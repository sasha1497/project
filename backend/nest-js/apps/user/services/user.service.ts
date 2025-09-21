import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../model/user.model';
import { McrudService } from '@app/main/services/mcurd.service';
import { StorageService } from '@app/main/services/storage.service';
import { MailService } from './mail.service';

@Injectable()
export class UserService {
  constructor(
    private mcurdSerRef: McrudService,
    private userModRef: UserModel,
    private storageSerRef: StorageService,
    private mailSerRef: MailService
  ) { }

  /******************** CREATE AND UPDATE USER ****************************/
  async upsertUser(id: any, data: any) {
    const { password, confirmPassword, mobile, ...rest } = data;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const hashedConfirmPassword = confirmPassword ? await bcrypt.hash(confirmPassword, 10) : null;

    const payload = {
      ...rest,
      ...(hashedPassword && { password: hashedPassword }),
      ...(hashedConfirmPassword && { confirmPassword: hashedConfirmPassword }),
      ...(mobile && { phone_number: mobile }),
      // ...(email && { email }),
    };

    // Mobile uniqueness check
    if (mobile) {
      const existingUser = await this.mcurdSerRef.find('users', { phone_number: mobile });
      if (existingUser && existingUser.length > 0) {
        if (!id || existingUser[0].id !== +id) {
          throw new BadRequestException('Mobile number already exists. Please use a new number.');
        }
      }
    }

    let result;
    if (id) {
      // Update existing user
      result = await this.mcurdSerRef.update('users', payload, { id });
    } else {
      // Create new user
      const newId = await this.mcurdSerRef.create('users', payload, 'id');
      result = { id: newId, ...payload };

      // if (email && name) {
      //   this.mailSerRef.sendUserCreationMail(email, name).catch(err => {
      //     console.error('Error sending user creation email:', err);
      //   });
      // }
    }

    return result;
  }



  /******************** USER LIST ****************************/
  async listUsers(payload: any) {
    return await this.userModRef.list(payload);
  }

  /******************** GET USER DATA ****************************/

  // async getUserData(id: string) {
  //   // Get user info
  //   const user: any = await this.mcurdSerRef.get('*', 'users', { id });
  //   if (!user) throw new BadRequestException('User not found');

  //   // Get payments
  //   const payments: any = await this.mcurdSerRef.get('*', 'payments', { user_id: id });
  //   const paymentsData = Array.isArray(payments) ? payments : payments ? [payments] : [];
  //   const hasPayments = paymentsData.length > 0;

  //   // Payment expiry info (can be null if no payments)
  //   let paymentExpiryInfo: {
  //     message: string;
  //     remainingDays: number;
  //     expired: boolean;
  //   } | null = null;

  //   if (hasPayments) {
  //     // Get latest payment
  //     const latestPayment = paymentsData.sort(
  //       (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //     )[0];

  //     const createdAt = new Date(latestPayment.created_at);
  //     const now = new Date();

  //     // Calculate difference in days
  //     const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60 / 60 / 24);
  //     const totalValidityDays = 90; // total expiry days
  //     const remainingDays = totalValidityDays - diffDays;

  //     if (remainingDays > 0) {
  //       paymentExpiryInfo = {
  //         message: `Your payment will expire in ${remainingDays} day(s)`,
  //         remainingDays,
  //         expired: false,
  //       };
  //     } else {
  //       paymentExpiryInfo = {
  //         message: `Your payment has expired`,
  //         remainingDays: 0,
  //         expired: true,
  //       };
  //     }
  //   }

  //   // Get user images
  //   const imageData = await this.parseUserImages(id, user.photo);

  //   // Return full user data
  //   return {
  //     ...user,
  //     hasPayments,
  //     paymentExpiryInfo,
  //     imageData,
  //   };
  // }

  async getUserData(id: string) {
    // Get user info
    const user: any = await this.mcurdSerRef.get('*', 'users', { id });
    if (!user) throw new BadRequestException('User not found');

    // Get payments
    const payments: any = await this.mcurdSerRef.get('*', 'payments', { user_id: id });
    const paymentsData = Array.isArray(payments) ? payments : payments ? [payments] : [];
    const hasPayments = paymentsData.length > 0;

    // Payment expiry info (can be null if no payments)
    let paymentExpiryInfo: {
      message: string;
      remainingMinutes: number;
      expired: boolean;
    } | null = null;

    if (hasPayments) {
      // Get latest payment
      const latestPayment = paymentsData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const createdAt = new Date(latestPayment.created_at);
      const now = new Date();

      // For testing: total validity = 5 minutes
      const totalValidityMinutes = 5;
      const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60);
      const remainingMinutes = totalValidityMinutes - diffMinutes;

      if (remainingMinutes > 0) {
        paymentExpiryInfo = {
          message: `Your payment will expire in ${remainingMinutes} minute(s)`,
          remainingMinutes,
          expired: false,
        };
      } else {
        paymentExpiryInfo = {
          message: `Your payment has expired`,
          remainingMinutes: 0,
          expired: true,
        };
      }
    }

    // Get user images
    const imageData = await this.parseUserImages(id, user.photo);

    // Return full user data
    return {
      ...user,
      hasPayments,
      paymentExpiryInfo,
      imageData,
    };
  }



  // ---------------- Private function ----------------
  private async parseUserImages(userId: string, rawPhotoData: any) {
    let imageKeys: string[] = [];

    try {
      let raw = rawPhotoData;

      if (typeof raw === 'string') {
        raw = JSON.parse(raw);
        if (typeof raw === 'string') {
          raw = JSON.parse(raw);
        }
      }

      if (Array.isArray(raw)) {
        imageKeys = raw;
      } else {
        console.warn('Photo is not an array after parsing:', raw);
      }
    } catch (err) {
      console.error('Error parsing user.photo:', err);
    }

    // Build image metadata list
    return await Promise.all(
      imageKeys.map(async (fileName) => {
        const filePath = `${userId}/users/${fileName}`;
        const url = await this.storageSerRef.getImageUrl(filePath);

        const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
        const date = dateMatch ? dateMatch[0] : null;

        return {
          name: fileName,
          url,
          date,
        };
      }),
    );
  }


  /******************** DELETE USER ****************************/

  async deleteUser(id) {

    return await this.mcurdSerRef.delete('users', { id: id });

  }

}

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
  async getUserData(id: string) {
    // Get user info
    const user = await this.mcurdSerRef.get('*', 'users', { id });
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Get payments
    const payments = await this.mcurdSerRef.get('*', 'payments', { user_id: id });
    const paymentsData = Array.isArray(payments) ? payments : payments ? [payments] : [];
    const hasPayments = paymentsData.length > 0;

    let paymentAlert = false;
    let paymentExpired = false;

    if (hasPayments) {
      const latestPayment = paymentsData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const createdAt = new Date(latestPayment.created_at);

      // Calculate expiry date (90 days after created_at)
      const expiryDate = new Date(createdAt);
      expiryDate.setDate(expiryDate.getDate() + 90);

      // Calculate alert date (4 days before expiry)
      const alertDate = new Date(expiryDate);
      alertDate.setDate(alertDate.getDate() - 4);

      const now = new Date();

      // Alert check
      if (now >= alertDate && now < expiryDate) {
        paymentAlert = true;
      }

      // Expiry check
      if (now >= expiryDate) {
        paymentExpired = true;
      }
    }

    const imageData = await this.parseUserImages(id, user.photo);

    return {
      success: true,
      message: paymentExpired ? 'Your payment expired' : 'User data fetched successfully',
      data: {
        ...user,
        hasPayments,
        paymentAlert,
        paymentExpired,
        imageData,
      },
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
        const filePath = `users/${userId}/${fileName}`;
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

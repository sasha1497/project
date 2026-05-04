import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../model/user.model';
import { McrudService } from '@app/main/services/mcurd.service';
import { StorageService } from '@app/main/services/storage.service';
import { MailService } from './mail.service';
import * as jwt from 'jsonwebtoken';
import { register } from 'module';
import { CommentModel } from '../model/comment.model';
const JWT_SECRET = process.env.JWT_SECRET as string;


@Injectable()
export class UserService {
  constructor(
    private mcurdSerRef: McrudService,
    private userModRef: UserModel,
    private commentModRef: CommentModel,
    private storageSerRef: StorageService,
    private mailSerRef: MailService
  ) { }

  /******************** CREATE AND UPDATE USER ****************************/
  async upsertUser(id: any, data: any) {
    const {
      password,
      confirmPassword,
      confirm_password,
      mobile,
      mobileNumber,
      phone_number,
      phoneNumber,
      ...rest
    } = data;

    const normalizedMobile = (mobile || mobileNumber || phone_number || phoneNumber || '').trim();
    const normalizedState = (data?.state || '').trim();
    const normalizedPassword = (password || '').trim();
    const normalizedConfirmPassword = (confirmPassword || confirm_password || '').trim();
    const isCreate = !id;

    if (isCreate) {
      if (!normalizedMobile) {
        throw new BadRequestException('Phone number is required');
      }
      if (!normalizedState) {
        throw new BadRequestException('State is required');
      }
      if (!normalizedPassword || !normalizedConfirmPassword) {
        throw new BadRequestException('Password and confirm password are required');
      }
    }

    if ((normalizedPassword || normalizedConfirmPassword) && normalizedPassword !== normalizedConfirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    const hashedPassword = normalizedPassword ? await bcrypt.hash(normalizedPassword, 10) : null;

    const cleanedRest = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );

    const payload = {
      ...cleanedRest,
      ...(normalizedState && { state: normalizedState }),
      ...(hashedPassword && { password: hashedPassword, confirmPassword: hashedPassword }),
      ...(normalizedMobile && { phone_number: normalizedMobile }),
    };

    // Uniqueness check should be mobile + state, not mobile alone.
    if (normalizedMobile && normalizedState) {
      const existingUser = await this.mcurdSerRef.find('users', {
        phone_number: normalizedMobile,
        state: normalizedState,
      });
      if (existingUser && existingUser.length > 0) {
        const conflict = existingUser.some((user: any) => Number(user.id) !== Number(id));
        if (conflict) {
          throw new BadRequestException('User already exists with this mobile number in the selected state.');
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
      const createdUserId = Array.isArray(newId) ? newId[0] : newId?.id;

      const tokenPayload = { userId: createdUserId };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

      result = { id: createdUserId, ...payload, token, register: true };

      // if (email && name) {
      //   this.mailSerRef.sendUserCreationMail(email, name).catch(err => {
      //     console.error('Error sending user creation email:', err);
      //   });
      // }
    }

    return result;
  }



  /******************** USER LIST ****************************/
  // async listUsers(payload: any) {
  //   // Get initial list of users
  //   const { data }: any = await this.userModRef.list(payload);

  //   // Fetch additional data for each user
  //   const detailedData = await Promise.all(
  //     data.map(async (user: any) => {
  //       const userDetails = await this.getUserData(user.id);
  //       return { ...user, userDetails }; // merge user info with additional details
  //     })
  //   );

  //   return detailedData;
  // }
  async listUsers(payload: any) {
  const { filter, viewerUserId } = payload;

  // Check if all filter values are empty
  const isFilterEmpty = Object.values(filter).every((value: any) => !value || value === "");

  if (isFilterEmpty) {
    // Return empty array if no filter is applied
    return [];
  }

  // Get initial list of users based on filter
  const { data }: any = await this.userModRef.list(payload);

  // Fetch additional data for each user
  const detailedData = await Promise.all(
    data.map(async (user: any) => {
      const userDetails = await this.getUserData(user.id, viewerUserId);
      return {
        ...userDetails,
        userDetails: {
          imageData: userDetails.imageData,
        },
      };
    })
  );

  return detailedData;
}



  /******************** GET USER DATA ****************************/
  private async hasProfileContactAccess(viewerUserId: string | number | null | undefined, profileUserId: string | number) {
    if (!viewerUserId) return false;

    if (Number(viewerUserId) === Number(profileUserId)) {
      return true;
    }

    try {
      const unlockPayment = await this.mcurdSerRef.get(
        '*',
        'payments',
        {
          user_id: viewerUserId,
          target_user_id: profileUserId,
          payment_type: 'profile_contact',
          captured: 1,
        }
      );

      return !!unlockPayment;
    } catch (error: any) {
      if (error?.code === 'ER_BAD_FIELD_ERROR' && String(error?.sqlMessage || '').includes('target_user_id')) {
        console.error(
          'payments table is missing target_user_id/payment_type columns. Run sqls/init/alter-payments-profile-contact.sql'
        );
        return false;
      }
      throw error;
    }
  }

  async getUserData(id: string, viewerUserId?: string | number) {
    if (!id || Number.isNaN(Number(id))) {
      throw new BadRequestException('Valid user id is required');
    }

    // Get user info
    const user: any = await this.mcurdSerRef.get('*', 'users', { id });
    if (!user) throw new NotFoundException('User not found');

    // Get payments
    const payments: any = await this.mcurdSerRef.get('*', 'payments', { user_id: id });
    const paymentsData = Array.isArray(payments) ? payments : payments ? [payments] : [];
    const hasPayments = paymentsData.length > 0;

    // Payment expiry info (can be null if no payments)
    let paymentExpiryInfo: {
      message: string;
      remainingDays: number;
      expired: boolean;
    } | null = null;

    if (hasPayments) {
      // Get latest payment
      const latestPayment = paymentsData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const createdAt = new Date(latestPayment.created_at);
      const now = new Date();

      // Calculate difference in days
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60 / 60 / 24);
      const totalValidityDays = 45; // total expiry days
      const remainingDays = totalValidityDays - diffDays;

      if (remainingDays > 0) {
        paymentExpiryInfo = {
          message: `Your payment will expire in ${remainingDays} day(s)`,
          remainingDays,
          expired: false,
        };
      } else {
        paymentExpiryInfo = {
          message: `Your payment has expired`,
          remainingDays: 0,
          expired: true,
        };
      }
    }

    // Get user images
    const imageData = await this.parseUserImages(id, user.photo);
    const contactUnlocked = viewerUserId
      ? await this.hasProfileContactAccess(viewerUserId, id)
      : true;
    const maskedUser = {
      ...user,
      phone_number: contactUnlocked ? user.phone_number : null,
      whatsapp: contactUnlocked ? user.whatsapp : null,
    };

    // Return full user data
    return {
      ...maskedUser,
      hasPayments,
      paymentExpiryInfo,
      imageData,
      contactUnlocked,
      contactLocked: !contactUnlocked,
    };
  }

  /******************** PROFILE COMMENTS ****************************/
  async getProfileComments(profileUserId: string) {
    const profileId = Number(profileUserId);
    if (!profileId) {
      throw new BadRequestException('Valid profile user id is required');
    }

    const user = await this.mcurdSerRef.get('*', 'users', { id: profileId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const comments = await this.commentModRef.listByProfileUserId(profileId);
    return this.buildCommentTree(comments);
  }

  async addProfileComment(profileUserId: string, data: any) {
    const profileId = Number(profileUserId);
    if (!profileId) {
      throw new BadRequestException('Valid profile user id is required');
    }

    const targetUser = await this.mcurdSerRef.get('*', 'users', { id: profileId });
    if (!targetUser) {
      throw new BadRequestException('User not found');
    }

    const content = String(data?.content || '').trim();
    const commenterName = String(data?.commenter_name || data?.commenterName || '').trim();
    const commenterUserId = data?.commenter_user_id ? Number(data.commenter_user_id) : null;
    const parentCommentId = data?.parent_comment_id ? Number(data.parent_comment_id) : null;

    if (!commenterName) {
      throw new BadRequestException('Commenter name is required');
    }

    if (!content) {
      throw new BadRequestException('Comment content is required');
    }

    if (parentCommentId) {
      const parentComment = await this.commentModRef.getById(parentCommentId);
      if (!parentComment || Number(parentComment.profile_user_id) !== profileId) {
        throw new BadRequestException('Parent comment not found for this profile');
      }
    }

    const createdComment = await this.commentModRef.create({
      profile_user_id: profileId,
      parent_comment_id: parentCommentId,
      commenter_user_id: commenterUserId,
      commenter_name: commenterName,
      content,
    });

    return createdComment;
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
    const imageResults = await Promise.all(
      imageKeys.map(async (fileName) => {
        try {
          const filePath = `${userId}/users/${fileName}`;
          const url = await this.storageSerRef.getImageUrl(filePath);

          const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
          const date = dateMatch ? dateMatch[0] : null;

          return {
            name: fileName,
            url,
            date,
          };
        } catch (error) {
          console.error(`Failed to resolve image URL for user ${userId}:`, fileName, error);
          return null;
        }
      }),
    );

    return imageResults.filter(Boolean);
  }


  /******************** DELETE USER ****************************/

  async deleteUser(id) {

    return await this.mcurdSerRef.delete('users', { id: id });

  }

  private buildCommentTree(comments: any[]) {
    const commentMap = new Map<number, any>();
    const roots: any[] = [];

    comments.forEach((comment) => {
      commentMap.set(Number(comment.id), {
        ...comment,
        replies: [],
      });
    });

    commentMap.forEach((comment) => {
      const parentId = comment.parent_comment_id ? Number(comment.parent_comment_id) : null;
      if (parentId && commentMap.has(parentId)) {
        commentMap.get(parentId).replies.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  }

}

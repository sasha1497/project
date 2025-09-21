import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../model/user.model';
import { McrudService } from '@app/main/services/mcurd.service';
import { StorageService } from '@app/main/services/storage.service';

@Injectable()
export class UserService {
  constructor(
    private mcurdSerRef: McrudService,
    private userModRef: UserModel,
    private storageSerRef: StorageService,
  ) { }

  /******************** CREATE AND UPDATE USER ****************************/
  async upsertUser(id: any, data: any) {
    const { password, confirmPassword, mobile, ...rest } = data;

    // Hash passwords
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const hashedConfirmPassword = confirmPassword ? await bcrypt.hash(confirmPassword, 10) : null;

    // Prepare payload
    const payload = {
      ...rest,
      ...(hashedPassword && { password: hashedPassword }),
      ...(hashedConfirmPassword && { confirmPassword: hashedConfirmPassword }),
      ...(mobile && { phone_number: mobile }),
    };

    // Check mobile duplicate when creating new user
    if (!id && mobile) {
      const existingUser = await this.mcurdSerRef.find('users', { phone_number: mobile });
      if (existingUser && existingUser.length > 0) {
        return {
          success: false,
          data: null,
          toast: {
            type: 'error',
            title: 'Mobile Number Exists',
            message: 'This phone number is already registered. Please use a different number.',
          },
        };
      }
    }

    if (id) {
      // Update existing user
      const updatedUser = await this.mcurdSerRef.update('users', payload, { id });
      return {
        success: true,
        data: updatedUser,
        toast: {
          type: 'success',
          title: 'User Updated',
          message: 'User updated successfully.',
        },
      };
    } else {
      // Create new user
      const newId = await this.mcurdSerRef.create('users', payload, 'id');
      return {
        success: true,
        data: { id: newId, ...payload },
        toast: {
          type: 'success',
          title: 'User Created',
          message: 'User created successfully.',
        },
      };
    }
  }



  /******************** USER LIST ****************************/
  async listUsers(payload: any) {
    return await this.userModRef.list(payload);
  }

  /******************** GET USER DATA ****************************/
  async getUserData(id: string) {
    const user = await this.mcurdSerRef.get('*', 'users', { id });
    console.log(user.photo, '<--- user.photo (raw from DB)');

    let imageKeys: string[] = [];

    try {
      let raw = user.photo;

      // Parse JSON string (first level)
      if (typeof raw === 'string') {
        raw = JSON.parse(raw);

        // If double-stringified
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

    console.log(imageKeys, '<--- imageKeys after parsing');

    // Build image metadata list
    const imageData = await Promise.all(
      imageKeys.map(async (fileName) => {
        const filePath = `users/${id}/${fileName}`;
        const url = await this.storageSerRef.getImageUrl(filePath);

        // Extract date from filename (like "2025-06-07")
        const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
        const date = dateMatch ? dateMatch[0] : null;

        return {
          name: fileName,
          url,
          date,
        };
      }),
    );

    return {
      ...user,
      imageData,
    };
  }
}

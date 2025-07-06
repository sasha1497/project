// user.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../user.model';
import { StorageService } from 'libs/services/src/storage.service';

const JWT_SECRET = process.env.JWT_SECRET as string;

@Injectable()
export class UserService {
  constructor(
    private db: DbService,
    private mcurdSerRef: McrudService,
    private userModRef: UserModel,
    private storageSerRef :StorageService
  ) { }

  async upsertUser(id: any, data: any) {
    if (id) {
      return await this.mcurdSerRef.update('users', data, { id });
    } else {
      const newId = await this.mcurdSerRef.create('users', data, 'id');
      return { id: newId, ...data };
    }
  }

  async login(data: { mobileNumber: string; password: string }) {
    const { mobileNumber, password } = data;

    if (!mobileNumber || !password) {
      throw new BadRequestException('Mobile number and password are required');
    }

    const user = await this.mcurdSerRef.get('*', 'users', {
      'phone_number': mobileNumber,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    // // Validate password using bcrypt
    // const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    // if (!isPasswordMatch) {
    //   throw new UnauthorizedException('Invalid password');
    // }

    // Gender mapping: male -> 1, female -> 2, others -> 3
    let genderType = 3;
    if (user.gender) {
      const gender = user.gender.toLowerCase();
      if (gender === 'male') genderType = 1;
      else if (gender === 'female') genderType = 2;
    }

    // JWT Payload
    const payload = {
      userId: user.id,
      genderType,
    };

    // Generate JWT Token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  
    return {
      message: 'Login successful',
      user: {
        token,
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        type: genderType,
      },
    };
  }


  async listUsers(payload) {
    return await this.userModRef.list(payload);
  }

async getUserData(id: string) {
  const user = await this.mcurdSerRef.get('*', 'users', { id });
  console.log(user.photo, '<---------- user.photo (raw from DB)');

  let imageKeys: string[] = [];

  try {
    let raw = user.photo;

    // First level: parse string
    if (typeof raw === 'string') {
      raw = JSON.parse(raw);

      // If still string (double-stringified), parse again
      if (typeof raw === 'string') {
        raw = JSON.parse(raw);
      }
    }

    // If array, assign to imageKeys
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

      // Extract date from filename like "2025-06-07"
      const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : null;

      return {
        name: fileName,
        url,
        date,
      };
    })
  );

  return {
    ...user,
    imageData,
  };
}




}

// user.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { StorageService } from 'libs/services/src/storage.service';
import { UserModel } from '../model/user.model';

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
    const { password, confirmPassword, ...rest } = data;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const hashedConfirmPassword = confirmPassword ? await bcrypt.hash(confirmPassword, 10) : null;

    const payload = {
      ...rest,
      ...(hashedPassword && { password: hashedPassword }),
      ...(hashedConfirmPassword && { confirmPassword: hashedConfirmPassword })
    };

    if (id) {
      return await this.mcurdSerRef.update('users', payload, { id });
    } else {
      const newId = await this.mcurdSerRef.create('users', payload, 'id');
      return { id: newId, ...payload };
    }
  }


  async login(data: { mobileNumber: string; password: string }) {
    const { mobileNumber, password } = data;

    if (!mobileNumber || !password) {
      throw new BadRequestException('Mobile number and password are required');
    }

    // Find user by phone_number column
    const user = await this.mcurdSerRef.get('*', 'users', {
      phone_number: mobileNumber,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    //  Compare raw password with hashed password in `password` column
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    // Gender mapping
    let genderType = 3;
    if (user.gender) {
      const gender = user.gender.toLowerCase();
      if (gender === 'male') genderType = 1;
      else if (gender === 'female') genderType = 2;
    }

    // JWT
    const payload = {
      userId: user.id,
      genderType,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return {
      message: 'Login successful',
      user: {
        token,
        id: user.id,
        name: user.name,
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

// user.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../user.model';

const JWT_SECRET = process.env.JWT_SECRET as string;

@Injectable()
export class UserService {
  constructor(
    private db: DbService,
    private mcurdSerRef: McrudService,
    private userModRef: UserModel
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
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

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

  async getUserData(id) {
    const user = await this.mcurdSerRef.get('*', 'users', {
      'id': id,
    });

    return user;
  }
}

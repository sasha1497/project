// user.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../model/user.model';

const JWT_SECRET = process.env.JWT_SECRET as string;

@Injectable()
export class UserService {
  constructor(
    private db: DbService,
    private mcurdSerRef: McrudService,
    private userModRef: UserModel
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

  async getUserData(id) {
    const user = await this.mcurdSerRef.get('*', 'users', {
      'id': id,
    });

    return user;
  }
}

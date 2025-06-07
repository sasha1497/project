// user.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import * as bcrypt from 'bcrypt';
require('dotenv').config();


@Injectable()
export class UserService {
  constructor(private db: DbService, private mcurdSerRef: McrudService) { }


  async upsertUser(id: any, data: any) {
    if (id) {
      return await this.mcurdSerRef.update('users', data, { id });
    } else {
      const newId = await this.mcurdSerRef.create('users', data, 'id');
      return { id: newId, ...data };
    }
  }




  async loginNew(data: { mobileNumber: string; password: string }) {
    const { mobileNumber, password } = data;

    if (!mobileNumber || !password) {
      throw new BadRequestException('Mobile number and password are required');
    }

    const user = await this.mcurdSerRef.get('*', 'users', { phone_number: mobileNumber });

    if (!user) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    let genderType = 3; // default to others
    if (user.gender) {
      const gender = user.gender.toLowerCase();
      if (gender === 'male') genderType = 1;
      else if (gender === 'female') genderType = 2;
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        type: genderType,
      },
    };
  }

}
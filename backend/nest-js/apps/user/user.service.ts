// user.service.ts
import { Injectable } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
@Injectable()
export class UserService {
  constructor(private db: DbService, private mcurdSerRef: McrudService) {}

  async upsertUser(id: number | undefined, data: any) {
    if (id) {
      // Try updating existing user
      return ({
        where: { id },
        update: data,
        create: { ...data, id },
      });
    } else {
      // Create new user
    //   return this.mcurdSerRef.user.create({
    //     data,
    //   });
    }
  }
}

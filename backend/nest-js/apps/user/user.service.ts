// user.service.ts
import { Injectable } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
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


}

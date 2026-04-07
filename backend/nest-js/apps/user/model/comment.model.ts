import { DbService } from '@app/main/services/db.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentModel {
  constructor(private db: DbService) {}

  async listByProfileUserId(profileUserId: number) {
    return this.db
      .get()('profile_comments')
      .select(
        'id',
        'profile_user_id',
        'parent_comment_id',
        'commenter_user_id',
        'commenter_name',
        'content',
        'created_at',
        'updated_at',
      )
      .where({ profile_user_id: profileUserId })
      .orderBy('created_at', 'asc')
      .orderBy('id', 'asc');
  }

  async getById(id: number) {
    return this.db.get()('profile_comments').where({ id }).first();
  }

  async create(payload: Record<string, any>) {
    const result = await this.db.get()('profile_comments').insert(payload);
    const insertedId = Array.isArray(result) ? Number(result[0]) : Number(result);
    return this.getById(insertedId);
  }
}

import { Injectable } from '@nestjs/common';
import { DbService } from 'libs/services/src/db.service';

@Injectable()
export class UserModel {
    constructor(
        private db: DbService,
    ) { }


    async list(payload) {

        const { page = 1, limit = 10, filter = {}, search = "" } = payload;

        const offset = (page - 1) * limit;

        const query = this.db.get().select('id', 'first_name', 'last_name', 'email', 'gender', 'date_of_birth', 'height_cm', 'weight_kg', 'religion',
            'caste', 'mother_tongue', 'country', 'state', 'city', 'marital_status', 'is_active'
        )
            .from('users');

        if (filter.id) query.where('id', filter.id);
        if (filter.first_name) query.where('first_name', 'like', `%${filter.first_name}%`);
        if (filter.last_name) query.where('last_name', 'like', `%${filter.last_name}%`);
        if (filter.gender) query.where('gender', filter.gender);

        if (search) {
            query.where(builder => {
                builder
                    .orWhere('id', 'like', `%${search}%`)
                    .orWhere('first_name', 'like', `%${search}%`)
                    .orWhere('last_name', 'like', `%${search}%`);
            });
        }
        query.limit(limit).offset(offset);

        const users = await query;
        return users;
    }

}

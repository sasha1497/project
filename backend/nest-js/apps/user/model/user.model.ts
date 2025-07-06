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

        const query = this.db.get()
            .select(
                'id', 'name', 'email', 'phone_number', 'gender', 'date_of_birth', 'age',
                'person', 'height', 'job', 'mobile', 'whatsapp', 'monthlySalary', 'weight',
                'religion', 'caste', 'mother_tongue', 'country', 'district', 'state', 'city',
                'marital_status', 'education', 'occupation', 'income', 'about_me', 'photo', 'is_active'
            )
            .from('users');

        if (filter.id) query.where('id', filter.id);
        if (filter.name) query.where('name', 'like', `%${filter.name}%`);
        if (filter.gender) query.where('gender', filter.gender);
        if (filter.age) query.where('age', filter.age);
        if (filter.religion) query.where('religion', filter.religion);

        if (search) {
            query.where(builder => {
                builder
                    .orWhere('id', 'like', `%${search}%`)
                    .orWhere('name', 'like', `%${search}%`)
                    .orWhere('phone_number', 'like', `%${search}%`)
                    .orWhere('email', 'like', `%${search}%`);
            });
        }

        query.limit(limit).offset(offset);

        const users = await query;
        return users;
    }

}

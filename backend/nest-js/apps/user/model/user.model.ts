import { DbService } from '@app/main/services/db.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModel {
    constructor(
        private db: DbService,
    ) { }


    // async list(payload) {
    //     const { page = 1, limit = 10, filter = {}, search = "" } = payload;
    //     const offset = (page - 1) * limit;

    //     const query = this.db.get()
    //         .select(
    //             'users.id',
    //             'users.name',
    //             'users.email',
    //             'users.phone_number',
    //             'users.gender',
    //             'users.date_of_birth',
    //             'users.age',
    //             'users.person',
    //             'users.job',
    //             'users.mobile',
    //             'users.whatsapp',
    //             'users.monthlySalary',
    //             'users.religion',
    //             'users.caste',
    //             'users.mother_tongue',
    //             'users.country',
    //             'users.district',
    //             'users.state',
    //             'users.city',
    //             'users.marital_status',
    //             'users.education',
    //             'users.occupation',
    //             'users.income',
    //             'users.about_me',
    //             'users.photo',
    //             'users.is_active'
    //         )
    //         .from('users');

    //     // Filters
    //     if (filter.id) query.where('users.id', filter.id);
    //     if (filter.name) query.where('users.name', 'like', `%${filter.name}%`);
    //     if (filter.gender) query.where('users.gender', filter.gender);
    //     if (filter.age) query.where('users.age', filter.age);
    //     if (filter.religion) query.where('users.religion', filter.religion);
    //     if (filter.country) query.where('users.country', filter.country);
    //     if (filter.state) query.where('users.state', filter.state);



    //     // Global search
    //     if (search) {
    //         query.where(builder => {
    //             builder
    //                 .orWhere('users.id', 'like', `%${search}%`)
    //                 .orWhere('users.name', 'like', `%${search}%`)
    //                 .orWhere('users.phone_number', 'like', `%${search}%`)
    //                 .orWhere('users.state', 'like', `%${search}%`)
    //                 .orWhere('users.email', 'like', `%${search}%`);
    //         });
    //     }

    //     // Pagination
    //     query.limit(limit).offset(offset);

    //     const users = await query;

    //     const totalUsers = await this.db.get()('users').count({ count: 'id' }).first();

    //     const currencyTotals = await this.db.get()('payments')
    //         .select('currency')
    //         .count({ total_transactions: 'id' })
    //         .sum({ total_amount: 'amount' })
    //         .groupBy('currency');

    //     return {
    //         data: users,
    //         total_users: totalUsers?.count || 0,
    //         currencyTotals
    //     };
    // }

    async list(payload) {
  const { page = 1, limit = 10, filter = {}, search = "" } = payload;
  const offset = (page - 1) * limit;

  const query = this.db.get()
    .select(
      'users.id',
      'users.name',
      'users.email',
      'users.phone_number',
      'users.gender',
      'users.date_of_birth',
      'users.age',
      'users.person',
      'users.job',
      'users.mobile',
      'users.whatsapp',
      'users.monthlySalary',
      'users.religion',
      'users.caste',
      'users.mother_tongue',
      'users.country',
      'users.district',
      'users.state',
      'users.city',
      'users.marital_status',
      'users.education',
      'users.occupation',
      'users.income',
      'users.about_me',
      'users.photo',
      'users.is_active'
    )
    .from('users');

  // ✅ Normalize filter values: convert "N/A" → ""
  const normalizedFilter = Object.fromEntries(
    Object.entries(filter).map(([key, value]) => [key, value === "N/A" ? "" : value])
  );

  // ✅ Apply filters only if value is truthy and not empty
  if (normalizedFilter.id) query.where('users.id', normalizedFilter.id);
  if (normalizedFilter.name) query.where('users.name', 'like', `%${normalizedFilter.name}%`);
  if (normalizedFilter.gender) query.where('users.gender', normalizedFilter.gender);
  if (normalizedFilter.age) query.where('users.age', normalizedFilter.age);
  if (normalizedFilter.religion) query.where('users.religion', normalizedFilter.religion);
  if (normalizedFilter.country) query.where('users.country', normalizedFilter.country);
  if (normalizedFilter.state) query.where('users.state', normalizedFilter.state);
  if (normalizedFilter.district) query.where('users.district', normalizedFilter.district);

  // ✅ Global search
  if (search) {
    query.where(builder => {
      builder
        .orWhere('users.id', 'like', `%${search}%`)
        .orWhere('users.name', 'like', `%${search}%`)
        .orWhere('users.phone_number', 'like', `%${search}%`)
        .orWhere('users.state', 'like', `%${search}%`)
        .orWhere('users.email', 'like', `%${search}%`);
    });
  }

  // ✅ Pagination
  query.limit(limit).offset(offset);

  const users = await query;

  const totalUsers = await this.db.get()('users').count({ count: 'id' }).first();

  const currencyTotals = await this.db.get()('payments')
    .select('currency')
    .count({ total_transactions: 'id' })
    .sum({ total_amount: 'amount' })
    .groupBy('currency');

  return {
    data: users,
    total_users: totalUsers?.count || 0,
    currencyTotals
  };
}



}

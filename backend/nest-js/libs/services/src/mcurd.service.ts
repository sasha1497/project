import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DbService } from './db.service';

@Injectable()
export class McrudService {
    constructor(
        @Inject(forwardRef(() => DbService)) private readonly db: DbService,
    ) {
        console.log("trigger---mcrudservices");

    }

    create(table, datas, primarykey) {

        if (table && datas) {
            return this.db.get().table(table).insert(datas).returning(primarykey);
        }
    }


    update(table, datas, condition) {

        if (table && datas) {
            return this.db.get().table(table).where(condition).update(datas);


        }
    }


    read(select: any = "*", table, condition = {}) {
        return this.db.get().select(select).from(table).where(condition);

    }


    async get(select: any = "*", table, condition = null) {
        const result = await this.db.get().select(this.db.get().raw(select)).from(table).where(condition).first();
        return result ?? false;
    }


    delete(table, condition) {
        return this.db.get().from(table).del().where(condition);
    }

    async createBatch(table, datas, chunkSize = 100, primarykey) {
        // const chunkSize = 100;
        return this.db.get().batchInsert(table, datas, chunkSize);
        // return this.db.get().batchInsert(table, datas, chunkSize).returning(primarykey);
    }


    readIn(select: any = "*", table, value, condition = []) {
        return this.db.get().select(select).from(table).whereIn(value, condition);

    }

    deleteBatch(table, ids, primarykey) {
        return this.db.get().from(table).whereIn(primarykey, ids).del();
    }

    updateBatch(table, ids, datas, primarykey) {
        return this.db.get().from(table).whereIn(primarykey, ids).update(datas);
    }

    find(table: string, where: Record<string, any>) {
        return this.db.get().table(table).where(where);
    }


}


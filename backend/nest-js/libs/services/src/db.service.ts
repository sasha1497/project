import { Inject, Injectable, forwardRef } from '@nestjs/common';

let dbConnection: any = {};

function getDb() {

    console.log("<-----dbco",dbConnection);
    
    if (dbConnection) {
        return dbConnection;
    }

    const connection: any = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        timezone: "+00:00",
        dateStrings: true,
    };
    if (process.env.DB_PORT) {
        connection.port = process.env.DB_PORT;
    }

    dbConnection = require('knex')({
        client: 'mysql2',
        connection,
        pool: { min: 0, max: 3 },
    });

    return dbConnection;
}



@Injectable()
export class DbService {
    private _mainDbConnection: any;

    constructor() {
        console.log("<---trigger-DbService!!!!");
     }

    get() {
        return getDb();
    }


    closeConnections() {
        this._mainDbConnection && this._mainDbConnection.destroy();
    }

}




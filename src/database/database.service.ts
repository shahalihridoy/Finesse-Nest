import { Injectable } from '@nestjs/common';
import { db } from './connection';

@Injectable()
export class DatabaseService {
  getDb() {
    return db;
  }
}

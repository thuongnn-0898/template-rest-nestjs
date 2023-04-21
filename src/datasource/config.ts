import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

config();

const isTestEnv = process.env.NODE_ENV !== 'test';

export default {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: isTestEnv ? process.env.DATABASE : process.env.DATABASE_TEST,
  entities: [
    isTestEnv ? 'dist/entities/*.entity.js' : 'src/entities/*.entity.ts',
  ],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  seeds: ['src/database/seeds/*.seed.ts'],
  factories: ['src/database/factories/*.factory.ts'],
} as DataSourceOptions & SeederOptions;

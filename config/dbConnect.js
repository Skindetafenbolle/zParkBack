import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgresql://Skindetafenbolle:LkyWGYxH8D0b@ep-odd-hat-a55kar3v.us-east-2.aws.neon.tech/zpark?sslmode=require', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});
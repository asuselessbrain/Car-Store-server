import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  db_Url: process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
};

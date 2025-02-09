import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_Url: process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  sp: {
    sp_endpoint: process.env.SP_ENDPOINT,
    sp_username: process.env.SP_USERNAME,
    sp_password: process.env.SP_PASSWORD,
    sp_prefix: process.env.SP_PREFIX,
    sp_return_url: process.env.SP_RETURN_URL,
  },
};

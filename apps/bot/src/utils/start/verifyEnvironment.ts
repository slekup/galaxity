import { verifyEnvironment } from '@slekup/utils';
import dotenv from 'dotenv';

dotenv.config();

const newEnv = verifyEnvironment([
  'ENVIRONMENT',
  'DEBUG',

  'MONGODB_URI',
  'SESSION_SECRET',
  'SECRET_KEY',
  'SECRET_IV',

  'PUBLIC_CLIENT_ID',
  'BOT_TOKEN',
  'CLIENT_SECRET',

  'DEV_GUILD_ID',
  'DEV_ROLE_ID',

  'ALERT_CHANNEL_ID',
  'GUILD_CHANNEL_ID',
  'USER_HISTORY_CHANNEL_ID',
  'GUILD_HISTORY_CHANNEL_ID',
  'CLIENT_CHANNEL_ID',
  'VOTE_CHANNEL_ID',

  'INFO_CHANNEL_ID',
  'WARN_CHANNEL_ID',
  'ERROR_CHANNEL_ID',
  'DEBUG_CHANNEL_ID',
]);

export default newEnv;

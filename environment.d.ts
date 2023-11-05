declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: string;
      DEBUG: string;

      MONGODB_URI: string;
      SESSION_SECRET: string;
      SECRET_KEY: string;
      SECRET_IV: string;

      PUBLIC_CLIENT_ID: string;
      BOT_TOKEN: string;
      CLIENT_SECRET: string;

      DEV_GUILD_ID: string;
      DEV_ROLE_ID: string;

      ALERT_CHANNEL_ID: string;
      GUILD_CHANNEL_ID: string;
      USER_HISTORY_CHANNEL_ID: string;
      GUILD_HISTORY_CHANNEL_ID: string;
      CLIENT_CHANNEL_ID: string;
      VOTE_CHANNEL_ID: string;

      INFO_CHANNEL_ID: string;
      WARN_CHANNEL_ID: string;
      ERROR_CHANNEL_ID: string;
      DEBUG_CHANNEL_ID: string;

      TOPGG_TOKEN: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};

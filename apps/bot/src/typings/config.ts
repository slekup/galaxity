export interface Emoji {
  full: string;
  id: string;
}
export interface EmojisConfig {
  verified: Emoji;
  partner: Emoji;
  [key: string]: Emoji;
}

interface LimitValues {
  Free?: number;
  Premium?: number;
}

export type Limits = Readonly<LimitValues> & number[];

export interface LimitsConfig {
  cooldown: {
    slash: Limits;
    prefix: Limits;
    context: Limits;
    button: Limits;
    selectMenu: Limits;
    modal: Limits;
  };
}

export interface MainConfig {
  productionId: string;
  status: string;
  links: {
    invite: string;
    support: string;
    vote: string;
  };
  developers: string[];
  colors: {
    primary: `#${string}`;
    success: `#${string}`;
    warning: `#${string}`;
    danger: `#${string}`;
    blurple: `#${string}`;
  };
  images: {
    banner: string;
  };
}

export interface ConfigType extends MainConfig {
  logFolder: string;
  emojis: EmojisConfig;
  limits: LimitsConfig;

  // Environment
  env: NodeJS.ProcessEnv;

  // Functions
  isDevelopment: () => boolean;
  isBeta: () => boolean;
  isProduction: () => boolean;
}

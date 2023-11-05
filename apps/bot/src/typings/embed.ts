export interface RawEmbed {
  type?: string;
  color?: number;
  title?: string;
  description?: string;
  image?: { url?: string };
  thumbnail?: { url?: string };
  author?: { name?: string; icon_url?: string };
  footer?: { text?: string; icon_url?: string };
  timestamp?: string;
}

export interface Embed {
  color?: string;
  title?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  author?: { name?: string; iconURL?: string };
  footer?: { text?: string; iconURL?: string };
  timestamp?: boolean;
}

export interface DynamicEmbed {
  author?: { name: string; icon_url?: string; iconURL?: string };
  title?: string;
  image?: string | { url: string };
  thumbnail?: string | { url: string };
  color?: number | string;
  footer?: { text: string; icon_url?: string; iconURL?: string };
  timestamp?: boolean | string;
  description?: string;
}

// For schemas
export const embedObject = {
  color: String,
  author: {
    name: String,
    iconURL: String,
  },
  thumbnail: String,
  title: String,
  url: String,
  description: String,
  image: String,
  footer: {
    text: String,
    iconURL: String,
  },
  timestamp: Boolean,
};

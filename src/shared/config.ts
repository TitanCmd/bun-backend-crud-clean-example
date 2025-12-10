export interface Config {
  server: {
    development: boolean;
    port: number;
    database: {
      url: string;
    };
    cors: {
      origin: string;
    };
  };
}

export const config: Config = {
  server: {
    development: process.env.NODE_ENV !== "production",
    port: parseInt(process.env.PORT || "3000"),
    database: {
      url: process.env.DATABASE_URL || "./dev.db",
    },
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
    },
  },
};

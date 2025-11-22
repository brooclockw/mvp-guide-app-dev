declare namespace NodeJS {
  interface ProcessEnv {
    readonly SUPABASE_URL: string;
    readonly SUPABASE_ANON_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    readonly PORT?: string;
    readonly CORS_ORIGIN?: string;
    readonly NODE_ENV?: "development" | "production" | "test";
    // más variables de entorno aquí si es necesario
  }
}

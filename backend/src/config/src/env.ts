type EnvKey =
    | "PORT"
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    | "SUPABASE_SERVICE_ROLE_KEY"
    | "RESEND_API_KEY"
    | "EMAIL_FROM"
    | "EMAIL_FROM_NAME";

const sourceEnv: Record<string, string | undefined> =
    typeof Bun !== "undefined" && Bun.env ? Bun.env : process.env;

const readEnv = (key: EnvKey, required: boolean = true): string => {
    const value = sourceEnv[key];
    if (required && (!value || !value.trim())) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || "";
};

export const env = {
    port: readEnv("PORT", false) || "4000",
    supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
    resendApiKey: readEnv("RESEND_API_KEY", false),
    emailFrom: readEnv("EMAIL_FROM", false),
    emailFromName: readEnv("EMAIL_FROM_NAME", false),
};

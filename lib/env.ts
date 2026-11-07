function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

export const serverEnv = {
  openAiApiKey: () => required("OPENAI_API_KEY"),
  openAiChatModel: () => required("OPENAI_CHAT_MODEL"),
  supabaseUrl: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  googleClientId: () => required("GOOGLE_CLIENT_ID"),
  googleClientSecret: () => required("GOOGLE_CLIENT_SECRET"),
  tokenEncryptionKey: () => required("TOKEN_ENCRYPTION_KEY")
};

// Import this module only from server-side code. Never expose service-role or provider secrets to client components.
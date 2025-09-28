// Supabase Configuration
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    // Get these from your Supabase project dashboard
    // https://supabase.com/dashboard/project/[your-project-id]/settings/api
    
    url: 'https://yuyjmguvrnutyrjrqxwg.supabase.co',  // Example: https://xyzcompany.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eWptZ3V2cm51dHlyanJxeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NzE2NDAsImV4cCI6MjA3MjI0NzY0MH0.KzPK0ECohc0MF6C0xln5_EIILlxbu0uOu5TDe9HmGKw',  // Your anon/public key
    
    // Optional: Set to false to disable Supabase and use offline mode only
    enabled: true  // Set to true once you configure your credentials above
};

// Initialize Supabase client if enabled and credentials are provided
if (SUPABASE_CONFIG.enabled && 
    SUPABASE_CONFIG.url && 
    SUPABASE_CONFIG.anonKey &&
    typeof supabase !== 'undefined') {
    
    window.supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✅ Supabase client initialized');
} else {
    console.log('📱 Running in offline mode - Supabase not configured or disabled');
    window.supabase = null;
}

// Supabase Configuration
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    // Get these from your Supabase project dashboard
    // https://supabase.com/dashboard/project/[your-project-id]/settings/api
    
    url: 'YOUR_SUPABASE_URL',  // Example: https://xyzcompany.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY',  // Your anon/public key
    
    // Optional: Set to false to disable Supabase and use offline mode only
    enabled: false  // Set to true once you configure your credentials above
};

// Initialize Supabase client if enabled and credentials are provided
if (SUPABASE_CONFIG.enabled && 
    SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' && 
    SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    typeof supabase !== 'undefined') {
    
    window.supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✅ Supabase client initialized');
} else {
    console.log('📱 Running in offline mode - Supabase not configured or disabled');
    window.supabase = null;
}

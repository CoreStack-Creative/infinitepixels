# Cross-Device Account Sync Setup Guide

## Current Issue
Your account system currently only works on one device because it's running in **offline mode**. All data (accounts, favorites, recent games) is stored in localStorage, which is device-specific and doesn't sync across devices.

## Solution: Enable Supabase Integration

To enable cross-device synchronization, you need to set up a Supabase database backend.

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project:
   - Choose a name (e.g., "infinitepixels")
   - Choose a region close to your users
   - Set a strong database password

### Step 2: Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the SQL script from `supabase-account-setup.sql` in your project
   - This creates all the necessary tables for users, favorites, recent games, etc.

### Step 3: Configure Your Project

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your project URL and anon key
3. Edit `supabase-config.js` in your project:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here',
    enabled: true  // Change this to true!
};
```

### Step 4: Test the Integration

1. Open your website and try creating an account
2. Add some favorites and play some games
3. Open the same website on another device/browser
4. Log in with the same account - you should see your data synced!

## How the Sync Works

Once configured, the system will:

### On Login:
1. **Sync UP**: Upload any local data (favorites, recent games) to the server
2. **Sync DOWN**: Download server data and merge with local data
3. **Keep Most Recent**: When there are conflicts, keep the most recent timestamps

### During Use:
- **Favorites**: Immediately saved to both local storage and server
- **Recent Games**: Automatically synced to server when you play games
- **Real-time**: Changes appear instantly on the current device, sync to other devices on next login

### Cross-Device Experience:
- **Device A**: Add a favorite game
- **Device B**: Login → favorite appears automatically
- **Device A**: Play a game
- **Device B**: Login → game appears in recent games

## Fallback Behavior

If Supabase is not configured or fails:
- The system automatically falls back to offline mode
- All features still work, but only on the current device
- No error messages or broken functionality

## Security Features

- **Row Level Security**: Users can only access their own data
- **Email Verification**: Optional email verification for accounts
- **Password Reset**: Users can reset passwords via email
- **Session Management**: 72-hour sessions with automatic extension

## Benefits of Cross-Device Sync

1. **Better User Experience**: Users can access their data anywhere
2. **Increased Engagement**: Users are more likely to return when their progress is saved
3. **Data Backup**: User data is safely stored in the cloud
4. **Analytics**: Better understanding of user behavior across devices

## Current Status

- ✅ **Code Updated**: Sync logic has been implemented
- ✅ **Database Schema**: SQL setup file is ready
- ❌ **Configuration**: Supabase credentials need to be added
- ❌ **Testing**: Cross-device sync needs to be tested

## Next Steps

1. Set up your Supabase project
2. Configure the credentials in `supabase-config.js`
3. Test the sync functionality
4. Monitor the browser console for sync status messages

Once configured, you'll see messages like:
- "✅ Supabase client initialized"
- "✅ Recent games loaded from server: 5"
- "✅ Favorites loaded from server: 3"
- "✅ Local data synced to server successfully"

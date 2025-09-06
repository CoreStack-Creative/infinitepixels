# InfinitePixels Account System Setup Guide

## Overview
This account system provides complete user authentication, profile management, favorites, recent games tracking, and secure data storage for your gaming website.

## Features Implemented

### 🔐 Authentication System
- **User Registration**: Email-based signup with username validation and profanity filtering
- **Login/Logout**: Secure session management with JWT tokens
- **Password Reset**: Email-based password recovery
- **Email Verification**: Account activation via email confirmation

### 👤 User Profile Management
- **Profile Images**: Upload and manage profile pictures with Supabase Storage
- **Username Management**: Change username with profanity filtering
- **Password Changes**: Secure password updates requiring current password
- **Account Statistics**: Track favorites, games played, and reviews

### 💾 Data Persistence
- **Favorites**: Save and sync favorite games across devices
- **Recent Games**: Track up to 50 most recently played games
- **User Settings**: Store preferences and configuration
- **Review System**: Enhanced reviews linked to user accounts

### 🎨 UI/UX Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Supports both theme modes
- **Real-time Updates**: Instant UI updates for favorites and profile changes
- **Loading States**: Smooth loading animations and error handling

## Setup Instructions

### 1. Database Setup (Supabase)

1. **Run the SQL Setup Script**:
   - Copy the content from `supabase-account-setup.sql`
   - Go to your Supabase dashboard → SQL Editor
   - Paste and run the script
   - This creates all necessary tables, policies, and triggers

2. **Configure Authentication**:
   - Go to Authentication → Settings in Supabase
   - Enable email confirmations if desired
   - Set up email templates for password reset

3. **Set up Storage**:
   - The SQL script automatically creates the `profile-images` bucket
   - Configure CORS if needed for file uploads

### 2. Server Configuration

1. **Install Dependencies**:
   ```bash
   cd /Users/velo/webhtml/infinitepixels
   npm install multer  # For file uploads
   ```

2. **Environment Variables**:
   - Update `server/.env` with your Supabase service key:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

3. **Start the Server**:
   ```bash
   cd server
   node server.js
   ```

### 3. Frontend Integration

The account system is already integrated into your pages:

1. **Account Button**: Added to the right of the search icon on all pages
2. **Account System Script**: Included in all major pages
3. **Page-Specific Features**:
   - `account.html`: Complete profile management interface
   - `favorites.html`: Dynamic loading of user favorites
   - `recent.html`: Recently played games tracking
   - All game pages: Enhanced with favorite/recent tracking

## File Structure

```
infinitepixels/
├── account-system.js          # Core account system logic
├── account-page.js           # Account page management
├── favorites-page.js         # Favorites page functionality
├── recent-page.js           # Recent games page functionality
├── supabase-account-setup.sql # Database setup script
├── style.css                # Enhanced with account system styles
├── javascript.js            # Updated with account integration
├── account.html             # Updated account page
├── favorites.html           # Updated favorites page
├── recent.html             # Updated recent games page
├── index.html              # Updated with account system
└── server/
    ├── server.js           # Enhanced with auth endpoints
    └── .env               # Environment configuration
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### User Profile
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `POST /user/upload-avatar` - Upload profile image
- `POST /user/change-password` - Change password

### User Data
- `GET /user/favorites` - Get user favorites
- `POST /user/favorites` - Add to favorites
- `DELETE /user/favorites/:gameId` - Remove from favorites
- `GET /user/recent-games` - Get recent games
- `POST /user/recent-games` - Add/update recent game

## Security Features

1. **Row Level Security**: Supabase RLS ensures users can only access their own data
2. **Profanity Filtering**: Username validation prevents inappropriate content
3. **File Upload Security**: Image validation and size limits
4. **Password Security**: Minimum length requirements and secure hashing
5. **Session Management**: JWT tokens with expiration

## Usage Guide

### For Users
1. **Sign Up**: Click account icon → Sign Up tab → Fill form → Verify email
2. **Login**: Click account icon → Enter credentials
3. **Profile Management**: Account page for uploads, password changes
4. **Favorites**: Heart icon on games to add/remove favorites
5. **Recent Games**: Automatically tracked when playing games

### For Developers
1. **Check Login Status**: `accountSystem.isLoggedIn()`
2. **Get User Data**: `accountSystem.user`
3. **Add to Favorites**: `accountSystem.addToFavorites(gameId)`
4. **Track Game Play**: `accountSystem.addToRecentGames(gameId)`
5. **Get Auth Headers**: `accountSystem.getAuthHeaders()`

## Customization

### Styling
- All styles are in `style.css` with clear section markers
- Light/dark theme support included
- Responsive design for all screen sizes

### Profanity Filter
- Located in SQL function `check_username_profanity`
- Add/remove words from the `bad_words` array
- Automatically blocks inappropriate usernames

### File Upload Limits
- Default: 5MB max file size
- Image types only (configurable in server.js)
- Stored in Supabase Storage with proper permissions

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Ensure server is running on localhost:3000
   - Check Supabase CORS settings

2. **File Upload Fails**:
   - Verify storage bucket exists
   - Check file size and type restrictions
   - Ensure user is authenticated

3. **Database Errors**:
   - Verify all SQL scripts ran successfully
   - Check RLS policies are enabled
   - Ensure proper environment variables

4. **Authentication Issues**:
   - Check Supabase URL and keys
   - Verify email settings in Supabase
   - Check browser console for specific errors

### Debug Mode
Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Next Steps

1. **Email Templates**: Customize verification and reset emails in Supabase
2. **Social Login**: Add Google/GitHub authentication
3. **Admin Panel**: Create admin interface for user management
4. **Analytics**: Track user engagement and favorite games
5. **Mobile App**: The API is ready for mobile app integration

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase dashboard for data/auth issues
3. Check server logs for API endpoint issues
4. Review this documentation for configuration steps

---

🎉 **Your account system is now fully functional!** Users can register, login, manage profiles, track favorites, and have their game progress saved across sessions.

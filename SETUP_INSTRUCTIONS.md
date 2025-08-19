# Setup Instructions for Forgot Password and Google Login

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Use this password in EMAIL_PASS

### 4. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Set authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:3000`
7. Copy the Client ID and use it in your frontend

## Frontend Setup

### 1. Install Dependencies
```bash
cd client
npm install @react-oauth/google
```

### 2. Environment Variables
Create a `.env` file in the client directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://localhost:5000
```

### 3. Google OAuth Script
The Google OAuth script is already added to `index.html`.

## Features Implemented

### 1. Forgot Password
- ✅ Backend API endpoints for forgot password and reset password
- ✅ Email sending functionality using Nodemailer
- ✅ Frontend forgot password form
- ✅ Reset password form with token validation
- ✅ Secure token generation and validation
- ✅ Password reset email with styled HTML template

### 2. Google Login
- ✅ Backend API endpoint for Google authentication
- ✅ Frontend Google login button
- ✅ Google OAuth integration
- ✅ Automatic user creation for new Google users
- ✅ Profile picture support
- ✅ JWT token generation for Google users

### 3. Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Secure reset token generation
- ✅ Token expiration (10 minutes for reset tokens)
- ✅ Input validation and sanitization

## API Endpoints

### Authentication
- `POST /api/v1/users/login/` - Regular login
- `POST /api/v1/users/google-login/` - Google login
- `POST /api/v1/users/forgot-password/` - Request password reset
- `POST /api/v1/users/reset-password/` - Reset password with token
- `POST /api/v1/users/register/` - User registration

## Usage

### Forgot Password Flow
1. User clicks "Forgotten your password?" on login page
2. User enters email address
3. System sends reset email with secure link
4. User clicks link and sets new password
5. User is redirected to login page

### Google Login Flow
1. User clicks "Continue with Google" button
2. Google OAuth popup appears
3. User authenticates with Google
4. System creates/updates user account
5. User is logged in and redirected to dashboard

## Testing

### Test Forgot Password
1. Start both backend and frontend servers
2. Go to login page and click "Forgotten your password?"
3. Enter a valid email address
4. Check email for reset link
5. Click link and set new password

### Test Google Login
1. Ensure Google OAuth is properly configured
2. Click "Continue with Google" on login page
3. Complete Google authentication
4. Verify user is logged in successfully

## Troubleshooting

### Email Not Sending
- Check Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Verify EMAIL_USER and EMAIL_PASS in .env

### Google Login Not Working
- Verify Google Client ID is correct
- Check authorized origins in Google Cloud Console
- Ensure Google+ API is enabled

### Reset Token Issues
- Check token expiration (10 minutes)
- Verify frontend URL in .env matches actual URL
- Check email template for correct reset URL format

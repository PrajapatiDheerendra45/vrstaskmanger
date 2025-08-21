# Inactive Staff Login Block Feature

## Overview
This feature prevents inactive staff members from logging into the system and displays an appropriate error message.

## Implementation Details

### Backend Changes
Modified `backend/controller/authController.js` to add status checks in two functions:

1. **`loginUser` function** - Added status check after password verification
2. **`googleLogin` function** - Added status check before JWT token generation

### Status Check Logic
```javascript
// Check if user is active (for staff members)
if (user.role === 0 && user.status === 'inactive') {
  return res.status(403).json({ 
    message: "Access denied. Your account has been deactivated. Please contact the administrator." 
  });
}
```

### Frontend Behavior
- When an inactive staff member tries to login, they will see a toast notification with the message:
  - "Login failed: Access denied. Your account has been deactivated. Please contact the administrator."
- The error is displayed using the existing toast notification system in `client/src/auth/Login.jsx`

## How It Works

1. **Staff Status Management**: Admins can set staff status to "inactive" using the Staff Management interface
2. **Login Attempt**: When an inactive staff member tries to login (either via email/password or Google OAuth)
3. **Status Verification**: The system checks if the user has role=0 (staff) and status="inactive"
4. **Access Denial**: If both conditions are met, login is blocked with a 403 status code
5. **User Notification**: The frontend displays the error message to the user

## Testing the Feature

1. **Set a staff member to inactive**:
   - Go to Admin Dashboard → Staff Management
   - Find a staff member and click the status toggle to set them to "inactive"

2. **Test login attempt**:
   - Try to login with the inactive staff member's credentials
   - You should see the error message: "Access denied. Your account has been deactivated. Please contact the administrator."

3. **Reactivate the staff member**:
   - Go back to Staff Management and set the status back to "active"
   - The staff member should now be able to login successfully

## Security Benefits

- **Immediate Access Control**: Inactive staff members cannot access the system even if they have valid credentials
- **Clear Communication**: Users receive a clear message explaining why access is denied
- **Admin Control**: Only administrators can reactivate accounts
- **Consistent Enforcement**: Works for both regular login and Google OAuth login

## Error Codes

- **403 Forbidden**: Returned when an inactive staff member tries to login
- **400 Bad Request**: Returned for invalid credentials (existing behavior)
- **500 Internal Server Error**: Returned for server errors (existing behavior)

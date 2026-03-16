const { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_GOOGLE_CALLBACK_URL } = require('./src/config/env.js');

console.log('=== Google OAuth Configuration Check ===');
console.log('AUTH_GOOGLE_ID:', AUTH_GOOGLE_ID ? '✅ Set' : '❌ Missing');
console.log('AUTH_GOOGLE_SECRET:', AUTH_GOOGLE_SECRET ? '✅ Set' : '❌ Missing');
console.log('AUTH_GOOGLE_CALLBACK_URL:', AUTH_GOOGLE_CALLBACK_URL);
console.log('');

if (AUTH_GOOGLE_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.log('❌ ACTION REQUIRED:');
  console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Create OAuth 2.0 Client ID');
  console.log('3. Add redirect URI: http://localhost:5000/api/auth/google/callback');
  console.log('4. Update .env file with your credentials');
} else {
  console.log('✅ Google OAuth appears to be configured!');
  console.log('You can test the "Continue with Google" option in the login page.');
}

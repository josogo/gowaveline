
// Gmail OAuth Configuration
export const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Redirect URI should match exactly what you've set in Google Cloud Console
export const REDIRECT_URI = window.location.origin + '/admin/gmail-integration';

// Debug info for troubleshooting
console.log('Gmail Integration Constants:');
console.log('- Redirect URI:', REDIRECT_URI);
console.log('- Current origin:', window.location.origin);
console.log('- Current path:', window.location.pathname);

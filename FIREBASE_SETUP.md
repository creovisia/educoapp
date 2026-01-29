# Firebase Setup Guide for Educo

## Prerequisites
- A Google account
- Basic knowledge of Firebase Console

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project"
3. Enter project name: `educo-app`
4. Choose your preferred Google Analytics account (optional)
5. Click "Create project"
6. Wait for project to be created (takes a few minutes)

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Enable the sign-in provider
4. Click **Save**

## Step 3: Setup Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Select a location (choose closest to your users)
4. Choose **Start in Test Mode** (we'll update security rules later)
5. Click **Create database**

### Add Security Rules

1. In Firestore Database, go to **Rules** tab
2. Delete existing rules
3. Copy the contents from `firestore.rules` file
4. Paste the rules
5. Click **Publish**

### Create Initial Collections

#### Users Collection Structure:
```
users/{userId}
  name: string
  email: string
  class: string
  board: string
  school: string
  fcmToken: string (optional)
  createdAt: timestamp
```

#### Content Collection Structure:
```
content/{contentId}
  title: string
  bookName: string (optional)
  chapterNumber: number (optional)
  class: string
  school: string
  viewUrl: string (Google Drive preview URL)
  downloadUrl: string (Google Drive direct download URL)
  createdAt: timestamp
```

#### Notifications Collection Structure:
```
notifications/{notificationId}
  title: string
  message: string
  class: string
  school: string
  timestamp: timestamp
  readBy: array of userIds
```

## Step 4: Setup Cloud Messaging (FCM)

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Cloud Messaging** tab
3. Click **Generate key** for Web Push certificates
4. Save the key pair (you'll need the VAPID key later)
5. Scroll down to **Web configuration** section
6. Copy the **Web Push Certificate Key Pair**

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** → **General** tab
2. Scroll down to **Your apps** section
3. Click on the **</>** icon (Web app)
4. Enter app name: `educo`
5. Check "Also set up Firebase Hosting" (optional)
6. Click **Register app**
7. Copy the **Firebase SDK snippet** configuration object
8. It should look like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 6: Update Firebase Config in Your App

1. Open `firebase-config.js` file in your project
2. Replace the placeholder values with your actual Firebase config
3. Save the file

## Step 7: Create Admin User

### Option 1: Using Firebase Console

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter email: `admin@educo.app`
4. Enter a secure password
5. Click **Add user**

### Option 2: Using the App

1. Open the app in your browser
2. Use the Admin Panel (accessible only to admin@educo.app)
3. Go to Users tab
4. Create a new user with email: `admin@educo.app`

### Create User Document for Admin

After creating the auth user, you need to create a user document in Firestore:

1. Go to **Firestore Database**
2. Navigate to `users` collection
3. Click **Add document**
4. Use the user's UID from Authentication as the document ID
5. Add these fields:
   - `name`: Admin
   - `email`: admin@educo.app
   - `class`: 12
   - `board`: CBSE
   - `school`: All Schools
   - `createdAt`: (auto-generated timestamp)

## Step 8: Configure Google Drive for PDFs

### Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Library**
4. Search for "Google Drive API"
5. Click on it and enable it

### Create Public PDF Links

For each PDF you want to share:

1. Upload PDF to Google Drive
2. Right-click on the file → **Share**
3. Set sharing to **Anyone with the link**
4. Copy the file ID from the URL (the long string between `/d/` and `/view`)

### Generate View URL

```
https://drive.google.com/file/d/FILE_ID/preview
```

### Generate Download URL

```
https://drive.google.com/uc?export=download&id=FILE_ID
```

Replace `FILE_ID` with your actual file ID.

## Step 9: Test the App

1. Open `index.html` in your browser
2. Login with admin credentials
3. Verify you can access the Admin Panel
4. Create a test user
5. Add some content
6. Send a test notification
7. Login as the test user
8. Verify all features work correctly

## Step 10: Deploy (Optional)

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Select Hosting
5. Use existing project
6. Set public directory to current directory
7. Deploy: `firebase deploy`

### Deploy to Netlify/Vercel

1. Push your code to GitHub
2. Connect repository to Netlify/Vercel
3. Deploy

## Troubleshooting

### Authentication Errors

If you see "auth/email-already-in-use":
- The email is already registered. Use a different email or login with existing credentials.

If you see "auth/wrong-password":
- Check the password is correct
- Reset password using Firebase Console

### Firestore Permission Errors

If you see "Missing or insufficient permissions":
- Check Firestore security rules
- Ensure user is authenticated
- Verify email matches admin email for admin operations

### FCM Not Working

If push notifications don't work:
- Ensure you're on HTTPS or localhost
- Check browser notification permissions
- Verify FCM configuration in Firebase Console
- Check browser console for errors

### PDF Not Loading

If PDF viewer shows blank:
- Ensure Google Drive link is public
- Verify the view URL format is correct
- Check browser console for CORS errors

## Security Best Practices

1. **Never commit Firebase config to public repositories**
2. **Use environment variables in production**
3. **Enable App Check for additional security**
4. **Regularly review Firestore security rules**
5. **Use strong passwords for admin accounts**
6. **Enable 2FA for your Google account**
7. **Monitor Firebase Console for suspicious activity**

## Production Checklist

- [ ] Replace test database with production rules
- [ ] Enable App Check
- [ ] Set up analytics
- [ ] Configure crash reporting
- [ ] Add error tracking (Sentry/Firebase Crashlytics)
- [ ] Test on multiple devices and browsers
- [ ] Test on mobile browsers
- [ ] Verify push notifications work on mobile
- [ ] Set up monitoring and alerts
- [ ] Create backup strategy
- [ ] Document all API endpoints and configurations

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules)
- [Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Review Firestore rules
4. Check network tab for failed requests
5. Review Firebase Console for errors

---

**Note:** This setup guide is for development and testing. For production, implement additional security measures and monitoring.
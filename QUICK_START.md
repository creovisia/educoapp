# Quick Start Guide - Educo

Get Educo up and running in 5 minutes!

## 🚀 Fastest Way to Start

### 1. Open the App
Simply open `index.html` in your browser:
- Double-click `index.html`
- Or drag it to your browser window
- Or use: `python -m http.server 8000` and visit `http://localhost:8000`

### 2. Set Up Firebase (5 minutes)

#### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it: `educo-app`
4. Click "Create project"

#### Step 2: Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

#### Step 3: Setup Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Select location → **Start in Test Mode**
4. Go to **Rules** tab → Delete rules → Paste from `firestore.rules` → **Publish**

#### Step 4: Get Configuration
1. Go to **Project Settings** → **General**
2. Scroll to **Your apps** → Click **</>** (Web)
3. Copy the config object:
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

#### Step 5: Update App Config
1. Open `firebase-config.js`
2. Replace the placeholder with your actual config
3. Save the file

### 3. Create Admin User

#### Option A: Using Firebase Console
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Email: `admin@educo.app`
4. Password: (your choice)
5. Click **Add user**

#### Option B: Using the App
1. Open the app
2. Sign up with any email
3. Go to Firestore Console
4. Create user document manually with admin email

### 4. Create Admin Document (Important!)
After creating the auth user, create a Firestore document:

1. Go to **Firestore Database** → **users** collection
2. Click **Add document**
3. Document ID: (User UID from Authentication)
4. Add fields:
   ```
   name: Admin
   email: admin@educo.app
   class: 12
   board: CBSE
   school: All Schools
   ```
5. Click **Save**

### 5. You're Ready! 🎉

1. Refresh the app
2. Login with: `admin@educo.app`
3. Access Admin Panel from menu
4. Create users and add content

## 📱 Add Content Quickly

### Add Your First PDF

1. **Upload PDF to Google Drive**
   - Upload your PDF file
   - Right-click → Share → Anyone with link
   - Copy the file ID (long string between `/d/` and `/view`)

2. **Add Content via Admin Panel**
   - Go to Admin Panel → Content tab
   - Fill in:
     - Title: "Chapter 1 - Introduction"
     - Book Name: "Maths Part-I"
     - Chapter Number: 1
     - Class: 10
     - School: "My School"
     - View URL: `https://drive.google.com/file/d/YOUR_FILE_ID/preview`
     - Download URL: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`
   - Click **Add Content**

3. **Test It!**
   - Logout as admin
   - Create a user with matching class and school
   - Login as that user
   - See the content!

## 🔔 Send Your First Notification

1. Go to Admin Panel → Notifications tab
2. Fill in:
   - Title: "Welcome to Educo!"
   - Message: "We've added new content for you."
   - Class: Select class or "All"
   - School: Enter school name
3. Click **Send Notification**
4. Users with matching class/school will see it!

## 📱 Test on Mobile

1. Deploy to Firebase Hosting (or any hosting)
2. Open on your phone
3. Allow notifications
4. Test all features

## ❓ Common Quick Fixes

**"Login fails"**
→ Check Firebase config is correct
→ Verify email/password in Firebase Console

**"Can't see content"**
→ Ensure user's class and school match content
→ Check content is added correctly

**"PDF not loading"**
→ Make sure Google Drive link is public
→ Verify URL format is correct

**"Admin panel not showing"**
→ Check email is exactly `admin@educo.app`
→ Verify user document exists in Firestore

## 🎯 Next Steps

- Read full [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed setup
- Check [README.md](README.md) for all features
- Deploy to production using Firebase Hosting

## 💡 Tips

- Use Chrome DevTools for debugging
- Check browser console for errors
- Test on multiple devices
- Keep your admin password secure

---

**Need help?** Check the detailed documentation in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
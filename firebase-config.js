// Firebase Configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDcXgGY5zwFCuDByvpgt6GzF5B2M9uZdFc",
  authDomain: "educoapp.firebaseapp.com",
  databaseURL: "https://educoapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "educoapp",
  storageBucket: "educoapp.firebasestorage.app",
  messagingSenderId: "727036537455",
  appId: "1:727036537455:web:5bf727d17ed8f5bf153b9a",
  measurementId: "G-2KYGR2XWP6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

// Export for use in other files
window.firebaseConfig = {
  auth,
  db,
  messaging
};
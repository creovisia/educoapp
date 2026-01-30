import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";

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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
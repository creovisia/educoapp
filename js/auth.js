// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = function () {
  signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  ).then(() => {
    window.location.href = "home.html";
  }).catch(err => alert(err.message));
};

onAuthStateChanged(auth, user => {
  if (user && location.pathname.includes("index")) {
    window.location.href = "home.html";
  }
});
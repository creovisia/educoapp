// For Firebase JS SDK v7.20.0 and later, measurementId is optional



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
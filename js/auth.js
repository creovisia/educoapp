import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => location.href = "home.html")
    .catch(e => alert(e.message));
};

window.logout = () => {
  signOut(auth).then(() => location.href = "index.html");
};

export function protect() {
  onAuthStateChanged(auth, user => {
    if (!user) location.href = "index.html";
  });
}
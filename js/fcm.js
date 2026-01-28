import { messaging, auth, db } from "./firebase.js";
import { getToken } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";
import { doc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const token = await getToken(messaging, {
    vapidKey: "YOUR_VAPID_KEY"
  });

  if (token) {
    await updateDoc(doc(db, "users", user.uid), {
      fcmToken: token
    });
  }
});
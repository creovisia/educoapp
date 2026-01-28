import { auth, db } from "./firebase.js";
import { collection, onSnapshot } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const u = (await db.collection("users").doc(user.uid).get()).data();

  onSnapshot(collection(db, "notifications"), snap => {
    let unread = 0;
    snap.forEach(d => {
      const n = d.data();
      if (
        n.school === u.school &&
        n.class === u.class &&
        (!n.readBy || !n.readBy.includes(user.uid))
      ) unread++;
    });

    const badge = document.getElementById("badge");
    badge.innerText = unread;
    badge.classList.toggle("hidden", unread === 0);
  });
});
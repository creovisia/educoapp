import { auth, db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  const u = (await db.collection("users").doc(user.uid).get()).data();
  const snap = await getDocs(collection(db, "notifications"));

  notificationList.innerHTML = "";
  snap.forEach(async d => {
    const n = d.data();
    if (n.school === u.school && n.class === u.class) {
      notificationList.innerHTML += `
        <div class="notification">
          <h4>${n.title}</h4>
          <p>${n.message}</p>
        </div>`;

      if (!n.readBy || !n.readBy.includes(user.uid)) {
        await updateDoc(doc(db,"notifications",d.id), {
          readBy: [...(n.readBy||[]), user.uid]
        });
      }
    }
  });
});
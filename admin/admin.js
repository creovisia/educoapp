import { auth, db } from "../firebase.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user || user.email !== "admin@educo.app") {
    location.href = "../index.html";
  }
  loadUsers();
  loadContent();
});

/* ===================== USERS ===================== */

window.createUser = async () => {
  await addDoc(collection(db, "users"), {
    name: uName.value,
    email: uEmail.value,
    class: uClass.value,
    school: uSchool.value
  });
  loadUsers();
};

async function loadUsers() {
  userList.innerHTML = "";
  const snap = await getDocs(collection(db, "users"));
  snap.forEach(d => {
    const u = d.data();
    userList.innerHTML += `
      <div class="card">
        <b>${u.name}</b> (${u.email})<br>
        Class: ${u.class} | School: ${u.school}
        <br>
        <button onclick="deleteUser('${d.id}')">Delete</button>
      </div>`;
  });
}

window.deleteUser = async id => {
  await deleteDoc(doc(db, "users", id));
  loadUsers();
};

/* ===================== CONTENT ===================== */

window.createContent = async () => {
  await addDoc(collection(db, "content"), {
    title: cTitle.value,
    class: cClass.value,
    school: cSchool.value,
    viewUrl: cView.value,
    downloadUrl: cDownload.value
  });
  loadContent();
};

async function loadContent() {
  contentList.innerHTML = "";
  const snap = await getDocs(collection(db, "content"));
  snap.forEach(d => {
    const c = d.data();
    contentList.innerHTML += `
      <div class="card">
        <b>${c.title}</b><br>
        Class: ${c.class} | School: ${c.school}
        <br>
        <button onclick="deleteContent('${d.id}')">Delete</button>
      </div>`;
  });
}

window.deleteContent = async id => {
  await deleteDoc(doc(db, "content", id));
  loadContent();
};

/* ===================== NOTIFICATIONS ===================== */

window.sendNotification = async () => {
  await addDoc(collection(db, "notifications"), {
    title: nTitle.value,
    message: nMsg.value,
    class: nClass.value,
    school: nSchool.value,
    timestamp: Date.now(),
    readBy: []
  });
  alert("Notification sent!");
};

/* ===================== LOGOUT ===================== */

window.logout = () => auth.signOut();
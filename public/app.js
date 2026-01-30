import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let currentUserData = null;
let activeSchoolId = null;

onAuthStateChanged(auth, async user => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  currentUserData = snap.data();
  activeSchoolId = currentUserData.schoolId;

  renderSidebar();
  loadDashboard();
});

window.renderSidebar = function () {
  const s = document.getElementById("sidebar");
  s.innerHTML = `<h3>${currentUserData.name}</h3>`;

  s.innerHTML += `<button onclick="loadDashboard()">Dashboard</button>`;
  s.innerHTML += `<button onclick="loadChat()">Chat</button>`;
  s.innerHTML += `<button onclick="loadReportCards()">Report Cards</button>`;

  if (["admin","teacher"].includes(currentUserData.role)) {
    s.innerHTML += `<button onclick="loadMarks()">Marks</button>`;
    s.innerHTML += `<button onclick="loadAttendance()">Attendance</button>`;
  }

  if (currentUserData.role === "superadmin") {
    s.innerHTML += `<button onclick="loadSchools()">Schools</button>`;
  }
};

window.loadDashboard = function () {
  document.getElementById("main-content").innerHTML = `
    <div class="card">
      <h2>Welcome ${currentUserData.name}</h2>
      <p>Role: ${currentUserData.role}</p>
      <p>School ID: ${currentUserData.schoolId}</p>
    </div>
  `;
};
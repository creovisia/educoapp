const feed = document.getElementById("feed");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".categories button");

let allFiles = [];
let currentSubject = "By School";

// Load files from Firebase
db.collection("files").onSnapshot(snapshot => {
  allFiles = snapshot.docs.map(doc => doc.data());
  renderFiles();
});

function renderFiles() {
  feed.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  allFiles
    .filter(file =>
      (currentSubject === "By School" || file.subject === currentSubject) &&
      file.title.toLowerCase().includes(searchText)
    )
    .forEach(file => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="icon">📄</div>
        <div>
          <h3>${file.title}</h3>
          <p>${file.subject} • PDF</p>
        </div>
      `;
      card.onclick = () => window.open(file.link, "_blank");
      feed.appendChild(card);
    });
}

// Search
searchInput.addEventListener("input", renderFiles);

// Category filter
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentSubject = btn.dataset.subject;
    renderFiles();
  });
});
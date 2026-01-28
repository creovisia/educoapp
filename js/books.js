function openBook(book) {
  localStorage.setItem("book", book);
  location.href = "chapters.html";
}
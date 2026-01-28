function openPDF(viewUrl) {
  localStorage.setItem("pdfView", viewUrl);
  location.href = "reader.html";
}

function downloadPDF(downloadUrl) {
  window.open(downloadUrl, "_blank");
}
const certificationCategories = {
  Technical: ["Amazon Nova.pdf","AWS AI CERT.pdf","AWS Artificial Intelligence Practitioner Learning Plan.pdf","AWS Cloud Practitioner Essentials.pdf","AWS SimuLearn Cloud Practitioner.pdf","AWS.pdf","Bedrock.pdf","Building Generative AI Applications Using Amazon Bedrock.pdf","Developing Generative Artificial Intelligence Solutions.pdf","Developing Machine Learning Solutions.pdf","Essentials of Prompt Engineering.pdf","Exploring Artificial Intelligence Use Cases and Applications.pdf","Foundations of Prompt Engineering.pdf","Fundamentals of ML & AI.pdf","Gen AI.pdf","Generative AI Learning Plan for Developers.pdf","Intro to Gen AI.pdf","Introduction to Amazon SageMaker Notebooks.pdf","Optimizing Foundation Models.pdf","Responsible Artificial Intelligence Practices.pdf","Security, Compliance, and Governance for AI Solutions.pdf"],
  "Non-Technical": ["graphic designing cert.png","Screenshot 2024-11-14 133835.png","Screenshot 2025-06-28 115207.png","Sport Certificate.png"]
};
const gallery = document.querySelector("#certification-gallery");
Object.entries(certificationCategories).forEach(([category, files]) => {
  const section = document.createElement("section");
  section.className = "cert-category";
  section.innerHTML = `<h2>${category === "Non-Technical" ? "Non-<em>Technical</em>" : "<em>Technical</em>"}</h2><div class="cert-list"></div>`;
  const list = section.querySelector(".cert-list");
  files.forEach((file) => {
    const link = document.createElement("a");
    link.href = `./Content/Certifications/${encodeURIComponent(category)}/${encodeURIComponent(file)}`;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openCertificatePreview(link.href, file);
    });
    link.textContent = `${file.replace(/\.[^.]+$/, "")} ↗`;
    list.append(link);
  });
  gallery.append(section);
});
const modal = document.querySelector("#certification-modal");
const modalContent = document.querySelector("#certification-modal-content");
const modalTitle = document.querySelector("#certification-modal-title");
const closeButton = document.querySelector("#certification-modal-close");
function openCertificatePreview(path, file) {
  const isPdf = file.toLowerCase().endsWith(".pdf");
  modalContent.innerHTML = isPdf
    ? `<iframe src="${path}" title="${file}" loading="lazy"></iframe>`
    : `<img src="${path}" alt="${file.replace(/\.[^.]+$/, "")}">`;
  modalTitle.textContent = file.replace(/\.[^.]+$/, "");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeButton.focus();
}
function closeCertificatePreview() {
  modal.setAttribute("aria-hidden", "true");
  modalContent.innerHTML = "";
  document.body.classList.remove("modal-open");
}
closeButton.addEventListener("click", closeCertificatePreview);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeCertificatePreview();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeCertificatePreview();
});

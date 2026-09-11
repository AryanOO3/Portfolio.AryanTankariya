const designCategories = {
  "Branding and Logos": ["Brand 1.png","Brand 2.png","logo11.png","logo12.png","logo13.png","logo14.png","logo4.png","Screenshot 2024-10-01 162942.png","Screenshot 2024-10-01 172640.png","The Bodhi.png","Untitled design.png","Untitled design2.png"],
  "Certificates Designs": ["1.png","11.png","38.png","50.png","8.png","Appreciation Certificates.png","certificate.png","graphic designing cert.png","PPT.png","Proficiency Certificates.png","Project.png","Screenshot 2024-11-14 133835.png","Screenshot 2025-06-28 115207.png","Sport Certificate.png","Teacher's day.png","triumph.png","ZICA.png"],
  Posts: ["11.png","Farewell.png","Freasher's + Janmashtami.png","Ram Mandir.mp4","Ravindra Jadeja.mp4","Republic Day.png","Screenshot 2025-02-03 151318.png","Teacher's day 2.png","Teacher's day.png","Vasant Panchmi.mp4"],
  Prints: ["1.png","2.png","Entry Pass.png","Pass.png","Screenshot 2024-11-01 172408.png","Screenshot 2025-12-28 222652.png","Screenshot 2026-02-08 175350.png"],
  Randoms: ["13.png","gojow.jpg","magazine1.png","magazine2.png","navratri.jpg","Screenshot 2024-08-25 141652.png","Screenshot 2024-08-25 174600.png","Screenshot 2025-01-18 154329.png"],
  "UI-UX": ["1.png","2.png","3.png","4.png","5.png","6.png","7.png","Screenshot 2025-05-01 171349.png","Screenshot 2025-05-08 100009.png","Screenshot 2025-10-06 223249.png"]
};
const gallery = document.querySelector("#design-gallery");
Object.entries(designCategories).forEach(([category, files]) => {
  const section = document.createElement("section");
  section.className = "design-category";
  section.innerHTML = `<h2>${category.replace(" and ", " <em>&</em> ").replace("-", " <em>/</em> ")}</h2><div class="design-grid"></div>`;
  const grid = section.querySelector(".design-grid");
  files.forEach((file) => {
    const path = `./Content/Graphic%20Design/${encodeURIComponent(category)}/${encodeURIComponent(file)}`;
    const card = document.createElement("a");
    card.className = "design-card";
    card.href = path;
    const isVideo = file.toLowerCase().endsWith(".mp4");
    card.addEventListener("click", (event) => {
      event.preventDefault();
      openDesignPreview(path, file, isVideo);
    });
    card.innerHTML = isVideo
      ? `<video src="${path}" muted loop autoplay playsinline></video><span>${file.replace(/\.[^.]+$/, "")}</span>`
      : `<img src="${path}" alt="${file.replace(/\.[^.]+$/, "")}"><span>${file.replace(/\.[^.]+$/, "")}</span>`;
    const media = card.querySelector("img, video");
    if (isVideo) media.preload = "metadata";
    else {
      media.loading = "lazy";
      media.decoding = "async";
    }
    grid.append(card);
  });
  gallery.append(section);
});
const modal = document.querySelector("#design-modal");
const modalContent = document.querySelector("#design-modal-content");
const modalTitle = document.querySelector("#design-modal-title");
const closeButton = document.querySelector("#design-modal-close");
function openDesignPreview(path, file, isVideo) {
  modalContent.innerHTML = isVideo
    ? `<video src="${path}" controls autoplay playsinline></video>`
    : `<img src="${path}" alt="${file.replace(/\.[^.]+$/, "")}">`;
  modalTitle.textContent = file.replace(/\.[^.]+$/, "");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeButton.focus();
}
function closeDesignPreview() {
  modal.setAttribute("aria-hidden", "true");
  modalContent.innerHTML = "";
  document.body.classList.remove("modal-open");
}
closeButton.addEventListener("click", closeDesignPreview);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeDesignPreview();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeDesignPreview();
});

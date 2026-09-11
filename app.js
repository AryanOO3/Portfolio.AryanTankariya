import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("#space-canvas");
const selectedPlanet = document.querySelector("#selected-planet");
const labels = {
  about: document.querySelector("#label-about"),
  resume: document.querySelector("#label-resume"),
  projects: document.querySelector("#label-projects"),
  design: document.querySelector("#label-design"),
  certifications: document.querySelector("#label-certifications"),
};
const themedPageNames = {
  "about.html": ["Profile // About Me", "01 / Profile // About Me"],
  "resume.html": ["Mission Log // Resume", "02 / Mission Log // Resume"],
  "projects.html": ["Project Bay // Projects", "03 / Project Bay // Projects"],
  "graphic-designing.html": ["Design Lab // Graphic Design", "04 / Design Lab // Graphic Design"],
  "certifications.html": ["Credentials // Certifications", "05 / Credentials // Certifications"],
};
const pageName = themedPageNames[location.pathname.split("/").pop()];
if (pageName) {
  document.title = `${pageName[0]} // Orbit`;
  const pageMarker = document.querySelector(".page-top > span");
  if (pageMarker) pageMarker.textContent = pageName[1];
}
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080b18, 0.035);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.4, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(1800 * 3);
for (let i = 0; i < starPositions.length; i += 3) {
  const radius = 4 + Math.random() * 16;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i + 1] = radius * Math.cos(phi);
  starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
}
starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starTextureCanvas = document.createElement("canvas");
starTextureCanvas.width = 32;
starTextureCanvas.height = 32;
const starTextureContext = starTextureCanvas.getContext("2d");
const starGradient = starTextureContext.createRadialGradient(16, 16, 0, 16, 16, 16);
starGradient.addColorStop(0, "rgba(255,255,255,1)");
starGradient.addColorStop(0.25, "rgba(220,230,255,0.9)");
starGradient.addColorStop(0.65, "rgba(180,200,255,0.22)");
starGradient.addColorStop(1, "rgba(180,200,255,0)");
starTextureContext.fillStyle = starGradient;
starTextureContext.fillRect(0, 0, 32, 32);
const starTexture = new THREE.CanvasTexture(starTextureCanvas);
const stars = new THREE.Points(
  starsGeometry,
  new THREE.PointsMaterial({
    color: 0xb8c7ff,
    size: 0.07,
    map: starTexture,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  })
);
scene.add(stars);

const assets = new THREE.Group();
assets.position.y = -3.6;
assets.position.set(0, -1.7, 0);
assets.scale.setScalar(0.78);
scene.add(assets);
const assetFiles = [
  "Планета36.glb",
  "Планета19.glb",
  "Mercury.glb",
  "earth-00.glb",
  "Moon.glb",
  "MOON05.glb",
  "Jupiter.glb",
  "saturn.glb",
  "uranus.glb",
  "neptune.glb",
  "Sun.glb",
];
const pageDestinations = {
  "earth-00.glb": ["Mission Log / Resume", "./resume.html"],
  "Sun.glb": ["Profile / About Me", "./about.html"],
  "Jupiter.glb": ["Project Bay / Projects", "./projects.html"],
  "saturn.glb": ["Design Lab / Graphic Design", "./graphic-designing.html"],
  "neptune.glb": ["Credentials / Certifications", "./certifications.html"],
};
const labelByFile = {
  "earth-00.glb": labels.resume,
  "Sun.glb": labels.about,
  "Jupiter.glb": labels.projects,
  "saturn.glb": labels.design,
  "neptune.glb": labels.certifications,
};
const fallbackDestinations = [
  ["Profile / About Me", "./about.html"],
  ["Mission Log / Resume", "./resume.html"],
  ["Project Bay / Projects", "./projects.html"],
  ["Design Lab / Graphic Design", "./graphic-designing.html"],
  ["Credentials / Certifications", "./certifications.html"],
];
const orbitRadii = [
  1.55, 1.98, 2.45, 2.92, 3.42, 3.92, 4.45, 5.0, 5.55, 6.1, 0,
];
const loadedAssets = [];
const loader = new GLTFLoader();
const orbitMaterial = new THREE.LineBasicMaterial({
  color: 0x7885ba,
  transparent: true,
  opacity: 0.22,
});
orbitRadii.slice(0, -1).forEach((radius) => {
  const points = [];
  for (let i = 0; i <= 96; i += 1) {
    const angle = (i / 96) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -1.8));
  }
  const orbit = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    orbitMaterial
  );
  assets.add(orbit);
});
assetFiles.forEach((file, index) => {
  loader.load(`./3d/${encodeURIComponent(file)}`, (gltf) => {
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const largestSide = Math.max(size.x, size.y, size.z);
    const targetSize = file === "Sun.glb" ? 2.2 : file === "saturn.glb" ? 1.1 : file === "Jupiter.glb" ? 1.25 : file === "Moon.glb" ? 0.55 : 0.65;
    model.scale.setScalar(targetSize / largestSide);
    const radius = orbitRadii[index];
    const phase = index * 0.92;
    model.position.set(Math.cos(phase) * radius, Math.sin(phase) * radius, -1.8);
    model.rotation.set(0.1 * index, index * 0.6, -0.08 * index);
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    assets.add(model);
    model.userData.planetName = file.replace(".glb", "").replace("earth-00", "Earth");
    model.userData.destination = pageDestinations[file] || fallbackDestinations[index % fallbackDestinations.length];
    loadedAssets.push({ model, index, radius, phase, label: labelByFile[file] });
  }, undefined, (error) => {
    console.error(`Could not load 3D asset: ${file}`, error);
  });
});
scene.add(new THREE.HemisphereLight(0x9aaeff, 0x130e24, 2.8));
const keyLight = new THREE.DirectionalLight(0xffd2af, 4);
keyLight.position.set(3, 5, 5);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x718cff, 2.2);
fillLight.position.set(-4, 1, 3);
scene.add(fillLight);

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let scrollProgress = 0;
let scrollTarget = 0;
addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
});
addEventListener("click", (event) => {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(loadedAssets.map(({ model }) => model), true)[0];
  if (!hit) return;
  let object = hit.object;
  while (object && !object.userData.planetName) object = object.parent;
  if (!object) return;
  const [pageName, pageUrl] = object.userData.destination;
  if (selectedPlanet) selectedPlanet.textContent = `${pageName} / selected`;
  window.location.href = pageUrl;
});
addEventListener("scroll", () => {
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  scrollTarget = maxScroll > 0 ? scrollY / maxScroll : 0;
});
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
const labelWorldPosition = new THREE.Vector3();
function positionLabel(model, label) {
  if (!label) return;
  model.getWorldPosition(labelWorldPosition);
  labelWorldPosition.y += 0.42;
  labelWorldPosition.project(camera);
  label.style.transform = `translate(${(labelWorldPosition.x * 0.5 + 0.5) * innerWidth}px, ${(-labelWorldPosition.y * 0.5 + 0.5) * innerHeight}px)`;
  label.style.opacity = labelWorldPosition.z > 1 ? "0" : "1";
}
function animate() {
  const elapsed = clock.getElapsedTime();
  stars.rotation.y = elapsed * 0.006;
  scrollProgress += (scrollTarget - scrollProgress) * 0.055;
  assets.rotation.x = 1.08;
  assets.rotation.z = -0.3;
  assets.rotation.y = 0;
  loadedAssets.forEach(({ model, index, radius, phase, label }) => {
    if (radius === 0) {
      model.rotation.y += 0.002;
      positionLabel(model, label);
      return;
    }
    const orbit = scrollProgress * Math.PI * 2 + phase + elapsed * (0.012 + index * 0.002);
    model.position.x = Math.cos(orbit) * radius;
    model.position.y = Math.sin(orbit) * radius;
    model.position.z = -1.8 + Math.sin(orbit * 0.7) * 0.12;
    model.rotation.y += 0.003 + scrollProgress * 0.004;
    positionLabel(model, label);
  });
  camera.position.x += (pointer.x * 0.16 - camera.position.x) * 0.018;
  camera.position.y += (pointer.y * 0.1 + 0.4 - camera.position.y) * 0.018;
  camera.position.z += (9.4 - camera.position.z) * 0.018;
  camera.lookAt(0, 0.35, -1);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

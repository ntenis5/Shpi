import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase konfigurimi
const firebaseConfig = {
  apiKey: "AIzaSyAzeg2ha8agdS5zKFB34Udwj2CTMJamy0E",
  authDomain: "shpi-d4e2d.firebaseapp.com",
  projectId: "shpi-d4e2d",
  storageBucket: "shpi-d4e2d.appspot.com",
  messagingSenderId: "600471884377",
  appId: "1:600471884377:web:5512544dc9dfb1fa009748"
};

// Inicimi i Firebase dhe Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const propertyCol = collection(db, "properties");
let allProperties = [];

// Inicializimi i globit
const globe = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  .backgroundColor('#000')
  .pointOfView({ lat: 20, lng: 0, altitude: 2 });

function renderPoints(data) {
  globe.pointsData(data)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointAltitude(0.05)
    .pointColor(() => 'orange')
    .pointLabel(d => `${d.category}<br>${d.city}<br>€${d.price}`);
  updateCategoryFilter(data);
}

function updateCategoryFilter(data) {
  const categories = [...new Set(data.map(p => p.category))];
  const select = document.getElementById("filter-category");
  select.innerHTML = '<option value="">Të gjitha kategoritë</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

window.applyFilters = function () {
  const fCategory = document.getElementById("filter-category").value.toLowerCase();
  const fCity = document.getElementById("filter-city").value.toLowerCase();
  const fMax = parseFloat(document.getElementById("filter-price").value);
  const fMin = parseFloat(document.getElementById("filter-min-price").value);
  const sort = document.getElementById("filter-sort").value;

  let filtered = allProperties.filter(p => {
    return (!fCategory || p.category.toLowerCase().includes(fCategory)) &&
           (!fCity || p.city.toLowerCase().includes(fCity)) &&
           (!fMax || p.price <= fMax) &&
           (!fMin || p.price >= fMin);
  });

  if (sort === "asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "desc") filtered.sort((a, b) => b.price - a.price);

  renderPoints(filtered);
};

window.addProperty = async function () {
  const sanitize = (id) => document.getElementById(id).value.trim().replace(/[<>]/g, "");
  const category = sanitize("new-category");
  const city = sanitize("new-city");
  const price = parseFloat(document.getElementById("new-price").value);
  const lat = parseFloat(document.getElementById("new-lat").value);
  const lng = parseFloat(document.getElementById("new-lng").value);

  if (!category || !city || isNaN(price) || isNaN(lat) || isNaN(lng)) {
    alert("⚠️ Të gjitha fushat janë të detyrueshme dhe duhet të jenë të vlefshme.");
    return;
  }

  try {
    const newProp = { category, city, price, lat, lng };
    await addDoc(propertyCol, newProp);
    alert("✅ Prona u shtua me sukses!");
    location.reload();
  } catch (err) {
    console.error("Gabim në shtim prone:", err);
    alert("❌ Shtimi i pronës dështoi.");
  }
};

window.filterByCategory = function (cat) {
  document.getElementById("filter-category").value = cat;
  applyFilters();
};

// Rendisja orbitale e butonave të kategorive
const orbitButtons = document.querySelectorAll('.orbit-button');
const radius = 160;
orbitButtons.forEach((btn, i) => {
  const angle = (i / orbitButtons.length) * 2 * Math.PI;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  btn.style.left = `${250 + x - 50}px`;
  btn.style.top = `${250 + y - 50}px`;
});

// Ngarko të gjitha pronat dhe shfaq në glob
const propertySnap = await getDocs(propertyCol);
allProperties = propertySnap.docs.map(doc => doc.data());
renderPoints(allProperties);

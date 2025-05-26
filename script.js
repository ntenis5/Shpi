// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase konfigurimi
const firebaseConfig = {
  apiKey: "AIzaSyAdKeG2FPS85pG8pZbNf_Fg7Yh-34bZruk",
  authDomain: "shpipron.firebaseapp.com",
  projectId: "shpipron",
  storageBucket: "shpipron.appspot.com",
  messagingSenderId: "42251121368",
  appId: "1:42251121368:web:f528291f5cdbfcb87bddad",
  measurementId: "G-XYR0NH53FC"
};

// Inicializo Firebase dhe Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let map;
let markers = [];

// Inicializo hartën Google Maps
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.3275, lng: 19.8189 }, // Qendra e Tiranës
    zoom: 10,
  });

  loadProperties();
};

// Funksion për geokodim (konverton adresë në koordinata)
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve(results[0].geometry.location);
      } else {
        console.warn("Geocode dështoi për: " + address);
        resolve(null); // nuk heq ngarkimin nëse nuk gjendet
      }
    });
  });
}

// Pastro markerat nga harta
function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}

// Ngarko pronat nga Firebase dhe shfaq i filtruar
async function loadProperties() {
  clearMarkers();
  const propertyList = document.getElementById("property-list");
  propertyList.innerHTML = "";

  // Merr filtrat nga inputet
  const priceMin = parseFloat(document.getElementById("filter-price-min").value) || 0;
  const priceMax = parseFloat(document.getElementById("filter-price-max").value) || Infinity;
  const countryFilter = document.getElementById("filter-country").value.trim().toLowerCase();
  const cityFilter = document.getElementById("filter-city").value.trim().toLowerCase();

  // Merr të gjitha pronat nga koleksioni "properties"
  const snapshot = await getDocs(collection(db, "properties"));
  const properties = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    properties.push({ id: doc.id, ...data });
  });

  // Filtrimi bazuar në çmim dhe vendndodhje
  const filtered = properties.filter(p => {
    const price = Number(p.price);
    const loc = (p.location || "").toLowerCase();

    const matchesPrice = price >= priceMin && price <= priceMax;
    const matchesCountry = countryFilter ? loc.includes(countryFilter) : true;
    const matchesCity = cityFilter ? loc.includes(cityFilter) : true;

    return matchesPrice && matchesCountry && matchesCity;
  });

  for (const prop of filtered) {
    // Krijo elementin në listë
    const div = document.createElement("div");
    div.className = "property-item";
    div.innerHTML = `
      <h3>${prop.title}</h3>
      <img src="${prop.imageUrl || ''}" alt="${prop.title}" style="width:100%; max-height:200px; object-fit:cover;" />
      <p>${prop.description || ""}</p>
      <p><strong>Çmimi:</strong> €${prop.price}</p>
      <p><strong>Vendndodhja:</strong> ${prop.location}</p>
    `;
    propertyList.appendChild(div);

    // Vendos marker në hartë
    const coords = await geocodeAddress(prop.location);
    if (coords) {
      const marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: prop.title
      });
      markers.push(marker);
    }
  }
}

// Event listener për filtrat
document.getElementById("filter-price-min").addEventListener("input", loadProperties);
document.getElementById("filter-price-max").addEventListener("input", loadProperties);
document.getElementById("filter-country").addEventListener("input", loadProperties);
document.getElementById("filter-city").addEventListener("input", loadProperties);

// Mund ta zgjerosh me kategori, kërkesa për qira/shitje etj.

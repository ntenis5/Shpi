// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "API_KEY_YT",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "APP_ID_YT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allProperties = [];
let filteredProperties = [];

const Globe = window.Globe;
const world = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .pointOfView({ lat: 20, lng: 0, altitude: 2 }, 1000)
  .labelsData([]);

async function fetchProperties() {
  const snapshot = await getDocs(collection(db, "prona"));
  allProperties = snapshot.docs.map(doc => doc.data());
  filteredProperties = allProperties;
  updateGlobe();
}
fetchProperties();

function updateGlobe() {
  world.labelsData(filteredProperties.map(p => ({
    lat: p.lat,
    lng: p.lng,
    text: `${p.category}: ${p.city} - ${p.price}€`,
    size: 1.5,
    color: p.type === "sale" ? "lime" : "deepskyblue"
  })));
}

// Filter functions
window.filterByCategory = (category) => {
  filteredProperties = allProperties.filter(p => p.category === category);
  updateGlobe();
};

document.getElementById("applyFilterBtn").onclick = () => {
  const cat = document.getElementById("filter-category").value;
  const city = document.getElementById("filter-city").value.toLowerCase();
  const minPrice = parseFloat(document.getElementById("filter-min-price").value) || 0;
  const maxPrice = parseFloat(document.getElementById("filter-price").value) || Infinity;
  const sort = document.getElementById("filter-sort").value;

  filteredProperties = allProperties.filter(p =>
    (!cat || p.category === cat) &&
    (!city || p.city.toLowerCase().includes(city)) &&
    p.price >= minPrice &&
    p.price <= maxPrice
  );

  if (sort === "asc") {
    filteredProperties.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filteredProperties.sort((a, b) => b.price - a.price);
  }

  updateGlobe();
};

// UI buttons
document.getElementById("searchToggle").onclick = () => {
  const panel = document.getElementById("filterPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
};

document.getElementById("adminToggle").onclick = () => {
  const panel = document.getElementById("adminPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
};

document.getElementById("resetBtn").onclick = () => {
  filteredProperties = allProperties;
  updateGlobe();
};

document.getElementById("addPropertyBtn").onclick = async () => {
  const newProp = {
    category: document.getElementById("new-category").value,
    city: document.getElementById("new-city").value,
    price: parseFloat(document.getElementById("new-price").value),
    lat: parseFloat(document.getElementById("new-lat").value),
    lng: parseFloat(document.getElementById("new-lng").value),
    type: document.getElementById("new-type").value
  };

  if (!newProp.category || !newProp.city || isNaN(newProp.price)) {
    alert("Plotëso të gjitha fushat saktë!");
    return;
  }

  await addDoc(collection(db, "prona"), newProp);
  alert("Prona u shtua!");
  fetchProperties();
};

// Opsionale: Ndaj sipas tipit
document.getElementById("saleBtn").onclick = () => {
  filteredProperties = allProperties.filter(p => p.type === "sale");
  updateGlobe();
};

document.getElementById("rentBtn").onclick = () => {
  filteredProperties = allProperties.filter(p => p.type === "rent");
  updateGlobe();
};

document.getElementById("startBtn").onclick = () => {
  document.getElementById("resetBtn").style.display = "inline-block";
  filteredProperties = allProperties;
  updateGlobe();
};

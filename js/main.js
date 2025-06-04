// /js/main.js
import { db, propertyCol } from './firebase-config.js';
import { initGlobe, renderPoints } from './globe.js';
import { applyFilters, updateCategoryFilter } from './filters.js';
import { setupAdmin } from './admin.js';
import { getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

let allProperties = [];
let selectedCategory = "";
let selectedType = "";

initGlobe(document.getElementById('globeViz'));

async function loadProperties() {
  const snapshot = await getDocs(propertyCol);
  allProperties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderPoints(allProperties);
  updateCategoryFilter(allProperties);
}
loadProperties();

setupAdmin(allProperties);

// Toggles
document.getElementById("searchToggle").onclick = () => {
  document.getElementById("filterPanel").style.display =
    document.getElementById("filterPanel").style.display === "block" ? "none" : "block";
  document.getElementById("adminPanel").style.display = "none";
};
document.getElementById("adminToggle").onclick = () => {
  document.getElementById("adminPanel").style.display =
    document.getElementById("adminPanel").style.display === "block" ? "none" : "block";
  document.getElementById("filterPanel").style.display = "none";
};

// Sale / Rent Buttons
document.getElementById('saleBtn').onclick = () => { selectedType = "sale"; alert("Në shitje"); };
document.getElementById('rentBtn').onclick = () => { selectedType = "rent"; alert("Me qira"); };

// START
document.getElementById('startBtn').onclick = () => {
  let filtered = allProperties;
  if (selectedType) filtered = filtered.filter(p => p.type === selectedType);
  if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
  renderPoints(filtered);
  document.getElementById("resetBtn").style.display = "inline-block";
  document.getElementById("categoryCircle").style.pointerEvents = "none";
  document.getElementById("categoryCircle").style.opacity = 0.3;
  document.getElementById("saleBtn").style.display = "none";
  document.getElementById("rentBtn").style.display = "none";
  document.getElementById("searchToggle").style.display = "none";
};

// RESET
document.getElementById('resetBtn').onclick = () => {
  renderPoints(allProperties);
  selectedCategory = "";
  selectedType = "";
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("categoryCircle").style.pointerEvents = "auto";
  document.getElementById("categoryCircle").style.opacity = 1;
  document.getElementById("saleBtn").style.display = "inline-block";
  document.getElementById("rentBtn").style.display = "inline-block";
  document.getElementById("searchToggle").style.display = "inline-block";
  document.getElementById("filterPanel").style.display = "none";
  document.getElementById("adminPanel").style.display = "none";
};

// Apply filter button
document.getElementById("applyFilterBtn").onclick = () => {
  applyFilters(allProperties);
  document.getElementById("resetBtn").style.display = "inline-block";
  document.getElementById("filterPanel").style.display = "none";
};

// Orbit category buttons
window.filterByCategory = (cat) => {
  selectedCategory = cat;
  const filtered = allProperties.filter(p => p.category === cat);
  renderPoints(filtered);
  document.getElementById("resetBtn").style.display = "inline-block";
};

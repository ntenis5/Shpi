// /js/admin.js
import { addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { propertyCol } from './firebase-config.js';
import { renderPoints } from './globe.js';
import { updateCategoryFilter } from './filters.js';

export function setupAdmin(allProperties) {
  document.getElementById("addPropertyBtn").onclick = async () => {
    const category = document.getElementById("new-category").value.trim();
    const city = document.getElementById("new-city").value.trim();
    const price = parseFloat(document.getElementById("new-price").value);
    const lat = parseFloat(document.getElementById("new-lat").value);
    const lng = parseFloat(document.getElementById("new-lng").value);
    const type = document.getElementById("new-type").value;

    if (!category || !city || isNaN(price) || isNaN(lat) || isNaN(lng)) {
      alert("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    try {
      const newProp = { category, city, price, lat, lng, type };
      const docRef = await addDoc(propertyCol, newProp);
      newProp.id = docRef.id;
      allProperties.push(newProp);
      alert("Prona u shtua!");
      renderPoints(allProperties);
      updateCategoryFilter(allProperties);
      document.getElementById("adminPanel").style.display = "none";
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë shtimit.");
    }
  };

  document.getElementById("logoutBtn").onclick = () => {
    document.getElementById("adminPanel").style.display = "none";
    alert("U larguat nga admin.");
  };
}

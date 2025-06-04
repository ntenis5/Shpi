import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const adminPanel = document.getElementById("adminPanel");
const filterPanel = document.getElementById("filterPanel");

document.getElementById("adminToggle").onclick = () => {
  const email = prompt("Shkruani email-in:");
  const password = prompt("Shkruani fjalëkalimin:");

  if (!email || !password) {
    alert("Email ose fjalëkalim i pavlefshëm.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      adminPanel.style.display = "block";
      filterPanel.style.display = "none";
    })
    .catch(error => {
      alert("Gabim në autentikim: " + error.message);
    });
};

document.getElementById("logoutBtn").onclick = () => {
  signOut(auth)
    .then(() => {
      adminPanel.style.display = "none";
      filterPanel.style.display = "block";
      alert("U shkyçët me sukses.");
    })
    .catch(err => {
      alert("Gabim gjatë shkyçjes.");
    });
};

document.getElementById("addPropertyBtn").onclick = async () => {
  const category = document.getElementById("new-category").value.trim();
  const city = document.getElementById("new-city").value.trim();
  const price = parseFloat(document.getElementById("new-price").value);
  const lat = parseFloat(document.getElementById("new-lat").value);
  const lng = parseFloat(document.getElementById("new-lng").value);
  const type = document.getElementById("new-type").value;

  if (!category || !city || isNaN(price) || isNaN(lat) || isNaN(lng)) {
    alert("Ju lutem plotësoni të gjitha fushat me të dhëna valide.");
    return;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    alert("Koordinatat janë jashtë kufijve të lejuar.");
    return;
  }

  try {
    const newProp = { category, city, price, lat, lng, type };
    await addDoc(collection(db, "properties"), newProp);
    alert("Prona u shtua me sukses!");
    adminPanel.style.display = "none";
    filterPanel.style.display = "block";
  } catch (err) {
    alert("Gabim gjatë shtimit të pronës.");
  }
};

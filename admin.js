import { auth, signInWithEmailAndPassword, signOut } from './firebase-config.js';
import { addDoc, collection } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const adminPanel = document.getElementById("adminPanel");
const filterPanel = document.getElementById("filterPanel");
const propertyCol = collection(db, "properties"); // duhet importuar edhe db nëse ndodhet jashtë

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
    const docRef = await addDoc(propertyCol, newProp);
    newProp.id = docRef.id;
    alert("Prona u shtua me sukses!");
    // nëse ke funksione globale si renderPoints, thirri këtu nëse janë të importuara
    adminPanel.style.display = "none";
  } catch (err) {
    alert("Gabim gjatë shtimit të pronës.");
  }
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase konfigurimi
const firebaseConfig = {
  apiKey: "AIzaSyAzeg2ha8agdS5zKFB34Udwj2CTMJamy0E",
  authDomain: "shpi-d4e2d.firebaseapp.com",
  projectId: "shpi-d4e2d",
  storageBucket: "shpi-d4e2d.appspot.com",
  messagingSenderId: "600471884377",
  appId: "1:600471884377:web:5512544dc9dfb1fa009748"
};

// Inicializimi
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const propertyCol = collection(db, "properties");

// Ngarko të gjitha pronat në tabelë
async function loadProperties() {
  const table = document.getElementById("property-table");
  const snapshot = await getDocs(propertyCol);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.category}</td>
      <td>${data.city}</td>
      <td>€${data.price}</td>
      <td>${data.lat}</td>
      <td>${data.lng}</td>
      <td>
        <button onclick="deleteProperty('${docSnap.id}')">🗑️ Fshi</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// Fshi një pronë
window.deleteProperty = async function (id) {
  if (confirm("A je i sigurt që do të fshish këtë pronë?")) {
    try {
      await deleteDoc(doc(db, "properties", id));
      alert("Prona u fshi me sukses.");
      location.reload();
    } catch (err) {
      console.error("Gabim gjatë fshirjes:", err);
      alert("❌ Fshirja dështoi.");
    }
  }
};

// Thirrja për të ngarkuar të dhënat kur skripti ekzekutohet
loadProperties();

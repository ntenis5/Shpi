// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAdKeG2FPS85pG8pZbNf_Fg7Yh-34bZruk",
  authDomain: "shpipron.firebaseapp.com",
  projectId: "shpipron",
  storageBucket: "shpipron.appspot.com",
  messagingSenderId: "42251121368",
  appId: "1:42251121368:web:f528291f5cdbfcb87bddad",
  measurementId: "G-XYR0NH53FC"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Shto pronë
document.getElementById("propertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const location = document.getElementById("location").value;
  const imageFile = document.getElementById("image").files[0];

  try {
    const imageRef = ref(storage, "properties/" + imageFile.name);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "properties"), {
      title,
      description,
      price: Number(price),
      location,
      imageUrl
    });

    alert("Prona u shtua me sukses!");
    document.getElementById("propertyForm").reset();
    loadProperties();
  } catch (err) {
    alert("Gabim: " + err.message);
  }
});

// Ngarko pronat nga Firebase
async function loadProperties() {
  const propertyList = document.getElementById("property-list");
  propertyList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "properties"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const item = document.createElement("div");
    item.className = "property-item";
    item.innerHTML = `
      <h3>${data.title}</h3>
      <img src="${data.imageUrl}" width="200" />
      <p>${data.description}</p>
      <p><strong>Çmimi:</strong> €${data.price}</p>
      <p><strong>Vendndodhja:</strong> ${data.location}</p>
    `;
    propertyList.appendChild(item);

    // Shto në hartë
    geocodeAddress(data.location, (coords) => {
      new google.maps.Marker({
        position: coords,
        map: map,
        title: data.title
      });
    });
  });
}

// Inicializo hartën
fetch('/prona.json')
  .then(res => res.json())
  .then(data => {
    const lista = document.getElementById("lista-pronave");
    data.forEach(prona => {
      const div = document.createElement("div");
      div.innerHTML = `<h3>${prona.titulli}</h3><p>${prona.pershkrimi}</p><strong>${prona.cmimi}</strong>`;
      lista.appendChild(div);
    });
  });
let map;
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.3275, lng: 19.8189 }, // Tirana
    zoom: 10
  });

  loadProperties();
};

// Geocode (tekst në koordinata)
function geocodeAddress(address, callback) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK" && results[0]) {
      callback(results[0].geometry.location);
    } else {
      console.warn("Geocode failed for: " + address);
    }
  });
}

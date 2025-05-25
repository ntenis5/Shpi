// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdKeG2FPS85pG8pZbNf_Fg7Yh-34bZruk",
  authDomain: "shpipron.firebaseapp.com",
  projectId: "shpipron",
  storageBucket: "shpipron.appspot.com",
  messagingSenderId: "42251121368",
  appId: "1:42251121368:web:f528291f5cdbfcb87bddad",
  measurementId: "G-XYR0NH53FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Shto pronë në Firebase
document.getElementById("propertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const location = document.getElementById("location").value;
  const imageFile = document.getElementById("image").files[0];

  try {
    // Ngarko imazhin në Firebase Storage
    const imageRef = ref(storage, "properties/" + imageFile.name);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Ruaj të dhënat në Firestore
    await addDoc(collection(db, "properties"), {
      title,
      description,
      price: Number(price),
      location,
      imageUrl
    });

    alert("Prona u shtua me sukses!");
    document.getElementById("propertyForm").reset();
    loadProperties(); // Rifresko pronat
  } catch (err) {
    alert("Gabim gjatë shtimit: " + err.message);
  }
});

// Ngarko dhe shfaq pronat nga Firebase
async function loadProperties() {
  const propertyList = document.getElementById("property-list");
  propertyList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "properties"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // Shto në listë
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

// Inicializo Google Maps
let map;
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.3275, lng: 19.8189 }, // Tirana
    zoom: 10
  });

  loadProperties(); // Ngarko pronat kur harta hapet
};

// Geokodo adresën në koordinata
function geocodeAddress(address, callback) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK" && results[0]) {
      callback(results[0].geometry.location);
    } else {
      console.warn("Geocode nuk funksionoi për: " + address);
    }
  });
}

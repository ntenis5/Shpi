// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWg5xS5BX6hHeRdgi7YnNgVu8iQLXhGdU",
  authDomain: "shpi-df1ff.firebaseapp.com",
  projectId: "shpi-df1ff",
  storageBucket: "shpi-df1ff.appspot.com",
  messagingSenderId: "983229738097",
  appId: "1:983229738097:web:3822cf4e012755c9d6bfd0",
  measurementId: "G-BQNNBXMEES"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = "nteniskotsiou@gmail.com";

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("addPropertyForm").addEventListener("submit", addProperty);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Hyrje e suksesshme!");
    })
    .catch(error => {
      alert("Gabim: " + error.message);
    });
}

onAuthStateChanged(auth, user => {
  if (user?.email === adminEmail) {
    document.getElementById("adminPanel").style.display = "block";
    loadProperties();
  } else if (user) {
    document.body.innerHTML = "<h3>Nuk ke të drejtë të hysh si administrator.</h3>";
  }
});

function addProperty(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  addDoc(collection(db, "prona"), {
    title,
    location,
    description,
    createdAt: serverTimestamp()
  })
    .then(() => {
      alert("Prona u shtua me sukses!");
      document.getElementById("addPropertyForm").reset();
      loadProperties();
    })
    .catch(err => alert("Gabim gjatë shtimit: " + err.message));
}

function loadProperties() {
  const container = document.getElementById("propertyList");
  container.innerHTML = "";

  const q = query(collection(db, "prona"), orderBy("createdAt", "desc"));
  getDocs(q)
    .then(snapshot => {
      snapshot.forEach(docItem => {
        const data = docItem.data();
        const div = document.createElement("div");
        div.innerHTML = `
          <strong>${data.title}</strong> (${data.location})<br>
          <p>${data.description}</p>
          <button onclick="deleteProperty('${docItem.id}')">Fshi</button>
          <button onclick="editProperty('${docItem.id}', '${data.title}', '${data.location}', \`${data.description}\`)">Edito</button>
        `;
        container.appendChild(div);
      });
    });
}

window.deleteProperty = function(id) {
  if (confirm("A je i sigurt që do ta fshish këtë pronë?")) {
    deleteDoc(doc(db, "prona", id)).then(() => {
      alert("Prona u fshi.");
      loadProperties();
    });
  }
};

window.editProperty = function(id, title, location, description) {
  const newTitle = prompt("Titulli i ri", title);
  const newLocation = prompt("Vendndodhja e re", location);
  const newDescription = prompt("Përshkrimi i ri", description);
  if (newTitle && newLocation && newDescription) {
    updateDoc(doc(db, "prona", id), {
      title: newTitle,
      location: newLocation,
      description: newDescription
    }).then(() => {
      alert("Prona u përditësua.");
      loadProperties();
    });
  }
};

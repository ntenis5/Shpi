// Firebase konfigurimi
const firebaseConfig = {
  apiKey: "AIzaSyAWg5xS5BX6hHeRdgi7YnNgVu8iQLXhGdU",
  authDomain: "shpi-df1ff.firebaseapp.com",
  projectId: "shpi-df1ff",
  storageBucket: "shpi-df1ff.appspot.com",
  messagingSenderId: "983229738097",
  appId: "1:983229738097:web:3822cf4e012755c9d6bfd0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const adminEmail = "nteniskotsiou@gmail.com";
  const adminPassword = "28Qershor1997";

  if (email === adminEmail && password === adminPassword) {
    alert("Hyrje e suksesshme!");
    document.getElementById("adminPanel").style.display = "block";
    loadProperties();
  } else {
    alert("Email ose fjalëkalim i pasaktë.");
  }
}

function loadProperties() {
  const container = document.getElementById("propertyList");
  container.innerHTML = "";

  db.collection("prona").orderBy("createdAt", "desc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.innerHTML = `
          <hr>
          <strong>${data.title}</strong> (${data.location})<br>
          <p>${data.description}</p>
          <button onclick="deleteProperty('${doc.id}')">Fshi</button>
          <button onclick="editProperty('${doc.id}', '${data.title}', '${data.location}', \`${data.description}\`)">Edito</button>
        `;
        container.appendChild(div);
      });
    });
}

document.getElementById("addPropertyForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  db.collection("prona").add({
    title,
    location,
    description,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Prona u shtua me sukses!");
    document.getElementById("addPropertyForm").reset();
    loadProperties();
  })
  .catch(err => alert("Gabim gjatë shtimit: " + err.message));
});

function deleteProperty(id) {
  if (confirm("A je i sigurt që do ta fshish këtë pronë?")) {
    db.collection("prona").doc(id).delete().then(() => {
      alert("Prona u fshi.");
      loadProperties();
    });
  }
}

function editProperty(id, title, location, description) {
  const newTitle = prompt("Titulli i ri", title);
  const newLocation = prompt("Vendndodhja e re", location);
  const newDescription = prompt("Përshkrimi i ri", description);

  if (newTitle && newLocation && newDescription) {
    db.collection("prona").doc(id).update({
      title: newTitle,
      location: newLocation,
      description: newDescription
    }).then(() => {
      alert("Prona u përditësua.");
      loadProperties();
    });
  }
}

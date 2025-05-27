const firebaseConfig = {
  apiKey: "AIzaSyAWg5xS5BX6hHeRdgi7YnNgVu8iQLXhGdU",
  authDomain: "shpi-df1ff.firebaseapp.com",
  databaseURL: "https://shpi-df1ff-default-rtdb.firebaseio.com",
  projectId: "shpi-df1ff",
  storageBucket: "shpi-df1ff.appspot.com",
  messagingSenderId: "983229738097",
  appId: "1:983229738097:web:3822cf4e012755c9d6bfd0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function loadProperties() {
  const list = document.getElementById("property-list");
  list.innerHTML = "";

  db.ref("properties").once("value", (snapshot) => {
    snapshot.forEach((child) => {
      const p = child.val();
      const item = document.createElement("div");
      item.className = "property-item";
      item.innerHTML = `
        <img src="${p.image}" alt="Prona" />
        <h3>${p.title}</h3>
        <p><strong>Çmimi:</strong> €${p.price}</p>
        <p><strong>Dhoma:</strong> ${p.rooms}</p>
        <p>${p.description}</p>
      `;
      list.appendChild(item);
    });
  });
}

document.getElementById("propertyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputs = e.target.elements;
  const newProperty = {
    title: inputs[0].value,
    type: inputs[1].value,
    price: parseInt(inputs[2].value),
    rooms: parseInt(inputs[3].value),
    image: inputs[4].value,
    description: inputs[5].value,
  };

  db.ref("properties").push(newProperty).then(() => {
    alert("Prona u shtua me sukses!");
    e.target.reset();
    loadProperties();
  });
});

document.getElementById("applyFilters").addEventListener("click", function () {
  const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
  const rooms = parseInt(document.getElementById("rooms").value) || 0;

  db.ref("properties").once("value", (snapshot) => {
    const list = document.getElementById("property-list");
    list.innerHTML = "";

    snapshot.forEach((child) => {
      const p = child.val();
      if (p.price <= maxPrice && p.rooms >= rooms) {
        const item = document.createElement("div");
        item.className = "property-item";
        item.innerHTML = `
          <img src="${p.image}" alt="Prona" />
          <h3>${p.title}</h3>
          <p><strong>Çmimi:</strong> €${p.price}</p>
          <p><strong>Dhoma:</strong> ${p.rooms}</p>
          <p>${p.description}</p>
        `;
        list.appendChild(item);
      }
    });
  });
});

loadProperties();

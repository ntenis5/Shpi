// Open map on globe click
function openMap() {
  const mapDiv = document.getElementById('map');
  mapDiv.style.display = 'block';

  if (!window.myMap) {
    window.myMap = L.map('map').setView([41.3275, 19.8189], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(window.myMap);

    // Example property
    const property = {
      title: "Modern Apartment in Tirana",
      lat: 41.3275,
      lng: 19.8189,
      price: "€120,000",
      phone: "+355 69 123 4567"
    };

    const popupContent = `
      <b>${property.title}</b><br>
      Price: ${property.price}<br>
      <button style="background-color:green; color:white; padding:5px 10px; border:none; border-radius:5px;">
        Call: ${property.phone}
      </button>
    `;

    L.marker([property.lat, property.lng])
      .addTo(window.myMap)
      .bindPopup(popupContent);
  }
}

// Handle category click
document.querySelectorAll('.category').forEach(cat => {
  cat.addEventListener('click', () => {
    const name = cat.textContent.trim();
    console.log(`Category selected: ${name}`);
    // Future: filter properties by category
  });
});
// Property data
const properties = [
  {
    title: "Modern Apartment in Tirana",
    lat: 41.3275,
    lng: 19.8189,
    price: "€120,000",
    area: "95m²",
    floor: "3rd",
    rooms: 3,
    baths: 2,
    address: "Rruga Myslym Shyri, Tirana",
    country: "Albania",
    city: "Tirana",
    phone: "+355 69 123 4567",
    images: [
      "https://via.placeholder.com/300x200?text=Photo+1",
      "https://via.placeholder.com/300x200?text=Photo+2",
      "https://via.placeholder.com/300x200?text=Photo+3"
    ]
  },
  {
    title: "Luxury Villa in Durrës",
    lat: 41.312,
    lng: 19.445,
    price: "€450,000",
    area: "300m²",
    floor: "2 floors",
    rooms: 5,
    baths: 4,
    address: "Lalëz Bay, Durrës",
    country: "Albania",
    city: "Durrës",
    phone: "+355 68 987 6543",
    images: [
      "https://via.placeholder.com/300x200?text=Villa+1",
      "https://via.placeholder.com/300x200?text=Villa+2",
      "https://via.placeholder.com/300x200?text=Villa+3"
    ]
  },
  {
    title: "Private House in Vlorë",
    lat: 40.466,
    lng: 19.489,
    price: "€250,000",
    area: "180m²",
    floor: "1st",
    rooms: 4,
    baths: 2,
    address: "Uji i Ftohtë, Vlorë",
    country: "Albania",
    city: "Vlorë",
    phone: "+355 67 111 2233",
    images: [
      "https://via.placeholder.com/300x200?text=House+1",
      "https://via.placeholder.com/300x200?text=House+2"
    ]
  }
];

// Open and populate map
function openMap() {
  const mapDiv = document.getElementById('map');
  mapDiv.style.display = 'block';

  if (!window.myMap) {
    window.myMap = L.map('map').setView([41.3275, 19.8189], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(window.myMap);

    // Loop through properties and add markers
    properties.forEach((property, index) => {
      const popupContent = `
        <div style="max-width: 300px;">
          <div class="slider">
            ${property.images.map(src => `<img src="${src}" style="width:100%; margin-bottom:5px;" />`).join("")}
          </div>
          <b>${property.title}</b><br>
          ${property.address}, ${property.city}, ${property.country}<br>
          Price: ${property.price}<br>
          Area: ${property.area} | Floor: ${property.floor}<br>
          Rooms: ${property.rooms} | Baths: ${property.baths}<br><br>
          <button style="background-color:green; color:white; padding:8px 12px; border:none; border-radius:5px;">
            Call: ${property.phone}
          </button>
        </div>
      `;

      L.marker([property.lat, property.lng])
        .addTo(window.myMap)
        .bindPopup(popupContent);
    });
  }
}

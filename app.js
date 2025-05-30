let map;
let markers = [];

function initMap() {
  const defaultLocation = { lat: 42.6629, lng: 21.1655 }; // Prishtina

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: defaultLocation,
  });
}

document.getElementById("property-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const emri = document.getElementById("emri").value;
  const telefoni = document.getElementById("telefoni").value;
  const lloji = document.getElementById("lloji").value;
  const pershkrimi = document.getElementById("pershkrimi").value;
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);

  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: `${lloji} - ${emri}`,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <strong>${lloji}</strong><br/>
      <em>${emri} - ${telefoni}</em><br/>
      <p>${pershkrimi}</p>
    `,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  markers.push(marker);
  map.setCenter({ lat, lng });

  this.reset();
});

// Inicioni globin pa rrotullim automatik
import createGlobe from 'https://unpkg.com/globe.gl';

const world = Globe()
  (document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .backgroundColor('#000')
  .pointOfView({ lat: 0, lng: 0, altitude: 2 }, 0);

// Mos e rrotullo automatikisht
world.controls().autoRotate = false;

const properties = []; // Lista e pronave

function applyFilters() {
  const category = document.getElementById('filter-category').value;
  const city = document.getElementById('filter-city').value.toLowerCase();
  const maxPrice = parseFloat(document.getElementById('filter-price').value) || Infinity;
  const minPrice = parseFloat(document.getElementById('filter-min-price').value) || 0;
  const sort = document.getElementById('filter-sort').value;

  let filtered = properties.filter(p => {
    const matchesCategory = !category || p.category === category;
    const matchesCity = !city || p.city.toLowerCase().includes(city);
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchesCategory && matchesCity && matchesPrice;
  });

  if (sort === 'asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'desc') filtered.sort((a, b) => b.price - a.price);

  updateGlobe(filtered);
}

function updateGlobe(data) {
  world.pointsData(data)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(() => 'orange')
    .pointAltitude(() => 0.05)
    .pointLabel(d => `${d.category} - ${d.city} (${d.price} €)`);
}

function filterByCategory(category) {
  document.getElementById('filter-category').value = category;
  applyFilters();
}

window.applyFilters = applyFilters;
window.filterByCategory = filterByCategory;
window.updateGlobe = updateGlobe;
window.properties = properties;

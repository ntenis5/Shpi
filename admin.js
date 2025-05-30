document.getElementById('adminToggle').addEventListener('click', () => {
  const panel = document.getElementById('adminPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

function addProperty() {
  const category = document.getElementById('new-category').value;
  const city = document.getElementById('new-city').value;
  const price = parseFloat(document.getElementById('new-price').value);
  const lat = parseFloat(document.getElementById('new-lat').value);
  const lng = parseFloat(document.getElementById('new-lng').value);

  if (!category || !city || isNaN(price) || isNaN(lat) || isNaN(lng)) {
    alert("Ju lutem plotësoni të gjitha fushat siç duhet.");
    return;
  }

  const newProperty = { category, city, price, lat, lng };
  window.properties.push(newProperty);
  window.updateGlobe(window.properties);

  document.getElementById('new-category').value = '';
  document.getElementById('new-city').value = '';
  document.getElementById('new-price').value = '';
  document.getElementById('new-lat').value = '';
  document.getElementById('new-lng').value = '';
}

window.addProperty = addProperty;

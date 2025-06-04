// /js/filters.js
import { renderPoints } from './globe.js';

export function applyFilters(allProperties) {
  const fCategory = document.getElementById("filter-category").value.trim().toLowerCase();
  const fCity = document.getElementById("filter-city").value.trim().toLowerCase();
  const fMin = parseFloat(document.getElementById("filter-min-price").value);
  const fMax = parseFloat(document.getElementById("filter-price").value);
  const sort = document.getElementById("filter-sort").value;

  let filtered = allProperties.filter(p => {
    let matchCategory = !fCategory || p.category.toLowerCase().includes(fCategory);
    let matchCity = !fCity || p.city.toLowerCase().includes(fCity);
    let matchMin = isNaN(fMin) || p.price >= fMin;
    let matchMax = isNaN(fMax) || p.price <= fMax;
    return matchCategory && matchCity && matchMin && matchMax;
  });

  if (sort === "asc") filtered.sort((a,b) => a.price - b.price);
  else if (sort === "desc") filtered.sort((a,b) => b.price - a.price);

  renderPoints(filtered);
  return filtered;
}

export function updateCategoryFilter(data) {
  const categories = [...new Set(data.map(p => p.category))].sort();
  const select = document.getElementById("filter-category");
  select.innerHTML = '<option value="">Të gjitha kategoritë</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

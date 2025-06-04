// /js/globe.js
export let globe;
export function initGlobe(container) {
  globe = Globe()(container)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundColor('#000')
    .pointOfView({ lat: 20, lng: 0, altitude: 2 });
}
export function renderPoints(data) {
  globe.pointsData(data)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointAltitude(0.05)
    .pointColor(() => 'orange')
    .pointLabel(d => `
      <b>Kategori:</b> ${d.category}<br>
      <b>Qytet:</b> ${d.city}<br>
      <b>Çmimi:</b> €${d.price.toLocaleString('sq-AL')}
    `);
}

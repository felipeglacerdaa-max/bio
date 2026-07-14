const CONFIG = {
  location: {
    url: '',
    address: 'Rua Professor Clovis Salgado, 400 — Centro, Betim - MG',
    label: 'Rua Prof. Clovis Salgado, 400 — Betim',
  },
};

document.getElementById('year').textContent = new Date().getFullYear();

const locationLink = document.getElementById('locationLink');
const locationText = document.getElementById('locationText');

if (CONFIG.location.label) {
  locationText.textContent = CONFIG.location.label;
}

if (CONFIG.location.url) {
  locationLink.href = CONFIG.location.url;
} else if (CONFIG.location.address) {
  const query = encodeURIComponent(CONFIG.location.address);
  locationLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
} else {
  locationLink.addEventListener('click', (event) => {
    event.preventDefault();
  });
  locationLink.setAttribute('aria-disabled', 'true');
  locationLink.classList.add('link-btn--pending');
}

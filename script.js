const CONFIG = {
  location: {
    url: 'https://maps.app.goo.gl/wXfVYmRfDfh8Z7WD9',
    address: 'R. da Mata, 84 - Estaleiro, Contagem - MG',
    label: 'R. da Mata, 84 - Estaleiro, Contagem - MG',
  },
};

function sanitizeString(str) {
  if (typeof str !== 'string') {
    return '';
  }
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function isValidUrl(url, allowedHosts = ['wa.me', 'www.instagram.com', 'www.google.com', 'instagram.com', 'google.com']) {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:') {
      console.warn('URL não está em HTTPS:', url);
      return false;
    }
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const isAllowed = allowedHosts.some(host => hostname === host || hostname.endsWith(host));
    if (!isAllowed) {
      console.warn('Host não autorizado:', hostname);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('URL inválida:', url, error);
    return false;
  }
}

function initializeYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function initializeLocationLink() {
  const locationLink = document.getElementById('locationLink');
  const locationText = document.getElementById('locationText');

  if (!locationLink) {
    console.warn('Elemento locationLink não encontrado');
    return;
  }

  if (CONFIG.location.label) {
    locationText.textContent = sanitizeString(CONFIG.location.label);
  }

  if (CONFIG.location.url && isValidUrl(CONFIG.location.url)) {
    locationLink.href = CONFIG.location.url;
  } else if (CONFIG.location.address) {
    const query = encodeURIComponent(CONFIG.location.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    if (isValidUrl(mapsUrl)) {
      locationLink.href = mapsUrl;
    } else {
      locationLink.setAttribute('aria-disabled', 'true');
      locationLink.classList.add('link-btn--pending');
    }
  } else {
    locationLink.addEventListener('click', (event) => {
      event.preventDefault();
    });
    locationLink.setAttribute('aria-disabled', 'true');
    locationLink.classList.add('link-btn--pending');
  }
  locationLink.setAttribute('rel', 'noopener noreferrer');
  locationLink.setAttribute('target', '_blank');
}

function initializeSecurityMeasures() {
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a');
    if (target && !isValidUrl(target.href)) {
      e.preventDefault();
      console.warn('Tentativa de navegação para URL não autorizada bloqueada');
    }
  }, true);
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.tagName === 'SCRIPT' && node.src) {
                console.warn('Script injected detectado, bloqueado:', node.src);
                node.remove();
              }
            }
          });
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

function initializeApp() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecureApp);
  } else {
    initializeSecureApp();
  }
}

function initializeSecureApp() {
  initializeYear();
  initializeLocationLink();
  initializeSecurityMeasures();
  console.info('Aplicação inicializada com segurança ativada');
}

initializeApp();

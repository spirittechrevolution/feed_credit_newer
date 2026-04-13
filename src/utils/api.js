// Utilitaire pour requêtes API backend
export const BASE_URL = 'http://192.168.1.18:3000/api/'; // ← Mets ici l'IP locale de ton PC


// GET /users/me — profil utilisateur connecté
export async function getUserProfile(token) {
  const res = await fetch(BASE_URL + 'users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    let msg = 'Erreur réseau';
    try {
      const err = await res.json();
      msg = err.error || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// PUT /users/me — mise à jour du profil
export async function updateUserProfile(token, data) {
  const res = await fetch(BASE_URL + 'users/me', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = 'Erreur réseau';
    try {
      const err = await res.json();
      msg = err.error || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// GET /offers?mode=...&status=...
export async function getOffers({ mode, status } = {}) {
  let url = BASE_URL + 'offers';
  const params = [];
  if (mode) params.push(`mode=${encodeURIComponent(mode)}`);
  if (status) params.push(`status=${encodeURIComponent(status)}`);
  if (params.length) url += '?' + params.join('&');
  const res = await fetch(url);
  if (!res.ok) {
    let msg = 'Erreur réseau';
    try {
      const err = await res.json();
      msg = err.error || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function post(path, data) {
  const res = await fetch(BASE_URL + path, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = 'Erreur réseau';
    try {
      const err = await res.json();
      msg = err.error || err.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

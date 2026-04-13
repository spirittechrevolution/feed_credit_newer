// POST /auth/refresh — renouveler l'access_token avec un refresh_token
export async function refreshAccessToken(refresh_token) {
  const res = await fetch(BASE_URL + 'auth/refresh', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ refresh_token }),
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

// POST /auth/forgot-password — demander un code OTP de réinitialisation par SMS
export async function forgotPassword(phone) {
  let phoneToSend = phone.trim();
  if (!phoneToSend.startsWith('+221')) {
    phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
  }
  const res = await fetch(BASE_URL + 'auth/forgot-password', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ phone: phoneToSend }),
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

// POST /auth/reset-password — réinitialiser le mot de passe avec OTP
export async function resetPassword(phone, otp, new_password) {
  let phoneToSend = phone.trim();
  if (!phoneToSend.startsWith('+221')) {
    phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
  }
  const res = await fetch(BASE_URL + 'auth/reset-password', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ phone: phoneToSend, otp, new_password }),
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

// POST /auth/change-password — changer son mot de passe (utilisateur connecté)
export async function changePassword(current_password, new_password, token) {
  const res = await fetch(BASE_URL + 'auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ current_password, new_password }),
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

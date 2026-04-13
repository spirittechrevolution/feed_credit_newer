// Données mockées pour la démonstration FeedCredit

// ─── Catégories de produits ────────────────────────────────────────────────
export const categories = [
  {id: 'all',      label: 'Toutes',  emoji: '🛒'},
  {id: 'Viande',   label: 'Viande',  emoji: '🥩'},
  {id: 'Poisson',  label: 'Poisson', emoji: '🐟'},
  {id: 'Volaille', label: 'Volaille',emoji: '🍗'},
  {id: 'Mouton',   label: 'Mouton',  emoji: '🐑'},
];

// ─── Bannière promotionnelle (HomeScreen) ──────────────────────────────────
export const banner = {
  id: 1,
  emoji: '🎉',
  title: '-20% sur le boeuf !',
  subtitle: 'Livraison gratuite ce weekend',
  color: null, // null = couleur primaire
};

// ─── Méthodes de paiement (PaymentScreen) ─────────────────────────────────
export const paymentMethods = [
  {id: 'wave',   label: 'Wave',           emoji: '💙', recommended: true},
  {id: 'orange', label: 'Orange Money',   emoji: '🟠', recommended: false},
  {id: 'free',   label: 'Free Money',     emoji: '🟣', recommended: false},
  {id: 'manuel', label: 'Paiement manuel',emoji: '💵',  recommended: false},
];

// ─── Menu profil (ProfileScreen) ─────────────────────────────────────────
export const profileMenuItems = [
  {id: 'settings',  icon: '⚙️',  label: 'Paramètres',          screen: null},
  {id: 'score',     icon: '📊', label: 'Score de confiance',   screen: 'MyCredit'},
  {id: 'history',   icon: '🏆', label: 'Historique',           screen: 'Subscriptions'},
  {id: 'payments',  icon: '💳', label: 'Mes paiements',        screen: 'Subscriptions'},
  {id: 'addresses', icon: '📍', label: 'Mes adresses',         screen: null},
  {id: 'help',      icon: '❓', label: 'Aide & Support',       screen: null},
];

// ─── Caractéristiques d'une offre (OfferDetailScreen) ───────────────────
export const offerFeatures = [
  {id: 'delivery', icon: '📦', label: 'Livraison sous 24h'},
  {id: 'quality',  icon: '✅', label: 'Qualité garantie'},
  {id: 'halal',    icon: '🕌', label: 'Abattage halal'},
  {id: 'local',    icon: '🌍', label: 'Producteurs locaux'},
];

// ─── Filtres abonnements (SubscriptionsScreen) ────────────────────────────
export const subscriptionFilters = [
  {id: 'en_cours', label: 'En cours'},
  {id: 'terminee', label: 'Terminées'},
  {id: 'annulee',  label: 'Annulées'},
];

// ─── Statuts abonnements ──────────────────────────────────────────────────
export const subscriptionStatusConfig = {
  en_cours: {label: 'En cours', color: '#1565C0', bg: '#E3F2FD'},
  terminee: {label: 'Terminée', color: '#2E7D32', bg: '#E8F5E9'},
  annulee:  {label: 'Annulée',  color: '#C62828', bg: '#FFEBEE'},
};

export const offers = [
  {
    id: 1,
    title: 'Boeuf 10kg',
    priceCash: 50000,
    priceCredit: 55000,
    available: 8,
    max: 10,
    mode: 'Fin du mois',
    emoji: '🥩',
    description:
      'Boeuf frais de qualité supérieure, idéal pour les repas familiaux. Viande locale sélectionnée avec soin. Livraison sous 24h.',
    deposit: 0,  // acompte requis (0% pour les bons clients)
    category: 'Viande',
  },
  {
    id: 2,
    title: 'Poisson 20kg',
    priceCash: 80000,
    priceCredit: 88000,
    available: 5,
    max: 15,
    mode: '4 semaines',
    emoji: '🐟',
    description:
      'Thiof et capitaine frais pêchés localement. Idéal pour thiéboudienne et autres plats traditionnels. Conditionnement sous vide.',
    deposit: 5000,
    category: 'Poisson',
  },
  {
    id: 3,
    title: 'Mouton 25kg',
    priceCash: 125000,
    priceCredit: 137500,
    available: 3,
    max: 8,
    mode: 'Fin du mois',
    emoji: '🐑',
    description:
      'Mouton sain et bien nourri. Parfait pour les grandes occasions et fêtes familiales. Abattage halal certifié.',
    deposit: 10000,
    category: 'Mouton',
  },
  {
    id: 4,
    title: 'Poulet 15kg',
    priceCash: 35000,
    priceCredit: 38500,
    available: 10,
    max: 20,
    mode: '2 semaines',
    emoji: '🍗',
    description:
      'Poulets fermiers élevés naturellement. Chair tendre et savoureuse. Conditionnement hygiénique garanti.',
    deposit: 0,
    category: 'Volaille',
  },
];

export const subscriptions = [
  {
    id: 1,
    offerId: 1,
    offerTitle: 'Boeuf 10kg',
    offerEmoji: '🥩',
    date: '01/11/2025',
    amount: 55000,
    paid: 0,
    nextDue: '30/11/2025',
    status: 'en_cours',
    mode: 'Fin du mois',
  },
  {
    id: 2,
    offerId: 2,
    offerTitle: 'Poisson 20kg',
    offerEmoji: '🐟',
    date: '10/10/2025',
    amount: 88000,
    paid: 88000,
    nextDue: null,
    status: 'terminee',
    mode: '4 semaines',
  },
  {
    id: 3,
    offerId: 3,
    offerTitle: 'Mouton 25kg',
    offerEmoji: '🐑',
    date: '15/09/2025',
    amount: 137500,
    paid: 0,
    nextDue: null,
    status: 'annulee',
    mode: 'Fin du mois',
  },
];

export const notifications = [
  {
    id: 1,
    type: 'offer',
    title: 'Nouvelle offre',
    message: 'Boeuf 10kg disponible — rejoignez le groupe !',
    time: '5min',
    unread: true,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Rappel paiement',
    message: 'Votre échéance est dans 3 jours (30/11/2025)',
    time: '2h',
    unread: true,
  },
  {
    id: 3,
    type: 'payment',
    title: 'Paiement reçu',
    message: '40 000 CFA confirmé pour Poisson 20kg',
    time: 'hier',
    unread: false,
  },
  {
    id: 4,
    type: 'offer',
    title: 'Places limitées',
    message: 'Mouton 25kg — plus que 3 places disponibles !',
    time: '3h',
    unread: false,
  },
];

export const user = {
  name: 'Jean Diop',
  phone: '+221 78 123 45 67',
  email: 'jean@email.com',
  trustScore: 85,
  trustLevel: 'Bon client',
  ordersCount: 12,
  repaymentRate: 95,
  lateCount: 5,
  memberSince: 'Janvier 2024',
  depositRate: '0%',
  creditLimit: 500000,
  totalOwed: 165000,
};

export const creditHistory = [
  {id: 1, label: 'Boeuf 10kg', amount: 55000, paid: 0, dueDate: '30/11/2025', status: 'en_cours'},
  {id: 2, label: 'Poisson 20kg', amount: 88000, paid: 88000, dueDate: '07/11/2025', status: 'paye'},
  {id: 3, label: 'Volaille 5kg', amount: 22000, paid: 22000, dueDate: '15/10/2025', status: 'paye'},
];

export const paymentHistory = [
  {id: 1, date: '07/11/2025', amount: 88000, method: 'Wave', status: 'confirme'},
  {id: 2, date: '15/10/2025', amount: 22000, method: 'Orange Money', status: 'confirme'},
  {id: 3, date: '30/09/2025', amount: 40000, method: 'Wave', status: 'confirme'},
];

// ─── Adresses utilisateur (ProfileScreen) ────────────────────────────────
export const userAddresses = [
  {id: 1, label: 'Domicile',  address: '12 Rue Blaise Diagne, Médina, Dakar', default: true},
  {id: 2, label: 'Bureau',    address: '45 Avenue Cheikh Anta Diop, Fann, Dakar', default: false},
  {id: 3, label: 'Famille',   address: '8 Allée des Baobabs, Thiès', default: false},
];

// ─── FAQ / Aide & Support ─────────────────────────────────────────────────
export const faqItems = [
  {id: 1, q: 'Comment fonctionne le crédit ?',      a: 'Vous commandez maintenant et payez fin du mois ou en plusieurs semaines selon la modalité choisie.'},
  {id: 2, q: 'Comment payer une échéance ?',         a: 'Allez dans "Mes commandes", sélectionnez la commande et appuyez sur "Payer".'},
  {id: 3, q: 'Que se passe-t-il en cas de retard ?', a: 'Un retard impacte votre score de confiance. Contactez-nous au +221 33 000 00 00.'},
  {id: 4, q: 'Comment améliorer mon score ?',        a: 'Payez à temps et régulièrement. Chaque paiement ponctuel augmente votre score.'},
];

// ─── Paramètres utilisateur ───────────────────────────────────────────────
export const settingsOptions = [
  {id: 'notif_push', label: 'Notifications push',     type: 'toggle', value: true},
  {id: 'notif_sms',  label: 'Rappels SMS',             type: 'toggle', value: true},
  {id: 'biometric',  label: 'Connexion biométrique',   type: 'toggle', value: false},
  {id: 'language',   label: 'Langue',                  type: 'value',  value: 'Français'},
  {id: 'currency',   label: 'Devise',                  type: 'value',  value: 'CFA (XOF)'},
];

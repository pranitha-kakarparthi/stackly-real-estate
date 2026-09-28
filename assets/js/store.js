/* ==========================================================================
   STACKLY REAL ESTATE - DATA STORAGE LAYER (localStorage)
   Strictly No Demo Accounts Seeded (User Registers Own Account)
   ========================================================================== */

const STORAGE_KEYS = {
  USERS: "stackly_users",
  CURRENT_USER: "stackly_current_user",
  PROPERTIES: "stackly_properties",
  INQUIRIES: "stackly_inquiries",
  FAVORITES: "stackly_favorites",
  NOTIFICATIONS: "stackly_notifications",
};

// Default Real Estate Properties Database
const DEFAULT_PROPERTIES = [
  {
    id: "prop-1",
    title: "The Grand Beverly Villa",
    type: "Villa",
    status: "sale",
    price: 18500000,
    priceDisplay: "₹1.85 Cr",
    beds: 5,
    baths: 4,
    sqft: 4850,
    garage: 3,
    address: "Green Valley Enclave, Hasthampatti",
    city: "Salem",
    image: "assets/images/properties/property-1.webp",
    featured: true,
    agent: {
      name: "Karthik Raja",
      role: "Principal Broker",
      phone: "+91 9876543210",
      avatar: "assets/images/agents/agent-1.webp",
    },
    amenities: [
      "Private Infinity Pool",
      "Solar Powered",
      "Smart Home Automation",
      "Home Theater",
      "24/7 Security",
    ],
    description:
      "An architectural masterpiece offering expansive double-height living spaces, European marble finishes, and landscaped private lawns in Salem's prime residential enclave.",
  },
  {
    id: "prop-2",
    title: "Serene Meadow Modern Residence",
    type: "House",
    status: "sale",
    price: 12500000,
    priceDisplay: "₹1.25 Cr",
    beds: 4,
    baths: 3,
    sqft: 3200,
    garage: 2,
    address: "Fairlands Main Road",
    city: "Salem",
    image: "assets/images/properties/property-2.webp",
    featured: true,
    agent: {
      name: "Ananya Sharma",
      role: "Luxury Property Consultant",
      phone: "+91 9876543211",
      avatar: "assets/images/agents/agent-2.webp",
    },
    amenities: [
      "Modular Italian Kitchen",
      "Landscaped Garden",
      "EV Charging Point",
      "Rainwater Harvesting",
    ],
    description:
      "Contemporary family sanctuary combining Scandinavian minimalist architecture with lush tropical landscaping and state-of-the-art energy efficiency.",
  },
  {
    id: "prop-3",
    title: "Skyline Azure Penthouse",
    type: "Apartment",
    status: "rent",
    price: 85000,
    priceDisplay: "₹85,000 / mo",
    beds: 3,
    baths: 3,
    sqft: 2650,
    garage: 2,
    address: "Mount Road Prestige Towers",
    city: "Chennai",
    image: "assets/images/properties/property-3.webp",
    featured: true,
    agent: {
      name: "Karthik Raja",
      role: "Principal Broker",
      phone: "+91 9876543210",
      avatar: "assets/images/agents/agent-1.webp",
    },
    amenities: [
      "Panoramic City View",
      "Rooftop Lounge",
      "Clubhouse Access",
      "Valet Parking",
      "Concierge",
    ],
    description:
      "Breathtaking 18th-floor penthouse featuring wraparound panoramic balconies, designer lighting, and access to world-class clubhouse amenities.",
  },
  {
    id: "prop-4",
    title: "The Metro Executive Suites",
    type: "Apartment",
    status: "sale",
    price: 9200000,
    priceDisplay: "₹92 Lakhs",
    beds: 3,
    baths: 2,
    sqft: 1850,
    garage: 1,
    address: "Indiranagar 100ft Road",
    city: "Bangalore",
    image: "assets/images/properties/property-4.webp",
    featured: false,
    agent: {
      name: "Ananya Sharma",
      role: "Luxury Property Consultant",
      phone: "+91 9876543211",
      avatar: "assets/images/agents/agent-2.webp",
    },
    amenities: [
      "Gymnasium",
      "Heated Indoor Pool",
      "High-Speed Elevators",
      "CCTV Surveillance",
    ],
    description:
      "Sleek metropolitan apartment moments away from top tech parks, curated dining, and high-street shopping in Indiranagar.",
  },
  {
    id: "prop-5",
    title: "Lakeview Palms Waterfront Estate",
    type: "Villa",
    status: "sale",
    price: 34000000,
    priceDisplay: "₹3.40 Cr",
    beds: 6,
    baths: 6,
    sqft: 6200,
    garage: 4,
    address: "Mookaneri Lake Promenade",
    city: "Salem",
    image: "assets/images/properties/property-5.webp",
    featured: true,
    agent: {
      name: "Vikram Menon",
      role: "Managing Director",
      phone: "+91 9876543212",
      avatar: "assets/images/agents/agent-5.webp",
    },
    amenities: [
      "Lake View Deck",
      "Private Jetty",
      "Wine Cellar",
      "Servant Quarters",
      "Gated Perimeter",
    ],
    description:
      "An ultra-exclusive private waterfront residence boasting unobstructed water vistas, expansive stone terraces, and bespoke teakwood craftsmanship.",
  },
  {
    id: "prop-6",
    title: "Modernist Glass Pavilion Penthouse",
    type: "Apartment",
    status: "rent",
    price: 120000,
    priceDisplay: "₹1.20 Lakh / mo",
    beds: 4,
    baths: 4,
    sqft: 3400,
    garage: 2,
    address: "Race Course Road",
    city: "Coimbatore",
    image: "assets/images/properties/property-6.webp",
    featured: false,
    agent: {
      name: "Vikram Menon",
      role: "Managing Director",
      phone: "+91 9876543212",
      avatar: "assets/images/agents/agent-5.webp",
    },
    amenities: [
      "Floor-to-Ceiling Glass",
      "Duplex Living",
      "Private Elevator Access",
      "Designer Walk-in Closets",
    ],
    description:
      "Ultra-chic duplex penthouse bathed in natural illumination with seamless open-plan entertaining areas and bespoke designer fixtures.",
  },
  {
    id: "prop-7",
    title: "Stackly Cyber Tower Commercial Hub",
    type: "Commercial",
    status: "rent",
    price: 350000,
    priceDisplay: "₹3.50 Lakh / mo",
    beds: 0,
    baths: 8,
    sqft: 12500,
    garage: 15,
    address: "Junction Main Road, Opp New Bus Stand",
    city: "Salem",
    image: "assets/images/properties/property-7.webp",
    featured: true,
    agent: {
      name: "Pooja Iyer",
      role: "Senior Commercial Broker",
      phone: "+91 9876543213",
      avatar: "assets/images/agents/agent-6.webp",
    },
    amenities: [
      "Grade A LEED Certified",
      "100% DG Power Backup",
      "Fiber Optic Backbone",
      "Central HVAC",
      "Cafeteria",
    ],
    description:
      "Premier commercial headquarters ready for IT/ITES, corporate banking, or medical enterprise with flexible floor plates and ample covered parking.",
  },
  {
    id: "prop-8",
    title: "The Orchard Suburban Bungalow",
    type: "House",
    status: "sale",
    price: 8800000,
    priceDisplay: "₹88 Lakhs",
    beds: 3,
    baths: 3,
    sqft: 2400,
    garage: 2,
    address: "Chinna Thirupathi Residential Zone",
    city: "Salem",
    image: "assets/images/properties/property-8.webp",
    featured: false,
    agent: {
      name: "Pooja Iyer",
      role: "Senior Commercial Broker",
      phone: "+91 9876543213",
      avatar: "assets/images/agents/agent-6.webp",
    },
    amenities: [
      "Private Fruit Orchard",
      "Vaastu Compliant",
      "Solar Water Heating",
      "Broadband Ready",
    ],
    description:
      "Charming modern bungalow situated just minutes from MMR Complex, surrounded by peaceful greenery and reputed educational institutions.",
  },
];

// Initialize Storage
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Zero demo users: empty array
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    localStorage.setItem(
      STORAGE_KEYS.PROPERTIES,
      JSON.stringify(DEFAULT_PROPERTIES)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(["prop-1", "prop-3"])
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify([
        {
          id: "notif-1",
          title: "Welcome to Stackly",
          text: "Explore our latest verified residential listings.",
          time: "Just now",
        },
        {
          id: "notif-2",
          title: "New Property Alert",
          text: "Grand Beverly Villa price updated.",
          time: "2 hours ago",
        },
      ])
    );
  }
}

// User CRUD
function getUsers() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  } catch (e) {
    return [];
  }
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Session Management
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Property CRUD
function getProperties() {
  initStorage();
  try {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES)) ||
      DEFAULT_PROPERTIES
    );
  } catch (e) {
    return DEFAULT_PROPERTIES;
  }
}

function saveProperty(property) {
  const properties = getProperties();
  properties.unshift(property);
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
}

// Favorites
function getFavorites() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
  } catch (e) {
    return [];
  }
}

function toggleFavorite(propId) {
  let favs = getFavorites();
  if (favs.includes(propId)) {
    favs = favs.filter((id) => id !== propId);
  } else {
    favs.push(propId);
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  return favs.includes(propId);
}

// Inquiries / Forms
function saveInquiry(inquiry) {
  initStorage();
  const inquiries = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.INQUIRIES) || "[]"
  );
  inquiries.unshift({
    id: "inq-" + Date.now(),
    date: new Date().toLocaleString(),
    ...inquiry,
  });
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
}

function getInquiries() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES)) || [];
  } catch (e) {
    return [];
  }
}

// Notifications
function getNotifications() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
  } catch (e) {
    return [];
  }
}

// Auto init
initStorage();

// Export globals
window.StacklyStore = {
  getUsers,
  saveUser,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getProperties,
  saveProperty,
  getFavorites,
  toggleFavorite,
  saveInquiry,
  getInquiries,
  getNotifications,
};

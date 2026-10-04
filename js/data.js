/**
 * Luiscart - Premium Audio & Headphone Catalog
 * Curated High-Fidelity Headphones, Earbuds & Acoustic Gear
 */

const LUISCART_PRODUCTS = [
  {
    id: "luis-01",
    name: "Wireless Earbuds, IPX8",
    category: "Earbuds & TWS",
    price: 2499,
    originalPrice: 4999,
    subtitle: "Organic Cotton, fairtrade certified case & active ANC",
    description: "Engineered for pure audiophile fidelity with custom 11mm graphene drivers, active acoustic noise cancellation, and an IPX8 waterproof rating. Encased in an eco-certified bespoke charging case with smart LED power display.",
    rating: 5.0,
    reviewsCount: 121,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Midnight Black",
    colors: ["#111111", "#2563eb", "#0d3a35"],
    material: "Titanium & Bio-Ceramic",
    offer: "50% Off",
    featured: true,
    inStock: true,
    specs: {
      "Battery Life": "36 Hours with Charging Case",
      "Water Resistance": "IPX8 Submersible",
      "Connectivity": "Bluetooth 5.3 Low Latency",
      "Driver Size": "11mm Custom Graphene",
      "Warranty": "2-Year Luiscart Bespoke Guarantee"
    }
  },
  {
    id: "luis-02",
    name: "AirPods Max Luxe Edition",
    category: "Over-Ear",
    price: 49900,
    originalPrice: 59900,
    subtitle: "A perfect balance of high-fidelity audio & gold accents",
    description: "An uncompromising synergy of luxurious acoustic engineering and haute design. Features custom knit-mesh canopy headband, brushed anodized aluminum earcups, and precision computational audio for spatial cinema immersion.",
    rating: 4.9,
    reviewsCount: 184,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Blush Champagne",
    colors: ["#e0a996", "#silver", "#1f2937"],
    material: "Anodized Aluminum & Memory Foam",
    offer: "Best Seller",
    featured: true,
    inStock: true,
    specs: {
      "Battery Life": "20 Hours with ANC active",
      "Audio Technology": "Apple H1 / Spatial Audio",
      "Cushions": "Acoustically engineered memory foam",
      "Weight": "384.8 grams",
      "Warranty": "2-Year International VIP Warranty"
    }
  },
  {
    id: "luis-03",
    name: "Bose BT Acoustic Earphones",
    category: "Noise Cancelling",
    price: 24900,
    originalPrice: 29900,
    subtitle: "Table with acoustic purifier, stained veneer/black",
    description: "World-class acoustic noise cancellation with custom ambient transparency modes. Lightweight ergonomic structure tailored for high-flying executives and discerning audiophiles.",
    rating: 4.8,
    reviewsCount: 96,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Obsidian Black",
    colors: ["#111111", "#d4af37"],
    material: "Polycarbonate & Soft Silicone",
    offer: "Best Seller",
    featured: true,
    inStock: true,
    specs: {
      "Battery Life": "24 Hours Continuous Playback",
      "Noise Cancellation": "11 Levels of Controllable ANC",
      "Microphone": "4-Mic Adaptive Beamforming Array",
      "Fast Charging": "15 min charge = 2.5 hours",
      "Warranty": "2-Year Full Replacement"
    }
  },
  {
    id: "luis-04",
    name: "VIVEFOX Crimson Studio",
    category: "Studio & Audiophile",
    price: 3499,
    originalPrice: 6999,
    subtitle: "Wired & wireless stereo headsets with studio mic",
    description: "Striking crimson profile crafted for studio mastering and dynamic soundstages. 50mm neodymium magnet drivers deliver rich resonant bass and crystal treble response.",
    rating: 4.7,
    reviewsCount: 75,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Crimson Red",
    colors: ["#b91c1c", "#111111", "#3b82f6"],
    material: "Reinforced Polymer & Breathable Mesh",
    offer: "New Arrival",
    featured: true,
    inStock: true,
    specs: {
      "Driver": "50mm Neodymium Stereo",
      "Impedance": "32 Ohms Studio Standard",
      "Frequency Response": "20Hz - 24,000Hz",
      "Connectivity": "Gold 3.5mm jack + Bluetooth 5.2",
      "Warranty": "1-Year Manufacturer Warranty"
    }
  },
  {
    id: "luis-05",
    name: "Sony WH-1000XM5 Onyx",
    category: "Noise Cancelling",
    price: 28990,
    originalPrice: 34990,
    subtitle: "Industry-leading dual processor noise cancelling",
    description: "Two processors control 8 microphones for unprecedented noise cancellation and exceptional call clarity. Ultra-comfortable lightweight soft fit leather designed for all-day listening.",
    rating: 4.9,
    reviewsCount: 242,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Midnight Black",
    colors: ["#1e1e1e", "#e2e8f0"],
    material: "Synthetic Soft Leather & Carbon Fiber",
    offer: "50% Off",
    featured: false,
    inStock: true,
    specs: {
      "Battery Life": "30 Hours Battery with Quick Charge",
      "Voice Pickup": "Precise Voice Pickup with AI DNN",
      "Codec": "LDAC High-Resolution Wireless Audio",
      "Touch Controls": "Intuitive swipe gesture surface",
      "Warranty": "2-Year Global Warranty"
    }
  },
  {
    id: "luis-06",
    name: "Luiscart CyberPods Pro",
    category: "Earbuds & TWS",
    price: 1999,
    originalPrice: 3999,
    subtitle: "Futuristic mech charging case with RGB power HUD",
    description: "Designed with aerospace zinc-alloy shell, rapid wireless charging, low-latency 35ms gaming mode, and immersive 3D surround soundstage.",
    rating: 4.8,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Gunmetal Slate",
    colors: ["#374151", "#059669"],
    material: "Zinc Alloy & Polycarbonate",
    offer: "50% Off",
    featured: false,
    inStock: true,
    specs: {
      "Latency": "35ms Ultra Low Latency",
      "Battery": "40 Hours total with Mech Bay",
      "Drivers": "Titanium Coated 12mm",
      "Water Resistance": "IPX7 Sweat & Rain Proof",
      "Warranty": "2-Year Luiscart VIP Warranty"
    }
  },
  {
    id: "luis-07",
    name: "Bone Conduction Aero Sport",
    category: "Sports & Open-Ear",
    price: 12999,
    originalPrice: 15999,
    subtitle: "Open-ear titanium frame for active athletes",
    description: "Delivers audio through your cheekbones while keeping your ears completely open to ambient surroundings for supreme safety and lightweight all-day comfort.",
    rating: 4.6,
    reviewsCount: 48,
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Matte Black",
    colors: ["#111111", "#0284c7"],
    material: "Wrap-around Titanium Alloy",
    offer: "New Arrival",
    featured: false,
    inStock: true,
    specs: {
      "Technology": "9th Gen Bone Conduction Shakers",
      "Weight": "Only 29 grams",
      "Battery": "10 Hours of Music & Calls",
      "Water Resistance": "IP67 Submersible & Dustproof",
      "Warranty": "2-Year Luiscart Active Coverage"
    }
  },
  {
    id: "luis-08",
    name: "Azure SoundPulse Studio",
    category: "Over-Ear",
    price: 2999,
    originalPrice: 4499,
    subtitle: "Youthful vibrant acoustic headset with comfort pads",
    description: "Crisp dynamic balanced audio with extra deep punchy bass. Featuring a modular lightweight flex headband and soft memory ear cushions.",
    rating: 4.7,
    reviewsCount: 53,
    image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Cobalt Azure",
    colors: ["#2563eb", "#06b6d4"],
    material: "Flexible Polymer & Protein Leather",
    offer: "Exclusive Drop",
    featured: false,
    inStock: true,
    specs: {
      "Drivers": "40mm High Output Neodymium",
      "Battery": "35 Hours continuous playback",
      "Foldable": "180-degree swiveling earcups",
      "Microphone": "Built-in HD noise reduction",
      "Warranty": "1-Year Luiscart Guarantee"
    }
  },
  {
    id: "luis-09",
    name: "Bowers & Wilkins Px8 Luxury Flagship",
    category: "Studio & Audiophile",
    price: 58900,
    originalPrice: 68900,
    subtitle: "Custom 40mm carbon cone drive units & cast aluminum arms",
    description: "The reference standard in wireless audio. Features high-resolution 24-bit DSP with bespoke carbon cone drive units, angled for ultra-low distortion and expansive concert-hall acoustics.",
    rating: 5.0,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Tan & Aluminum",
    colors: ["#d4af37", "#1e1e1e"],
    material: "Anodized Aluminum & Nappa Leather",
    offer: "Exclusive Drop",
    featured: true,
    inStock: true,
    specs: {
      "Drivers": "40mm Dynamic Carbon Cone",
      "Battery Life": "30 Hours Playback",
      "Wireless Codecs": "aptX Adaptive, aptX HD, AAC, SBC",
      "Weight": "320g",
      "Warranty": "2-Year VIP Replacement"
    }
  },
  {
    id: "luis-10",
    name: "Marshall Major IV Classic Wireless",
    category: "Over-Ear",
    price: 11999,
    originalPrice: 14999,
    subtitle: "Iconic vintage vinyl styling with 80+ solid hours wireless playtime",
    description: "Delivers the signature Marshall explosive sound with custom-tuned 40mm dynamic drivers. Multi-directional control knob allows seamless track skipping, volume tuning, and call management.",
    rating: 4.8,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Classic Black",
    colors: ["#111111", "#78350f"],
    material: "Textured Vinyl & Ergonomic Cushioning",
    offer: "Best Seller",
    featured: true,
    inStock: true,
    specs: {
      "Battery Playtime": "80+ Wireless Hours",
      "Quick Charge": "15 min charge = 15 hours playtime",
      "Charging": "Wireless Qi + USB-C",
      "Driver Sensitivity": "106±2 dB SPL (100mV @ 1kHz)",
      "Warranty": "2-Year Official Guarantee"
    }
  },
  {
    id: "luis-11",
    name: "Sennheiser Momentum 4 Audiophile",
    category: "Noise Cancelling",
    price: 27990,
    originalPrice: 34990,
    subtitle: "Audiophile-inspired 42mm transducer acoustic system",
    description: "Unsurpassed musicality powered by Sennheiser's audiophile transducer system. Features adaptive noise cancellation, crystal clear phone calls with 4 digital beamforming microphones, and an astonishing 60-hour battery life.",
    rating: 4.9,
    reviewsCount: 114,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Graphite White",
    colors: ["#f1f5f9", "#111111"],
    material: "Premium Fabric Headband & Soft Foam",
    offer: "Best Seller",
    featured: true,
    inStock: true,
    specs: {
      "Battery Life": "60 Hours with ANC Active",
      "Transducer": "42mm Diameter Dynamic System",
      "Frequency Range": "6 Hz - 22,000 Hz",
      "Sound Personalization": "Tailored Hearing Profile via App",
      "Warranty": "2-Year Global Warranty"
    }
  },
  {
    id: "luis-12",
    name: "Beats Studio Pro Spatial Audio",
    category: "Over-Ear",
    price: 29900,
    originalPrice: 34900,
    subtitle: "Custom acoustic platform with personalized spatial audio",
    description: "Fully custom acoustic architecture engineered to deliver powerful, balanced sound. Fully adaptive Active Noise Cancelling continuously pinpoints and eliminates external noise.",
    rating: 4.8,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    color: "Deep Navy",
    colors: ["#1e3a8a", "#111111", "#d97706"],
    material: "Seamless Engineered Leather & Memory Foam",
    offer: "New Arrival",
    featured: false,
    inStock: true,
    specs: {
      "Audio": "Personalized Spatial Audio with Head Tracking",
      "Battery": "Up to 40 Hours total listening time",
      "Connectivity": "Lossless Audio via USB-C + Bluetooth",
      "Compatibility": "One-touch pairing with Apple & Android",
      "Warranty": "1-Year Luiscart Guarantee"
    }
  }
];

// Luiscart Currency Configuration: Indian Rupee (INR Only)
const CURRENCIES = {
  INR: { symbol: "₹", rate: 1.0, name: "INR" }
};

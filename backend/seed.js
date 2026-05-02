// seed.js - Run this once to insert all plans into MongoDB
// Usage: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  type: { type: String, default: 'individual' },
  difficulty: String,
  location: String,
  distance: String,
  duration: String,
  features: [String],
  description: String,
  popular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Plan = mongoose.model('Plan', planSchema);

const plans = [
  // ==================== AKOURA ====================
  { name: "St Jhons Cliff", category: "Hiking", location: "Akoura", distance: "7 km", duration: "3h", difficulty: "M++", features: ["Meditation rock", "St Jhons cave", "Orchis tridenta", "View Adonis valley"], description: "Not suitable for kids" },
  { name: "LMT Section - Akoura Afqa", category: "Hiking", location: "Akoura", duration: "5h", difficulty: "M+", features: ["Passing near Akoura reforestation site", "Roman wall"] },
  { name: "LMT Section Tannourine Akoura", category: "Hiking", location: "Akoura", difficulty: "M" },
  { name: "LMT Geotrail", category: "Hiking", location: "Akoura", difficulty: "M", features: ["Beautiful geological formations", "Watersheds"] },
  { name: "Lakes Loop", category: "Hiking", location: "Akoura", distance: "8 km", duration: "3h", difficulty: "M" },
  { name: "Peaks Trail", category: "Hiking", location: "Akoura", distance: "9 km", duration: "4h", difficulty: "D", description: "No trail" },
  { name: "River Cross", category: "Hiking", location: "Akoura", distance: "3 km", duration: "2h", difficulty: "D - Wet Hike", features: ["Clear water", "2 waterfalls with natural pools"] },
  { name: "Akoura - Yammoune", category: "Hiking", location: "Akoura", distance: "12 km", duration: "4h", difficulty: "Moderate+", description: "One way trail" },
  { name: "Mini Peaks", category: "Hiking", location: "Akoura", distance: "6 km", duration: "3h", difficulty: "Moderate+", features: ["Top View 360", "Highest point 2100m asl"] },
  { name: "Ain el Deb", category: "Hiking", location: "Akoura", distance: "7 km", duration: "2h30", difficulty: "Moderate", description: "Highest peak in Jbeil District 2250m asl" },

  // ==================== EHMEJ ====================
  { name: "Neznazeh Trail", category: "Hiking", location: "Ehmej", distance: "10 km", duration: "3h30", difficulty: "Moderate" },
  { name: "Hafroun Trail", category: "Hiking", location: "Ehmej", distance: "8 km", duration: "3h30", difficulty: "Difficult" },
  { name: "Akoura Trail", category: "Hiking", location: "Ehmej", distance: "15 km", duration: "4h30", difficulty: "Moderate", features: ["Side Trail (LMT)"] },
  { name: "Baatara Trail", category: "Hiking", location: "Ehmej", distance: "14 km", duration: "4h30", difficulty: "Moderate to Difficult", features: ["Geo Trail"] },
  { name: "Tannourine Trail", category: "Hiking", location: "Ehmej", distance: "16 km", duration: "5h", difficulty: "Difficult to Adventure", features: ["Side Trail (LMT)"] },
  { name: "Saqi Rechmaya", category: "Hiking", location: "Ehmej", distance: "9.3 km", duration: "3h30", difficulty: "Moderate" },
  { name: "Tellaj Trail", category: "Hiking", location: "Ehmej", distance: "11 km", duration: "3h30", difficulty: "Moderate", features: ["Geo Trail"] },
  { name: "Almat Trail", category: "Hiking", location: "Ehmej", distance: "6 km", duration: "2h", difficulty: "Easy to Moderate" },
  { name: "Jaj Trail", category: "Hiking", location: "Ehmej", distance: "12 km", duration: "3h30", difficulty: "Moderate to Difficult" },
  { name: "Annaya Trail", category: "Hiking", location: "Ehmej", distance: "10 km", duration: "3h", difficulty: "Moderate" },
  { name: "Mayfouq Trail", category: "Hiking", location: "Ehmej", distance: "12 km", duration: "4h", difficulty: "Moderate+" },
  { name: "Douma Trail", category: "Hiking", location: "Ehmej", distance: "14 km", duration: "4h30", difficulty: "Moderate+" },
  { name: "Ghommas Trail", category: "Hiking", location: "Ehmej", distance: "6 km", duration: "2h", difficulty: "Easy to Moderate" },
  { name: "Azer Forest Trail", category: "Hiking", location: "Ehmej", distance: "6 km", duration: "2h", difficulty: "Easy to Moderate" },
  { name: "Dichar Trail", category: "Hiking", location: "Ehmej", duration: "2h30" },
  { name: "Iris Trail", category: "Hiking", location: "Ehmej", duration: "2h", description: "Available 1 to 15 May only" },
  { name: "Telten el Bled Trail", category: "Hiking", location: "Ehmej", difficulty: "M+", features: ["Interpretive trail about WW1 famine", "Olive press", "Old houses", "Cultural experience", "Old churches"], description: "Passes by Maad, Bejje, Ghalboun, Ain Kfaa, Ghbeline, Chmout, Bekhaaz" },
  { name: "Dareb Mar Charbel Trail 1", category: "Hiking", location: "Ehmej", difficulty: "Difficult" },
  { name: "Dareb Mar Charbel Trail 2", category: "Hiking", location: "Ehmej", difficulty: "Difficult" },

  // ==================== BENTAEL RESERVE ====================
  { name: "Akfi Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Daher el Mghara", category: "Hiking", location: "Bentael Reserve" },
  { name: "Daher el Shir", category: "Hiking", location: "Bentael Reserve" },
  { name: "Delem Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Dukan Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Hermitage Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Karoussi Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Khasfe Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Maksour Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Mar Sarkis Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Mashareb Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Nahr Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Pigs Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Qattine Grotto", category: "Hiking", location: "Bentael Reserve" },
  { name: "Shir el Sekki", category: "Hiking", location: "Bentael Reserve" },
  { name: "St Simon Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Switch Back Trail", category: "Hiking", location: "Bentael Reserve" },
  { name: "Karaz Trail", category: "Hiking", location: "Bentael Reserve" },

  // ==================== ROAD TRIPS ====================
  { name: "Road Trip 1", category: "Road trip", location: "North Lebanon", distance: "41km", difficulty: "Easy", features: ["Nahrh Ibrahim", "Halat", "Bechtelida - Fidar", "Blat", "Jbail", "Aamchit", "Hosrayel", "Monsef", "Barbara"] },
  { name: "Road Trip 2", category: "Road trip", location: "North Lebanon", distance: "112km", difficulty: "Easy", features: ["Aaqoura", "Laqlouq", "Mghaira", "Majdel", "Yanouh - Hedayne", "Afqa", "Lassa", "Qahmez"] },
  { name: "Road Trip 3", category: "Road trip", location: "North Lebanon", distance: "68.7km", difficulty: "Easy", features: ["Fatre", "Mashna'a", "Mechane", "Mazraat Es Siyad", "Aalmat- ech Chemaliye", "Ghabate", "Qartaba", "Aaboud", "Charbine"] },
  { name: "Road Trip 4", category: "Road trip", location: "North Lebanon", distance: "56km", difficulty: "Easy", features: ["Jaj", "Tartij", "Lehfed", "Saki Reshmaya", "Haqel", "MechmMech Jbeil", "Bjarrine", "Beithabbak", "Maifouq - Qattara"] },
  { name: "Road Trip 5", category: "Road trip", location: "North Lebanon", distance: "46km", difficulty: "Easy", features: ["Aannaya - Kfarbaal", "Ehmej", "Ras Osta", "Hboub", "Bentael"] },
  { name: "Road Trip 6", category: "Road trip", location: "North Lebanon", distance: "46.7km", difficulty: "Easy", features: ["Maad", "Bejje", "Ain kfaa", "Ghbaline", "Sghar", "Chmout", "Chamat", "Ghalboun", "Sabil"] },
  { name: "Road Trip 7", category: "Road trip", location: "North Lebanon", distance: "48.6km", difficulty: "Easy", features: ["Aalita", "Zebdine", "Qornayah", "Jouret el Qattine", "Bchelli", "Sebrine", "Hsoun", "Balhoss", "Bir el Hait"] },
  { name: "Road Trip 8", category: "Road trip", location: "North Lebanon", distance: "58km", difficulty: "Easy", features: ["Adonis", "Mechan", "Haqlet el Tine", "Bazyoun", "Ain Jrain", "Almat Ej Jnoubiye", "Zmar", "Souane", "Qerqraiya"] },
  { name: "Road Trip 9", category: "Road trip", location: "North Lebanon", distance: "58km", difficulty: "Easy", features: ["Ehmej", "Mechmech", "Jaj", "Mayfouq", "Ain Jrain", "Kfifen", "Jrabta"] },
  { name: "Road Trip 10", category: "Road trip", location: "North Lebanon", distance: "58km", difficulty: "Easy", features: ["Ehmej", "Haqel", "Mayfouq", "Kfifen", "Jrabta", "Batroun", "Jrabt", "Kfifen"] },
  { name: "Road Trip 11", category: "Road trip", location: "North Lebanon", difficulty: "Easy", features: ["Mayfouq", "Jran", "Derya", "Chebtine", "Alele"] },

  // ==================== RELIGIOUS TOURS ====================
  { name: "Religious Tour 1", category: "Religious Tour", location: "North Lebanon", features: ["Annaya", "Kfarbaal", "Ehmej"] },
  { name: "Religious Tour 2", category: "Religious Tour", location: "North Lebanon", features: ["Ehmej", "Laklouk", "Aqoura"] },
  { name: "Religious Tour 3", category: "Religious Tour", location: "North Lebanon", features: ["Laklouk", "Aqoura", "Tannourine"] },
  { name: "Religious Tour 4", category: "Religious Tour", location: "North Lebanon", features: ["Aqoura", "Mejdel", "Abboud"] },
  { name: "Religious Tour 5", category: "Religious Tour", location: "North Lebanon", features: ["Tannourine", "Houb", "Douma"] },
  { name: "Religious Tour 6", category: "Religious Tour", location: "North Lebanon", features: ["Tannourine", "Hadath el Jebbe", "Bcharri"] },
  { name: "Religious Tour 7", category: "Religious Tour", location: "North Lebanon", features: ["Ehmej", "Jbeil"] },
  { name: "Religious Tour 8", category: "Religious Tour", location: "North Lebanon", features: ["Jbeil", "Batroun"] },
  { name: "Religious Tour 9", category: "Religious Tour", location: "North Lebanon", features: ["Jbeil", "Harissa"] },
  { name: "Religious Tour 10", category: "Religious Tour", location: "North Lebanon", features: ["Batroun", "Jrabta", "Kfifen"] },
  { name: "Religious Tour 11", category: "Religious Tour", location: "North Lebanon", features: ["Annaya", "Lehfed", "Mayfouq"] },

  // ==================== SIGHTSEEING ====================
  { name: "Sightseeing Jbeil", category: "Sightseeing", location: "Jbeil" },
  { name: "Sightseeing Afqa", category: "Sightseeing", location: "Afqa" },
  { name: "Sightseeing Batroun", category: "Sightseeing", location: "Batroun" },
  { name: "Sightseeing Msaylha", category: "Sightseeing", location: "Msaylha" },
  { name: "Sightseeing Tripoli", category: "Sightseeing", location: "Tripoli" },
  { name: "Sightseeing Saida", category: "Sightseeing", location: "Saida" },
  { name: "Sightseeing Sour", category: "Sightseeing", location: "Sour" },
  { name: "Sightseeing Baalbeck", category: "Sightseeing", location: "Baalbeck" },
  { name: "Sightseeing Faqra", category: "Sightseeing", location: "Faqra" },
  { name: "Sightseeing Bayrouth", category: "Sightseeing", location: "Beirut" },

  // ==================== ADVENTURE ====================
  { name: "Rock Climbing", category: "Adventure", location: "North Lebanon", difficulty: "Difficult" },
  { name: "Zipline", category: "Adventure", location: "North Lebanon", difficulty: "Moderate" },
  { name: "Caving", category: "Adventure", location: "North Lebanon", difficulty: "Moderate" },
  { name: "Via Ferrata", category: "Adventure", location: "North Lebanon", difficulty: "Difficult" },
  { name: "Rafting", category: "Adventure", location: "North Lebanon", difficulty: "Difficult" },
  { name: "Kayak", category: "Adventure", location: "North Lebanon", difficulty: "Moderate" },
  { name: "ATV Ride", category: "Adventure", location: "North Lebanon", difficulty: "Moderate" },
  { name: "Sky-Doo", category: "Adventure", location: "North Lebanon", difficulty: "Moderate", description: "Winter only" },
  { name: "Winter Camping", category: "Adventure", location: "North Lebanon", difficulty: "Difficult", description: "Winter only" },
  { name: "Ski", category: "Adventure", location: "North Lebanon", difficulty: "Moderate", description: "Winter only" },

  // ==================== CULTURAL ====================
  { name: "Cultural Tour Ehmej", category: "Cultural", location: "Ehmej" },
  { name: "Farm Visit", category: "Cultural", location: "North Lebanon" },
  { name: "Taanayel", category: "Cultural", location: "Taanayel" },
  { name: "Zahle", category: "Cultural", location: "Zahle" },
  { name: "Saida Souks", category: "Cultural", location: "Saida" },
  { name: "Sour Souks", category: "Cultural", location: "Sour" },
];

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    let inserted = 0;
    let skipped = 0;

    for (const plan of plans) {
      const exists = await Plan.findOne({ name: plan.name, location: plan.location });
      if (!exists) {
        await Plan.create(plan);
        console.log(`✅ Added: ${plan.name} (${plan.location || 'N/A'})`);
        inserted++;
      } else {
        console.log(`⏭️  Skipped (already exists): ${plan.name}`);
        skipped++;
      }
    }

    console.log(`\n🎉 Done! Inserted: ${inserted} | Skipped: ${skipped}`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });
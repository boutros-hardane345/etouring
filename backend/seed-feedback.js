// seed-feedback.js - Run this once to insert sample feedbacks
// Usage: node seed-feedback.js

require('dotenv').config();
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  rating: Number,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const feedbacks = [
  {
    name: "Lara Khoury",
    email: "lara.khoury@gmail.com",
    message: "Amazing experience! The Akoura hiking trail was breathtaking. The team was professional and very helpful. Will definitely come back for more adventures!",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-03-10')
  },
  {
    name: "Elie Nassar",
    email: "elie.nassar@gmail.com",
    message: "We did the Road Trip 2 through Laqlouq and Afqa. The views were incredible and the route was well planned. Highly recommend e_Touring to anyone who loves Lebanon.",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-03-15')
  },
  {
    name: "Maya Hakim",
    email: "maya.hakim@hotmail.com",
    message: "The Bentael Reserve trails are hidden gems. Our guide was knowledgeable and passionate about nature. A truly unforgettable day trip.",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-03-22')
  },
  {
    name: "Georges Frem",
    email: "georges.frem@gmail.com",
    message: "Went on the Religious Tour to Annaya and Kfarbaal. Very well organized and spiritually enriching. The team respected everyone's pace which I appreciated.",
    rating: 4,
    approved: true,
    createdAt: new Date('2025-04-01')
  },
  {
    name: "Nadia Saad",
    email: "nadia.saad@yahoo.com",
    message: "The rafting adventure was insane! Best experience I've had in Lebanon. Safety was a top priority and the guides were fun and experienced.",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-04-05')
  },
  {
    name: "Charbel Abi Nader",
    email: "charbel.abinader@gmail.com",
    message: "Did the Ehmej Baatara Trail. The scenery around the Baatara Gorge is out of this world. Great difficulty level for intermediate hikers.",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-04-10')
  },
  {
    name: "Sandra Mehanna",
    email: "sandra.mehanna@gmail.com",
    message: "Loved the Sightseeing tour in Baalbeck. The historical context provided by our guide was fascinating. A must-do for anyone visiting Lebanon.",
    rating: 4,
    approved: true,
    createdAt: new Date('2025-04-14')
  },
  {
    name: "Tony Bou Khalil",
    email: "tony.boukhalil@outlook.com",
    message: "The via ferrata was challenging but so rewarding. Proper equipment was provided and safety briefing was thorough. 10/10 would do it again!",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-04-18')
  },
  {
    name: "Rita Gemayel",
    email: "rita.gemayel@gmail.com",
    message: "Joined the Cultural Farm Visit tour with my family. Kids loved it and learned so much about Lebanese agriculture and traditions. Very wholesome experience.",
    rating: 4,
    approved: true,
    createdAt: new Date('2025-04-22')
  },
  {
    name: "Jad Mouawad",
    email: "jad.mouawad@gmail.com",
    message: "The Tannourine trail was tough but worth every step. The cedar forest is magical. e_Touring really knows how to show you the best of Lebanon.",
    rating: 5,
    approved: true,
    createdAt: new Date('2025-04-28')
  },
  {
    name: "Celine Azar",
    email: "celine.azar@gmail.com",
    message: "Booking was easy and the team was responsive. The Jbeil sightseeing tour covered everything from the Phoenician ruins to the old souk. Very informative!",
    rating: 4,
    approved: true,
    createdAt: new Date('2025-05-02')
  },
  {
    name: "Rabih Tawk",
    email: "rabih.tawk@hotmail.com",
    message: "Good experience overall. The kayaking trip was fun but I wish it was a bit longer. Looking forward to trying more adventures with e_Touring.",
    rating: 3,
    approved: true,
    createdAt: new Date('2025-05-08')
  }
];

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGO_URI not found in .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    let inserted = 0;
    for (const fb of feedbacks) {
      const exists = await Feedback.findOne({ email: fb.email });
      if (!exists) {
        await Feedback.create(fb);
        console.log(`✅ Added feedback from: ${fb.name}`);
        inserted++;
      } else {
        console.log(`⏭️  Skipped (already exists): ${fb.name}`);
      }
    }

    console.log(`\n🎉 Done! Inserted ${inserted} feedbacks.`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });
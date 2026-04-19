require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Charity = require('./models/Charity');

const charities = [
  {
    name: "Green Fairways Index",
    description: "Supporting sustainable golf course management and water conservation.",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800",
    website: "https://greenfairways.org"
  },
  {
    name: "Youth Tee-Off Foundation",
    description: "Providing inner-city youth with access to golf and educational mentorship.",
    image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800",
    website: "https://youthteeoff.org"
  },
  {
    name: "Ocean Clean Golf",
    description: "Removing plastics from coastal areas near seaside golf resorts.",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800",
    website: "https://oceanclean.org"
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-heroes');
    
    // Clear existing
    await User.deleteMany({ role: 'admin' });
    await Charity.deleteMany({});
    
    // Add charities
    const createdCharities = await Charity.insertMany(charities);
    console.log('Charities seeded');
    
    // Add admin
    const admin = new User({
      name: 'Admin Hero',
      email: 'admin@digitalheroes.co.in',
      password: 'adminpassword', // Will be hashed by pre-save
      role: 'admin',
      subscription: { status: 'active', plan: 'yearly' },
      charity: createdCharities[0]._id
    });
    
    await admin.save();
    console.log('Admin user seeded: admin@digitalheroes.co.in / adminpassword');
    
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seed();

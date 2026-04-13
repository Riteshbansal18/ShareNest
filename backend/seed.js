require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const RoommateProfile = require('./models/RoommateProfile');

const MONGO_URI = process.env.MONGODB_URI;

const seedUsers = [
  { fullName: 'Rahul Sharma', email: 'rahul@sharenest.com', password: 'password123', location: 'Mumbai', occupation: 'Software Engineer', gender: 'Male', bio: 'Working professional, clean and quiet.', verificationLevel: 2 },
  { fullName: 'Priya Patel', email: 'priya@sharenest.com', password: 'password123', location: 'Bangalore', occupation: 'UX Designer', gender: 'Female', bio: 'Creative professional, love cooking and yoga.', verificationLevel: 2 },
  { fullName: 'Arjun Mehta', email: 'arjun@sharenest.com', password: 'password123', location: 'Delhi', occupation: 'MBA Student', gender: 'Male', bio: 'Student at IIM, looking for clean PG.', verificationLevel: 1 },
  { fullName: 'Sneha Reddy', email: 'sneha@sharenest.com', password: 'password123', location: 'Hyderabad', occupation: 'Data Analyst', gender: 'Female', bio: 'IT professional, early riser, non-smoker.', verificationLevel: 2 },
  { fullName: 'Vikram Singh', email: 'vikram@sharenest.com', password: 'password123', location: 'Pune', occupation: 'Product Manager', gender: 'Male', bio: 'Startup guy, loves weekend treks.', verificationLevel: 1 },
  { fullName: 'Ananya Iyer', email: 'ananya@sharenest.com', password: 'password123', location: 'Chennai', occupation: 'Doctor', gender: 'Female', bio: 'Medical resident, need quiet space.', verificationLevel: 3 },
];

const seedProperties = [
  // MUMBAI
  {
    title: 'Premium PG for Working Professionals – Andheri West',
    description: 'Fully furnished AC rooms with attached bathroom. 24/7 security, housekeeping, and home-cooked meals included. 5 min walk from Andheri Metro Station. Ideal for IT professionals.',
    category: 'pg', address: 'Lokhandwala Complex, Andheri West', neighborhood: 'Andheri West', city: 'Mumbai',
    price: 12000, deposit: 24000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Laundry', 'Kitchen', 'Security', 'Furnished'],
    genderPref: 'Male', verified: true,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'],
    lookingFor: ['Working professional', 'Non-smoker', 'Clean and tidy']
  },
  {
    title: 'Girls PG with Meals – Bandra East, Near BKC',
    description: 'Safe and secure ladies PG near BKC corporate hub. Spacious rooms, nutritious meals (breakfast + dinner), RO water, CCTV surveillance. Walking distance to bus stop.',
    category: 'pg', address: 'Kherwadi, Bandra East', neighborhood: 'Bandra East', city: 'Mumbai',
    price: 14000, deposit: 28000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Furnished', 'Kitchen'],
    genderPref: 'Female', verified: true,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
    lookingFor: ['Working professional', 'Female only', 'Non-smoker']
  },
  {
    title: 'Affordable Shared PG – Powai, Hiranandani',
    description: 'Budget-friendly shared accommodation near Hiranandani Gardens. Common kitchen, fast WiFi, and a great community of young professionals. Close to IIT Bombay and Powai Lake.',
    category: 'pg', address: 'Hiranandani Gardens, Powai', neighborhood: 'Powai', city: 'Mumbai',
    price: 8500, deposit: 17000, roomType: 'Shared Space', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Kitchen', 'Laundry', 'Security'],
    genderPref: 'Any', verified: false,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    lookingFor: ['Student or working professional', 'Clean habits']
  },
  {
    title: 'Luxury Studio PG – Worli Sea Face',
    description: 'Premium studio-style PG with sea view. Fully furnished with modular kitchen, smart TV, high-speed internet. Concierge service, gym access, and rooftop lounge.',
    category: 'studio', address: 'Worli Sea Face Road', neighborhood: 'Worli', city: 'Mumbai',
    price: 28000, deposit: 56000, roomType: 'Studio', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Furnished', 'Security', 'Balcony'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    lookingFor: ['Working professional', 'Long-term stay preferred']
  },

  // DELHI
  {
    title: 'Boys PG Near Connaught Place – Central Delhi',
    description: 'Well-maintained PG for male professionals and students. AC rooms, daily housekeeping, power backup, and meals available. Metro connectivity to all major hubs.',
    category: 'pg', address: 'Rajendra Place, Central Delhi', neighborhood: 'Rajendra Place', city: 'Delhi',
    price: 10000, deposit: 20000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Laundry', 'Security', 'Furnished'],
    genderPref: 'Male', verified: true,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    lookingFor: ['Working professional or student', 'Non-smoker']
  },
  {
    title: 'Girls Hostel with AC – Lajpat Nagar',
    description: 'Safe ladies hostel in prime South Delhi location. Biometric entry, CCTV, warden on premises. Meals, laundry, and housekeeping included. Near Lajpat Nagar Metro.',
    category: 'pg', address: 'Lajpat Nagar II', neighborhood: 'Lajpat Nagar', city: 'Delhi',
    price: 11000, deposit: 22000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Furnished', 'Kitchen', 'Laundry'],
    genderPref: 'Female', verified: true,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
    lookingFor: ['Female only', 'Student or working professional']
  },
  {
    title: 'Co-Living Space – Hauz Khas Village',
    description: 'Trendy co-living space in the heart of Hauz Khas. Rooftop terrace, co-working area, community events. Perfect for freelancers, artists, and startup folks.',
    category: 'flat', address: 'Hauz Khas Village', neighborhood: 'Hauz Khas', city: 'Delhi',
    price: 18000, deposit: 36000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Furnished', 'Balcony', 'Kitchen'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
    lookingFor: ['Creative professional', 'Open-minded', 'Long-term preferred']
  },

  // BANGALORE
  {
    title: 'IT Professional PG – Koramangala 5th Block',
    description: 'Premium PG tailored for tech professionals. High-speed 200Mbps WiFi, ergonomic workstations, AC rooms, and healthy meals. 10 min from major IT parks.',
    category: 'pg', address: '5th Block, Koramangala', neighborhood: 'Koramangala', city: 'Bangalore',
    price: 13000, deposit: 26000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Kitchen', 'Laundry', 'Security'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'],
    lookingFor: ['IT professional', 'Non-smoker', 'Clean habits']
  },
  {
    title: 'Girls PG with Home Food – Indiranagar',
    description: 'Homely PG for working women in upscale Indiranagar. North and South Indian meals, AC rooms, attached bath, and a caring environment. Near 100 Feet Road.',
    category: 'pg', address: '12th Main, Indiranagar', neighborhood: 'Indiranagar', city: 'Bangalore',
    price: 15000, deposit: 30000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Security', 'Furnished', 'Laundry'],
    genderPref: 'Female', verified: true,
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
    lookingFor: ['Working woman', 'Non-smoker', 'Vegetarian preferred']
  },
  {
    title: 'Budget PG for Students – HSR Layout',
    description: 'Affordable and clean PG near Electronic City. Shared rooms available. Common kitchen, fast WiFi, and a friendly community. Shuttle service to tech parks.',
    category: 'pg', address: 'Sector 2, HSR Layout', neighborhood: 'HSR Layout', city: 'Bangalore',
    price: 7500, deposit: 15000, roomType: 'Shared Space', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Kitchen', 'Laundry', 'Security'],
    genderPref: 'Male', verified: false,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'],
    lookingFor: ['Student or fresher', 'Budget-conscious']
  },
  {
    title: 'Luxury Co-Living – Whitefield Tech Park',
    description: 'Premium co-living near ITPL and Whitefield tech corridor. Private rooms with smart locks, Netflix, gym, swimming pool, and daily housekeeping. All-inclusive pricing.',
    category: 'flat', address: 'ITPL Main Road, Whitefield', neighborhood: 'Whitefield', city: 'Bangalore',
    price: 22000, deposit: 44000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Gym', 'Pool', 'Furnished', 'Security', 'Laundry'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    lookingFor: ['Senior IT professional', 'Long-term stay']
  },

  // HYDERABAD
  {
    title: 'Modern PG for IT Professionals – HITEC City',
    description: 'Fully furnished PG steps away from Cyberabad IT hub. AC rooms, power backup, high-speed WiFi, and meals. Shuttle to major tech companies. Zero brokerage.',
    category: 'pg', address: 'Madhapur, HITEC City', neighborhood: 'HITEC City', city: 'Hyderabad',
    price: 11000, deposit: 22000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Kitchen', 'Security', 'Laundry'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
    lookingFor: ['IT professional', 'Non-smoker']
  },
  {
    title: 'Girls PG Near Gachibowli – Safe & Secure',
    description: 'Premium ladies PG near financial district. Biometric access, CCTV, female warden. Spacious rooms, healthy meals, and a supportive community for working women.',
    category: 'pg', address: 'Gachibowli Circle', neighborhood: 'Gachibowli', city: 'Hyderabad',
    price: 12500, deposit: 25000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Furnished', 'Kitchen'],
    genderPref: 'Female', verified: true,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
    lookingFor: ['Working woman', 'Female only', 'Non-smoker']
  },

  // PUNE
  {
    title: 'Startup-Friendly Co-Living – Koregaon Park',
    description: 'Vibrant co-living space in Pune\'s most happening neighborhood. Co-working desks, fast internet, rooftop hangout, and regular community events. Near Osho Ashram.',
    category: 'flat', address: 'Lane 5, Koregaon Park', neighborhood: 'Koregaon Park', city: 'Pune',
    price: 16000, deposit: 32000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Kitchen', 'Balcony', 'Security'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
    lookingFor: ['Entrepreneur or freelancer', 'Open-minded', 'Social']
  },
  {
    title: 'Boys PG Near Hinjewadi IT Park',
    description: 'Budget PG for male IT professionals near Hinjewadi Phase 1, 2 & 3. AC rooms, meals, WiFi, and shuttle service. Clean bathrooms and 24/7 security.',
    category: 'pg', address: 'Wakad, Near Hinjewadi', neighborhood: 'Hinjewadi', city: 'Pune',
    price: 9000, deposit: 18000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Laundry', 'Security', 'Furnished'],
    genderPref: 'Male', verified: false,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    lookingFor: ['IT professional', 'Non-smoker', 'Clean habits']
  },

  // CHENNAI
  {
    title: 'Premium PG for Women – Anna Nagar',
    description: 'Upscale ladies PG in Chennai\'s most sought-after residential area. AC rooms, South Indian meals, RO water, and a safe environment. Near Anna Nagar Tower Park.',
    category: 'pg', address: 'Anna Nagar West', neighborhood: 'Anna Nagar', city: 'Chennai',
    price: 10000, deposit: 20000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Security', 'Furnished', 'Laundry'],
    genderPref: 'Female', verified: true,
    images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
    lookingFor: ['Working woman', 'Female only', 'Vegetarian preferred']
  },
  {
    title: 'IT Professional PG – OMR Tech Corridor',
    description: 'Modern PG along Old Mahabalipuram Road, Chennai\'s IT spine. Fully furnished AC rooms, high-speed WiFi, meals, and shuttle to major IT parks like Tidel Park and Sholinganallur.',
    category: 'pg', address: 'Perungudi, OMR', neighborhood: 'OMR', city: 'Chennai',
    price: 9500, deposit: 19000, roomType: 'Single Room', bedroomCount: 1, bathroomCount: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Kitchen', 'Laundry', 'Security'],
    genderPref: 'Any', verified: true,
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'],
    lookingFor: ['IT professional', 'Non-smoker']
  },
];

const seedRoommates = [
  { budget: 12000, preferredCities: ['Mumbai'], gender: 'Male', tags: ['Non-smoker', 'Early bird', 'Gym freak', 'Vegetarian'], lookingFor: 'Looking for a clean, quiet PG near Andheri or BKC. I work at a startup and keep regular hours.', occupation: 'Software Engineer', leaseDuration: '6-12 months' },
  { budget: 15000, preferredCities: ['Bangalore'], gender: 'Female', tags: ['Non-smoker', 'Pet friendly', 'Yoga lover', 'Foodie'], lookingFor: 'Seeking a safe PG in Koramangala or Indiranagar. I value cleanliness and a positive vibe.', occupation: 'UX Designer', leaseDuration: '1+ year' },
  { budget: 10000, preferredCities: ['Delhi'], gender: 'Male', tags: ['Student', 'Night owl', 'Gamer', 'Non-smoker'], lookingFor: 'MBA student looking for affordable PG near South Delhi. Prefer co-living with like-minded people.', occupation: 'MBA Student', leaseDuration: '1+ year' },
  { budget: 13000, preferredCities: ['Hyderabad'], gender: 'Female', tags: ['Non-smoker', 'Early bird', 'Fitness enthusiast', 'Vegetarian'], lookingFor: 'IT professional seeking ladies PG near HITEC City or Gachibowli. Safety is top priority.', occupation: 'Data Analyst', leaseDuration: '6-12 months' },
  { budget: 16000, preferredCities: ['Pune'], gender: 'Male', tags: ['Entrepreneur', 'Social', 'Coffee lover', 'Traveler'], lookingFor: 'Startup founder looking for co-living in Koregaon Park or Kalyani Nagar. Love community vibes.', occupation: 'Product Manager', leaseDuration: 'Flexible' },
  { budget: 11000, preferredCities: ['Chennai'], gender: 'Female', tags: ['Non-smoker', 'Quiet', 'Book lover', 'Vegetarian'], lookingFor: 'Doctor looking for peaceful PG near OMR or Anna Nagar. Need quiet environment for night shifts.', occupation: 'Doctor', leaseDuration: '1+ year' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ email: { $in: seedUsers.map(u => u.email) } });
    await Property.deleteMany({ city: { $in: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'] } });
    console.log('🗑️  Cleared old seed data');

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      // Use insertOne to bypass pre-save double-hashing
      const result = await User.collection.insertOne({
        ...userData,
        password: hashedPassword,
        role: 'user',
        isEmailVerified: true,
        isActive: true,
        verificationLevel: userData.verificationLevel || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      createdUsers.push({ _id: result.insertedId, ...userData });
    }
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create properties (distribute owners)
    const createdProperties = [];
    for (let i = 0; i < seedProperties.length; i++) {
      const owner = createdUsers[i % createdUsers.length];
      const property = await Property.create({ ...seedProperties[i], owner: owner._id });
      createdProperties.push(property);
    }
    console.log(`🏠 Created ${createdProperties.length} properties`);

    // Create roommate profiles
    await RoommateProfile.deleteMany({ user: { $in: createdUsers.map(u => u._id) } });
    for (let i = 0; i < seedRoommates.length; i++) {
      await RoommateProfile.create({ ...seedRoommates[i], user: createdUsers[i]._id });
    }
    console.log(`👥 Created ${seedRoommates.length} roommate profiles`);

    // Create admin account
    await User.deleteOne({ email: 'admin@sharenest.com' });
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123456', salt);
    // Use insertOne to bypass the pre-save hook (password already hashed)
    await User.collection.insertOne({
      fullName: 'ShareNest Admin',
      email: 'admin@sharenest.com',
      password: adminPass,
      role: 'admin',
      isEmailVerified: true,
      verificationLevel: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('🔐 Admin account created: admin@sharenest.com / admin123456');

    console.log('\n🎉 Seed complete!');
    console.log('📧 Test login: rahul@sharenest.com / password123');
    console.log('🔐 Admin login: admin@sharenest.com / admin123456');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();

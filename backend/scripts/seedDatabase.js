import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

import User from '../models/User.js';
import Player from '../models/Player.js';
import Coach from '../models/Coach.js';
import Match from '../models/Match.js';
import Training from '../models/Training.js';
import PlayerPerformance from '../models/PlayerPerformance.js';
import News from '../models/News.js';
import Ticket from '../models/Ticket.js';
import AIChatHistory from '../models/AIChatHistory.js';
import AIMatchSummary from '../models/AIMatchSummary.js';
import AIPlayerAnalysis from '../models/AIPlayerAnalysis.js';
import Notification from '../models/Notification.js';
import Merchandise from '../models/Merchandise.js';

dotenv.config();

const seedAllCollections = async () => {
  try {
    await connectDB();
    console.log('--- Initializing ClubVerse MongoDB Seeder ---');

    // 1. Seed Users
    await User.deleteMany({});
    const adminUser = await User.create({
      full_name: 'Admin Manager',
      email: 'admin@clubverse.com',
      password: 'hashed_password_123',
      role: 'Admin',
      phone: '+34 600 000 001',
      status: 'Active'
    });

    const playerUser = await User.create({
      full_name: 'Lamine Yamal',
      email: 'yamal@clubverse.com',
      password: 'hashed_password_123',
      role: 'Player',
      phone: '+34 600 000 019',
      status: 'Active'
    });

    const coachUser = await User.create({
      full_name: 'Hansi Flick',
      email: 'flick@clubverse.com',
      password: 'hashed_password_123',
      role: 'Coach',
      phone: '+34 600 000 005',
      status: 'Active'
    });

    const fanUser = await User.create({
      full_name: 'Alex Supporter',
      email: 'supporter@clubverse.com',
      password: 'hashed_password_123',
      role: 'Fan',
      phone: '+34 600 000 100',
      status: 'Active'
    });

    console.log('✅ 1. Users Collection Seeded');

    // 2. Seed Players
    await Player.deleteMany({});
    const playerRecord = await Player.create({
      user_id: playerUser._id,
      full_name: 'Lamine Yamal',
      position: 'Right Winger',
      jersey_number: 19,
      date_of_birth: new Date('2007-07-13'),
      nationality: 'Spanish',
      status: 'Active'
    });
    console.log('✅ 2. Players Collection Seeded');

    // 3. Seed Coaches
    await Coach.deleteMany({});
    const coachRecord = await Coach.create({
      user_id: coachUser._id,
      full_name: 'Hansi Flick',
      specialization: 'Head Tactical Coach',
      experience: 18,
      status: 'Active'
    });
    console.log('✅ 3. Coaches Collection Seeded');

    // 4. Seed Matches
    await Match.deleteMany({});
    const matchRecord = await Match.create({
      opponent: 'Real Madrid',
      match_date: new Date('2026-05-12'),
      match_time: '21:00 CEST',
      venue: 'Spotify Arena, Barcelona',
      competition: 'La Liga',
      home_score: 2,
      away_score: 1,
      status: 'Upcoming'
    });
    console.log('✅ 4. Matches Collection Seeded');

    // 5. Seed Training
    await Training.deleteMany({});
    await Training.create({
      coach_id: coachRecord._id,
      training_date: new Date('2026-05-10'),
      training_time: '10:00 CEST',
      venue: 'Ciutat Esportiva Pitch 1',
      training_type: 'High Press & Rondos',
      description: 'Tactical positioning and rapid transition drills.'
    });
    console.log('✅ 5. Training Collection Seeded');

    // 6. Seed Player Performance
    await PlayerPerformance.deleteMany({});
    await PlayerPerformance.create({
      player_id: playerRecord._id,
      match_id: matchRecord._id,
      goals: 2,
      assists: 1,
      passes: 45,
      pass_accuracy: 91.5,
      rating: 9.6
    });
    console.log('✅ 6. PlayerPerformance Collection Seeded');

    // 7. Seed News
    await News.deleteMany({});
    await News.create({
      title: 'Lamine Yamal Signs Long-Term Extension Until 2030',
      content: 'ClubVerse FC confirms agreement with Lamine Yamal for a historic release clause.',
      author_id: adminUser._id,
      status: 'Published'
    });
    console.log('✅ 7. News Collection Seeded');

    // 8. Seed Tickets
    await Ticket.deleteMany({});
    await Ticket.create({
      match_id: matchRecord._id,
      user_id: fanUser._id,
      seat_number: 'LATERAL-104-12',
      payment_status: 'Paid',
      ticket_status: 'Booked'
    });
    console.log('✅ 8. Tickets Collection Seeded');

    // 9. Seed AI Chat History
    await AIChatHistory.deleteMany({});
    await AIChatHistory.create({
      user_id: fanUser._id,
      question: 'Who is starting in midfield against Real Madrid?',
      response: 'Pedri, Gavi, and Frenkie de Jong are starting in midfield.'
    });
    console.log('✅ 9. AIChatHistory Collection Seeded');

    // 10. Seed AI Match Summaries
    await AIMatchSummary.deleteMany({});
    await AIMatchSummary.create({
      match_id: matchRecord._id,
      summary: 'Aggressive mid-block pressing led to early goal conversion in 2-1 victory.'
    });
    console.log('✅ 10. AIMatchSummary Collection Seeded');

    // 11. Seed AI Player Analysis
    await AIPlayerAnalysis.deleteMany({});
    await AIPlayerAnalysis.create({
      player_id: playerRecord._id,
      analysis: 'World-class 1v1 dribbling efficiency with 97% successful progressive carries.',
      recommendations: 'Continue overload transitions on right flank.'
    });
    console.log('✅ 11. AIPlayerAnalysis Collection Seeded');

    // 12. Seed Notifications
    await Notification.deleteMany({});
    await Notification.create({
      user_id: fanUser._id,
      title: 'Match Pass Confirmed',
      message: 'Your Lateral Stand ticket for El Clásico has been issued.',
      is_read: false
    });
    console.log('✅ 12. Notifications Collection Seeded');

    // 13. Seed Merchandise
    await Merchandise.deleteMany({});
    await Merchandise.create({
      product_name: 'ClubVerse 2026 Official Home Jersey',
      category: 'Kits',
      price: 95.00,
      stock: 500,
      status: 'Available'
    });
    console.log('✅ 13. Merchandise Collection Seeded');

    console.log('--- All 13 Collections Successfully Configured & Seeded in MongoDB ---');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedAllCollections();

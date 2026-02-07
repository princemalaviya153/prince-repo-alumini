const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const SuccessStory = require('../models/SuccessStory');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Job.deleteMany({});
        await Event.deleteMany({});
        await Donation.deleteMany({});
        await SuccessStory.deleteMany({});

        // Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                role: 'alumni',
                graduationYear: 2020,
                degree: 'B.Tech',
                fieldOfStudy: 'Computer Science',
                currentPosition: 'Software Engineer',
                company: 'Google',
                industry: 'Technology',
                location: 'Bangalore',
                isProfileComplete: true
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                role: 'alumni',
                graduationYear: 2018,
                degree: 'MBA',
                fieldOfStudy: 'Marketing',
                currentPosition: 'Product Manager',
                company: 'Amazon',
                industry: 'E-commerce',
                location: 'Mumbai',
                isProfileComplete: true
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                isProfileComplete: true
            }
        ]);

        console.log('Users Seeded');

        // Create Jobs
        await Job.create([
            {
                title: 'Senior React Developer',
                company: 'TechCorp',
                location: 'Remote',
                jobType: 'Full-time',
                salaryRange: '₹20L - ₹30L',
                description: 'Looking for an experienced React developer...',
                postedBy: users[0]._id
            },
            {
                title: 'Marketing Manager',
                company: 'BrandFlow',
                location: 'Delhi',
                jobType: 'Full-time',
                salaryRange: '₹15L - ₹20L',
                description: 'Lead our marketing initiatives...',
                postedBy: users[1]._id
            }
        ]);
        console.log('Jobs Seeded');

        // Create Events
        await Event.create([
            {
                title: 'Alumni Meetup 2026',
                description: 'Annual gathering for all batches.',
                dateTime: new Date('2026-05-15'),
                venue: 'University Audi',
                eventType: 'Reunion',
                createdBy: users[2]._id
            },
            {
                title: 'Tech Talk: AI Futures',
                description: 'Webinar on the future of AI.',
                dateTime: new Date('2026-06-10'),
                venue: 'Zoom',
                eventType: 'Webinar',
                createdBy: users[0]._id
            }
        ]);
        console.log('Events Seeded');

        // Create Donations
        await Donation.create([
            {
                amount: 5000,
                purpose: 'Scholarship',
                donorName: 'John Doe',
                receiptNumber: 'RCPT-001',
                donatedBy: users[0]._id
            },
            {
                amount: 10000,
                purpose: 'Infrastructure',
                donorName: 'Anonymous',
                isAnonymous: true,
                receiptNumber: 'RCPT-002',
                donatedBy: users[1]._id
            }
        ]);
        console.log('Donations Seeded');

        // Create Success Stories
        await SuccessStory.create([
            {
                alumniName: 'Jane Smith',
                graduationYear: 2018,
                currentPosition: 'Product Manager, Amazon',
                achievementTitle: 'Led Prime Day Launch',
                description: 'Successfully managed the product launch for Prime Day 2025...',
                category: 'Career',
                submittedBy: users[1]._id
            }
        ]);
        console.log('Stories Seeded');

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const RecommendationLog = require('../models/RecommendationLog');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop existing data
    await Promise.all([
      User.deleteMany({}),
      TutorProfile.deleteMany({}),
      Availability.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      RecommendationLog.deleteMany({}),
    ]);
    console.log('🗑️  Cleared all collections');

    // ========== USERS ==========
    const password = 'password123';

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@tutorconnect.com',
      password,
      role: 'admin',
    });

    const students = await User.create([
      { name: 'Alice Johnson', email: 'alice@student.com', password, role: 'student' },
      { name: 'Bob Williams', email: 'bob@student.com', password, role: 'student' },
      { name: 'Carol Davis', email: 'carol@student.com', password, role: 'student' },
      { name: 'David Brown', email: 'david@student.com', password, role: 'student' },
      { name: 'Emma Wilson', email: 'emma@student.com', password, role: 'student' },
    ]);

    const tutorUsers = await User.create([
      // ── Frontend (0-3) ──
      { name: 'Dr. Sarah Chen',     email: 'sarah@tutor.com',    password, role: 'tutor' },
      { name: 'Ethan Brooks',       email: 'ethan@tutor.com',    password, role: 'tutor' },
      { name: 'Anika Patel',        email: 'anika@tutor.com',    password, role: 'tutor' },
      { name: 'Carlos Mendez',      email: 'carlos@tutor.com',   password, role: 'tutor' },
      // ── Backend (4-7) ──
      { name: 'Prof. James Miller', email: 'james@tutor.com',    password, role: 'tutor' },
      { name: 'Priya Sharma',       email: 'priya@tutor.com',    password, role: 'tutor' },
      { name: 'Noah Williams',      email: 'noah@tutor.com',     password, role: 'tutor' },
      { name: 'Zara Ahmed',         email: 'zara@tutor.com',     password, role: 'tutor' },
      // ── AI / ML (8-10) ──
      { name: 'Maria Garcia',       email: 'maria@tutor.com',    password, role: 'tutor' },
      { name: 'Dr. Liam Chen',      email: 'liam@tutor.com',     password, role: 'tutor' },
      { name: 'Sofia Rossi',        email: 'sofia@tutor.com',    password, role: 'tutor' },
      // ── DSA / CP (11-12) ──
      { name: 'Dr. Ahmed Khan',     email: 'ahmed@tutor.com',    password, role: 'tutor' },
      { name: 'Ivan Petrov',        email: 'ivan@tutor.com',     password, role: 'tutor' },
      // ── DevOps / Cloud (13-15) ──
      { name: 'Lisa Thompson',      email: 'lisa@tutor.com',     password, role: 'tutor' },
      { name: 'Marcus Johnson',     email: 'marcus@tutor.com',   password, role: 'tutor' },
      { name: 'Hana Nakamura',      email: 'hana@tutor.com',     password, role: 'tutor' },
      // ── Mobile (16-17) ──
      { name: 'Dr. Robert Lee',     email: 'robert@tutor.com',   password, role: 'tutor' },
      { name: 'Chloe Bennett',      email: 'chloe@tutor.com',    password, role: 'tutor' },
      // ── Data Science (18-19) ──
      { name: 'Jennifer Park',      email: 'jennifer@tutor.com', password, role: 'tutor' },
      { name: 'Omar Hassan',        email: 'omar@tutor.com',     password, role: 'tutor' },
      // ── Cybersecurity (20-21) ──
      { name: 'Michael Scott',      email: 'michael@tutor.com',  password, role: 'tutor' },
      { name: 'Elena Volkov',       email: 'elena@tutor.com',    password, role: 'tutor' },
      // ── Blockchain / Web3 (22) ──
      { name: 'Ravi Subramanian',   email: 'ravi@tutor.com',     password, role: 'tutor' },
      // ── Game Dev (23) ──
      { name: 'Jake Morrison',      email: 'jake@tutor.com',     password, role: 'tutor' },
      // ── Full Stack / pending (24) ──
      { name: 'Alex Turner',        email: 'alex@tutor.com',     password, role: 'tutor' },
    ]);


    console.log(`👥 Created ${1 + students.length + tutorUsers.length} users`);

    // ========== TUTOR PROFILES (Tech-Focused) ==========
    const profileData = [
      {
        userId: tutorUsers[0]._id,
        subjects: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Next.js', 'Frontend Development'],
        bio: 'Senior Frontend Engineer with 10+ years at top tech companies. I specialize in modern React ecosystem including hooks, context, Redux, and Next.js. I teach responsive design with CSS, component architecture, state management patterns, and performance optimization for web applications. Perfect for anyone wanting to become a professional frontend developer.',
        hourlyRate: 45,
        qualifications: ['M.Sc Computer Science — Stanford', 'Google Frontend Certification', 'Meta React Developer Certificate'],
        yearsOfExperience: 12,
        averageRating: 4.8,
        totalReviews: 5,
        isApproved: true,
      },
      {
        userId: tutorUsers[1]._id,
        subjects: ['React', 'Vue.js', 'JavaScript', 'CSS', 'Tailwind CSS', 'Webpack', 'Frontend Development'],
        bio: 'UI/UX-focused frontend developer with 8 years building beautiful, accessible web interfaces. I cover React and Vue.js, CSS animations, Tailwind CSS, Webpack bundling, accessibility (WCAG), and design-to-code workflows.',
        hourlyRate: 38, qualifications: ['B.Sc Computer Science — University of Toronto', 'Certified Accessibility Professional', 'Google UX Design Certificate'],
        yearsOfExperience: 8, averageRating: 4.5, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[2]._id,
        subjects: ['Angular', 'TypeScript', 'RxJS', 'JavaScript', 'HTML', 'CSS', 'Frontend Development'],
        bio: 'Enterprise frontend architect specialising in Angular and TypeScript. I teach Angular fundamentals to advanced patterns — components, services, routing, reactive forms, RxJS observables, NgRx state management, and unit testing with Jasmine/Karma.',
        hourlyRate: 42, qualifications: ['M.Sc Software Engineering — TU Munich', 'Google Developers Certification', 'Angular Certified Developer'],
        yearsOfExperience: 9, averageRating: 4.4, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[3]._id,
        subjects: ['React', 'Three.js', 'WebGL', 'GSAP', 'CSS Animations', 'SVG', 'Creative Coding'],
        bio: 'Creative frontend developer blending code and design. I specialise in immersive web experiences with Three.js, WebGL, and GSAP animations — advanced CSS animations, scroll-based effects, and 3D web scenes that make websites truly stand out.',
        hourlyRate: 50, qualifications: ['B.FA Digital Design — Parsons', 'Awwwards Speaker', 'CSS Design Awards Winner'],
        yearsOfExperience: 7, averageRating: 4.6, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[4]._id,
        subjects: ['Node.js', 'Express.js', 'MongoDB', 'REST API', 'Backend Development', 'PostgreSQL', 'GraphQL'],
        bio: 'Full-stack developer turned backend specialist. I teach Node.js and Express, database design with MongoDB and PostgreSQL, REST and GraphQL API architecture, JWT/OAuth authentication, and deployment strategies. My students build real production-ready backends from scratch.',
        hourlyRate: 50, qualifications: ['B.Sc Computer Science — MIT', 'AWS Solutions Architect', 'MongoDB Certified Developer'],
        yearsOfExperience: 15, averageRating: 4.6, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[5]._id,
        subjects: ['Java', 'Spring Boot', 'Microservices', 'Design Patterns', 'Object-Oriented Programming', 'JPA', 'Hibernate'],
        bio: 'Java architect with 14 years of enterprise experience. I teach core Java, advanced OOP, Spring Boot, microservices architecture, design patterns (SOLID, GoF), JPA/Hibernate, and building scalable enterprise applications.',
        hourlyRate: 47, qualifications: ['Oracle Certified Professional Java Developer', 'Spring Professional Certified', 'M.Tech Software Systems — BITS Pilani'],
        yearsOfExperience: 14, averageRating: 4.5, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[6]._id,
        subjects: ['Python', 'Django', 'FastAPI', 'Flask', 'Backend Development', 'REST API', 'Celery'],
        bio: 'Python backend engineer with deep expertise in Django, FastAPI, and Flask. I teach RESTful API design, async programming with FastAPI, background jobs with Celery and Redis, authentication & authorisation, and deploying Python apps on AWS and Heroku.',
        hourlyRate: 44, qualifications: ['M.Sc Computer Science — Edinburgh', 'PSF Fellow', 'AWS Developer Associate'],
        yearsOfExperience: 10, averageRating: 4.7, totalReviews: 5, isApproved: true,
      },
      {
        userId: tutorUsers[7]._id,
        subjects: ['Go', 'Rust', 'Microservices', 'gRPC', 'Backend Development', 'Distributed Systems', 'Kafka'],
        bio: 'Systems engineer specialising in high-performance backend services with Go and Rust. I cover goroutines, channels, gRPC, Protobuf, distributed systems patterns (CQRS, event sourcing), Apache Kafka for event streaming, and building resilient microservices at scale.',
        hourlyRate: 58, qualifications: ['M.Sc Distributed Systems — ETH Zurich', 'Google SRE Alumni', 'Confluent Kafka Certified'],
        yearsOfExperience: 11, averageRating: 4.8, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[8]._id,
        subjects: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'AI', 'Natural Language Processing'],
        bio: 'AI Research Scientist with a PhD in Machine Learning. I teach Python, ML algorithms (regression, classification, clustering), deep learning with TensorFlow and PyTorch, computer vision, NLP, and transformer architectures. I help students build real AI projects and crack ML engineer interviews.',
        hourlyRate: 60, qualifications: ['PhD Machine Learning — Carnegie Mellon', 'Google AI Residency', 'Published 20+ ML papers'],
        yearsOfExperience: 8, averageRating: 4.9, totalReviews: 6, isApproved: true,
      },
      {
        userId: tutorUsers[9]._id,
        subjects: ['LLMs', 'Prompt Engineering', 'LangChain', 'RAG', 'OpenAI API', 'AI', 'Generative AI'],
        bio: 'AI Engineer focused on Large Language Models and Generative AI. I teach prompt engineering, building LLM-powered apps with LangChain, retrieval-augmented generation (RAG) with vector databases, fine-tuning models, and integrating OpenAI and open-source LLMs into production.',
        hourlyRate: 65, qualifications: ['M.Sc AI — Oxford', 'DeepLearning.AI LLMOps Specialisation', 'Hugging Face Certified'],
        yearsOfExperience: 5, averageRating: 4.8, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[10]._id,
        subjects: ['Computer Vision', 'OpenCV', 'YOLO', 'Image Processing', 'PyTorch', 'Deep Learning', 'AI'],
        bio: 'Computer Vision researcher with 6 years in object detection, image segmentation, and video analytics. I teach OpenCV fundamentals, YOLO object detection, semantic segmentation, CNN-based classification, and deploying vision models on edge devices.',
        hourlyRate: 55, qualifications: ['PhD Computer Vision — TU Delft', 'NVIDIA Deep Learning Certified', 'CVPR Paper Author'],
        yearsOfExperience: 6, averageRating: 4.6, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[11]._id,
        subjects: ['Data Structures', 'Algorithms', 'System Design', 'Competitive Programming', 'DSA', 'LeetCode'],
        bio: 'Ex-Google engineer specialising in DSA and system design interview prep. I cover arrays, linked lists, trees, graphs, dynamic programming, and advanced algorithmic patterns. My structured approach has helped 500+ students land FAANG offers.',
        hourlyRate: 55, qualifications: ['M.Sc Computer Science — Carnegie Mellon', 'Ex-Google L6 Engineer', 'ICPC Regional Finalist'],
        yearsOfExperience: 9, averageRating: 4.7, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[12]._id,
        subjects: ['Data Structures', 'Algorithms', 'Competitive Programming', 'C++', 'LeetCode', 'Codeforces', 'DSA'],
        bio: 'International competitive programmer and algorithms coach. I specialise in segment trees, advanced graph algorithms, number theory, and contest strategies for Codeforces, AtCoder, and ICPC. I have trained students from Div. 4 all the way to Grandmaster rating.',
        hourlyRate: 48, qualifications: ['Codeforces Grandmaster', 'ICPC World Finalist', 'M.Sc CS — IIT Bombay'],
        yearsOfExperience: 7, averageRating: 4.9, totalReviews: 5, isApproved: true,
      },
      {
        userId: tutorUsers[13]._id,
        subjects: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Cloud Computing'],
        bio: 'DevOps Engineer and Cloud Architect with expertise in containerisation, orchestration, and cloud-native development. I teach Docker, Kubernetes, GitHub Actions CI/CD, AWS services (EC2, S3, Lambda, ECS), Terraform, and Linux system administration.',
        hourlyRate: 48, qualifications: ['AWS Solutions Architect Professional', 'CKA — Certified Kubernetes Administrator', 'HashiCorp Terraform Certified'],
        yearsOfExperience: 10, averageRating: 4.5, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[14]._id,
        subjects: ['Google Cloud', 'GCP', 'BigQuery', 'Cloud Functions', 'Kubernetes', 'DevOps', 'Terraform'],
        bio: 'Google Cloud Professional Architect helping developers master GCP. I cover Compute Engine, Cloud Run, GKE, BigQuery, Cloud Pub/Sub, and infrastructure as code with Terraform. I prepare students for GCP certification exams and real-world cloud architecture.',
        hourlyRate: 52, qualifications: ['GCP Professional Cloud Architect', 'GCP Data Engineer', 'B.Sc Engineering — IIT Delhi'],
        yearsOfExperience: 8, averageRating: 4.6, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[15]._id,
        subjects: ['Azure', 'DevOps', 'Azure DevOps', 'CI/CD', 'Cloud Computing', 'PowerShell', 'ARM Templates'],
        bio: 'Microsoft Azure specialist and DevOps engineer. I teach Azure services (App Service, AKS, Azure Functions, CosmosDB), Azure DevOps pipelines, ARM/Bicep templates, Azure AD, and monitoring with Azure Monitor. Ideal for teams in the Microsoft ecosystem.',
        hourlyRate: 50, qualifications: ['Azure Solutions Architect Expert', 'Azure DevOps Engineer Expert', 'Microsoft MVP'],
        yearsOfExperience: 9, averageRating: 4.4, totalReviews: 2, isApproved: true,
      },
      {
        userId: tutorUsers[16]._id,
        subjects: ['React Native', 'Flutter', 'Mobile Development', 'iOS', 'Android', 'Swift', 'Kotlin'],
        bio: 'Mobile development specialist with apps published on both App Store and Play Store. I teach cross-platform development with React Native and Flutter, native iOS with Swift, native Android with Kotlin, mobile UI/UX patterns, and app store deployment.',
        hourlyRate: 42, qualifications: ['B.Sc Software Engineering — UC Berkeley', 'Google Associate Android Developer', 'Apple Certified iOS Developer'],
        yearsOfExperience: 7, averageRating: 4.4, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[17]._id,
        subjects: ['Flutter', 'Dart', 'Mobile Development', 'Firebase', 'Android', 'iOS', 'State Management'],
        bio: 'Flutter specialist with 5 published apps and 200+ students taught. I cover Dart fundamentals, Flutter widget tree, state management (Riverpod, BLoC, Provider), Firebase integration, animations, and publishing to Google Play and App Store.',
        hourlyRate: 40, qualifications: ['Google Developer Expert — Flutter', 'B.Sc IT — NUS Singapore', 'Flutter Certified Developer'],
        yearsOfExperience: 5, averageRating: 4.7, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[18]._id,
        subjects: ['Data Science', 'SQL', 'Pandas', 'Data Analytics', 'Power BI', 'Tableau', 'Statistics'],
        bio: 'Data Scientist with experience at Fortune 500 companies. I teach SQL for data analysis, Python data manipulation with Pandas and NumPy, data visualisation with Matplotlib/Seaborn, and BI tools like Power BI and Tableau. I also cover statistical analysis, A/B testing, and data pipelines.',
        hourlyRate: 40, qualifications: ['M.Sc Data Science — Columbia', 'Google Data Analytics Certificate', 'IBM Data Science Professional'],
        yearsOfExperience: 6, averageRating: 4.3, totalReviews: 2, isApproved: true,
      },
      {
        userId: tutorUsers[19]._id,
        subjects: ['Data Engineering', 'Apache Spark', 'Airflow', 'dbt', 'Snowflake', 'Data Pipelines', 'SQL'],
        bio: 'Data Engineer with expertise in building large-scale data pipelines. I teach Apache Spark for big data, Airflow for workflow orchestration, dbt for data transformation, Snowflake data warehouse, and modern lakehouse architectures. I help analysts transition into data engineering roles.',
        hourlyRate: 54, qualifications: ['Databricks Certified Data Engineer', 'dbt Certified Developer', 'M.Sc Big Data — Barcelona GSE'],
        yearsOfExperience: 8, averageRating: 4.6, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[20]._id,
        subjects: ['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Penetration Testing', 'Linux Security'],
        bio: 'Cybersecurity consultant and ethical hacker. I teach network security fundamentals, web application security (OWASP Top 10), penetration testing with Kali Linux, security auditing, cryptography, and incident response. I prepare students for CEH, CompTIA Security+, and OSCP.',
        hourlyRate: 52, qualifications: ['OSCP Certified', 'CEH — Certified Ethical Hacker', 'CompTIA Security+'],
        yearsOfExperience: 11, averageRating: 4.6, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[21]._id,
        subjects: ['Application Security', 'Bug Bounty', 'OWASP', 'Web Security', 'Reverse Engineering', 'CTF'],
        bio: 'Application security researcher and bug bounty hunter with $200k+ in reported vulnerabilities. I teach web app security (XSS, SQLi, CSRF, SSRF, IDOR), API security testing, reverse engineering with Ghidra, binary exploitation, and CTF strategies.',
        hourlyRate: 58, qualifications: ['HackerOne Top 100', 'OSWE — Web Expert', 'B.Sc CS — Warsaw University of Technology'],
        yearsOfExperience: 8, averageRating: 4.8, totalReviews: 4, isApproved: true,
      },
      {
        userId: tutorUsers[22]._id,
        subjects: ['Blockchain', 'Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'DeFi', 'Hardhat'],
        bio: 'Blockchain developer and Web3 educator with 6 years in the Ethereum ecosystem. I teach Solidity smart contract development, Hardhat and Foundry testing frameworks, ERC-20/ERC-721 tokens, DeFi protocol design, and dApp development with ethers.js and wagmi.',
        hourlyRate: 62, qualifications: ['Ethereum Foundation Grant Recipient', 'Consensys Blockchain Developer', 'M.Sc CS — IISc Bangalore'],
        yearsOfExperience: 6, averageRating: 4.7, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[23]._id,
        subjects: ['Unity', 'C#', 'Game Development', 'Unreal Engine', 'Godot', '3D Development', 'Game Design'],
        bio: 'Indie game developer and Unity expert with 4 published games. I teach Unity game development with C#, physics and collision systems, 2D/3D game mechanics, shader programming, multiplayer with Photon, and game design fundamentals. I also cover Unreal Engine and Godot.',
        hourlyRate: 38, qualifications: ['Unity Certified Professional', 'B.Sc Game Design — DigiPen', 'Epic MegaGrant Recipient'],
        yearsOfExperience: 6, averageRating: 4.5, totalReviews: 3, isApproved: true,
      },
      {
        userId: tutorUsers[24]._id,
        subjects: ['Git', 'GitHub', 'Web Development', 'Full Stack', 'MERN Stack', 'Agile', 'Scrum'],
        bio: 'Full-stack web developer and Agile coach. I teach the complete MERN stack, Git version control, GitHub workflows, Agile/Scrum project management, and building production-ready web applications from ideation to deployment.',
        hourlyRate: 35, qualifications: ['Certified Scrum Master', 'freeCodeCamp Full Stack Certificate', 'B.Sc IT — University of London'],
        yearsOfExperience: 5, averageRating: 0, totalReviews: 0, isApproved: false,
      },
    ];

    const profiles = await TutorProfile.create(profileData);
    console.log(`📚 Created ${profiles.length} tutor profiles (${profiles.filter(p => p.isApproved).length} approved)`);

    // ========== AVAILABILITY SLOTS ==========
    const allSlots = [];
    const timeSlots = [
      { startTime: '08:00', endTime: '09:00' },
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '14:00', endTime: '15:00' },
      { startTime: '15:00', endTime: '16:00' },
      { startTime: '17:00', endTime: '18:00' },
      { startTime: '18:00', endTime: '19:00' },
      { startTime: '19:00', endTime: '20:00' },
    ];

    // Create varied availability for each approved tutor
    for (let i = 0; i < 24; i++) {
      const tutor = tutorUsers[i];
      // Each tutor gets 3-5 random days, 2-4 slots per day
      const numDays = 3 + Math.floor(Math.random() * 3);
      const shuffledDays = [...DAYS].sort(() => Math.random() - 0.5).slice(0, numDays);

      for (const day of shuffledDays) {
        const numSlots = 2 + Math.floor(Math.random() * 3);
        const daySlots = [...timeSlots].sort(() => Math.random() - 0.5).slice(0, numSlots);

        for (const slot of daySlots) {
          allSlots.push({
            tutorId: tutor._id,
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          });
        }
      }
    }

    const createdSlots = await Availability.create(allSlots);
    console.log(`📅 Created ${createdSlots.length} availability slots`);

    // ========== BOOKINGS ==========
    const availableSlots = createdSlots.filter(s => !s.isBooked);
    const bookingsToCreate = [];

    const bookingConfigs = [
      { studentIdx: 0, slotIdx: 0, subject: 'React', status: 'completed' },
      { studentIdx: 0, slotIdx: 1, subject: 'JavaScript', status: 'completed' },
      { studentIdx: 1, slotIdx: 2, subject: 'Node.js', status: 'confirmed' },
      { studentIdx: 1, slotIdx: 3, subject: 'MongoDB', status: 'completed' },
      { studentIdx: 2, slotIdx: 4, subject: 'Machine Learning', status: 'completed' },
      { studentIdx: 2, slotIdx: 5, subject: 'Python', status: 'pending' },
      { studentIdx: 3, slotIdx: 6, subject: 'Data Structures', status: 'completed' },
      { studentIdx: 3, slotIdx: 7, subject: 'Algorithms', status: 'confirmed' },
      { studentIdx: 4, slotIdx: 8, subject: 'Docker', status: 'completed' },
      { studentIdx: 0, slotIdx: 9, subject: 'TypeScript', status: 'completed' },
      { studentIdx: 1, slotIdx: 10, subject: 'React Native', status: 'completed' },
      { studentIdx: 2, slotIdx: 11, subject: 'SQL', status: 'confirmed' },
      { studentIdx: 3, slotIdx: 12, subject: 'Cybersecurity', status: 'cancelled' },
      { studentIdx: 4, slotIdx: 13, subject: 'AWS', status: 'pending' },
      { studentIdx: 0, slotIdx: 14, subject: 'Spring Boot', status: 'completed' },
      { studentIdx: 1, slotIdx: 15, subject: 'CSS', status: 'pending' },
      { studentIdx: 4, slotIdx: 16, subject: 'Flutter', status: 'completed' },
      { studentIdx: 2, slotIdx: 17, subject: 'System Design', status: 'completed' },
    ];

    for (const cfg of bookingConfigs) {
      if (cfg.slotIdx >= availableSlots.length) break;

      const slot = availableSlots[cfg.slotIdx];
      const tutorProfile = profiles.find(p => p.userId.toString() === slot.tutorId.toString());
      const amount = tutorProfile ? tutorProfile.hourlyRate : 30;

      bookingsToCreate.push({
        studentId: students[cfg.studentIdx]._id,
        tutorId: slot.tutorId,
        availabilitySlotId: slot._id,
        subject: cfg.subject,
        status: cfg.status,
        paymentStatus: cfg.status === 'completed' ? 'paid' : 'unpaid',
        amount,
        notes: `Session for ${cfg.subject} help`,
      });

      // Mark slot as booked (except cancelled)
      if (cfg.status !== 'cancelled') {
        slot.isBooked = true;
        await slot.save();
      }
    }

    const bookings = await Booking.create(bookingsToCreate);
    console.log(`📖 Created ${bookings.length} bookings`);

    // ========== REVIEWS ==========
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const reviewsToCreate = [];
    const reviewComments = [
      'Excellent tutor! Explained React hooks and state management very clearly. My frontend skills improved drastically.',
      'Really helped me understand JavaScript async patterns and closures. Would book again!',
      'Great session on Node.js and Express. Built a full REST API from scratch in one session.',
      'Fantastic MongoDB tutorial! Now I understand aggregation pipelines and indexing.',
      'Best ML tutor I have had. Made gradient descent and neural networks intuitive.',
      'Good Python session. Could use more hands-on coding exercises.',
      'Amazing DSA tutor! Went through every LeetCode pattern systematically.',
      'Solid Docker and Kubernetes session. Deployed my first containerized app.',
      'TypeScript generics finally make sense! Patient and thorough explanation.',
      'React Native session was perfect. Built a working app in 2 hours.',
      'Very helpful Spring Boot session! REST API with JPA was well explained.',
      'Flutter cross-platform development made easy. Great teaching style!',
      'System design session was exactly what I needed for my interview prep.',
    ];

    for (let i = 0; i < completedBookings.length && i < reviewComments.length; i++) {
      const booking = completedBookings[i];
      const rating = 3 + Math.floor(Math.random() * 3); // 3-5 stars

      reviewsToCreate.push({
        bookingId: booking._id,
        studentId: booking.studentId,
        tutorId: booking.tutorId,
        rating,
        comment: reviewComments[i],
      });
    }

    const reviews = await Review.create(reviewsToCreate);
    console.log(`⭐ Created ${reviews.length} reviews`);

    // Recalculate average ratings for all approved tutors
    for (const tutor of tutorUsers.slice(0, 24)) {
      const tutorReviews = reviews.filter(r => r.tutorId.toString() === tutor._id.toString());
      if (tutorReviews.length > 0) {
        const avg = tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length;
        await TutorProfile.findOneAndUpdate(
          { userId: tutor._id },
          {
            averageRating: Math.round(avg * 10) / 10,
            totalReviews: tutorReviews.length,
          }
        );
      }
    }
    console.log('📊 Recalculated tutor ratings');

    // ========== SUMMARY ==========
    console.log('\n🎉 Seed completed successfully!\n');
    console.log('=== Test Accounts (all password: password123) ===');
    console.log('Admin:                         admin@tutorconnect.com');
    console.log('Students:                      alice@student.com | bob@student.com | carol@student.com');
    console.log('--- Frontend ---');
    console.log('React/Next.js:                 sarah@tutor.com');
    console.log('Vue/React/CSS:                 ethan@tutor.com');
    console.log('Angular/TypeScript:            anika@tutor.com');
    console.log('Three.js/WebGL/Creative:       carlos@tutor.com');
    console.log('--- Backend ---');
    console.log('Node.js/Express/GraphQL:       james@tutor.com');
    console.log('Java/Spring Boot:              priya@tutor.com');
    console.log('Python/Django/FastAPI:         noah@tutor.com');
    console.log('Go/Rust/Microservices:         zara@tutor.com');
    console.log('--- AI / ML ---');
    console.log('ML/Deep Learning/PyTorch:      maria@tutor.com');
    console.log('LLMs/LangChain/GenAI:          liam@tutor.com');
    console.log('Computer Vision/OpenCV/YOLO:   sofia@tutor.com');
    console.log('--- DSA / CP ---');
    console.log('DSA/System Design/LeetCode:    ahmed@tutor.com');
    console.log('Competitive Programming/C++:   ivan@tutor.com');
    console.log('--- DevOps / Cloud ---');
    console.log('AWS/Docker/Kubernetes:         lisa@tutor.com');
    console.log('Google Cloud/GCP/BigQuery:     marcus@tutor.com');
    console.log('Azure/Azure DevOps:            hana@tutor.com');
    console.log('--- Mobile ---');
    console.log('React Native/Flutter/Swift:    robert@tutor.com');
    console.log('Flutter/Dart/Firebase:         chloe@tutor.com');
    console.log('--- Data Science ---');
    console.log('Data Science/SQL/Tableau:      jennifer@tutor.com');
    console.log('Data Engineering/Spark/dbt:    omar@tutor.com');
    console.log('--- Cybersecurity ---');
    console.log('Ethical Hacking/PenTest:       michael@tutor.com');
    console.log('Bug Bounty/AppSec/OWASP:       elena@tutor.com');
    console.log('--- Other ---');
    console.log('Blockchain/Solidity/Web3:      ravi@tutor.com');
    console.log('Unity/Game Dev/C#:             jake@tutor.com');
    console.log('MERN/Full Stack (pending):     alex@tutor.com');
    console.log('================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

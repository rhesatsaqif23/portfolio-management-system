import { db } from './db'
import { projectsTable, caseStudiesTable } from '../../src/infrastructure/db/schema'

export async function clearCaseStudies() {
  await db.delete(caseStudiesTable)
  console.log('  → Cleared case studies\n')
}

export async function seedCaseStudies() {
  console.log('Seeding case studies...')

  const projectRows = await db
    .select({ id: projectsTable.id, slug: projectsTable.slug })
    .from(projectsTable)

  const projectMap = Object.fromEntries(projectRows.map((p) => [p.slug, p.id]))

  const caseStudies = [
    {
      projectId: projectMap['octosight'],
      role: 'Full-Stack Developer',
      startDate: '2026-02-01',
      endDate: '2026-06-01',
      overview:
        'OctoSight is an end-to-end anti-phishing and fraud detection prototype for digital banking, built as a capstone project for CIMB Niaga. It provides a streamlined reporting portal for customers, a hybrid AI-driven detection engine combining rule-based heuristics with machine learning, and a full admin triage workflow with analytics dashboards, RBAC, SLA monitoring, and preventive education modules.',
      problems: [
        { title: 'Phishing Detection Accuracy', description: 'Traditional rule-based systems miss sophisticated phishing attempts that mimic legitimate banking communications.' },
        { title: 'Slow Incident Response', description: 'Security teams needed hours to identify and respond to fraud incidents due to fragmented monitoring tools.' },
        { title: 'Limited User Awareness', description: 'Customers lacked accessible educational resources to recognize and avoid phishing attempts.' },
        { title: 'No Centralized Case Management', description: 'Reported incidents were scattered across emails and spreadsheets with no structured triage pipeline.' },
      ],
      solutions: [
        { title: 'Hybrid Detection Engine', description: 'Combined ML-based URL/text classification with heuristic pattern matching to achieve 94% detection accuracy across 40+ rules and 2000+ training samples.' },
        { title: 'Admin Triage Dashboard', description: 'Built a Kanban-based case management system with real-time alerts, SLA monitoring, and a 7-stage workflow pipeline.' },
        { title: 'Educational Microlearning', description: 'Created 8 interactive modules with 4 difficulty levels covering phishing examples, danger signs, and prevention steps.' },
        { title: 'Gamification System', description: 'Implemented points, streaks, badges, and 14 achievement types to encourage user engagement and security awareness.' },
      ],
      features: [
        { icon: 'Shield', title: 'Hybrid Risk Analysis', description: 'Real-time preview of risk score combining rule heuristics and ML prediction for submitted reports.' },
        { icon: 'Bell', title: 'Instant Notifications', description: 'In-app push-style notifications and Gmail SMTP-powered email alerts for status changes and password reset.' },
        { icon: 'LayoutDashboard', title: 'Admin Dashboard', description: 'Chart.js widgets tracking incident trends, modus distribution, channel breakdown, and SLA compliance.' },
        { icon: 'Kanban', title: 'Kanban Case Workflow', description: 'Drag-and-drop ticket management across 7 columns with inline assignment and CSV export.' },
        { icon: 'BookOpen', title: 'Education Modules', description: 'Microlearning content with quizzes, articles, and AI-generated personalized security recommendations.' },
        { icon: 'Award', title: 'Gamification', description: 'Points, streaks, badges, and 14 achievement types to incentivize proactive security behavior.' },
      ],
      contributions: [
        'Architected the full-stack application with Next.js frontend and FastAPI backend',
        'Implemented ML model integration for phishing URL classification using scikit-learn',
        'Designed the admin triage workflow with Kanban board and SLA monitoring system',
        'Built RESTful APIs for case management, blacklist management, and dynamic rule configuration',
        'Developed the gamification system with 14 achievement types and points-based engagement',
        'Integrated Google OAuth, email notifications, and role-based access control across 7 roles',
      ],
      results: [
        { icon: 'Target', title: '94% Detection Accuracy', description: 'Achieved 94% accuracy in detecting phishing attempts during testing with 87% ML precision.' },
        { icon: 'Clock', title: 'Sub-2 Minute Response', description: 'Reduced average incident response time from hours to under 2 minutes via real-time alerting.' },
        { icon: 'Users', title: '7 Role-Based Access Levels', description: 'Implemented RBAC with granular permissions across admin, moderator, investigator, analyst, and user roles.' },
        { icon: 'Shield', title: '40+ Detection Rules', description: 'Built comprehensive rule engine covering typosquatting, punycode, brand impersonation, and phishing keywords.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['neuroclash-gg'],
      role: 'Full-Stack Developer',
      startDate: '2026-02-01',
      endDate: '2026-03-01',
      overview:
        'NeuroClash GG is a web-based edutainment platform that transforms conventional learning into a competitive auto-battler experience. The platform features an AI-powered question generator using the Gemini API to process PDFs into structured quizzes, integrated with a real-time combat system featuring dynamic 1v1 battles, HP systems, and a StarBox comeback mechanic.',
      problems: [
        { title: 'Low Student Engagement', description: 'Traditional quiz platforms failed to maintain student interest for extended periods, leading to shallow learning experiences.' },
        { title: 'No Competitive Element', description: 'Learning platforms lacked the social and competitive features that drive repeat engagement and peer motivation.' },
        { title: 'Manual Question Creation', description: 'Educators spent significant time creating quiz content manually with no automation or material reuse.' },
      ],
      solutions: [
        { title: 'Auto-Battler Mechanics', description: 'Introduced turn-based auto-battler gameplay where correct answers power in-game attacks against opponents.' },
        { title: 'AI Question Generation', description: 'Integrated Gemini API to dynamically generate structured multiple-choice questions from any uploaded PDF or template.' },
        { title: 'Real-Time Multiplayer', description: 'Built Supabase Realtime-powered 1v1 matchmaking with synchronized timers and damage calculation.' },
        { title: 'StarBox Comeback Mechanic', description: 'Designed a fairness system where the lowest HP player gets priority to pick game-changing items at specific intervals.' },
      ],
      features: [
        { icon: 'Swords', title: 'Auto-Battler Combat', description: 'Correct answers charge your hero\'s abilities in real-time PvP battles with HP and damage systems.' },
        { icon: 'Brain', title: 'AI-Powered Questions', description: 'Endless question variety generated by Gemini API from any uploaded PDF across any subject.' },
        { icon: 'Globe', title: 'Multiplayer Modes', description: 'Real-time 1v1 or 1v1v1 matchmaking against other students with live leaderboard tracking.' },
        { icon: 'Bot', title: 'Solo Mode vs AI', description: 'Practice offline against Prof. Bubu, an adaptive system bot with dynamic difficulty scaling.' },
        { icon: 'Box', title: 'StarBox System', description: 'Comeback mechanic with game-changing items like Knowledge Book, Healing Potion, and Strong Shield.' },
      ],
      contributions: [
        'Developed the frontend UI with Next.js and Tailwind CSS for the battle arena, dashboard, and avatar selection',
        'Integrated Gemini API for dynamic question generation and difficulty scaling from uploaded PDFs',
        'Implemented real-time multiplayer game state management using Supabase Realtime and WebSocket polling',
        'Designed the auto-battler combat system with HP tracking, damage calculation, and StarBox mechanics',
        'Built the room creation flow with customizable parameters including max players and question count',
        'Architected Route-Repository-Service clean architecture for separation of concerns across game logic',
      ],
      results: [
        { icon: 'Trophy', title: 'Top 13 Finalist', description: 'Selected as a Top 13 finalist at FICPACT CUP 2026 Web Development competition among national participants.' },
        { icon: 'Zap', title: 'Real-Time Synchronization', description: 'Achieved sub-100ms latency for game state updates using Supabase Realtime WebSockets.' },
        { icon: 'Users', title: 'Multiplayer Scalability', description: 'Support for up to 40 concurrent players per room with stable real-time state management.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['raion-web'],
      role: 'Lead Front-End Developer',
      startDate: '2026-01-01',
      endDate: null,
      overview:
        'Raion Community Website is the official digital presence for Raion Community, a student organization at the Faculty of Computer Science, Brawijaya University. The platform serves as a comprehensive full-stack web application powering content management, event registration, dynamic form building, product catalog, and internal administrative workflows.',
      problems: [
        { title: 'Manual Event Management', description: 'Previously, all event registrations and data collection were handled manually through Google Forms with no centralized system.' },
        { title: 'No Centralized CMS', description: 'Community information, member management, and announcements were scattered across multiple platforms and documents.' },
        { title: 'Legacy Codebase Maintenance', description: 'The existing website had accumulated technical debt with outdated dependencies and inconsistent architecture.' },
        { title: 'Limited Form Capabilities', description: 'Custom registration forms and surveys required developer intervention for every new data collection need.' },
      ],
      solutions: [
        { title: 'Admin CMS Dashboard', description: 'Built a full-featured CMS with CRUD operations for events, members, announcements, testimonials, and products.' },
        { title: 'Dynamic Form Builder', description: 'Developed a flexible form management system supporting various question types, file uploads, and conditional logic.' },
        { title: 'Modern Architecture Migration', description: 'Transitioned from legacy code to Next.js 16 with App Router, Drizzle ORM, and TypeScript strict mode.' },
        { title: 'Role-Based Access Control', description: 'Implemented authentication and authorization with distinct admin and member roles for secure content management.' },
      ],
      features: [
        { icon: 'Layout', title: 'CMS Dashboard', description: 'Complete content management for events, members, products, testimonials, and site pages with media upload.' },
        { icon: 'FileText', title: 'Form Builder', description: 'Dynamic form creation with customizable fields, submission tracking, and CSV/XLSX data export.' },
        { icon: 'Calendar', title: 'Event Management', description: 'Full event lifecycle from creation and registration tracking to attendance management and analytics.' },
        { icon: 'ShoppingBag', title: 'Order Craft System', description: 'Software house service ordering and booking workflow for Raion Craft product offerings.' },
        { icon: 'Users', title: 'Member Management', description: 'Role-based member directory with profiles, activity tracking, and administrative controls.' },
      ],
      contributions: [
        'Led frontend development for the complete website migration from legacy codebase to modern architecture',
        'Built the admin CMS dashboard with full CRUD functionality, media upload support, and API integration',
        'Developed the form management system supporting multiple question types, file uploads, and data export',
        'Implemented responsive design and accessibility best practices across all public and admin pages',
        'Architected clean module structure with repository-service separation for maintainable backend logic',
        'Integrated SEO metadata, dynamic OG images, and semantic HTML for search engine optimization',
      ],
      results: [
        { icon: 'Rocket', title: 'Modern Codebase', description: 'Successfully migrated from legacy code to Next.js with TypeScript, Drizzle ORM, and strict type safety.' },
        { icon: 'Zap', title: '10x Faster Workflows', description: 'Reduced event registration processing time from days to minutes with automated form management.' },
        { icon: 'Shield', title: 'Type-Safe Architecture', description: 'Achieved end-to-end type safety from database schema through Zod validation to React components.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['lwu'],
      role: 'Web Developer',
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      overview:
        'Learning With Us (LWU) Web is a premium online English education platform designed to showcase both digital products and educational services. Built as a modern, responsive, and SEO-optimized website within a 24-hour sprint, the platform serves as the definitive digital presence for LWU, which has mentored over 1,000 students globally.',
      problems: [
        { title: 'Outdated Digital Presence', description: 'The existing website did not reflect the premium quality of LWU\'s educational services and digital products.' },
        { title: 'Poor Conversion Flow', description: 'Visitors struggled to navigate from initial interest to enrollment due to unclear call-to-actions and information architecture.' },
        { title: 'No Dynamic Content Management', description: 'Product catalog and service offerings were static HTML pages requiring manual updates for every change.' },
      ],
      solutions: [
        { title: 'Premium Visual Design', description: 'Architected a high-end design system inspired by world-class educational templates with consistent typography and spacing.' },
        { title: 'Strategic UX Flow', description: 'Implemented clear conversion paths from landing to enrollment with strategic CTAs, social proof, and testimonial sections.' },
        { title: 'Dynamic Product Catalog', description: 'Built a centralized data-driven product catalog with filtering capabilities for ebooks and digital resources.' },
        { title: 'Performance Optimization', description: 'Optimized Core Web Vitals with next/image, priority loading, and efficient bundling for fast LCP and FID.' },
      ],
      features: [
        { icon: 'GraduationCap', title: 'Service Showcase', description: 'Detailed breakdown of course offerings including IELTS preparation, General English, and specialized webinars.' },
        { icon: 'BookOpen', title: 'Product Catalog', description: 'Dynamic listing of ebooks and digital resources with advanced filtering and detailed product pages.' },
        { icon: 'Users', title: 'About & Team', description: 'Comprehensive company story, instructor profiles, and embedded vision-mission values.' },
        { icon: 'MessageSquare', title: 'Contact Portal', description: 'Functional contact page with integrated location info and streamlined inquiry submission.' },
        { icon: 'Sparkles', title: 'Smooth Animations', description: 'Scroll-triggered entrance animations and interactive micro-interactions powered by Framer Motion.' },
      ],
      contributions: [
        'Architected and developed the complete Next.js 14 website within a 24-hour sprint to production-ready standard',
        'Designed and implemented a premium UI system with consistent design tokens and responsive layouts',
        'Built dynamic product catalog pages with filtering capabilities and detailed product routes',
        'Integrated Framer Motion animations for smooth scroll-triggered entrance effects and micro-interactions',
        'Implemented SEO best practices using Next.js Metadata API, semantic HTML, and optimized images',
        'Created reusable component library including ProductCard, SectionHeading, and layout primitives',
      ],
      results: [
        { icon: 'Rocket', title: 'Production-Ready in 24 Hours', description: 'Delivered a fully functional, SEO-optimized, and responsive website within a single-day sprint.' },
        { icon: 'Zap', title: 'Optimized Core Web Vitals', description: 'Achieved fast LCP and FID through image optimization, priority loading, and efficient bundling.' },
        { icon: 'Smartphone', title: 'Fully Responsive', description: 'Mobile-first design supporting all screen sizes from 375px to 1440px+ with adaptive layouts.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['gamevault'],
      role: 'Front-End Developer',
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      overview:
        'GameVault is a modern, premium web-based game catalog platform designed for the Indonesian gamer community. Built as part of the Ariverse Studio frontend internship technical test, it serves as an interactive hub where users can discover new games, explore comprehensive game details, filter by genre and platform, and curate a personal wishlist.',
      problems: [
        { title: 'No Centralized Game Discovery', description: 'Indonesian gamers lacked a dedicated, visually appealing platform to discover and catalog games across multiple genres and platforms.' },
        { title: 'Poor Search and Filter Experience', description: 'Existing game databases had clunky filtering with no URL-persistent state for easy sharing of search results.' },
        { title: 'No Persistent Wishlist', description: 'Gamers had no way to save and organize their game interests across browsing sessions.' },
      ],
      solutions: [
        { title: 'Advanced Filtering System', description: 'Built real-time debounced search with multi-select filters for genre, platform, price, and rating, synchronized with URL parameters.' },
        { title: 'LocalStorage Wishlist', description: 'Implemented a persistent wishlist using React Context and localStorage for cross-session state preservation.' },
        { title: 'Premium Visual Design', description: 'Designed a gaming-inspired UI with custom cursor system, dark/light mode, and fluid micro-interactions.' },
        { title: 'Skeleton Loading States', description: 'Created detailed skeleton screens for grid and detail views to ensure smooth perceived performance.' },
      ],
      features: [
        { icon: 'Search', title: 'Advanced Discovery', description: 'Real-time debounced search with multi-select genre, platform, price, and rating filters synced to URL.' },
        { icon: 'Heart', title: 'Persistent Wishlist', description: 'Save and organize games with local storage persistence across sessions using React Context.' },
        { icon: 'Sun', title: 'Dark/Light Mode', description: 'Full theme toggle seamlessly integrated with the UI design system for personalized browsing.' },
        { icon: 'Image', title: 'Interactive Lightbox', description: 'Custom-built full-screen lightbox for viewing high-quality game screenshots in the detail page.' },
        { icon: 'MousePointer', title: 'Custom Cursor', description: 'Unique unified custom cursor system enhancing the premium gaming aesthetic across the platform.' },
      ],
      contributions: [
        'Built the complete Next.js 15 application with App Router, TypeScript, and Tailwind CSS from scratch',
        'Implemented advanced filtering system with URL-synchronized state for shareable search results',
        'Developed persistent wishlist feature using React Context and localStorage with cross-session persistence',
        'Created comprehensive skeleton loading states for both grid and detail views',
        'Designed and implemented dark/light mode toggle with system preference detection',
        'Wrote 12+ Vitest unit tests covering filtering logic, wishlist operations, and UI components',
      ],
      results: [
        { icon: 'Star', title: 'Premium User Experience', description: 'Delivered a gaming-grade UI with custom cursor, fluid animations, and responsive design across all devices.' },
        { icon: 'Link', title: 'URL-Synced Filters', description: 'All filter states persist in URL parameters enabling deep linking and browser history navigation.' },
        { icon: 'CheckCircle', title: '12+ Unit Tests', description: 'Comprehensive test coverage for filtering logic, wishlist operations, and UI component rendering.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['jw-talk'],
      role: 'Full-Stack Developer',
      startDate: '2026-02-01',
      endDate: '2026-02-01',
      overview:
        'JW-Talk is a real-time, secure group chat web application built with a decoupled client-server architecture. It enables multiple users to communicate instantly across shared chat rooms with JWT-based authentication and WebSocket-powered messaging, featuring room management, persistent chat history, and route protection.',
      problems: [
        { title: 'No Real-Time Communication', description: 'Existing group chat solutions required page refreshes to see new messages, creating a poor user experience.' },
        { title: 'Authentication Integration', description: 'Chat applications often had weak security with no structured authentication for WebSocket connections.' },
        { title: 'Race Condition on Room Creation', description: 'Users could accidentally create duplicate rooms by clicking the create button multiple times.' },
        { title: 'No Persistent Message History', description: 'Messages were lost on page refresh with no database-backed storage for chat history.' },
      ],
      solutions: [
        { title: 'WebSocket Real-Time Chat', description: 'Implemented Socket.io bidirectional communication for instant message broadcasting across room participants.' },
        { title: 'JWT WebSocket Handshake', description: 'Validated JWT tokens during Socket.io connection handshake to prevent unauthorized socket connections.' },
        { title: 'Race Condition Prevention', description: 'Added loading state management on room creation to prevent duplicate submissions from rapid clicks.' },
        { title: 'Persistent Chat History', description: 'Stored all messages in PostgreSQL via Prisma ORM with chronological ordering and auto-scroll to latest.' },
      ],
      features: [
        { icon: 'MessageSquare', title: 'Real-Time Group Chat', description: 'Instant bidirectional messaging via Socket.io WebSockets with live participant updates.' },
        { icon: 'Lock', title: 'JWT Authentication', description: 'Secure stateless token-based auth with auto-injection via Axios interceptors on every request.' },
        { icon: 'DoorOpen', title: 'Room Management', description: 'Create new chat rooms or join existing ones by Room ID with persistent participant tracking.' },
        { icon: 'History', title: 'Chat History', description: 'Persistent message storage loaded from PostgreSQL on room join with chronological display.' },
        { icon: 'Shield', title: 'Route Protection', description: 'Unauthenticated users are automatically redirected to the login page via AuthContext middleware.' },
      ],
      contributions: [
        'Built the complete decoupled architecture with Express.js backend and Next.js frontend',
        'Implemented Socket.io real-time messaging with JWT-validated WebSocket handshake for secure connections',
        'Designed PostgreSQL database schema with User, Room, and Message models using Prisma ORM',
        'Developed JWT authentication system with bcrypt password hashing and Axios interceptor integration',
        'Created room management system with join-by-ID flow and race condition prevention on creation',
        'Built responsive chat UI with auto-scroll, chronological message ordering, and loading states',
      ],
      results: [
        { icon: 'Zap', title: 'Real-Time Delivery', description: 'Achieved instant message delivery across all connected clients using Socket.io WebSocket broadcasting.' },
        { icon: 'Lock', title: 'End-to-End Auth', description: 'JWT validation at both REST API and WebSocket handshake layers for comprehensive security.' },
        { icon: 'Database', title: 'Persistent Storage', description: 'All messages stored in PostgreSQL with full history available on room rejoin.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['zenpilates'],
      role: 'Full-Stack Developer',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
      overview:
        'ZenPilates is a full-stack web application simulating an end-to-end Pilates studio reservation system. It enables users to browse classes, select available dates and timeslots, choose an available court, complete payment, and manage reservation history — with double-booking prevention and payment-first confirmation flow.',
      problems: [
        { title: 'Double Booking', description: 'Manual booking systems allowed multiple customers to reserve the same slot, leading to scheduling conflicts and customer dissatisfaction.' },
        { title: 'No Payment Integration', description: 'Reservations were made without payment confirmation, resulting in high no-show rates and revenue uncertainty.' },
        { title: 'Complex State Transitions', description: 'Booking states needed careful design to prevent invalid transitions between pending, confirmed, and canceled statuses.' },
      ],
      solutions: [
        { title: 'Availability Validation Engine', description: 'Built a multi-layer validation system checking date, timeslot, and court availability before confirming any booking.' },
        { title: 'Midtrans Payment Gateway', description: 'Integrated Midtrans Snap for payment-first booking confirmation, requiring successful payment before reservation is confirmed.' },
        { title: 'Clean Architecture Backend', description: 'Implemented Golang backend with domain, usecase, repository, and delivery layers for clear separation of concerns.' },
        { title: 'JWT Authentication', description: 'Protected booking, payment, and history pages behind JWT-based authentication for secure user sessions.' },
      ],
      features: [
        { icon: 'Calendar', title: 'Dynamic Scheduling', description: 'Browse available dates and timeslots with real-time availability updates based on existing reservations.' },
        { icon: 'Dumbbell', title: 'Class Selection', description: 'Browse Pilates classes with detailed information and select the perfect session for your schedule.' },
        { icon: 'CreditCard', title: 'Payment Integration', description: 'Secure payment processing via Midtrans Snap before booking confirmation with status tracking.' },
        { icon: 'History', title: 'Reservation History', description: 'View all completed and pending bookings with status tracking and detailed information.' },
        { icon: 'Shield', title: 'Double Booking Prevention', description: 'Multi-layer validation ensures no two customers can book the same court at the same time.' },
      ],
      contributions: [
        'Architected the full-stack reservation system with Next.js frontend and Golang backend',
        'Implemented multi-layer availability validation engine preventing double bookings across date, timeslot, and court',
        'Integrated Midtrans Snap payment gateway with payment-first booking confirmation flow',
        'Designed clean architecture backend with domain, usecase, repository, and delivery layers',
        'Built JWT authentication middleware protecting all booking and payment endpoints',
        'Developed responsive frontend with progressive booking state management and user-friendly UX',
      ],
      results: [
        { icon: 'CheckCircle', title: 'Zero Double Bookings', description: 'Multi-layer validation system completely eliminated scheduling conflicts and double bookings.' },
        { icon: 'CreditCard', title: 'Payment-First Flow', description: 'Implemented real-world payment integration ensuring confirmed revenue for every reservation.' },
        { icon: 'Code', title: 'Clean Architecture', description: 'Golang backend with strict separation of concerns for maintainability and testability.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['swara-ibu'],
      role: 'Mobile Developer',
      startDate: '2025-07-01',
      endDate: '2025-07-01',
      overview:
        'Swara Ibu is a mobile application that supports mothers experiencing postpartum depression through voice-based emotional analysis. Users express their feelings via voice input, which is processed using speech recognition and emotion analysis to detect stress levels, classify mood states, identify potential crisis phases, and provide personalized support suggestions. In urgent cases, the app sends emergency alerts to trusted family members.',
      problems: [
        { title: 'Undetected Postpartum Depression', description: 'Postpartum depression often goes undetected due to limited emotional support and low awareness of early symptoms.' },
        { title: 'No Accessible Mental Health Tools', description: 'New mothers lacked accessible, private tools to monitor their emotional well-being from home.' },
        { title: 'Delayed Crisis Intervention', description: 'Family members were often unaware of critical emotional states until it was too late for timely intervention.' },
      ],
      solutions: [
        { title: 'Voice-Based Emotion Analysis', description: 'Developed AI pipeline using Whisper for speech-to-text and Librosa for audio feature extraction to detect emotional distress.' },
        { title: 'Crisis Detection & Emergency Alerts', description: 'Built crisis phase detection using Sentence-BERT semantic analysis that triggers emergency alerts to family members.' },
        { title: 'Companion Access Mode', description: 'Designed a secure companion dashboard allowing trusted family members to view summarized emotional conditions.' },
        { title: 'Gemini AI Recommendations', description: 'Integrated Gemini AI to generate personalized emotional support suggestions based on detected mood and stress levels.' },
      ],
      features: [
        { icon: 'Mic', title: 'Voice Recognition & Analysis', description: 'Analyzes voice input to detect emotional stress and potential mental health risks using AI-powered processing.' },
        { icon: 'AlertTriangle', title: 'Emergency Alert', description: 'Triggers automatic alerts to closest family members when high-risk emotional states are detected.' },
        { icon: 'LineChart', title: 'Mood Tracking', description: 'Tracks emotional changes over time to help users and companions understand mental health patterns.' },
        { icon: 'Users', title: 'Companion Access Mode', description: 'Allows trusted family members to view summarized emotional conditions with secure verification flow.' },
        { icon: 'Brain', title: 'AI-Powered Insights', description: 'Gemini AI generates personalized recommendations and coping strategies based on emotional analysis.' },
      ],
      contributions: [
        'Designed the application UI/UX flow and implemented the Android interface using Jetpack Compose',
        'Integrated Firebase Authentication and Realtime Database for secure user data and session management',
        'Connected the mobile app with FastAPI backend for AI-powered voice analysis and emotion detection',
        'Built the companion access mode with secure verification flow for family member access',
        'Collaborated with backend and AI teams during a fully remote 5-day hackathon',
        'Implemented Gemini AI integration on the mobile app for personalized emotional support responses',
      ],
      results: [
        { icon: 'Trophy', title: '1st Place Winner', description: 'Awarded 1st Place at the SLASHCOM Android Hackathon National Competition 2025.' },
        { icon: 'Heart', title: 'Social Impact', description: 'Delivered a functional AI-powered mental health prototype addressing real-world postpartum depression challenges.' },
        { icon: 'Zap', title: 'AI Integration', description: 'Successfully integrated three AI services: Whisper, Librosa-based emotion analysis, and Gemini recommendations.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['sabi'],
      role: 'Mobile Developer',
      startDate: '2025-02-01',
      endDate: '2025-03-01',
      overview:
        'SABI is a mobile-based waste management application that encourages sustainable behavior through point rewards, marketplace transactions, and community-driven waste handling. The platform enables users to exchange sorted waste for points, redeem rewards, donate to orphanages, purchase UMKM products, and access educational content about recycling.',
      problems: [
        { title: 'Ineffective Waste Management', description: 'Waste management in Malang City remained ineffective due to low public awareness and manual collection processes.' },
        { title: 'No Digital Incentive System', description: 'Citizens lacked motivation to sort and recycle waste without a tangible reward or recognition system.' },
        { title: 'Limited UMKM Market Access', description: 'Local recycling UMKM struggled to reach customers and market their recycled products effectively.' },
      ],
      solutions: [
        { title: 'Waste-to-Point Reward System', description: 'Built a points-based incentive system where users earn rewards for sorting and submitting waste, redeemable for cash, products, or donations.' },
        { title: 'UMKM Marketplace Integration', description: 'Created a marketplace platform for UMKM recycled products, supporting local economic growth and sustainability.' },
        { title: 'Gamification & Daily Challenges', description: 'Implemented daily eco-challenges and goal tracking to maintain consistent recycling behavior and user engagement.' },
        { title: 'Waste Pickup Scheduling', description: 'Developed a request-based waste pickup system for donations over 5kg with scheduled collection routes.' },
      ],
      features: [
        { icon: 'Recycle', title: 'Waste-to-Point System', description: 'Exchange sorted waste into points redeemable as cash, UMKM products, or charitable donations.' },
        { icon: 'ShoppingBag', title: 'Recycled Product Marketplace', description: 'Browse and purchase UMKM recycled products supporting local sustainable businesses.' },
        { icon: 'Truck', title: 'Waste Pickup Scheduling', description: 'Request scheduled waste pickup for large quantities with route visualization on an interactive map.' },
        { icon: 'Target', title: 'Gamification & Challenges', description: 'Daily eco-challenges and goal tracking to build consistent recycling habits.' },
        { icon: 'Heart', title: 'Donation System', description: 'Donate earned points or money to orphanages and community programs.' },
        { icon: 'BookOpen', title: 'Environmental Education', description: 'Educational content on waste management practices and recycling importance via external links.' },
      ],
      contributions: [
        'Implemented core application business logic and data flow using Kotlin and Jetpack Compose',
        'Integrated Firebase Authentication and Realtime Database with two-way data synchronization',
        'Applied Clean Architecture principles for scalable and maintainable code structure',
        'Handled data synchronization between Firebase and UI components using reactive streams',
        'Collaborated with designers and product team to translate business rules into functional features',
        'Supported media upload integration using UploadCare for waste evidence images',
      ],
      results: [
        { icon: 'Rocket', title: '90% MVP Completion', description: 'Delivered 90% of planned MVP features within a tight 3-week development timeline.' },
        { icon: 'Users', title: 'Community Impact', description: 'Built a platform connecting citizens, recycling communities, and UMKM for sustainable waste management.' },
        { icon: 'Award', title: 'Accepted as Raion Member', description: 'Project served as internship final evaluation leading to acceptance as an App Programmer at Raion Community.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['zelow'],
      role: 'Mobile Developer',
      startDate: '2025-05-01',
      endDate: '2025-08-01',
      overview:
        'Zelow is a mobile application developed as part of Raion Revival 2025 to reduce food waste by connecting UMKM culinary businesses with consumers through discounted surplus food offerings. The platform enables UMKM to sell surplus food through flash sales, surprise boxes, and location-based food discovery, turning food surplus into economic opportunities.',
      problems: [
        { title: 'Food Waste Crisis', description: 'Food waste contributed more than 50% of total waste in Malang, with UMKM suffering losses from unsold surplus food.' },
        { title: 'No Digital Distribution Channel', description: 'UMKM culinary businesses lacked efficient digital channels to distribute surplus food before it became waste.' },
        { title: 'Abandoned Codebase', description: 'The project was inherited as an unfinished application from a previous team with no documentation and inconsistent architecture.' },
      ],
      solutions: [
        { title: 'Flash Sale Surplus Food', description: 'Enabled UMKM to sell surplus food at discounted prices through time-limited flash sales with dynamic pricing.' },
        { title: 'Surprise Box Model', description: 'Introduced mystery food packages at lower prices to reduce food stigma and increase sales efficiency.' },
        { title: 'Codebase Recovery & Restructuring', description: 'Led the analysis and restructuring of the inherited codebase, establishing consistent architecture and documentation.' },
        { title: 'Location-Based Discovery', description: 'Implemented nearby UMKM discovery using location services to connect consumers with local food options.' },
      ],
      features: [
        { icon: 'Zap', title: 'Flash Sale Surplus Food', description: 'Time-limited discounted offerings from UMKM selling surplus food before it becomes waste.' },
        { icon: 'Gift', title: 'Surprise Box', description: 'Mystery food packages at reduced prices combining unsold items for value-conscious consumers.' },
        { icon: 'MapPin', title: 'Nearby UMKM Discovery', description: 'Location-based feature helping users find nearby UMKM offering discounted surplus food.' },
        { icon: 'Star', title: 'Rating & Review System', description: 'Builds trust and transparency with UMKM ratings, reviews, and quality feedback.' },
        { icon: 'MessageCircle', title: 'Chat with Seller', description: 'Direct communication between consumers and UMKM for pickup coordination and inquiries.' },
      ],
      contributions: [
        'Led the continuation of an unfinished mobile application project inherited from a previous team',
        'Acted as technical leader in a programmer-only team while maintaining active coding responsibilities',
        'Analyzed and restructured existing application flow, architecture, and codebase with no prior documentation',
        'Implemented and refined core mobile features using Flutter and Dart',
        'Bridged product-level decision making and technical implementation as team lead',
        'Collaborated with team members to align technical execution with product goals and timeline',
      ],
      results: [
        { icon: 'Recycle', title: 'Food Waste Reduction', description: 'Created a platform enabling UMKM to minimize losses from unsold food inventory through digital distribution.' },
        { icon: 'Building', title: 'UMKM Empowerment', description: 'Empowered local culinary businesses with a digital channel to reach consumers and reduce food waste.' },
        { icon: 'Code', title: 'Codebase Recovery', description: 'Successfully recovered and restructured an undocumented inherited codebase into a maintainable application.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['immunify'],
      role: 'Mobile Developer',
      startDate: '2025-10-01',
      endDate: '2025-11-01',
      overview:
        'Immunify is a mobile application designed to help parents manage and monitor their children\'s vaccination schedules more effectively. The application provides structured vaccine information, immunization reminders, and access to nearby healthcare facilities, aiming to increase awareness and compliance with childhood vaccination programs.',
      problems: [
        { title: 'Missed Vaccination Schedules', description: 'Parents often forgot or missed scheduled vaccinations due to busy lifestyles and lack of structured reminders.' },
        { title: 'Scattered Vaccine Information', description: 'Vaccination records and schedules were kept on paper or scattered across multiple sources with no centralization.' },
        { title: 'Limited Healthcare Facility Info', description: 'Parents struggled to find nearby clinics and healthcare centers providing specific vaccinations.' },
      ],
      solutions: [
        { title: 'Structured Vaccination Schedule', description: 'Built a comprehensive vaccine information system with age-based scheduling and milestone tracking.' },
        { title: 'Smart Reminder System', description: 'Implemented push notifications and reminders for upcoming vaccinations based on the child\'s age and vaccine type.' },
        { title: 'Location-Based Facility Finder', description: 'Integrated Fused Location Provider and OpenStreetMap to help users locate nearby clinics and healthcare centers.' },
        { title: 'Digital Vaccination Records', description: 'Created a centralized digital record system for tracking completed vaccinations and upcoming schedules.' },
      ],
      features: [
        { icon: 'Syringe', title: 'Vaccine Information', description: 'Comprehensive vaccine database with age-appropriate scheduling, descriptions, and milestone tracking.' },
        { icon: 'Bell', title: 'Immunization Reminders', description: 'Smart push notifications for upcoming vaccinations based on individual child schedules.' },
        { icon: 'Map', title: 'Healthcare Facility Locator', description: 'Location-based clinic discovery using Fused Location Provider and OpenStreetMap integration.' },
        { icon: 'ClipboardList', title: 'Digital Records', description: 'Centralized digital vaccination records with completion tracking and history export.' },
      ],
      contributions: [
        'Built the complete Android application using Jetpack Compose following MVVM architecture patterns',
        'Implemented Fused Location Provider and OSMDroid for location-based healthcare facility discovery',
        'Integrated Firebase services for authentication, data storage, and push notification delivery',
        'Transformed UI/UX designs from BNCC HMM team into fully functional application screens',
        'Designed the vaccination schedule data model with age-based milestone calculations',
      ],
      results: [
        { icon: 'CheckCircle', title: 'Vaccination Compliance', description: 'Created a tool that helps parents track and complete their children\'s vaccination schedules on time.' },
        { icon: 'MapPin', title: 'Location Integration', description: 'Successfully integrated real-time location services for nearby healthcare facility discovery.' },
        { icon: 'Star', title: 'Academic Excellence', description: 'Delivered as a final project for the Mobile Application Development course with strong execution.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['optifind'],
      role: 'Front-End Developer',
      startDate: '2025-09-01',
      endDate: '2025-11-01',
      overview:
        'OptiFind is a web-based Lost and Found platform rebuilt from Found It! using a modern tech stack for improved scalability, accessibility, and user experience. The platform introduces a public searchable system with verified user access, optimized indexing, and a user-friendly landing page ensuring reports remain discoverable and well-organized.',
      problems: [
        { title: 'Limited Discoverability', description: 'Lost and found reports were shared on social media and lost visibility quickly with no structured search system.' },
        { title: 'No User Verification', description: 'Anyone could post claims without verification, leading to false claims and untrustworthy recoveries.' },
        { title: 'Outdated Technology', description: 'The original Found It! platform used Laravel with limited scalability and a dated user experience.' },
      ],
      solutions: [
        { title: 'Modern Tech Stack Migration', description: 'Rebuilt the platform using Next.js, TypeScript, and Supabase for improved performance, scalability, and developer experience.' },
        { title: 'Verified User System', description: 'Implemented authentication and verified user profiles to build trust in the recovery process.' },
        { title: 'Optimized Search & Indexing', description: 'Built a searchable system with optimized indexing and filtering by category, location, and time.' },
        { title: 'Responsive Landing Page', description: 'Designed an engaging landing page with clear call-to-actions and intuitive navigation for first-time users.' },
      ],
      features: [
        { icon: 'Search', title: 'Searchable Reports', description: 'Optimized search with filtering by category, location, and time for quick discovery of lost and found items.' },
        { icon: 'Shield', title: 'Verified User Access', description: 'Authenticated user profiles with verification to ensure trustworthy recovery claims and communications.' },
        { icon: 'Layers', title: 'Category Organization', description: 'Structured categorization of lost and found items for efficient browsing and report management.' },
        { icon: 'MessageSquare', title: 'Direct Contact', description: 'In-platform communication between finders and owners for streamlined item recovery coordination.' },
        { icon: 'Sparkles', title: 'Modern UI/UX', description: 'Responsive, motion-enhanced interface with intuitive user flow and engaging landing page design.' },
      ],
      contributions: [
        'Built responsive and intuitive frontend interface using Next.js and TypeScript for optimal user experience',
        'Integrated Supabase as backend service for authentication, public access, and scalable data handling',
        'Implemented motion-based interactions and responsive design for cross-device compatibility',
        'Optimized user flow with clear navigation paths from landing page to report discovery and submission',
        'Collaborated with team to align frontend implementation with backend API contracts',
      ],
      results: [
        { icon: 'Trophy', title: 'Top 5 Finalist', description: 'Achieved Top 5 Finalist position at IT FEST UMK Web Development Competition 2025 at national level.' },
        { icon: 'Rocket', title: 'Modern Architecture', description: 'Successfully evolved from Laravel to modern Next.js stack with improved performance and developer experience.' },
        { icon: 'Zap', title: 'Enhanced Discoverability', description: 'Built optimized search and indexing system for efficient lost and found item discovery.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['hearme'],
      role: 'Mobile Developer',
      startDate: '2025-09-01',
      endDate: '2025-09-01',
      overview:
        'HearMe is a mobile application designed to help students recognize early signs of stress and depression through voice-based analysis. Users record their voice while answering guided questions, and the system analyzes speech patterns to detect stress levels, then provides personalized activity recommendations and access to professional counseling services.',
      problems: [
        { title: 'Undiagnosed Student Stress', description: 'Many students failed to recognize early signs of stress and depression, leading to deteriorating mental health.' },
        { title: 'Limited Mental Health Resources', description: 'Students lacked accessible, private tools to assess their mental well-being and find professional help.' },
        { title: 'Stigma Around Seeking Help', description: 'Social stigma prevented students from openly discussing mental health concerns or seeking counseling.' },
      ],
      solutions: [
        { title: 'Voice-Based Stress Analysis', description: 'Built an AI-powered system analyzing voice recordings for speech patterns indicative of stress and emotional states.' },
        { title: 'Guided Assessment Questions', description: 'Designed structured guided questions that help users articulate their feelings for more accurate analysis.' },
        { title: 'Personalized Recommendations', description: 'Integrated Gemini API to generate tailored activity recommendations and coping strategies based on analysis results.' },
        { title: 'Professional Counseling Access', description: 'Provided direct access to professional counseling services and resources for users needing additional support.' },
      ],
      features: [
        { icon: 'Mic', title: 'Voice Analysis', description: 'Record responses to guided questions and analyze speech patterns for stress and depression indicators.' },
        { icon: 'ClipboardCheck', title: 'Guided Assessment', description: 'Structured questions designed to help users articulate feelings and enable accurate emotional analysis.' },
        { icon: 'Sparkles', title: 'Personalized Recommendations', description: 'AI-generated activity suggestions and coping strategies based on individual stress analysis results.' },
        { icon: 'Phone', title: 'Counseling Access', description: 'Direct access to professional mental health counseling services and support resources.' },
      ],
      contributions: [
        'Built the Android application using Jetpack Compose and Firebase with Clean Architecture',
        'Integrated Gemini API and FastAPI backend for stress analysis and recommendation processing',
        'Designed the guided assessment question flow for optimal voice analysis accuracy',
        'Implemented Firebase Authentication and Realtime Database for secure user data management',
        'Collaborated with team members during Raion Hackjam 2025 to deliver the complete solution',
      ],
      results: [
        { icon: 'Heart', title: 'Mental Health Impact', description: 'Created an accessible tool for students to privately assess and understand their mental well-being.' },
        { icon: 'Zap', title: 'AI Integration', description: 'Successfully integrated voice analysis, Gemini API, and FastAPI for comprehensive stress detection pipeline.' },
        { icon: 'Users', title: 'Hackjam Delivery', description: 'Completed functional prototype within Raion Hackjam 2025 timeframe with cross-functional team collaboration.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['found-it'],
      role: 'Full-Stack Developer',
      startDate: '2025-05-01',
      endDate: '2025-05-01',
      overview:
        'Found It! is a web-based Lost and Found application designed to centralize reports of lost and found items within the campus environment at the Faculty of Computer Science, Universitas Brawijaya. The platform enables users to report items, search by category, location, and time, and directly contact reporters to speed up the recovery process.',
      problems: [
        { title: 'Decentralized Lost Reports', description: 'Lost and found items were reported through scattered social media posts and bulletin boards with no central repository.' },
        { title: 'Inefficient Recovery Process', description: 'Finding lost items required manually checking multiple sources with no structured search or filtering capabilities.' },
        { title: 'No Contact Mechanism', description: 'There was no direct way for finders to contact owners or vice versa without sharing personal information publicly.' },
      ],
      solutions: [
        { title: 'Centralized Reporting Platform', description: 'Built a single web platform serving as the authoritative source for all lost and found reports within the faculty.' },
        { title: 'Structured Search & Filtering', description: 'Implemented categorized search with filtering by item category, location, and date for efficient discovery.' },
        { title: 'In-App Contact System', description: 'Enabled direct communication between reporters and finders through the platform without exposing personal details.' },
        { title: 'Laravel Breeze Authentication', description: 'Integrated Laravel Breeze for secure authentication and user management with role-based access.' },
      ],
      features: [
        { icon: 'Search', title: 'Category-Based Search', description: 'Search and filter lost and found items by category, location, and time for efficient discovery.' },
        { icon: 'PlusCircle', title: 'Report Submission', description: 'Easy-to-use form for reporting lost or found items with relevant details and images.' },
        { icon: 'MessageSquare', title: 'Direct Contact', description: 'Platform-mediated communication between finders and owners for safe item recovery.' },
        { icon: 'Shield', title: 'User Authentication', description: 'Secure authentication via Laravel Breeze with role-based access for trusted reporting.' },
      ],
      contributions: [
        'Developed the complete full-stack application using Laravel with MVC architecture and PHP',
        'Designed the database schema for efficient report storage, categorization, and search indexing',
        'Implemented authentication and authorization using Laravel Breeze for secure user management',
        'Built frontend views with structured data flow enabling categorized browsing and report management',
        'Handled backend logic for report CRUD operations, search filtering, and user communication features',
      ],
      results: [
        { icon: 'CheckCircle', title: 'Centralized Solution', description: 'Created a single authoritative platform for all lost and found reports within the faculty environment.' },
        { icon: 'Zap', title: 'Efficient Recovery', description: 'Structured search and direct communication reduced the time needed to reunite items with their owners.' },
        { icon: 'Code', title: 'Full-Stack Foundation', description: 'Demonstrated end-to-end web development skills from database design to frontend implementation.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['eventpal'],
      role: 'Mobile Developer',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      overview:
        'Eventpal is a mobile application that helps event organizers easily find and connect with reliable vendors for event needs such as equipment, decoration, and supporting services. The platform addresses common challenges including difficulty finding trusted vendors, limited information, and inefficient communication processes.',
      problems: [
        { title: 'Difficulty Finding Trusted Vendors', description: 'Event organizers struggled to find reliable vendors with verified reputations and quality service records.' },
        { title: 'Limited Vendor Information', description: 'Available vendor listings lacked comprehensive information about services, pricing, and past client reviews.' },
        { title: 'Inefficient Communication', description: 'Coordinating with multiple vendors required scattered communication across different platforms and channels.' },
      ],
      solutions: [
        { title: 'Curated Vendor Directory', description: 'Built a structured directory of verified vendors with comprehensive service information, portfolios, and client reviews.' },
        { title: 'In-App Communication', description: 'Provided direct messaging between organizers and vendors for streamlined coordination and negotiation.' },
        { title: 'Structured Service Listings', description: 'Created detailed vendor profiles with service categories, pricing ranges, and availability information.' },
        { title: 'Authentication & Profiles', description: 'Implemented user authentication with organizer and vendor profiles for role-specific functionality.' },
      ],
      features: [
        { icon: 'Store', title: 'Vendor Discovery', description: 'Browse and discover verified event vendors with comprehensive service listings and portfolios.' },
        { icon: 'Star', title: 'Ratings & Reviews', description: 'Transparent client reviews and ratings to help organizers make informed vendor selection decisions.' },
        { icon: 'MessageCircle', title: 'Direct Communication', description: 'In-app messaging for streamlined coordination between organizers and vendors.' },
        { icon: 'Filter', title: 'Service Filtering', description: 'Filter vendors by service type, pricing, location, and availability for targeted discovery.' },
      ],
      contributions: [
        'Built core application features including authentication flow and UI implementation using Kotlin and XML',
        'Implemented user registration and login with secure session management',
        'Developed vendor discovery and listing features with structured data display',
        'Created intuitive UI components for browsing vendor profiles and service information',
        'Collaborated with the team during RAION Internship 2024 to deliver the initial application prototype',
      ],
      results: [
        { icon: 'CheckCircle', title: 'Vendor Discovery Solution', description: 'Created a centralized platform connecting event organizers with reliable vendors for streamlined planning.' },
        { icon: 'Users', title: 'Team Collaboration', description: 'Successfully delivered initial prototype as part of RAION Internship 2024 team project.' },
        { icon: 'Code', title: 'Mobile Foundation', description: 'Established foundational Android development skills in Kotlin and XML for future projects.' },
      ],
      gallery: [],
    },
    {
      projectId: projectMap['eduearth'],
      role: 'Front-End Developer',
      startDate: '2025-10-01',
      endDate: '2025-11-01',
      overview:
        'EduEarth is an interactive 3D Earth Layer Visualization built with Three.js that enables users to explore the Earth\'s internal structure through an immersive, educational 3D experience. Users can rotate, zoom, and interact with different geological layers to learn about the Earth\'s composition in an engaging visual format.',
      problems: [
        { title: 'Abstract Geological Concepts', description: 'Students struggled to visualize and understand the Earth\'s internal layered structure from traditional 2D diagrams.' },
        { title: 'Limited Interactive Learning Tools', description: 'Educational resources for geology were primarily static images with no hands-on exploration capabilities.' },
        { title: 'Low Engagement in Earth Science', description: 'Traditional teaching methods failed to capture student interest in earth science and geology topics.' },
      ],
      solutions: [
        { title: '3D Interactive Visualization', description: 'Built an immersive Three.js-based 3D model of Earth\'s layers with rotation, zoom, and interactive exploration.' },
        { title: 'Layer-by-Layer Exploration', description: 'Enabled users to peel back and examine each geological layer individually with detailed information popups.' },
        { title: 'Educational Annotations', description: 'Added informative labels and descriptions for each layer to combine visual learning with educational content.' },
      ],
      features: [
        { icon: 'Globe', title: '3D Earth Visualization', description: 'Interactive Three.js-powered 3D model of Earth with full rotation and zoom capabilities.' },
        { icon: 'Layers', title: 'Layer Exploration', description: 'Peel back and examine each geological layer from crust to core with detailed information.' },
        { icon: 'Info', title: 'Educational Annotations', description: 'Informative labels and descriptions for each layer combining visual and textual learning.' },
        { icon: 'RotateCw', title: 'Free Rotation', description: 'Users can freely rotate and examine the Earth model from any angle for complete understanding.' },
      ],
      contributions: [
        'Built the complete 3D visualization application using Three.js and JavaScript',
        'Implemented 3D modeling of Earth\'s geological layers with accurate relative proportions and colors',
        'Developed interactive controls for rotation, zoom, and layer-by-layer exploration',
        'Created educational annotation system with layer descriptions integrated into the 3D experience',
        'Optimized 3D rendering performance for smooth interaction across different devices',
      ],
      results: [
        { icon: 'Star', title: 'Interactive Education', description: 'Transformed abstract geological concepts into an engaging, hands-on 3D learning experience.' },
        { icon: 'Zap', title: '3D Performance', description: 'Achieved smooth 60fps rendering of complex 3D geometry across modern browsers and devices.' },
        { icon: 'Code', title: 'Three.js Mastery', description: 'Demonstrated proficiency in 3D web development using Three.js for educational visualization.' },
      ],
      gallery: [],
    },
  ]

  for (const cs of caseStudies) {
    if (cs.projectId) {
      await db.insert(caseStudiesTable).values(cs as any)
    }
  }
  console.log(`  → ${caseStudies.filter((cs) => cs.projectId).length} case studies inserted\n`)
}

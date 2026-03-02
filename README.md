# 🌌 Eventora

**Eventora** is a full-stack immersive event booking platform built with Spring Boot, PostgreSQL, Redis, and a cinematic React frontend.
  It combines dynamic pricing, real-time seat locking, secure payments, and an intelligent analytics dashboard.

---

## 🚀 Vision

Eventora is not just a ticket booking system.

It is:

- 🎟 Intelligent Event Ecosystem  
- 💰 AI-driven Dynamic Pricing Engine  
- ⚡ Real-time Seat Locking System  
- 🔐 Secure Payment Gateway Integration  
- 📊 Predictive Analytics Dashboard  
- 🌌 Immersive 3D Premium Frontend  

---

# 🏗 Project Structure

```

eventora/
│
├── frontend/   # React + Tailwind + Framer Motion + Three.js
│
├── backend/    # Spring Boot + PostgreSQL + Redis
│
└── README.md

````

---

# 🧠 Core Features

## 🔐 Authentication
- JWT-based authentication
- Role-based authorization (USER / ADMIN)
- BCrypt password hashing
- Secure REST APIs

---

## 🎟 Event Management
- Create & manage events
- Category filtering
- Location-based filtering
- Event search
- Countdown timer

---

## 💰 Dynamic Pricing Engine
Ticket prices adjust based on:

- Seat demand percentage
- Booking velocity
- Time remaining before event
- Popularity score

---

## ⚡ Real-Time Seat Locking
- Redis-based 5-minute seat lock
- Auto-expiry mechanism
- Prevents double booking
- WebSocket live seat updates

---

## 💳 Secure Payment Integration
- Razorpay integration
- UPI / Cards / Net Banking
- Payment signature verification
- Webhook validation
- Refund API support

---

## 🪑 Interactive Seat Selection
- Semi-circular seat layout
- Tier-based pricing
- Real-time updates
- Lock animation
- Countdown timer overlay

---

## 📊 Admin Analytics Dashboard
- Live revenue tracking
- Booking analytics
- Seat heatmap
- Fraud detection alerts
- Predictive revenue insights

---

## 🔍 Fraud Detection
- Rate limiting
- Suspicious booking velocity detection
- IP-based anomaly detection

---

# 🛠 Tech Stack

## Backend
- Java 17+
- Spring Boot
- PostgreSQL
- Redis
- Spring Security (JWT)
- WebSocket (STOMP)
- Razorpay SDK
- Flyway

## Frontend
- React (Vite)
- TailwindCSS
- Framer Motion
- GSAP
- React Router
- Axios
- React Three Fiber (Three.js)
- Lenis (Smooth Scrolling)

---

# 🎨 Design System

Eventora uses a hybrid premium theme combining:

- 🌌 Cosmic Neon accents
- 🧊 Glassmorphism panels
- 🪐 Subtle 3D depth
- 🎥 Cinematic motion

### Core Colors

- Background: `#0B0F1A`
- Surface: `#111827`
- Accent Gradient: `from-[#7C3AED] via-[#6366F1] to-[#06B6D4]`

---

# 🔐 Security Features

- JWT authentication with expiration
- BCrypt password encryption
- Payment signature verification
- Webhook validation
- Input validation
- Rate limiting
- Environment variable protection

---

# 📱 Mobile-First Design

- Sticky bottom CTA
- Swipeable event cards
- Collapsible sections
- Optimized animations
- WebGL fallback for low-power devices

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/eventora.git
cd eventora
````

---

## 2️⃣ Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Configure PostgreSQL & Redis in:

```
src/main/resources/application.yml
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🌍 Environment Variables

Backend `.env`:

```
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
REDIS_HOST=
REDIS_PORT=
```

Frontend `.env`:

```
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY=
```

---

# 🚀 Deployment

Recommended stack:

* Backend → Docker + AWS / Render
* Database → Supabase / Neon
* Redis → Redis Cloud
* Frontend → Vercel
* Reverse Proxy → Nginx

---

# 🎯 Development Roadmap

1. Backend authentication
2. Event CRUD APIs
3. Dynamic pricing engine
4. Redis seat locking
5. WebSocket real-time updates
6. Razorpay integration
7. Immersive frontend
8. Admin dashboard
9. Performance optimization
10. Deployment

---

# 🏆 Why Eventora Stands Out

Unlike typical ticket systems, Eventora features:

* Real-time distributed seat locking
* AI-inspired dynamic pricing
* Fraud detection logic
* Immersive 3D frontend
* Predictive analytics dashboard

This makes it a startup-grade portfolio project.

---

# 📜 License

MIT License

---

# 👨‍💻 Author

**Dhanush**

Full-stack Developer
CSBS | Spring Boot | React | Distributed Systems

# 🚗 Campus Ride

A modern ride-sharing application designed specifically for campus communities. Connect students with verified drivers for safe, convenient, and affordable campus transportation.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-purple?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-11-orange?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan?logo=tailwindcss)

## ✨ Features

### For Students
- 🔍 **Quick Ride Search** - Enter pickup & drop locations with preferred time
- 📱 **Real-time Negotiation** - Call and negotiate fares directly with drivers
- ✅ **Ride Confirmation** - Both parties confirm before the ride is locked
- 📍 **Destination Tracking** - Mark arrival when you reach your destination

### For Drivers
- 🟢 **Online/Offline Toggle** - Control your availability
- 🔔 **Incoming Requests** - Get notified of ride requests in real-time
- 📞 **Negotiation System** - Discuss fare and details with students
- 🛡️ **Verified Badge** - Admin-verified drivers get a trust badge

### Security
- 🔐 Google OAuth & Email/Password authentication
- 👤 Role-based access control (Student/Driver)
- 🛡️ Protected routes with authentication guards

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, React Router |
| Styling | TailwindCSS 4, Framer Motion |
| UI Components | shadcn/ui (Radix UI) |
| Backend | Firebase (Auth, Firestore) |
| Build Tool | Vite (Rolldown) |
| Icons | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Firestore & Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sagar-grv/Campus_Ride.git
   cd Campus_Ride/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
Campus_Ride/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── contexts/       # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── DriverLogin.jsx
│   │   │   └── DriverSignup.jsx
│   │   ├── services/       # Firebase configuration
│   │   ├── lib/            # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── firebase.json           # Firebase hosting config
├── firestore.rules         # Firestore security rules
└── firestore.indexes.json  # Firestore indexes
```

## 🔥 Firebase Setup

### Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profiles (name, role, verification status) |
| `rides` | Ride requests and status tracking |

### Authentication
Enable the following providers in Firebase Console:
- Email/Password
- Google

## 📸 Screenshots

| Home Page | Student Dashboard | Driver Dashboard |
|-----------|-------------------|------------------|
| Modern landing with hero section | Ride search & booking flow | Request management |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sagar** - [GitHub](https://github.com/sagar-grv)

---

<p align="center">
  Made with ❤️ for campus communities
</p>

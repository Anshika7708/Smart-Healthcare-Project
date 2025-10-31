# Smart Healthcare Portal

A comprehensive healthcare management system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🎯 Features

### User Authentication

-   Secure signup and login with JWT authentication
-   Password hashing with bcrypt
-   Protected routes and session management

### Patient Profile Management

-   Complete patient information (name, age, gender, contact, medical history)
-   Emergency contact details
-   Unique QR code for each patient
-   Editable profile with real-time updates

### QR Code System

-   Auto-generated QR code on signup
-   QR code links to public patient profile view
-   Scannable from any device

### Medical Reports & Prescriptions

-   Upload medical documents (PDF, images, Word docs)
-   Categorize as Reports or Prescriptions
-   View, download, and delete files
-   File metadata tracking (size, type, upload date)

### Health Vitals Tracking

-   Track multiple health metrics:
    -   Heart Rate (bpm)
    -   Blood Pressure (mmHg)
    -   Oxygen Level (SpO₂ %)
    -   Body Temperature (°C)
-   Visual charts and graphs using Recharts
-   Historical data comparison
-   Sample vitals data initialized for new users

### Dashboard

-   Quick overview of health stats
-   Recent vitals and reports count
-   Quick action buttons
-   QR code display

## 🛠 Tech Stack

### Frontend

-   **React** - UI library
-   **React Router DOM** - Routing
-   **Tailwind CSS** - Styling with custom animations
-   **Axios** - HTTP client
-   **Recharts** - Data visualization
-   **Lucide React** - Icons
-   **QRCode.react** - QR code generation

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MongoDB** - Database
-   **Mongoose** - ODM
-   **JWT** - Authentication
-   **Bcrypt** - Password hashing
-   **Multer** - File uploads
-   **QRCode** - QR code generation
-   **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (running locally or MongoDB Atlas)
-   npm or yarn

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Update `.env` file with your configurations:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the server:

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🚀 Usage

1. **Signup**: Create a new account with your personal and medical information
2. **Login**: Sign in with your email and password
3. **Dashboard**: View your health overview
4. **Profile**: View and edit your personal information, download your QR code
5. **Reports**: Upload medical reports and prescriptions
6. **Vitals**: Track and visualize your health metrics
7. **QR Code**: Scan your QR code to share your health profile

## 📁 Project Structure

```
smart-healthcare/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── reportController.js
│   │   └── vitalController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Report.js
│   │   └── Vital.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── report.js
│   │   └── vital.js
│   ├── uploads/
│   │   └── reports/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Vitals.jsx
│   │   │   └── PatientView.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎨 Design Features

-   **Soothing Color Palette**: Soft blues, indigos, and purples for a calming experience
-   **Micro Interactions**: Smooth hover effects, transitions, and animations
-   **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
-   **Custom Scrollbar**: Gradient-styled scrollbar matching the theme
-   **Loading States**: Beautiful loading animations for better UX
-   **Card-based Layout**: Clean, organized information presentation

## 🔒 Security Features

-   Password hashing with bcrypt
-   JWT-based authentication
-   Protected API routes
-   File type validation for uploads
-   File size limits (10MB)
-   Input validation and sanitization

## 🌐 API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/login` - Login user

### User

-   `GET /api/users/:id` - Get user profile
-   `PUT /api/users/update/:id` - Update user profile

### Reports

-   `POST /api/reports/upload` - Upload report
-   `GET /api/reports/:userId` - Get user reports
-   `DELETE /api/reports/:id` - Delete report

### Vitals

-   `POST /api/vitals/add` - Add vital reading
-   `GET /api/vitals/:userId` - Get user vitals
-   `POST /api/vitals/initialize` - Initialize sample vitals

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for better healthcare management

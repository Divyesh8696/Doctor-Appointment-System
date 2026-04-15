# 🩺 Doctor Appointment Management System

A comprehensive MERN stack application designed to streamline doctor appointment bookings, patient management, and administrative oversight. This system provides a seamless experience for patients, healthcare providers, and administrators.

## 🚀 Key Features

### 👤 Patient Features
- **Easy Registration & Login**: Secure authentication for patients.
- **Service Browsing**: Explore various healthcare services offered.
- **Appointment Booking**: Real-time scheduling of appointments with preferred providers.
- **My Appointments**: View and manage upcoming and past appointments.

### 👨‍⚕️ Provider Features
- **Appointment Management**: View and process patient appointments.
- **Service Management**: Define and update the services offered.
- **Dashboard**: Track daily schedules and patient interactions.

### 🛠️ Admin Features
- **System Statistics**: Real-time dashboard with key metrics.
- **User Management**: Oversee patient and provider accounts.
- **Audit Logs**: Track system-wide activities for security and transparency.

## 🛡️ Security & Performance
Built with industry-standard security practices:
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Input Sanitization**: Protection against NoSQL Injection (`express-mongo-sanitize`).
- **Security Headers**: Enhanced security using `Helmet`.
- **Rate Limiting**: Prevention of brute-force attacks (`express-rate-limit`).
- **XSS Protection**: Sanitization of user input to prevent Cross-Site Scripting (`xss-clean`).
- **Data Protection**: Prevent Parameter Pollution (`hpp`).

## 💻 Tech Stack

**Frontend:**
- React (Hooks, Router)
- Axios for API communication
- Professional CSS styling

**Backend:**
- Node.js & Express
- MongoDB with Mongoose ODM
- JWT for secure sessions
- Morgan for logging

## 📂 Project Structure

```text
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers (logic)
│   ├── middleware/     # Auth and security middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Full-page components
│   │   └── services/   # API abstraction layer
└── README.md
```

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Divyesh8696/Doctor-Appointment-System.git
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📄 License
This project is licensed under the ISC License.

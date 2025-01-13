School Payment App

A school payment system that integrates transaction management and user authentication. This application allows users to register, log in, view transaction details, and perform various operations related to school payments.

Features:

User Authentication: Users can register, log in, and access their profile securely.
Transaction Management: Track transactions related to school payments, including payment statuses and amounts.
Webhooks: Handle payment status updates via webhooks.
Role-based Access: Implement role-based access control for Admin and Login users.
Technologies Used:

Frontend: React, Axios, React Router, React Hooks, CSS
Backend: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
Deployment: Frontend on Netlify, Backend on Vercel, MongoDB for the database
Getting Started

Prerequisites:

Node.js (v14 or higher)
npm (v6 or higher)
MongoDB account (for cloud or local setup)
Installation:

Clone the repository:
git clone https://github.com/your-username/school-payment-app.git
Navigate to the project folder:
cd school-payment-app
Backend setup:
Go to the backend folder:
cd school-payment-backend
Install dependencies:
npm install
Create a .env file and add environment variables:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the backend server:
npm start
Frontend setup:
Go to the frontend folder:
cd school-payment-frontend
Install dependencies:
npm install
Start the frontend server:
npm start
API Endpoints

Authentication

POST /register: Register a new user
POST /login: Log in an existing user
GET /profile: Get the authenticated user's profile (protected route)
Transactions

GET /transactions: Get a list of all transactions
GET /transactions/school/:school_id: Get transactions by school ID
GET /transactions/status/:custom_order_id: Get transaction status by custom order ID
POST /transactions/webhook: Handle webhook updates for transactions
POST /transactions/manual-update: Manually update a transaction status
Environment Variables

Create a .env file in the backend directory and add the following:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Deployment

Frontend: Deployed on Netlify.
Backend: Deployed on Vercel. Ensure all environment variables are set up in the Vercel dashboard.
Contributing

Fork the repository
Create a new branch: git checkout -b feature-xyz
Commit changes: git commit -m 'Add feature xyz'
Push to the branch: git push origin feature-xyz
Open a pull request

License This project is licensed under the MIT License

Deployed Project Link : https://she-can-foundations-portal.vercel.app/login

email: admin@shecanfoundation.org
/
password: admin12345






# She Can Foundation — Contact Management System

A production-ready, highly secure, and visually stunning Full-Stack contact portal and administrative control center built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

This system enables public visitors to send validation-checked messages to the foundation, and provides administrators with a secure, JWT-authenticated dashboard to monitor submissions, search in real-time, paginate logs, read full letters, and delete records.

---

## 🗺️ System Architecture

The flowchart below visualizes the data flow between the public contact form, the secure admin dashboard, the Express API backend, and the MongoDB database.

```mermaid
graph TD
    subgraph Frontend (React.js + Vite)
        A[Public Visitor] -->|Fills Form| B[ContactForm Component]
        B -->|Validates Inputs| C[Axios API Client]
        
        D[Administrator] -->|Enters Credentials| E[Admin Login Page]
        E -->|Stores Token| F[Local Storage]
        F -->|Secures Route| G[Admin Dashboard Page]
        G -->|Renders Submissions| H[MessageTable Component]
    end

    subgraph Backend (Node.js + Express)
        C -->|POST /api/contact| I[Contact Controller]
        E -->|POST /api/auth/login| J[Auth Controller]
        G -->|GET / DELETE /api/contact| K[JWT Route Guard]
        K -->|Decodes Payload| L[Contact Controller]
    end

    subgraph Database (MongoDB Atlas)
        I -->|Saves Message| M[(MongoDB Database)]
        J -->|Validates Admin| M
        L -->|Reads/Deletes Message| M
    end

    classDef react fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef node fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef db fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff;
    
    class B,C,E,G,H react;
    class I,J,K,L node;
    class M db;
```

---

## 🌟 Key Features

*   **Public Contact Form**:
    *   Responsive glassmorphism layout with glowing mesh gradients and floating labels.
    *   Client-side validations with live error feedback below input fields.
    *   Subtle animations and loaders for premium UX.
*   **Authentication & Route Security**:
    *   Admin dashboard protected with JWT (JSON Web Tokens) Bearer validation.
    *   Password encryption using `bcryptjs` hashing.
    *   Request security checking with automatic 401 session expiration handling.
*   **Admin Dashboard Control Room**:
    *   Analytics count showing total messages and messages received today.
    *   Submissions data table with columns for Name, Email, Message, and Date.
    *   Real-time search functionality (case-insensitive filter on sender name/email).
    *   Pagination controls for simple scanning.
    *   Slide-in overlay detail window for reading long-form letters.
    *   Confirmative warning popup before executing deletes to prevent mistakes.
*   **Database Seeding**:
    *   Automatic seeding of the default admin account on server startup if the database is clean.

---

## 📁 Project Folder Structure

```text
she_can_foundation/
├── backend/                       # Express Node.js Backend API
│   ├── config/
│   │   └── db.js                  # Mongoose MongoDB Connection
│   ├── controllers/
│   │   ├── authController.js      # JWT login & initial Admin seeder
│   │   └── contactController.js   # Contact CRUD handlers
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT route verification guard
│   ├── models/
│   │   ├── Admin.js               # Admin Schema (pre-save hash & comparison)
│   │   └── Contact.js             # Contact message schema & validators
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication routing endpoints
│   │   └── contactRoutes.js       # Contact message routing endpoints
│   ├── .env                       # Environment configs (Port, URIs, Secrets)
│   ├── .gitignore                 # Backend gitignore files
│   ├── package.json               # Backend script definitions & dependencies
│   └── server.js                  # Main server entry & startup script
│
├── frontend/                      # React.js Vite Frontend Client
│   ├── public/                    # Static assets
│   ├── src/                       # React components & pages
│   │   ├── components/            # Reusable widgets (Form, Table, Navbar)
│   │   ├── pages/                 # Full pages (Home, Login, Dashboard)
│   │   ├── services/              # Axios API setup
│   │   ├── App.jsx                # Router & toast config
│   │   └── main.jsx               # DOM mounting entrypoint
│   ├── index.html                 # HTML shell
│   ├── .gitignore                 # Frontend gitignore files
│   ├── package.json               # React dependencies & scripts
│   ├── vite.config.js             # Vite configurations
│   ├── tailwind.config.js         # Tailwind styles & transitions
│   └── postcss.config.js          # PostCSS processor rules
│
└── README.md                      # Documentation & instructions
```

---

## 🚀 Local Run Guide

To run the application, navigate to each directory and set up the respective configurations:

### 1. Backend Setup

1.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure variables in the `backend/.env` file:
    ```env
    PORT=5001
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/she_can_foundation?retryWrites=true&w=majority
    JWT_SECRET=she_can_foundation_secret_jwt_key_2026_secure_key
    INITIAL_ADMIN_EMAIL=admin@shecanfoundation.org
    INITIAL_ADMIN_PASSWORD=admin12345
    NODE_ENV=development
    ```
4.  Start the backend server in development mode:
    ```bash
    npm run dev
    ```
    *You should see logs confirming that MongoDB is Connected and the Initial Admin was seeded.*

---

### 2. Frontend Setup

1.  Navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit: `http://localhost:5173`
5.  Use credentials `admin@shecanfoundation.org` / `admin12345` to log in to the admin panel!

---

## 📡 REST API Documentation

All request payloads and response bodies communicate using JSON.

### 🔐 Authentication Endpoints

#### 1. Admin Login
*   **Path**: `POST /api/auth/login`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "email": "admin@shecanfoundation.org",
      "password": "admin12345"
    }
    ```
*   **Response (Success - 200 OK)**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "admin": {
        "id": "60d0fe4f53112b321c8b3211",
        "email": "admin@shecanfoundation.org"
      }
    }
    ```

---

### ✉️ Contact Message Endpoints

#### 1. Submit Contact Message
*   **Path**: `POST /api/contact`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "message": "Hello, I am interested in sponsoring a girl's scholarship program!"
    }
    ```
*   **Response (Success - 201 Created)**:
    ```json
    {
      "success": true,
      "message": "Form Submitted Successfully",
      "data": {
        "_id": "60d0fe4f53112b321c8b3260",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "Hello, I am interested in sponsoring a girl's scholarship program!",
        "createdAt": "2026-06-03T10:41:00.000Z"
      }
    }
    ```

#### 2. Get All Contact Messages
*   **Path**: `GET /api/contact`
*   **Access**: Private (Admin Token Required)
*   **Headers**: `Authorization: Bearer <TOKEN>`
*   **Response (Success - 200 OK)**:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "60d0fe4f53112b321c8b3260",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "message": "Hello, I am interested in sponsoring a girl's scholarship program!",
          "createdAt": "2026-06-03T10:41:00.000Z"
        }
      ]
    }
    ```

#### 3. Get Contact Details
*   **Path**: `GET /api/contact/:id`
*   **Access**: Private (Admin Token Required)
*   **Headers**: `Authorization: Bearer <TOKEN>`
*   **Response (Success - 200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f53112b321c8b3260",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "Hello, I am interested in sponsoring a girl's scholarship program!",
        "createdAt": "2026-06-03T10:41:00.000Z"
      }
    }
    ```

#### 4. Delete Contact Message
*   **Path**: `DELETE /api/contact/:id`
*   **Access**: Private (Admin Token Required)
*   **Headers**: `Authorization: Bearer <TOKEN>`
*   **Response (Success - 200 OK)**:
    ```json
    {
      "success": true,
      "message": "Message deleted successfully"
    }
    ```

---

## 🛠️ Troubleshooting & Common Gotchas

### 1. `EADDRINUSE: address already in use :::5000`
On macOS Monterey and later, the **AirPlay Receiver** system service defaults to listening on port `5000`. 
*   **Our Solution**: The application is configured to run on port **`5001`** by default to bypass this conflict. If you change back to port `5000` and experience issues, disable AirPlay Receiver in your Mac settings: *System Settings > General > AirPlay & Handoff > Toggle AirPlay Receiver off*.

### 2. `Database connection error: connect ECONNREFUSED 127.0.0.1:27017`
This means a local instance of MongoDB is not running on your computer.
*   **Solution**: Update the `MONGO_URI` variable inside [backend/.env](file:///Users/bhukyakairam/Desktop/projects/she_can_foundation/backend/.env) to point to your free **MongoDB Atlas** cloud cluster.

### 3. `CORS Blocked Requests`
If the API requests fail when running in production, ensure your backend CORS configuration in [backend/server.js](file:///Users/bhukyakairam/Desktop/projects/she_can_foundation/backend/server.js) allows requests from your Vercel deployment URL.

---

## ☁️ Production Deployment Guide

### 1. MongoDB Database Setup (MongoDB Atlas)
1.  Register for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Deploy a new shared free cluster.
3.  Under **Database Access**, create a user with read/write credentials.
4.  Under **Network Access**, whitelist `0.0.0.0/0` (Allow access from anywhere).
5.  Retrieve the Connection String (URI).

### 2. Backend Service Deployment (Render)
1.  Create an account at [Render](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Set the following settings:
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  In the **Environment** tab, add your environment keys (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).
6.  Deploy and copy your live URL.

### 3. Frontend Deployment (Vercel)
1.  Create an account at [Vercel](https://vercel.com).
2.  Click **Add New** and select **Project**.
3.  Connect your GitHub repository.
4.  Configure the settings:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  In the **Environment Variables** section, add `VITE_API_URL` pointing to your Render backend API URL (e.g. `https://she-can-api.onrender.com/api`).
6.  Click **Deploy**.

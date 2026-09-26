# 🛍️ SheryCart - Secure E-Commerce Platform (REST API & Modern React Frontend)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A production-grade, secure full-stack e-commerce web application featuring a robust **RESTful API** powered by Express & MongoDB, along with an interactive, animated **React Frontend**. The project strictly adheres to modern enterprise security standards, including JWT dual-token authentication (short-lived access tokens + rotating `httpOnly` refresh tokens persisted in DB), comprehensive input validation with `express-validator`, role-based access control (User vs. Seller/Admin), and smooth GSAP UI animations.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [System Architecture & Security Flow](#-system-architecture--security-flow)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Setup](#-getting-started--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Environment Variables](#3-environment-variables)
- [API Documentation](#-api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Product CRUD Endpoints](#product-crud-endpoints)
  - [HTTP Status Codes Reference](#http-status-codes-reference)
  - [Standardized Error Response Format](#standardized-error-response-format)
- [Input Validation Coverage](#-input-validation-coverage-express-validator)
- [Frontend Features](#-frontend-features)
- [Deployment Guide](#-deployment-guide)

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **Bcrypt Password Hashing**: Passwords securely hashed with a minimum of 10 salt rounds before database persistence.
- **Dual-Token JWT Architecture**:
  - **Access Token**: Short-lived (15 minutes), returned in response body and stored in memory/client storage.
  - **Refresh Token**: Long-lived (7 days), stored in an `httpOnly`, `sameSite: strict` secure cookie and persisted in MongoDB for instant revocation upon logout or rotation.
- **Silent Token Refreshing**: Axios response interceptors automatically intercept 401 errors, request a new access token via `/api/auth/refresh-token`, replay queued requests seamlessly, or redirect to login if the session is invalidated.
- **409 Conflict Handling**: Explicitly rejects duplicate email or mobile registrations with HTTP status `409 Conflict`.
- **Protected Profile & Logout**: Endpoints `/api/auth/me` and `/api/auth/logout` are guarded by JWT verification middleware; logout revokes stored tokens and clears cookies.

### 📦 2. Product Management (CRUD & RBAC)
- **Public Product Browsing**: Unauthenticated users can view all products (`GET /api/products`) with query filters (`?category=...&search=...`) and view product details (`GET /api/products/:id`).
- **Role-Based Seller Controls**: Only authenticated sellers/admins (`seller`, `admin`) can create (`POST`), update (`PUT`), and delete (`DELETE`) products.
- **Existence Verification**: Verifies product existence before executing updates or deletions, returning proper `404 Not Found` errors if missing.

### 🛡️ 3. Input Validation (`express-validator`)
- Complete coverage across **Request Bodies**, **Query Parameters**, and **Route Parameters**:
  - Email format and normalization.
  - Password complexity (min 8 chars, 1 uppercase, 1 lowercase, 1 digit) & password confirmation matching.
  - Required product fields, price ranges (min > 0), and integer stock limits (min >= 0).
  - MongoDB ObjectId format verification (`isMongoId()`) for all route parameters.
  - 400 Bad Request with field-level structured error responses.

### 🎨 4. Frontend Experience
- **React 19 + Vite**: High performance modern SPA.
- **GSAP Animations**: Smooth staggered page entrances, card popups, and modal transitions.
- **Role Scoping**: Dynamic UI adapting to user roles (displays "Add Product", "Edit", and "Delete" actions strictly for sellers/admins).
- **Profile Management**: Profile dropdown displaying user avatar, role badge, email, contact, and membership date.

---

## 🏗️ System Architecture & Security Flow

```
[ Frontend (React + Axios) ]
           │
           ├── 1. POST /api/auth/login { email, password }
           ▼
[ Express Server ] ───▶ [ MongoDB ] (Verify bcrypt hash)
           │
           ├─────▶ Generates Access Token (15 min)
           ├─────▶ Generates Refresh Token (7 days) & saves to User DB
           │
           ├── 2. Response: Body { accessToken, user }
           │                Cookie: Set-Cookie: refreshToken=...; HttpOnly; SameSite=Strict
           ▼
[ Client Application ]
           │
           ├── 3. Authenticated Request with Header: Authorization: Bearer <accessToken>
           ▼
[ authenticate Middleware ] ───▶ Verified! Proceed to Controller
           │
           │ (When Access Token expires after 15 min -> 401 Unauthorized)
           ▼
[ Axios Response Interceptor ]
           │
           ├── 4. POST /api/auth/refresh-token (Cookie sent automatically)
           ▼
[ Express Server ] ───▶ Validates Cookie & compares with DB token
           │
           ├─────▶ Issues fresh Access Token & Rotates Refresh Token in DB
           ▼
[ Axios Retries Original Request ] (User session uninterrupted)
```

---

## 💻 Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Backend Runtime** | Node.js (v18+) | JavaScript server-side runtime |
| **Framework** | Express.js (v4.21) | RESTful API server framework |
| **Database** | MongoDB & Mongoose (v8.18) | Document database & ODM |
| **Authentication** | JSON Web Token (`jsonwebtoken`) & `bcrypt` | Stateless access tokens & secure hashing |
| **Validation** | `express-validator` (v7.2) | Declarative request payload & param validation |
| **Media Storage** | ImageKit SDK & Multer | Cloud-based product image hosting |
| **Frontend Framework** | React (v19) + Vite | Lightning-fast component library & bundler |
| **Styling** | Tailwind CSS (v4) & Lucide Icons | Utility-first styling with modern UI icons |
| **Animations** | GSAP (GreenSock Animation Platform) | Fluid interactive animations |
| **HTTP Client** | Axios (v1.11) | Promise-based client with interceptors |

---

## 📁 Project Directory Structure

```
Authentication/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.js                 # Express application & global middleware
│   │   ├── config/
│   │   │   ├── config.js              # Environment variables loader
│   │   │   └── imagekit.config.js     # ImageKit SDK setup
│   │   ├── controllers/
│   │   │   ├── auth.controllers.js    # Register, login, refresh-token, me, logout
│   │   │   └── products.controller.js # Product CRUD logic
│   │   ├── middleware.js/
│   │   │   └── auth.middleware.js     # JWT Bearer verification & role guards
│   │   ├── models/
│   │   │   ├── user.model.js          # User schema with refreshToken persistence
│   │   │   └── product.model.js       # Product schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # Auth routing
│   │   │   └── products.routes.js     # Product routing
│   │   ├── utils/
│   │   │   └── auth.js                # JWT sign, verify & cookie helpers
│   │   └── validators/
│   │       ├── auth.validator.js      # express-validator rules for auth
│   │       └── product.validator.js   # express-validator rules for products
│   ├── server.js                      # DB connection and HTTP server listener
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.jsx           # Landing view with hero & category highlights
│   │   │   ├── ProductPage.jsx        # Product catalog, search, filter & seller CRUD modal
│   │   │   ├── LoginPage.jsx          # Login form
│   │   │   ├── RegisterPage.jsx       # Registration form with confirm password
│   │   │   ├── Navbar.jsx             # Navigation bar with user avatar & logo
│   │   │   ├── ProfileModal.jsx       # Modal popup showing user account details
│   │   │   └── AboutPage.jsx          # Project information view
│   │   ├── config/
│   │   │   └── AxiosInstance.js       # Axios with auto token-refresh interceptor
│   │   ├── hooks/
│   │   │   ├── auth.hook.jsx          # Authentication context & custom hooks
│   │   │   └── product.hook.jsx       # Product API data fetching hooks
│   │   ├── layout/
│   │   │   └── MainLayout.jsx         # App shell & layout wrapper
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx     # Client-side protected route guard
│   │   ├── App.jsx                    # Route provider
│   │   └── main.jsx                   # React root entry
│   ├── package.json
│   ├── vite.config.js                 # Vite config with /api dev proxy
│   └── .env.example
│
├── .gitignore                         # Root gitignore excluding node_modules & secrets
└── README.md                          # Comprehensive project documentation
```

---

## 🚀 Getting Started & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Git**

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create local environment configuration
copy .env.example .env     # On Windows (cmd)
# cp .env.example .env      # On Linux/macOS or PowerShell

# Run the backend in development mode (with nodemon)
npm run dev
```

The backend server will launch on `http://localhost:3000`.

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create local environment configuration (optional for dev)
copy .env.example .env     # On Windows (cmd)
# cp .env.example .env      # On Linux/macOS or PowerShell

# Start the Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`. In development, requests sent to `/api` are automatically proxied to `http://localhost:3000`.

---

### 3. Environment Variables

#### Backend (`backend/.env`)
```env
# Server Port
PORT=3000

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/authentication
# Atlas Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Token Secrets (Use strong random strings)
ACCESS_TOKEN_SECRET=your_jwt_access_secret_key_minimum_32_characters
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key_minimum_32_characters

# ImageKit Credentials (Optional)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

#### Frontend (`frontend/.env`)
```env
# In local development, leave blank to use the Vite proxy to http://localhost:3000
# In production, set to your hosted backend URL:
VITE_API_BASE_URL=
```

---

## 📡 API Documentation

Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### 1. Register User
- **Method & Route**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Registers a new user or seller account. Hashes password with bcrypt (10 rounds). Rejects duplicate emails/mobile with `409 Conflict`. Returns user object without password or tokens.
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "mobile": "9876543210",
  "role": "user"
}
```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "user": {
        "_id": "6745f1b2c45e12a9b3d8810a",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "mobile": "9876543210",
        "role": "user",
        "createdAt": "2026-09-26T12:00:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Validation failure (weak password, missing fields).
  - `409 Conflict`: Email or mobile already registered.

---

#### 2. User Login
- **Method & Route**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates credentials. Issues a short-lived Access Token (15m) in the response body, sets a long-lived Refresh Token (7d) as an `httpOnly` secure cookie, and stores the refresh token in MongoDB for revocation.
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "6745f1b2c45e12a9b3d8810a",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }
    ```
    *Set-Cookie: `refreshToken=eyJhbGci...; HttpOnly; SameSite=Strict; Max-Age=604800`*
  - `400 Bad Request`: Invalid request format.
  - `401 Unauthorized`: Invalid email or password.

---

#### 3. Refresh Access Token
- **Method & Route**: `POST /api/auth/refresh-token`
- **Access**: Public (Cookie-based)
- **Description**: Verifies the `refreshToken` cookie against the database. Upon success, rotates both tokens, updating the database record and cookie.
- **Request Body**: None (reads `refreshToken` cookie automatically).
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Token refreshed successfully",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - `401 Unauthorized`: Refresh token missing or expired.
  - `403 Forbidden`: Token revoked or mismatch with database.

---

#### 4. Get Current User Profile
- **Method & Route**: `GET /api/auth/me`
- **Access**: Protected (`Bearer <accessToken>`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Description**: Returns the authenticated user's profile details.
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "user": {
        "_id": "6745f1b2c45e12a9b3d8810a",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "mobile": "9876543210",
        "role": "user",
        "createdAt": "2026-09-26T12:00:00.000Z"
      }
    }
    ```
  - `401 Unauthorized`: Missing, invalid, or expired Bearer token.

---

#### 5. User Logout
- **Method & Route**: `POST /api/auth/logout`
- **Access**: Protected (`Bearer <accessToken>`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Description**: Revokes the user's refresh token from the database and clears the `refreshToken` cookie.
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```
  - `401 Unauthorized`: Invalid or missing token.

---

### Product CRUD Endpoints

#### 1. Get All Products
- **Method & Route**: `GET /api/products`
- **Access**: Public
- **Query Parameters**:
  - `category` *(optional)*: Filter by category (e.g. `Electronics`, `Clothing`).
  - `search` *(optional)*: Text search matching product title or description.
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "count": 2,
      "products": [
        {
          "_id": "6745f201c45e12a9b3d8811b",
          "title": "Wireless Noise Cancelling Headphones",
          "description": "Premium over-ear headphones with 30-hour battery life",
          "price": 199.99,
          "category": "Electronics",
          "stock": 25,
          "images": ["https://ik.imagekit.io/..."],
          "seller": "6745f1b2c45e12a9b3d8810a"
        }
      ]
    }
    ```

---

#### 2. Get Single Product by ID
- **Method & Route**: `GET /api/products/:id`
- **Access**: Public
- **Route Parameters**:
  - `id`: Must be a valid 24-character MongoDB ObjectId.
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "product": {
        "_id": "6745f201c45e12a9b3d8811b",
        "title": "Wireless Noise Cancelling Headphones",
        "price": 199.99,
        "stock": 25
      }
    }
    ```
  - `400 Bad Request`: Invalid MongoDB ObjectId format.
  - `404 Not Found`: Product with the specified ID does not exist.

---

#### 3. Create Product
- **Method & Route**: `POST /api/products`
- **Access**: Protected (Role: `seller` or `admin`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "title": "Mechanical Gaming Keyboard",
  "description": "RGB tactile mechanical keyboard with hot-swappable switches",
  "price": 89.99,
  "category": "Electronics",
  "stock": 50,
  "images": ["https://example.com/keyboard.jpg"]
}
```
- **Responses**:
  - `201 Created`: Returns newly created product object.
  - `400 Bad Request`: Missing title, non-numeric price/stock, or invalid category.
  - `401 Unauthorized`: Not logged in.
  - `403 Forbidden`: User role is `user` (only `seller` and `admin` permitted).

---

#### 4. Update Product
- **Method & Route**: `PUT /api/products/:id`
- **Access**: Protected (Role: `seller` or `admin`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Route Parameters**: `id` (MongoDB ObjectId)
- **Request Body**: Any valid subset of product fields (`title`, `price`, `stock`, `description`, etc.)
- **Responses**:
  - `200 OK`: Returns updated product object.
  - `400 Bad Request`: Validation error or invalid ID format.
  - `403 Forbidden`: Not authorized to update this product.
  - `404 Not Found`: Product ID does not exist.

---

#### 5. Delete Product
- **Method & Route**: `DELETE /api/products/:id`
- **Access**: Protected (Role: `seller` or `admin`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Route Parameters**: `id` (MongoDB ObjectId)
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Product deleted successfully"
    }
    ```
  - `400 Bad Request`: Invalid ID format.
  - `404 Not Found`: Product does not exist.

---

### HTTP Status Codes Reference

| Code | Status | Meaning in this API |
| :--- | :--- | :--- |
| **`200`** | **OK** | Request succeeded (data fetched, updated, or deleted). |
| **`201`** | **Created** | Resource successfully created (User registration, Product added). |
| **`400`** | **Bad Request** | `express-validator` caught validation errors (malformed IDs, weak passwords, invalid numbers). |
| **`401`** | **Unauthorized** | Missing, invalid, or expired Access Token / Refresh Token. |
| **`403`** | **Forbidden** | Valid token but unauthorized role (e.g., standard `user` attempting seller actions). |
| **`404`** | **Not Found** | The requested resource (User or Product ID) does not exist in the database. |
| **`409`** | **Conflict** | Duplicate resource conflict (Email or Mobile already registered). |
| **`500`** | **Internal Server Error** | Unexpected server or database exception. |

---

### Standardized Error Response Format

When any request fails validation or hits a runtime exception, the API consistently returns:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    },
    {
      "field": "confirmPassword",
      "message": "Passwords do not match"
    }
  ]
}
```

---

## 🛡️ Input Validation Coverage (`express-validator`)

The API implements strict validations across all three request layers:

1. **Request Body (`body(...)`)**:
   - `registerValidator`: Validates non-empty name, RFC-compliant email, strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 number), `confirmPassword` equality check, and 10-digit mobile number.
   - `loginValidator`: Validates email format and non-empty password.
   - `createProductValidator` / `updateProductValidator`: Validates title length, description, positive numerical `price`, non-negative integer `stock`, and permissible categories.
2. **Query Parameters (`query(...)`)**:
   - `getProductsQueryValidator`: Sanitizes optional `category` and `search` query parameters to prevent injection attacks or unexpected query behavior.
3. **Route Parameters (`param(...)`)**:
   - `productIdValidator`: Enforces `.isMongoId()` on `:id` for `GET /api/products/:id`, `PUT /api/products/:id`, and `DELETE /api/products/:id`, returning `400 Bad Request` before the database is queried.

---

## 🎨 Frontend Features

- **Responsive Modern UI**: Built with Tailwind CSS v4, supporting both mobile screens and desktop monitors.
- **GSAP Stagger Animations**: Page titles, product cards, and modal windows enter with fluid spring physics.
- **Role-Gated Actions**: The UI inspects `user.role`:
  - `user`: Views products, searches, filters, and browses.
  - `seller` / `admin`: Unlocks the "Add Product" button, along with "Edit" and "Delete" controls on product cards.
- **Axios Silent Refresh**: Configured with request/response interceptors to seamlessly handle JWT expiration without logging out active users.
- **Interactive Modals**:
  - **Product Modal**: Add or update product title, price, category, stock, and image.
  - **Profile Modal**: View current account information (Name, Email, Phone, Role badge, Registration date).

---

## 🌐 Deployment Guide

### Deploying the Backend (e.g. Render / Railway / Fly.io)
1. Push your repository to GitHub.
2. In the hosting platform dashboard, create a new **Web Service** pointing to the repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command**: `npm install`.
5. Set the **Start Command**: `npm start`.
6. Add the environment variables:
   - `PORT`: `3000` (or leave default assigned by platform)
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `ACCESS_TOKEN_SECRET`: Long random secret string
   - `REFRESH_TOKEN_SECRET`: Long random secret string

### Deploying the Frontend (e.g. Vercel / Netlify)
1. Create a new project in Vercel or Netlify pointing to your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Build Command**: `npm run build`.
5. Set the **Output Directory**: `dist`.
6. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com` (your deployed backend URL)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

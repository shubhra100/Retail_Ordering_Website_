# 🍕 Retail Ordering Website (Full-Stack .NET Project)

## 📌 Overview

This project is a **Full-Stack Retail Ordering Web Application** that allows customers to browse, order, and receive items such as **Pizza, Cold Drinks, and Breads** seamlessly.
It ensures secure, efficient operations with a scalable backend and responsive frontend.

---

## 🚀 Tech Stack

### Frontend

* Angular Framework
* TypeScript / JavaScript

### Backend

* ASP.NET Core Web API (C#)
* Entity Framework Core

### Database

* SQL Server

---

## 🎯 Problem Statement

Build a retail ordering system that enables:

* Seamless browsing and ordering experience
* Secure and efficient backend operations
* Inventory management and order processing

---

## ✨ Core Features

### 🧑‍💻 Customer Enablement

* Browse menu items (Pizza, Drinks, Breads)
* Add items to cart
* Place and manage orders

### ⚙️ System Features

* Centralized management of:

  * Brands
  * Categories
  * Packaging
* Automatic inventory updates after order confirmation
* RESTful APIs for all operations
* API testing via Swagger/Postman

### 🔐 Security

* Authentication & Authorization (JWT-based)
* Secure API endpoints
* Rate limiting for API protection

### 🗂️ Development & Version Control

* Clean architecture and modular design
* Source code maintained using GitHub

---

## 🌟 Stretch Features (Optional Enhancements)

* 📧 Email notifications for order confirmation
* 📜 Order history & quick reorder
* 🎁 Promotions system:

  * Coupons
  * Loyalty points
  * Seasonal offers

---

## 🏗️ Project Architecture

```
Frontend (Angular)
        ↓
ASP.NET Core Web API
        ↓
Entity Framework Core
        ↓
SQL Server Database
```

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Backend Setup (.NET Core)

```bash
cd Backend
dotnet restore
dotnet build
dotnet run
```

* Update `appsettings.json` with your SQL Server connection string
* Run migrations (if applicable)

---

### 3️⃣ Frontend Setup (Angular)

```bash
cd Frontend
npm install
ng serve
```

* Navigate to: `http://localhost:4200`

---

## 📡 API Testing

* Swagger UI: `http://localhost:<port>/swagger`
* Use Postman for testing endpoints

---

## 📊 Database

* SQL Server used for persistent storage
* Tables include:

  * Users
  * Products
  * Categories
  * Orders
  * OrderItems

---

## 📌 Future Improvements

* Payment Gateway Integration
* Real-time order tracking
* Admin dashboard analytics
* Mobile app version

---

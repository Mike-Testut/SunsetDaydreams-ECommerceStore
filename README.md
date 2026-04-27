# Sunset Daydreams

Sunset Daydreams is a full-stack e-commerce web application built for a coastal lifestyle clothing brand. It includes a customer storefront, secure authentication, Stripe checkout, order management, inventory tracking, and an admin dashboard for managing products and store activity.

## Live Demo
- Frontend: https://sunset-daydreams.vercel.app/
- Backend API: https://sunsetdaydreams-ecommercestore.onrender.com/

## Demo Accounts
- Admin - test admin email: admin@test.com / test password: password
- Customer - test customer email: user@test.com  / test password: password

## Why I Built This

I built Sunset Daydreams to create a realistic full-stack e-commerce application that demonstrates production-style architecture, payment processing, protected admin tooling, and a polished user experience beyond a basic CRUD app.

## Features

### Customer Features
- Browse products by category
- Search and filter products
- View product details and available sizes
- Add items to cart
- Embedded Stripe checkout
- View order confirmation and order history
- Register, log in, and manage account access
- Optimized UI for desktop and mobile

### Admin Features
- Add, edit, and delete products
- Manage categories and subcategories
- Update inventory by size
- View and manage customer orders
- Update order status
- Receive notifications for:
    - new orders
    - low stock items
    - out of stock items

## Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Stripe React SDK
- Vite

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Stripe API

## Architecture Highlights
- Role-based access control for admin and customer routes
- JWT-based authentication with client-side expiration handling
- Inventory-aware checkout flow
- Notification system for store operations
- Persistent cart and auth state using local storage

## Screenshots
Home Page
![HomePage.png](screenshots/HomePage.png)
![Home-Mobile.png](screenshots/Home-Mobile.png)

Product page
![ProductPage.png](screenshots/ProductPage.png)
![Product-Mobile.png](screenshots/Product-Mobile.png)

Cart
![Cart.png](screenshots/Cart.png)
![Cart-Mobile.png](screenshots/Cart-Mobile.png)

Checkout
![Checkout1.png](screenshots/Checkout1.png)
![Checkout2.png](screenshots/Checkout2.png)

Admin dashboard
![AdminDashboard.png](screenshots/AdminDashboard.png)
![AdminDashboard-Mobile.png](screenshots/AdminDashboard-Mobile.png)

Admin products page
![AdminProducts.png](screenshots/AdminProducts.png)
![AdminProducts-Mobile.png](screenshots/AdminProducts-Mobile.png)

Admin orders page
![AdminOrders.png](screenshots/AdminOrders.png)
![AdminOrders-Mobile.png](screenshots/AdminOrders-Mobile.png)

Notifications page
![AdminNotifications.png](screenshots/AdminNotifications.png)

Search function
![Search.png](screenshots/Search.png)

# E-commerce App (Nike Clone)

This project is an Ecommerce store for Manga, designed to provide users with a seamless shopping experience. The app is built using React for the frontend and Firebase for the backend. It is fully responsive and allows users to browse products, manage their cart, and place orders. Additionally, the app includes an admin panel for managing product listings, orders and sales.

## Features

### User Authentication

- **Google Authentication**: Users can sign in with their Google account.
- **Checkout Authentication**: Only authenticated users can proceed to checkout.

### Product Management

- **Admin Panel**: Admins can log in using a basic username and password to manage product listings.
- **Product Listing**: Products added via the admin panel are dynamically displayed on the website.

### Shopping Cart

- **Add to Cart**: Users can add products to their shopping cart.
- **Edit Quantity**: Users can change the quantity of items in their cart.
- **Delete Items**: Users can remove items from their cart.
- **Checkout**: Authenticated users can complete their purchase by providing their address and pincode.
- **Order History**: Users can view their past orders in their profile.

### Personalised Recommendations

- **For you section**: The For you section smartly sorts and displays a list of products user might be interested in based on search history
- **AI helper boosts personalised recommendations**: AI helped powered by Gemini acts a powerful natural language conversation tool for personalised recommendations


### Favorites

- **Add to Favorites**: Users can mark products as favorites.
- **Favorites Section**
- **Share your favorite products**

### AI helper

- **Product Recommendations**
- **Navigation support**


## Technology Stack

- **Frontend**: React
- **Backend**: Firebase (Database & Authentication)
- **Authentication**: Google Sign-In, Basic Authentication for Admin Panel
- **Responsive Design**: Optimized for mobile and desktop devices.

## Installation

### Prerequisites

- Node.js and npm installed.
- A Firebase project with Firestore and Google Authentication enabled.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/plushexe351/Nike-clone.git
   ```

2. Install Dependencies:

```bash
cd Nike-clone
npm install
```

3. Set up Firebase:
   -Create a Firebase project.
   -Enable Firestore and Google Authentication.
   -Update the Firebase configuration in your project with your credentials.

4. Admin Panel Access
   To access the admin panel:

-Navigate to /admin.
-Log in with the provided username and password.

## To-Do List

-Favorites Section: Add a section to view all favorited products.
-Enhanced Order Details: Provide more detailed order information in the user profile.
-Admin Panel Enhancements: Implement additional features like bulk product uploads and analytics.
-Payment Integration: Integrate a payment gateway for processing orders.

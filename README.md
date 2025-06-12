# Zoe Car Dealership

A modern car dealership website built with React, TypeScript, and Firebase.

## Features

- Vehicle inventory display with filtering and search
- Detailed vehicle pages with image galleries
- Contact form
- Admin dashboard for inventory management
- User authentication for admin access
- Responsive design

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-username/zoe-car-dealership.git
   cd zoe-car-dealership
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Firebase project at [firebase.google.com](https://firebase.google.com)

4. Setup environment variables:
   - Create a `.env` file in the root directory
   - Copy contents from `.env.example` file
   - Fill in your Firebase configuration values

5. Start the development server:
   ```
   npm run dev
   ```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Create a Storage bucket
5. Add your Firebase configuration to the .env file

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/hooks` - Custom React hooks
  - `/firebase` - Firebase configuration
  - `/utils` - Utility functions
  - `/types` - TypeScript type definitions

## Deployment

1. Build the project:
   ```
   npm run build
   ```

2. Deploy to Firebase:
   ```
   firebase deploy
   ```

## License

This project is licensed under the MIT License
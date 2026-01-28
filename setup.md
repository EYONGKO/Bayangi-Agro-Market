# Local Roots Commerce - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install React Native app dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set up Database

1. Create a MySQL database named `local_roots`
2. Import the database schema:
```bash
mysql -u root -p local_roots < backend/database.sql
```

3. Copy the environment file:
```bash
cd backend
copy env.example .env
```

4. Update the `.env` file with your database credentials.

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3000/api`

### 4. Start the React Native App

```bash
npm run dev
```

This will start the Expo development server. You can:
- Scan the QR code with Expo Go app on your phone
- Press 'w' to open in web browser
- Press 'a' to open Android emulator
- Press 'i' to open iOS simulator

## Features

✅ **Completed:**
- React Native project setup with Expo
- Navigation between screens
- Shopping cart with AsyncStorage persistence
- Community-based product browsing
- Product detail screens
- Add product functionality
- Global marketplace
- Top artisans showcase
- Backend API with Express.js
- MySQL database schema
- Image asset management

## Project Structure

```
├── src/                    # React Native app source
│   ├── screens/           # Screen components
│   ├── components/        # Reusable components
│   ├── context/          # React Context providers
│   ├── data/             # Static data
│   ├── types/            # TypeScript types
│   └── assets/           # Images and assets
├── backend/              # Express.js API server
│   ├── server.js         # Main server file
│   ├── database.sql      # Database schema
│   └── package.json      # Backend dependencies
├── assets/               # App icons and splash screens
├── App.tsx               # Main app component
├── package.json          # React Native dependencies
└── README.md            # Project documentation
```

## Available Scripts

### React Native App
- `npm run dev` - Start Expo development server
- `npm run start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

### Backend API
- `cd backend && npm start` - Start production server
- `cd backend && npm run dev` - Start development server with nodemon

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/communities` - Get all communities
- `GET /api/products` - Get all products (global market)
- `GET /api/products/community/:id` - Get products by community
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product
- `GET /api/artisans` - Get top artisans
- `POST /api/subscribe` - Newsletter subscription
- `GET /api/stories` - Get community stories

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Database connection**: Check your MySQL credentials in `.env`
3. **Image loading**: Ensure images are in the correct `assets/` directory
4. **Dependencies**: Run `npm install` in both root and backend directories

### Getting Help

- Check the Expo documentation: https://docs.expo.dev/
- React Native documentation: https://reactnative.dev/
- Express.js documentation: https://expressjs.com/

## Next Steps

The app is now ready to run with `npm run dev`! You can:

1. Test the shopping cart functionality
2. Browse different communities
3. Add products to cart
4. Test the add product form
5. Explore the global marketplace
6. View top artisans

The backend API is ready to handle real data once you set up the MySQL database.


## Quick Start

### 1. Install Dependencies

```bash
# Install React Native app dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set up Database

1. Create a MySQL database named `local_roots`
2. Import the database schema:
```bash
mysql -u root -p local_roots < backend/database.sql
```

3. Copy the environment file:
```bash
cd backend
copy env.example .env
```

4. Update the `.env` file with your database credentials.

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3000/api`

### 4. Start the React Native App

```bash
npm run dev
```

This will start the Expo development server. You can:
- Scan the QR code with Expo Go app on your phone
- Press 'w' to open in web browser
- Press 'a' to open Android emulator
- Press 'i' to open iOS simulator

## Features

✅ **Completed:**
- React Native project setup with Expo
- Navigation between screens
- Shopping cart with AsyncStorage persistence
- Community-based product browsing
- Product detail screens
- Add product functionality
- Global marketplace
- Top artisans showcase
- Backend API with Express.js
- MySQL database schema
- Image asset management

## Project Structure

```
├── src/                    # React Native app source
│   ├── screens/           # Screen components
│   ├── components/        # Reusable components
│   ├── context/          # React Context providers
│   ├── data/             # Static data
│   ├── types/            # TypeScript types
│   └── assets/           # Images and assets
├── backend/              # Express.js API server
│   ├── server.js         # Main server file
│   ├── database.sql      # Database schema
│   └── package.json      # Backend dependencies
├── assets/               # App icons and splash screens
├── App.tsx               # Main app component
├── package.json          # React Native dependencies
└── README.md            # Project documentation
```

## Available Scripts

### React Native App
- `npm run dev` - Start Expo development server
- `npm run start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

### Backend API
- `cd backend && npm start` - Start production server
- `cd backend && npm run dev` - Start development server with nodemon

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/communities` - Get all communities
- `GET /api/products` - Get all products (global market)
- `GET /api/products/community/:id` - Get products by community
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product
- `GET /api/artisans` - Get top artisans
- `POST /api/subscribe` - Newsletter subscription
- `GET /api/stories` - Get community stories

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Database connection**: Check your MySQL credentials in `.env`
3. **Image loading**: Ensure images are in the correct `assets/` directory
4. **Dependencies**: Run `npm install` in both root and backend directories

### Getting Help

- Check the Expo documentation: https://docs.expo.dev/
- React Native documentation: https://reactnative.dev/
- Express.js documentation: https://expressjs.com/

## Next Steps

The app is now ready to run with `npm run dev`! You can:

1. Test the shopping cart functionality
2. Browse different communities
3. Add products to cart
4. Test the add product form
5. Explore the global marketplace
6. View top artisans

The backend API is ready to handle real data once you set up the MySQL database.

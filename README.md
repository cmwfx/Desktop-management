# Internet Cafe Management System

A MERN stack application for managing computers in an internet cafe.

## Features

- User and admin authentication
- Computer management
- Session tracking
- Transaction history
- Balance management
- Real-time computer monitoring via WebSockets

## Tech Stack

- MongoDB: Database
- Express: Backend API
- React: Frontend UI
- Node.js: Server
- Socket.IO: Real-time communication
- JWT: Authentication

## System Architecture

The system consists of three main components:

1. **Web Application (MERN Stack)**:

   - Frontend: React-based UI for users and admins
   - Backend: Express/Node.js API with MongoDB database

2. **Guest Agent**:

   - Lightweight Node.js application that runs on each guest computer
   - Connects to the central server via WebSockets
   - Executes commands like changing passwords and locking computers

3. **WebSocket Server**:
   - Integrated into the Express backend
   - Manages real-time communication between the web app and guest agents

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account

### Installation

1. Clone the repository

```
git clone <repository-url>
cd internet-cafe-management
```

2. Install server dependencies

```
cd server
npm install
```

3. Install client dependencies

```
cd ../ui
npm install
```

4. Create a .env file in the server directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### Running the Application

1. Start the server (development mode)

```
cd server
npm run dev
```

2. Start the client (in a new terminal)

```
cd ui
npm start
```

3. Access the application at http://localhost:3000

### Setting Up Guest Agents

1. Copy the `guest-agent` directory to each guest computer

2. On each guest computer:
   - Install Node.js
   - Run the `install.bat` script as administrator (Windows)
   - Follow the prompts to configure the agent

## Deployment

This application is configured for deployment on Heroku.

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI

```
heroku login
```

3. Create a new Heroku app

```
heroku create your-app-name
```

4. Set environment variables

```
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_EXPIRE=30d
heroku config:set NODE_ENV=production
```

5. Push to Heroku

```
git push heroku main
```

6. Open the application

```
heroku open
```

## License

ISC

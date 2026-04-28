# GridWars

A real-time multiplayer pixel battle game built with modern web technologies. Players compete on a shared grid, capturing tiles and defending their territory in real-time using WebSockets.

## Features

- 🎮 **Real-time Multiplayer Gameplay** - Live grid updates using Socket.IO
- 🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies
- 📊 **Player Leaderboard** - Track statistics and rankings
- 🎨 **Interactive Canvas** - Smooth tile-based rendering
- 📱 **Responsive Design** - Works on desktop and mobile with Tailwind CSS
- ⚡ **Fast Performance** - Optimized React frontend with TypeScript

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API and server
- **TypeScript** - Type-safe code
- **MongoDB** + **Mongoose** - Database
- **Socket.IO** - Real-time communication
- **JWT** + **bcryptjs** - Authentication & encryption
- **Cookie-Parser** - Secure cookie handling

### Frontend
- **React** + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket communication
- **React Hot Toast** - Notifications

## Project Structure

```
gridwars/
├── backend/
│   ├── src/
│   │   ├── config/        # Database and constants
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth and validation
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── socket/        # WebSocket handlers
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── config/        # App constants
    │   ├── context/       # React context (Auth)
    │   ├── frontend/      # Game UI components
    │   ├── hooks/         # Custom React hooks
    │   ├── lib/           # Utilities (API, Socket)
    │   ├── pages/         # Page components
    │   ├── types/         # TypeScript types
    │   ├── App.tsx        # Root component
    │   └── main.tsx       # Entry point
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost/gridwars
   JWT_SECRET=your-secret-key
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   VITE_API_BASE=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login (sets HTTP-only cookie)
- `GET /api/auth/me` - Get current player (protected)

### Tiles
- `GET /api/tiles` - Get all tiles state
- `PATCH /api/tiles/:id` - Claim/update a tile (protected)

### History
- `GET /api/history` - Get game history (protected)

## Authentication

The app uses **HTTP-only cookies** for secure token storage:
- Tokens are automatically sent with requests (browser handles this)
- Tokens expire after 30 days
- Cannot be accessed via JavaScript (XSS protection)

## Real-time Features

Using **Socket.IO** for live updates:
- `presence:count` - Connected players count
- Tile updates broadcast to all clients
- Automatic reconnection on disconnect

## Development

### Building

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

### Running Production Build

Backend:
```bash
npm run start
```

Frontend:
```bash
npm run preview
```

## Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm run start` - Run production build

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT License - feel free to use this project for learning or as a base for your own projects.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

---

**Built with ❤️ using TypeScript, React, Node.js, and MongoDB**

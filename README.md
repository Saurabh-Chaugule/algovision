# AlgoVision - Interactive Algorithm Visualizer & Sandbox

<div align="center">

🔮 **A Production-Ready Full-Stack Algorithm Visualization Platform** 🔮

[![Built with React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Supported Algorithms](#supported-algorithms)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AlgoVision is a comprehensive, full-stack web application designed to help students, developers, and algorithm enthusiasts understand how algorithms work through beautiful, interactive visualizations. Watch algorithms execute step-by-step, save your favorite configurations, and track your learning progress!

## ✨ Features

- **Interactive Algorithm Visualizations**: Sorting, searching, graph algorithms, and more
- **User Authentication**: Secure signup/login with JWT
- **Save & History**: Save your algorithm configurations and view execution history
- **Real-time Controls**: Play, pause, step forward/backward through algorithm execution
- **Custom Input**: Test algorithms with your own data
- **Performance Metrics**: View time and space complexity with actual execution stats

## Tech Stack

### Frontend
- React 18 with Hooks
- React Router for navigation
- Axios for API calls
- D3.js/Canvas for visualizations
- Tailwind CSS for styling

### Backend
- Node.js with Express
- JWT for authentication
- Bcrypt for password hashing
- PostgreSQL for database
- Prisma ORM

### Deployment
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- Database: PostgreSQL (Railway/Supabase)

## Project Structure

```
algovision/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/algovision"
JWT_SECRET="your-secret-key-here"
PORT=5000
NODE_ENV=development
```

3. Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Algorithms
- `GET /api/algorithms` - Get all available algorithms
- `POST /api/algorithms/execute` - Execute algorithm with input
- `POST /api/algorithms/save` - Save algorithm configuration
- `GET /api/algorithms/saved` - Get user's saved algorithms

### History
- `GET /api/history` - Get user's execution history
- `GET /api/history/:id` - Get specific execution details
- `DELETE /api/history/:id` - Delete history entry

## Supported Algorithms

### Sorting
- Bubble Sort
- Quick Sort
- Merge Sort
- Heap Sort
- Insertion Sort
- Selection Sort

### Searching
- Linear Search
- Binary Search
- Jump Search
- Interpolation Search

### Graph Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- A* Search
- Kruskal's MST
- Prim's MST

### Tree Algorithms
- Binary Tree Traversals (Inorder, Preorder, Postorder)
- AVL Tree Operations
- Binary Search Tree Operations

## 📸 Screenshots

### Home Page
Landing page with feature showcase and algorithm categories.

### Visualizer
Interactive algorithm execution with real-time playback controls, step-by-step visualization, and performance metrics.

### Dashboard
User dashboard showing execution statistics, recent activity, saved configurations, and algorithm usage charts.

### History
Complete execution history with detailed metrics, complexity analysis, and full replay capability.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete local development setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment instructions
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project overview

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/algovision.git
cd algovision

# Install all dependencies
npm run setup

# Set up your database and environment variables
# See SETUP.md for detailed instructions

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev

# Visit http://localhost:3000
```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Algorithm implementations inspired by classic computer science textbooks
- UI/UX inspired by modern educational platforms
- Built with love for the developer community

## 📧 Contact

For questions, suggestions, or feedback:
- Create an issue on GitHub
- Email: your-email@example.com

---

<div align="center">

**Made with ❤️ for algorithm enthusiasts**

⭐ Star this repo if you find it helpful!

</div>

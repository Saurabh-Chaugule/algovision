# AlgoVision - Complete Setup Guide

Follow these steps to get AlgoVision running locally on your machine.

## Prerequisites

Make sure you have these installed:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version   # Should be 18+
npm --version
psql --version   # Should be 14+
```

## Step 1: Clone or Navigate to Project

```bash
cd algovision
```

## Step 2: Database Setup

### Option A: PostgreSQL (Local)

1. Start PostgreSQL:
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows - use pgAdmin or services
```

2. Create database:
```bash
# Method 1: Using psql
psql postgres
CREATE DATABASE algovision;
\q

# Method 2: Using createdb command
createdb algovision
```

3. Get your database URL:
```
postgresql://username:password@localhost:5432/algovision

# Default username is usually your system username
# Default password might be empty or 'postgres'
# Example: postgresql://john:@localhost:5432/algovision
```

### Option B: Cloud Database (Recommended for production)

**Supabase (Free tier available):**
1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Go to Settings > Database
4. Copy the "Connection string" (use Connection pooling for production)

**Railway (Free $5 credit):**
1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy DATABASE_URL from Variables tab

## Step 3: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your settings:
```env
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/algovision"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Generate a secure JWT secret:**
```bash
# Run this in terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Run database migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Seed the database with initial data:
```bash
node prisma/seed.js
```

7. Start the backend server:
```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║      AlgoVision API Server            ║
║                                       ║
║  Status: Running                      ║
║  Port: 5000                           ║
...
╚═══════════════════════════════════════╝
```

8. Test the backend (in a new terminal):
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "AlgoVision API is running!",
  "timestamp": "..."
}
```

## Step 4: Frontend Setup

1. Open a NEW terminal and navigate to frontend:
```bash
cd frontend  # from algovision root
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The app should open automatically at `http://localhost:3000`

You should see:
```
  VITE v5.0.11  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 5: Test the Application

1. **Open browser** to `http://localhost:3000`

2. **Create an account:**
   - Click "Sign Up"
   - Fill in the form
   - Submit

3. **Test algorithm visualization:**
   - Go to "Visualizer"
   - Select an algorithm (e.g., Bubble Sort)
   - Enter input array: `5, 2, 8, 1, 9, 3`
   - Click "Execute Algorithm"
   - Use playback controls to step through visualization

4. **Test save functionality:**
   - After executing, click "Save Configuration"
   - Give it a name
   - Check "Saved" page

5. **Check history:**
   - Go to "History" page
   - View your execution records

## Project Structure

```
algovision/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Algorithm logic
│   │   └── server.js       # Express app
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Seed data
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API service
│   │   └── App.jsx        # Main app component
│   ├── .env               # Frontend env vars
│   └── package.json
│
├── README.md              # Project overview
├── SETUP.md              # This file
└── DEPLOYMENT.md         # Deployment guide
```

## Common Commands

### Backend
```bash
cd backend

# Start development server
npm run dev

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
node prisma/seed.js
```

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Backend won't start

**Problem:** "Error: Cannot find module"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** "Connection refused" or database errors
- Verify PostgreSQL is running: `psql --version`
- Check DATABASE_URL in `.env` is correct
- Test connection: `psql $DATABASE_URL`

**Problem:** "JWT_SECRET is not defined"
- Make sure `.env` file exists in backend folder
- Verify JWT_SECRET is set in `.env`

### Frontend won't start

**Problem:** "EADDRINUSE: address already in use"
- Port 3000 is taken. Kill the process or change port:
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
vite --port 3001
```

**Problem:** "Cannot connect to API"
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Check CORS settings in backend

### Database Issues

**Problem:** "relation does not exist"
```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma migrate dev
node prisma/seed.js
```

**Problem:** "password authentication failed"
- Verify PostgreSQL username/password
- Update DATABASE_URL in backend `.env`

### API Errors

**Problem:** "401 Unauthorized"
- Make sure you're logged in
- Check if token is stored (Browser DevTools > Application > Local Storage)
- Try logging out and back in

**Problem:** "CORS error"
- Verify FRONTEND_URL in backend `.env` matches your frontend URL
- Restart backend server after changing `.env`

## Development Tips

### Database Changes
When you modify `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name description_of_change
npx prisma generate
```

### Adding New Algorithms
1. Add to `backend/src/services/algorithmService.js`
2. Seed to database in `backend/prisma/seed.js`
3. Update frontend algorithm selectors

### Debugging
- Backend logs appear in the terminal running `npm run dev`
- Frontend logs in browser console (F12)
- Check Network tab for API call details

### Hot Reload
- Backend: Uses nodemon, auto-restarts on file changes
- Frontend: Uses Vite HMR, updates without full reload

## Next Steps

- Read [README.md](./README.md) for project overview
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Customize algorithms in `backend/src/services/algorithmService.js`
- Add new visualizations in `frontend/src/components/VisualizationCanvas.jsx`
- Extend database schema in `backend/prisma/schema.prisma`

## Getting Help

If you encounter issues:
1. Check error messages carefully
2. Verify all prerequisites are installed
3. Ensure both backend and frontend are running
4. Check that environment variables are set correctly
5. Try restarting both servers
6. Clear node_modules and reinstall

## Success Checklist

- [ ] PostgreSQL is installed and running
- [ ] Backend server starts without errors (port 5000)
- [ ] Frontend server starts without errors (port 3000)
- [ ] Can create a user account
- [ ] Can login successfully
- [ ] Can execute algorithms and see visualizations
- [ ] Can save configurations
- [ ] Can view history
- [ ] Can see dashboard statistics

Congratulations! You're ready to explore AlgoVision! 🎉

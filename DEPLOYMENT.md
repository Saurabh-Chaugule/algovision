# AlgoVision Deployment Guide

This guide covers deploying AlgoVision to production environments.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git
- Accounts on deployment platforms (Railway, Vercel, etc.)

## Database Setup

### Option 1: Railway PostgreSQL

1. Create a Railway account at https://railway.app
2. Create a new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from Railway dashboard

### Option 2: Supabase

1. Create account at https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Use the connection pooling string for production

### Option 3: Local PostgreSQL

```bash
# Install PostgreSQL
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Create database
createdb algovision

# Set DATABASE_URL
export DATABASE_URL="postgresql://localhost:5432/algovision"
```

## Backend Deployment

### Railway Deployment (Recommended)

1. Push your code to GitHub

2. Go to Railway dashboard
3. Click "New Project" > "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the backend

6. Set environment variables in Railway:
```
DATABASE_URL=<your-railway-postgres-url>
JWT_SECRET=<generate-random-secret>
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

7. Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

8. Add build settings:
```
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

9. Run database migrations:
```bash
# In Railway CLI or dashboard terminal
npx prisma migrate deploy
node prisma/seed.js
```

### Alternative: Render.com

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
4. Add environment variables (same as Railway)

### Heroku Deployment

```bash
# Install Heroku CLI
# Create Heroku app
heroku create algovision-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run npx prisma migrate deploy
heroku run node prisma/seed.js
```

## Frontend Deployment

### Vercel Deployment (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Follow prompts:
   - Project name: algovision
   - Directory: ./
   - Build command: `npm run build`
   - Output directory: `dist`

5. Set environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

6. For production deployment:
```bash
vercel --prod
```

### Alternative: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the app:
```bash
cd frontend
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

4. Set environment variables in Netlify dashboard

### Alternative: GitHub Pages (Static Only)

```bash
cd frontend
npm run build

# Deploy to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:5432/algovision"
JWT_SECRET="your-secure-random-secret-min-32-chars"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="production"
FRONTEND_URL="https://algovision.vercel.app"
```

### Frontend (.env)
```env
VITE_API_URL="https://algovision-api.railway.app/api"
```

## Post-Deployment Checklist

- [ ] Database is accessible and migrations are applied
- [ ] Seed data is loaded (algorithms table)
- [ ] Backend health check works: `GET /api/health`
- [ ] Frontend can connect to backend API
- [ ] User registration works
- [ ] User login works
- [ ] Algorithm execution works
- [ ] History saving works
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] SSL/HTTPS is enabled

## Database Migrations

When deploying updates with database changes:

```bash
# Generate migration
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy

# If needed, reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Monitoring

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/api/health
```

Should return:
```json
{
  "success": true,
  "message": "AlgoVision API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Check Logs

**Railway:**
- View logs in Railway dashboard

**Heroku:**
```bash
heroku logs --tail
```

**Vercel:**
```bash
vercel logs
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database allows external connections
- Ensure IP whitelist includes your deployment platform

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in server.js

### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are in package.json
- Verify build commands are correct

### Migration Errors
- Run migrations manually: `npx prisma migrate deploy`
- Check database permissions
- Ensure schema.prisma is up to date

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer)
- Monitor database performance
- Add indexes for frequently queried fields

### Backend
- Enable compression middleware
- Add rate limiting
- Implement caching (Redis)
- Use CDN for static assets

### Frontend
- Enable Vercel/Netlify CDN
- Optimize bundle size
- Implement lazy loading
- Use service workers for caching

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable HTTPS** on all endpoints
4. **Implement rate limiting** to prevent abuse
5. **Sanitize user inputs** to prevent XSS/SQL injection
6. **Keep dependencies updated** for security patches
7. **Use environment variables** for all secrets
8. **Enable CORS** only for trusted origins

## Backup Strategy

### Database Backups

**Railway:**
- Automatic backups included in paid plans

**Heroku:**
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

**Manual:**
```bash
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Domain Configuration

### Custom Domain on Vercel
1. Go to project settings
2. Add custom domain
3. Configure DNS records as instructed

### Custom Domain on Railway
1. Go to service settings
2. Add custom domain
3. Update DNS CNAME record

## Cost Optimization

### Free Tier Options
- **Frontend**: Vercel (free hobby plan)
- **Backend**: Railway ($5/month with free trial credits)
- **Database**: Railway PostgreSQL (included)
- **Total**: ~$5/month

### Optimizations
- Use connection pooling to reduce database connections
- Implement caching to reduce API calls
- Optimize images and assets
- Use serverless functions for low-traffic endpoints

## Support

For issues or questions:
- Check application logs
- Review environment variables
- Verify database connectivity
- Test API endpoints manually
- Check CORS configuration

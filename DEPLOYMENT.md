# 🚀 Gadgetra Deployment Guide

## 📋 Overview

This guide will help you deploy the Gadgetra e-commerce platform to production.

### 🏗️ Architecture
- **Frontend**: Next.js 14 (Deployed to Vercel)
- **Backend**: Node.js + Express + MongoDB (Deployed to Railway/Render)
- **Database**: MongoDB Atlas
- **Payment**: Razorpay
- **Authentication**: Google OAuth + JWT

---

## 🎯 Step 1: Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free)
- GitHub account

### Steps

1. **Push to GitHub** ✅ (Already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub account
   - Select `dharsha2005/mobile` repository

3. **Configure Vercel**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_APP_NAME=Gadgetra
   NEXT_PUBLIC_APP_DESCRIPTION=Indian E-commerce Platform
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live at `your-app-name.vercel.app`

---

## 🎯 Step 2: Backend Deployment (Railway)

### Prerequisites
- Railway account (free tier available)
- MongoDB Atlas account (free tier available)

### Steps

1. **Setup MongoDB Atlas**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Create a database user
   - Get your connection string

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select `dharsha2005/mobile` repository
   - Set root directory to `backend`

3. **Configure Environment Variables**:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gadgetra
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Google OAuth
   AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=your-google-client-secret
   AUTH_GOOGLE_CALLBACK_URL=https://your-backend-url.railway.app/api/auth/google/callback
   
   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Frontend URL
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Railway will build and deploy your backend
   - Your backend will be live at `your-app-name.railway.app`

---

## 🎯 Step 3: Update Google OAuth Configuration

### Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. **Update Authorized redirect URIs**:
   ```
   https://your-backend-url.railway.app/api/auth/google/callback
   ```
6. Save changes

---

## 🎯 Step 4: Update Frontend Environment

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update `NEXT_PUBLIC_API_BASE_URL`:
   ```
   https://your-backend-url.railway.app/api
   ```
5. Redeploy the frontend

---

## 🎯 Step 5: Test Deployment

### Test Checklist

- [ ] Frontend loads at `your-app-name.vercel.app`
- [ ] Backend health check works at `your-app.railway.app/api/health`
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Products load correctly
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Admin panel works

### Test URLs

```
Frontend: https://your-app-name.vercel.app
Backend API: https://your-app.railway.app/api/health
Admin Panel: https://your-app-name.vercel.app/admin
```

---

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` is set correctly in backend env vars
   - Check that frontend URL is in allowed origins

2. **Google OAuth Errors**:
   - Verify redirect URI matches exactly
   - Check that Google OAuth is enabled in Google Cloud Console

3. **Database Connection**:
   - Verify MongoDB URI is correct
   - Check that IP is whitelisted in MongoDB Atlas
   - Ensure database user has correct permissions

4. **Build Failures**:
   - Check all environment variables are set
   - Verify package.json has correct scripts
   - Check for any missing dependencies

### Debug Commands

```bash
# Check backend logs (Railway)
# Go to Railway dashboard → Your service → Logs

# Check frontend deployment (Vercel)
# Go to Vercel dashboard → Your project → Logs

# Test backend health
curl https://your-backend-url.railway.app/api/health

# Test API endpoints
curl https://your-backend-url.railway.app/api/products
```

---

## 📊 Monitoring

### Railway (Backend)
- Built-in monitoring dashboard
- Log viewing
- Performance metrics
- Error tracking

### Vercel (Frontend)
- Real-time logs
- Performance metrics
- Analytics
- Error tracking

---

## 🔄 CI/CD

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

1. **Push to main branch** → Auto-deploy to production
2. **Push to other branches** → Preview deployments
3. **Pull requests** → Preview deployments

### Environment Management

- **Production**: Main branch
- **Staging**: Develop branch (optional)
- **Feature**: Feature branches (preview)

---

## 💰 Cost Analysis

### Free Tier Limits

**Vercel (Frontend)**:
- 100GB bandwidth/month
- 100 builds/month
- Unlimited static sites

**Railway (Backend)**:
- $5/month after free credits
- 500 hours/month
- 100GB bandwidth/month

**MongoDB Atlas**:
- 512MB storage
- Shared cluster
- Sufficient for development/small apps

### Estimated Monthly Cost

- **Vercel**: $0 (free tier)
- **Railway**: $5 (after free credits)
- **MongoDB Atlas**: $0 (free tier)
- **Total**: ~$5/month for production

---

## 🚀 Production Optimizations

### Performance

1. **Frontend**:
   - Image optimization (Next.js built-in)
   - Code splitting (automatic)
   - Caching (Vercel Edge Network)

2. **Backend**:
   - Database indexing
   - API response caching
   - Compression middleware

### Security

1. **Environment Variables**:
   - Never commit .env files
   - Use different keys for production
   - Rotate secrets regularly

2. **HTTPS**:
   - Automatic SSL certificates
   - Secure cookies only
   - HSTS headers

### Scalability

1. **Horizontal Scaling**:
   - Railway auto-scaling
   - Database connection pooling
   - CDN for static assets

2. **Monitoring**:
   - Error tracking
   - Performance monitoring
   - Uptime monitoring

---

## 🎉 Success!

Once deployed, your Gadgetra e-commerce platform will be:

✅ **Live on the internet**  
✅ **Accessible to users worldwide**  
✅ **Secure and scalable**  
✅ **Ready for business**  

**Congratulations! 🎊**

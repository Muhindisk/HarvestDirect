# Frontend-Backend Connection Setup

## Backend (Server) - Already Deployed ✅
Backend URL: `https://harvest-direct-j626.vercel.app`

### Server Environment Variables Set in Vercel:
Make sure these are configured in your Vercel dashboard for the server:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `INTASEND_API_KEY`, `INTASEND_SECRET_KEY`, `INTASEND_PUBLISHABLE_KEY`
- `CLIENT_URL` - Set to your frontend Vercel URL (once deployed)
- `NODE_ENV=production`

## Frontend (Client) - To Deploy

### Step 1: Set Environment Variables in Vercel
When deploying the client to Vercel, add these environment variables:

```
VITE_API_URL=https://harvest-direct-j626.vercel.app/api
VITE_APP_NAME=HarvestDirect
VITE_IMGBB_API_KEY=ad90f2584fff547a0f171c7400c6d33f
VITE_INTASEND_PUBLIC_KEY=ISPubKey_test_c203be54-62fc-44b7-89ab-64c49c8cf0a6
```

### Step 2: Update CLIENT_URL in Server
After deploying the frontend:
1. Go to your server's Vercel project settings
2. Update the `CLIENT_URL` environment variable to your frontend URL
3. Example: `CLIENT_URL=https://your-app.vercel.app`
4. Redeploy the server

### Step 3: Deploy Frontend
The `.env.production` file is already configured with the correct backend URL.

## Testing the Connection

### Test Backend:
```bash
curl https://harvest-direct-j626.vercel.app/
curl https://harvest-direct-j626.vercel.app/health
```

### Test Frontend → Backend:
Once both are deployed, open your frontend app and:
1. Try logging in or registering
2. Check browser console for any CORS errors
3. Check Network tab to see if API calls are going to the correct URL

## Troubleshooting

### CORS Errors:
- Make sure `CLIENT_URL` is set correctly in server environment variables
- Ensure the frontend URL matches exactly (with https://)

### API Not Found (404):
- Verify `VITE_API_URL` is set correctly in frontend Vercel settings
- Check that it ends with `/api` (not just the base URL)

### Connection Refused:
- Ensure backend is deployed and running
- Test backend health endpoint first

# Deployment Guide

This guide covers deploying the LMS frontend to various platforms.

## Environment Variables

Before deploying, make sure to set the following environment variable:

- `VITE_API_URL`: Your backend API URL

## Vercel Deployment

### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `VITE_API_URL` with your backend URL

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in project settings
4. Deploy automatically on push

## Netlify Deployment

### Method 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### Method 2: Git Integration

1. Update `netlify.toml` with your backend URL
2. Push to GitHub/GitLab
3. Connect repository to Netlify
4. Set environment variables in site settings
5. Deploy automatically

## Render Deployment

1. Update `render.yaml` with your backend URL
2. Connect your repository to Render
3. Create a new static site
4. Set environment variables:
   - `VITE_API_URL`: Your backend URL
5. Deploy

## Manual Deployment

For any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder contents to your hosting service

3. Configure redirects to serve `index.html` for all routes

## Backend Requirements

Make sure your backend:

1. Is deployed and accessible
2. Has CORS configured for your frontend domain
3. Serves the required API endpoints
4. Uses HTTPS in production

## Environment Configuration

### Development
```bash
VITE_API_URL=http://localhost:5000/api
```

### Production
```bash
VITE_API_URL=https://your-backend-domain.com/api
```

## Troubleshooting

### Common Issues

1. **404 on page refresh**: Configure your hosting to serve `index.html` for all routes
2. **API calls failing**: Check CORS configuration on backend
3. **Environment variables not working**: Make sure they start with `VITE_`
4. **Build failures**: Check Node.js version compatibility

### Vercel Specific

- Use `vercel.json` for redirects and environment variables
- Set environment variables in project dashboard
- Check build logs for errors

### Netlify Specific

- Use `netlify.toml` for configuration
- Set environment variables in site settings
- Check deploy logs for issues

### Render Specific

- Use `render.yaml` for configuration
- Environment variables set in service settings
- Check build and deploy logs

## Security Considerations

1. Never commit `.env` files with sensitive data
2. Use environment variables for all configuration
3. Enable HTTPS in production
4. Configure proper CORS on backend
5. Use secure authentication tokens

## Performance Optimization

1. Enable gzip compression on your hosting service
2. Configure proper caching headers
3. Use CDN for static assets
4. Optimize images and assets
5. Enable tree shaking in build process

## Monitoring

Consider setting up:

1. Error tracking (Sentry, LogRocket)
2. Analytics (Google Analytics, Mixpanel)
3. Performance monitoring
4. Uptime monitoring

## Backup and Recovery

1. Keep your code in version control
2. Document your deployment process
3. Have rollback procedures ready
4. Monitor deployment health
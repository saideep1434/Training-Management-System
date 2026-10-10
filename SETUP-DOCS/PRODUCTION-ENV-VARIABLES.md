# 🔐 Production Environment Variables

**CRITICAL**: Set these environment variables in your Render.com dashboard before deploying.

---

## Required Environment Variables for Render

### Database Configuration (Neon PostgreSQL)
```bash
DATABASE_URL=<your-neon-postgresql-connection-string>
DB_USERNAME=<your-neon-username>
DB_PASSWORD=<your-neon-password>
```

### JWT Configuration (CRITICAL - NEWLY GENERATED)
```bash
JWT_SECRET=UCzO/J/KQ2HRFUUV2y1C+ilyE+dwDmYt9OGO7y53/H3gS4mtsHWNJzVKqyDQ8TSL02C717z0rzP5BLdmTSePdw==
JWT_EXPIRATION_MS=86400000
```
**⚠️ IMPORTANT**: This JWT secret was randomly generated on December 10, 2025. Never commit this to Git!

### CORS Configuration
```bash
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
```
Replace with your actual Netlify frontend URL. For multiple origins, use comma-separated values:
```bash
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app,https://custom-domain.com
```

### Email Configuration (Optional - for notifications)
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your-email@gmail.com>
MAIL_PASSWORD=<your-app-specific-password>
```

### Other Configuration
```bash
PORT=8083
SPRING_PROFILES_ACTIVE=prod
```

---

## How to Set Environment Variables in Render

1. **Login to Render**: https://dashboard.render.com/
2. **Navigate to Your Backend Service**
3. **Go to "Environment" Tab**
4. **Add Environment Variables**:
   - Click "Add Environment Variable"
   - Enter `Key` and `Value` from the list above
   - Click "Save Changes"

5. **Trigger Redeploy**: After adding all variables, click "Manual Deploy" → "Deploy latest commit"

---

## Security Checklist

- [x] Strong JWT secret generated (64 bytes, cryptographically random)
- [x] CORS restricted to specific frontend origins
- [x] Admin endpoints protected with role-based access
- [x] Password logging removed
- [x] BCrypt password hashing enabled
- [ ] Environment variables set in Render
- [ ] Frontend CORS_ALLOWED_ORIGINS matches Netlify URL

---

## Testing After Deployment

1. **Check Backend Health**: 
   ```bash
   curl https://your-backend.onrender.com/actuator/health
   ```

2. **Monitor Password Migration Logs**:
   - Go to Render Dashboard → Your Service → Logs
   - Look for `[PasswordMigration]` messages
   - Should see: "Migration complete - Migrated: X, Skipped: Y, Errors: 0"

3. **Test Login**:
   - Use your frontend to login
   - Check that JWT token is returned
   - Verify role-based access works

---

## Netlify Environment Variables

Set this in Netlify → Site Settings → Environment Variables:

```bash
API_BASE_URL=https://your-backend.onrender.com/api
```

This will be used by `environment.prod.ts` during production builds.

---

**Generated**: December 10, 2025  
**Status**: Ready for production deployment

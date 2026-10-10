# 🔧 Environment Setup Guide: Local vs Production

This guide clearly explains how to configure environment variables for **local development** vs **production deployment**.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Frontend Configuration](#frontend-configuration)
3. [Backend Configuration](#backend-configuration)
4. [Quick Reference Tables](#quick-reference-tables)
5. [Step-by-Step Setup](#step-by-step-setup)

---

## 🎯 Overview

The application uses **different configuration files** for local and production environments:

### **Frontend (Angular)**
- **Local**: `src/environments/environment.ts` (used by `npm start`)
- **Production**: `src/environments/environment.prod.ts` (used by `npm run build`)

### **Backend (Spring Boot)**
- **Local**: `src/main/resources/application.properties` (default)
- **Production**: `src/main/resources/application-prod.properties` + environment variables

---

## 🎨 Frontend Configuration

### **Local Development** (`environment.ts`)

**File**: `Genc Training Portal Client/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'  // ← Local backend URL
};
```

**When it's used**: When you run `npm start` or `ng serve`

**What to change**:
- Update `apiBaseUrl` to match your local backend port
- Default backend runs on `http://localhost:8080`

---

### **Production Deployment** (`environment.prod.ts`)

**File**: `Genc Training Portal Client/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://training-management-system-dyy0.onrender.com/api'  // ← Deployed backend URL
};
```

**When it's used**: When you run `npm run build` (production build)

**What to change**:
- Update `apiBaseUrl` to your deployed backend URL (Render, Railway, etc.)
- Must include `/api` suffix
- Must use `https://` for production

---

### **How Angular Chooses the File**

Angular automatically selects the correct environment file based on the build configuration:

```bash
# Uses environment.ts (local)
npm start
ng serve

# Uses environment.prod.ts (production)
npm run build
ng build --configuration production
```

---

## ⚙️ Backend Configuration

### **Local Development** (`application.properties`)

**File**: `Genc Training Portal Server/src/main/resources/application.properties`

```properties
# ============================================
# LOCAL DEVELOPMENT CONFIGURATION
# ============================================

# Database (MySQL - Local)
spring.datasource.url=jdbc:mysql://localhost:3306/tms_db
spring.datasource.username=root
spring.datasource.password=new_password

# Server Port
server.port=8080

# JWT Configuration (Hardcoded for local testing)
app.jwt.secret=yourVeryStrongAndSecureSecretKeyForJWTAuthenticationWhichShouldBeLongerThan256Bits
app.jwt.expiration-ms=86400000

# Email Configuration (Hardcoded)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=saranprakash3112@gmail.com
spring.mail.password=xossgfyrsltmzzgf

# CORS (Allow local frontend)
cors.allowed.origins=http://localhost:4200

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**When it's used**: When you run `mvn spring-boot:run` (no profile specified)

**What to change**:
- Database credentials (if different)
- Server port (if 8080 is taken)
- Email credentials (for testing email features)

---

### **Production Deployment** (`application-prod.properties`)

**File**: `Genc Training Portal Server/src/main/resources/application-prod.properties`

```properties
# ============================================
# PRODUCTION CONFIGURATION
# ============================================

# Database (PostgreSQL - Environment Variables)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Server Port (Dynamic from hosting platform)
server.port=${PORT:8080}

# JWT Configuration (Environment Variables)
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}

# Email Configuration (Environment Variables)
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

# CORS (Environment Variable)
cors.allowed.origins=${CORS_ALLOWED_ORIGINS:http://localhost:4200}

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**When it's used**: When you deploy to Render/Railway with `SPRING_PROFILES_ACTIVE=prod`

**What to change**: Set these **environment variables** on your hosting platform (Render, Railway, etc.):

| Variable | Example Value | Required |
|----------|--------------|----------|
| `DATABASE_URL` | `jdbc:postgresql://host/db?sslmode=require` | ✅ |
| `DB_USERNAME` | `neondb_owner` | ✅ |
| `DB_PASSWORD` | `your_secure_password` | ✅ |
| `JWT_SECRET` | `64-char-random-string` | ✅ |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.netlify.app` | ✅ |
| `MAIL_USERNAME` | `your-email@gmail.com` | ⚠️ |
| `MAIL_PASSWORD` | `your-app-password` | ⚠️ |

---

### **How Spring Boot Chooses the File**

Spring Boot uses **profiles** to select configuration:

```bash
# Uses application.properties (local)
mvn spring-boot:run

# Uses application-prod.properties (production)
mvn spring-boot:run -Dspring.profiles.active=prod

# Or set environment variable:
export SPRING_PROFILES_ACTIVE=prod
java -jar app.jar
```

On **Render/Railway**, set environment variable:
```
SPRING_PROFILES_ACTIVE=prod
```

---

## 📊 Quick Reference Tables

### **Frontend Environment Files**

| Environment | File | Used By | API Base URL |
|-------------|------|---------|--------------|
| **Local** | `environment.ts` | `npm start` | `http://localhost:8080/api` |
| **Production** | `environment.prod.ts` | `npm run build` | `https://your-backend.onrender.com/api` |

---

### **Backend Configuration Files**

| Environment | File | Activated By | Database |
|-------------|------|--------------|----------|
| **Local** | `application.properties` | Default (no profile) | MySQL (localhost) |
| **Production** | `application-prod.properties` | `SPRING_PROFILES_ACTIVE=prod` | PostgreSQL (Neon/Cloud) |

---

### **Backend Environment Variables (Production Only)**

| Variable | Source | Example |
|----------|--------|---------|
| `DATABASE_URL` | Neon/Railway/Render | `jdbc:postgresql://ep-xyz.aws.neon.tech/db?sslmode=require` |
| `DB_USERNAME` | Neon Dashboard | `neondb_owner` |
| `DB_PASSWORD` | Neon Dashboard | `npg_xyz123` |
| `JWT_SECRET` | Generate yourself | `openssl rand -base64 64` |
| `CORS_ALLOWED_ORIGINS` | Netlify URL | `https://your-app.netlify.app` |
| `PORT` | Auto-set by Render | `8080` (Render assigns) |

---

## 🚀 Step-by-Step Setup

### **Scenario 1: Local Development (Full Stack)**

#### **Frontend Setup**

1. Navigate to frontend folder:
   ```bash
   cd "Genc Training Portal Client"
   ```

2. Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'http://localhost:8080/api'  // ← Match your backend port
   };
   ```

3. Start frontend:
   ```bash
   npm install
   npm start
   ```
   **Runs on**: `http://localhost:4200`

#### **Backend Setup**

1. Navigate to backend folder:
   ```bash
   cd "Genc Training Portal Server"
   ```

2. Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/tms_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   server.port=8080
   ```

3. Start backend:
   ```bash
   mvn spring-boot:run
   ```
   **Runs on**: `http://localhost:8080`

4. Test:
   ```bash
   curl http://localhost:8080/api/health
   ```

---

### **Scenario 2: Local Frontend + Cloud Backend**

**Use Case**: Test frontend against deployed backend (debugging production issues)

#### **Frontend Setup**

1. Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'https://training-management-system-dyy0.onrender.com/api'  // ← Cloud URL
   };
   ```

2. Start frontend:
   ```bash
   npm start
   ```

3. **Important**: Make sure your cloud backend allows CORS from `http://localhost:4200`:
   - On Render, set: `CORS_ALLOWED_ORIGINS=http://localhost:4200,https://your-netlify-app.netlify.app`

---

### **Scenario 3: Production Deployment (Netlify + Render)**

#### **Frontend (Netlify)**

1. Edit `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiBaseUrl: 'https://training-management-system-dyy0.onrender.com/api'
   };
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push origin main
   ```

3. Netlify auto-deploys from GitHub (configured in `netlify.toml`)

#### **Backend (Render)**

1. Go to [Render Dashboard](https://dashboard.render.com) → Your Service → Environment

2. Set these environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://ep-winter-rain-xyz.aws.neon.tech/neondb?sslmode=require
   DB_USERNAME=neondb_owner
   DB_PASSWORD=your_password
   JWT_SECRET=your_64_char_secret_key
   CORS_ALLOWED_ORIGINS=https://your-app.netlify.app
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```

3. Commit and push backend code:
   ```bash
   git add .
   git commit -m "Update production config"
   git push origin main
   ```

4. Render auto-deploys from GitHub

5. Verify:
   ```bash
   curl https://training-management-system-dyy0.onrender.com/api/health
   ```

---

### **Scenario 4: Docker Local Development**

**Use Case**: Run entire stack in Docker containers

#### **Setup**

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env`:
   ```bash
   # Local MySQL for Docker
   MYSQL_ROOT_PASSWORD=new_password
   MYSQL_DATABASE=tms_db
   
   # Backend will use these via docker-compose
   SERVER_PORT=8080
   ```

3. Start Docker stack:
   ```bash
   docker-compose up -d
   ```

4. Update frontend `environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'http://localhost:8080/api'
   };
   ```

---

## ⚠️ Common Mistakes & Solutions

### **Mistake 1: Wrong API URL in Frontend**

**Symptom**: `CORS error` or `net::ERR_CONNECTION_REFUSED`

**Solution**:
- **Local**: Use `http://localhost:8080/api` (must include `/api`)
- **Production**: Use `https://your-backend.onrender.com/api`
- Always include `/api` suffix

---

### **Mistake 2: Forgot to Set Production Profile**

**Symptom**: Backend uses local MySQL settings in production

**Solution**: Set environment variable on Render/Railway:
```
SPRING_PROFILES_ACTIVE=prod
```

---

### **Mistake 3: CORS Not Configured**

**Symptom**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Update backend CORS settings:
- **Local**: `cors.allowed.origins=http://localhost:4200`
- **Production**: `CORS_ALLOWED_ORIGINS=https://your-app.netlify.app`

---

### **Mistake 4: Using `environment.ts` in Production Build**

**Symptom**: Production app points to `localhost`

**Solution**: Use production build command:
```bash
# ❌ Wrong (uses environment.ts)
npm start

# ✅ Correct (uses environment.prod.ts)
npm run build
```

---

## 🔐 Security Best Practices

### **DO NOT Commit Secrets**

❌ **Never commit**:
- Database passwords
- JWT secrets
- Email passwords
- API keys

✅ **Instead**:
- Use `.env` files (add to `.gitignore`)
- Use environment variables on hosting platforms
- Use `.env.example` as a template (safe to commit)

---

### **Separate Local and Production Secrets**

| Environment | Storage Method |
|-------------|---------------|
| **Local** | `.env` file (gitignored) or hardcoded in `application.properties` |
| **Production** | Environment variables on Render/Railway/Netlify |

---

## 📝 Cheat Sheet

### **Check Current Configuration**

```bash
# Frontend: Which environment file is active?
npm start          # Uses environment.ts
npm run build      # Uses environment.prod.ts

# Backend: Which profile is active?
mvn spring-boot:run                           # Uses application.properties
mvn spring-boot:run -Dspring.profiles.active=prod  # Uses application-prod.properties
```

---

### **Update Frontend API URL**

```bash
# Local Development
vi "Genc Training Portal Client/src/environments/environment.ts"
# Change: apiBaseUrl: 'http://localhost:8080/api'

# Production
vi "Genc Training Portal Client/src/environments/environment.prod.ts"
# Change: apiBaseUrl: 'https://your-backend.onrender.com/api'
```

---

### **Update Backend Configuration**

```bash
# Local Development
vi "Genc Training Portal Server/src/main/resources/application.properties"
# Edit database, port, etc.

# Production: Set on Render Dashboard
# Go to: Dashboard → Service → Environment → Add Environment Variable
```

---

## 🎯 Summary

| Aspect | Local | Production |
|--------|-------|------------|
| **Frontend Config** | `environment.ts` | `environment.prod.ts` |
| **Backend Config** | `application.properties` | `application-prod.properties` + env vars |
| **Database** | MySQL (localhost) | PostgreSQL (Neon Cloud) |
| **How to Activate** | `npm start` / `mvn spring-boot:run` | `npm run build` / `SPRING_PROFILES_ACTIVE=prod` |
| **API URL** | `http://localhost:8080/api` | `https://backend.onrender.com/api` |
| **CORS** | `http://localhost:4200` | `https://app.netlify.app` |
| **Secrets** | Hardcoded or `.env` | Environment variables |

---

## 📞 Need Help?

- 📧 **Email**: harikuchipudi1@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/SARAN1231/Training-Management-System/issues)
- 📚 **Main README**: [README.md](README.md)

---

**Last Updated**: December 10, 2025  
**Version**: 2.0

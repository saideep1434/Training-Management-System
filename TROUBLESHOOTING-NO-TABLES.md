# 🔍 Troubleshooting: Hibernate Not Creating Tables

**Problem**: Backend deployed but no tables created in Neon PostgreSQL

---

## ✅ **Checklist - Do This in Order**

### **1. Check Render Environment Variables**

Go to https://dashboard.render.com/ → Your Service → "Environment" tab

**MUST HAVE these variables set:**

```bash
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=postgresql://user:pass@host/database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**⚠️ Common Mistakes:**
- ❌ `SPRING_PROFILES_ACTIVE` not set → uses local MySQL config instead
- ❌ `DATABASE_URL` format wrong → connection fails silently
- ❌ `DB_USERNAME` missing → authentication fails

---

### **2. Check Neon Connection String Format**

Your Neon connection string should look like:
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/databasename?sslmode=require
```

**Split it into these environment variables in Render:**

```bash
# Full URL (includes everything)
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/databasename?sslmode=require

# OR split into parts:
DATABASE_URL=jdbc:postgresql://ep-xxx-xxx.region.aws.neon.tech/databasename?sslmode=require
DB_USERNAME=username
DB_PASSWORD=password
```

**⚠️ Note**: If using `DATABASE_URL`, it should include `jdbc:` prefix OR you need to extract username/password separately.

---

### **3. Check Render Deployment Logs**

Go to Render Dashboard → Your Service → "Logs" tab

**Look for these GOOD signs:**
```
✅ Started TraineeManagementSystemApplication
✅ Tomcat started on port 8083
✅ Hibernate: create table register_associate
✅ HikariPool-1 - Start completed
```

**Look for these BAD signs:**
```
❌ Failed to configure a DataSource
❌ Access denied for user
❌ Unknown database
❌ Connection refused
❌ Communications link failure
❌ SSL connection failed
```

If you see errors, copy them - we'll fix them!

---

### **4. Verify Render Service is Running**

Check Render dashboard:
- Status should show **"Live"** (green dot)
- Latest deploy should show **"Deploy succeeded"**
- Not showing "Deploy failed" or "Deploying..."

---

### **5. Test Database Connection Manually**

**In Render Shell** (if available) or check logs:

The backend should log something like:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Initialized JPA EntityManagerFactory for persistence unit 'default'
```

If you DON'T see this, database connection failed!

---

## 🔧 **Solution Based on Issue**

### **Issue A: "SPRING_PROFILES_ACTIVE not set"**

**Symptom**: Backend tries to connect to MySQL (localhost) instead of PostgreSQL

**Solution**:
1. Go to Render → Environment → Add variable
2. Key: `SPRING_PROFILES_ACTIVE`
3. Value: `prod`
4. Save → Redeploy

---

### **Issue B: "Failed to configure a DataSource"**

**Symptom**: Logs show datasource configuration error

**Solution**: Set these THREE variables in Render:

```bash
DATABASE_URL=jdbc:postgresql://ep-xxx-xxx.region.aws.neon.tech:5432/your-database?sslmode=require
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

**How to get these from Neon:**
1. Go to https://console.neon.tech/
2. Select your project
3. Click "Connection Details"
4. Copy the connection string
5. Extract host, database name, username, password

---

### **Issue C: "Unknown database" or "Database does not exist"**

**Symptom**: Connection works but database not found

**Solution**:
1. Go to Neon console
2. Check your database name (usually `neondb` or custom name)
3. Update `DATABASE_URL` with correct database name

Example:
```bash
# Wrong:
DATABASE_URL=jdbc:postgresql://host/wrong-name

# Right:
DATABASE_URL=jdbc:postgresql://host/neondb
```

---

### **Issue D: "Access denied" or "Authentication failed"**

**Symptom**: Can't login to database

**Solution**:
1. Go to Neon console → Database → Roles
2. Copy EXACT username (case-sensitive!)
3. Reset password if needed
4. Update Render env vars with EXACT values

---

## 🚀 **Manual Table Creation (Fallback)**

If Hibernate still won't create tables, create them manually:

### **Step 1: Connect to Neon SQL Editor**

Go to https://console.neon.tech/ → Your Database → SQL Editor

### **Step 2: Run This Minimal Schema**

```sql
-- Core user authentication table (MUST HAVE THIS!)
CREATE TABLE IF NOT EXISTS register_associate (
    id BIGSERIAL PRIMARY KEY,
    associate_name VARCHAR(255),
    associate_id VARCHAR(255) UNIQUE,
    associate_email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Verify it was created
SELECT * FROM register_associate;
```

### **Step 3: Restart Backend**

Go to Render → Manual Deploy → "Deploy latest commit"

Hibernate will now create the **remaining tables** automatically!

### **Step 4: Check Logs**

You should now see:
```
Hibernate: create table cohort (...)
Hibernate: create table trainee (...)
... (all other tables)
```

---

## 🎯 **Quick Diagnostic**

**Tell me what you see in Render logs, and I'll tell you exactly what's wrong:**

### **Scenario 1: No logs at all**
→ Deployment failed, check "Events" tab

### **Scenario 2: Logs show "Started on port 8083"**
→ Backend started successfully! Tables should be created.
→ Check Neon console to refresh and see tables

### **Scenario 3: Logs show MySQL errors**
→ `SPRING_PROFILES_ACTIVE=prod` not set!
→ Backend using local config instead of production

### **Scenario 4: Logs show "DataSource error"**
→ `DATABASE_URL` is wrong or missing
→ Fix connection string format

### **Scenario 5: Logs show "Access denied"**
→ Username/password incorrect
→ Check Neon credentials

---

## 📋 **What to Send Me for Help**

If still not working, copy these from Render and share:

1. **Environment Variables** (hide passwords!):
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://host/database (hide password)
   DB_USERNAME=username
   ```

2. **Last 30 lines of logs**:
   - Go to Render → Logs
   - Copy the startup section
   - Look for errors in red

3. **Neon Connection String format**:
   - Go to Neon → Connection Details
   - Tell me if it's "Connection string" or "JDBC URL"

---

## 🔍 **Expected Successful Startup Logs**

When everything works correctly, you should see this in Render logs:

```
2025-12-10T15:30:00Z Starting TraineeManagementSystemApplication using Java 17
2025-12-10T15:30:01Z The following 1 profile is active: "prod"
2025-12-10T15:30:05Z HikariPool-1 - Starting...
2025-12-10T15:30:06Z HikariPool-1 - Start completed.
2025-12-10T15:30:07Z Initialized JPA EntityManagerFactory
2025-12-10T15:30:08Z Hibernate: create table if not exists register_associate (...)
2025-12-10T15:30:08Z Hibernate: create table if not exists cohort (...)
2025-12-10T15:30:08Z Hibernate: create table if not exists trainee (...)
... (more create table statements)
2025-12-10T15:30:12Z Started TraineeManagementSystemApplication in 12.5 seconds
2025-12-10T15:30:12Z Tomcat started on port 8083
```

If you see this → **SUCCESS!** Tables are created in Neon.

---

## ✅ **Next Steps**

1. Check Render environment variables
2. Copy and share Render logs (last 30 lines)
3. I'll diagnose the exact issue
4. We'll fix it together!

**Ready to troubleshoot?** Share what you see in Render logs! 🚀

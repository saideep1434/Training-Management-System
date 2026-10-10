# 📊 TRAINEE BULK UPLOAD GUIDE

## 🎯 Overview

Your application has a **complete bulk upload system** for trainees already implemented! This guide will help you use it correctly.

---

## ✅ What's Already Working

### **Backend** (All Implemented ✅)
1. ✅ **Bulk Upsert Endpoint**: `/api/trainee/bulk-upsert`
2. ✅ **Smart Matching**: Matches by `traineeAssociateId` first, then by `traineeEmail`
3. ✅ **Upsert Logic**: Creates new or updates existing trainees
4. ✅ **Domain Mapping**: Maps domain by name (looks up in domain table)
5. ✅ **Skills Support**: Stores comma-separated skills
6. ✅ **Cohort Assignment**: Can assign to cohort (optional)
7. ✅ **Error Handling**: Returns per-row status (CREATED, UPDATED, SKIPPED, FAILED)

### **Frontend** (All Implemented ✅)
1. ✅ **CSV Upload Component**: `trainee-upload.component.ts`
2. ✅ **CSV Parser**: Handles quoted fields, commas, line breaks
3. ✅ **Draft Save/Load**: Saves progress to localStorage
4. ✅ **Result Report**: Shows which rows succeeded/failed
5. ✅ **Update Mode**: Toggle between create-only or update-existing

---

## 📋 **CSV File Format**

### **Required Columns** (Must have these exact headers)
```csv
traineeName,traineeAssociateId,traineeEmail,domainName,skills
```

### **Column Descriptions**

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `traineeName` | ✅ Yes | Full name of trainee | "John Doe" |
| `traineeAssociateId` | ✅ Yes | Unique associate ID (5-20 chars) | "TRAIN001" |
| `traineeEmail` | ✅ Yes | Valid email address | "john.doe@company.com" |
| `domainName` | ⚪ Optional | Domain name (must exist in DB) | "Technology" |
| `skills` | ⚪ Optional | Comma-separated skills | "Java,Python,SQL" |

---

## 📝 **Sample CSV File**

### **Example 1: Basic Upload**
```csv
traineeName,traineeAssociateId,traineeEmail,domainName,skills
John Doe,TRAIN001,john.doe@company.com,Technology,Java Python SQL
Jane Smith,TRAIN002,jane.smith@company.com,Technology,React Angular TypeScript
Bob Johnson,TRAIN003,bob.johnson@company.com,Business,Excel PowerPoint
Alice Williams,TRAIN004,alice.williams@company.com,Technology,AWS Docker Kubernetes
```

### **Example 2: With Quoted Fields (for commas in names)**
```csv
traineeName,traineeAssociateId,traineeEmail,domainName,skills
"Doe, John",TRAIN001,john.doe@company.com,Technology,Java Python SQL
"Smith, Jane",TRAIN002,jane.smith@company.com,Technology,React Angular TypeScript
```

### **Example 3: Minimal (No Domain/Skills)**
```csv
traineeName,traineeAssociateId,traineeEmail
John Doe,TRAIN001,john.doe@company.com
Jane Smith,TRAIN002,jane.smith@company.com
Bob Johnson,TRAIN003,bob.johnson@company.com
```

---

## 🚀 **How to Upload Trainees**

### **Step 1: Prepare Your CSV File**

1. Create a CSV file with the columns mentioned above
2. Use Excel, Google Sheets, or text editor
3. Ensure headers match exactly: `traineeName`, `traineeAssociateId`, `traineeEmail`
4. Save as **CSV (UTF-8)** format

**Excel/Google Sheets Tips**:
- First row = headers
- Each subsequent row = one trainee
- Use quotes around fields with commas (Excel does this automatically)
- Save as "CSV UTF-8" in Excel or "Download as CSV" in Google Sheets

---

### **Step 2: Access the Upload Page**

1. Login to admin dashboard
2. Navigate to **Trainees** section
3. Click **"Upload Trainees"** or **"Bulk Upload"** button
4. You'll see the upload interface

---

### **Step 3: Upload the CSV**

1. **Click "Choose File"** and select your CSV
2. **Review the Preview Table**:
   - Check that data parsed correctly
   - Verify all rows are shown
   - Check for missing required fields

3. **Choose Upload Mode**:
   - ✅ **"Update Existing"** (default): Updates existing trainees if found
   - ⬜ **"Create Only"**: Skips existing trainees, only creates new ones

4. **Click "Upload" button**

---

### **Step 4: Review Results**

After upload completes, you'll see a summary:

**Success Message Example**:
```
Bulk upsert complete. Created: 45, Updated: 5, Skipped: 0, Failed: 0
```

**Result Report** (if any issues):
- Shows rows that were **SKIPPED** or **FAILED**
- Includes reason for each failure
- You can fix and re-upload just the failed rows

---

## 🔧 **Upload Behavior**

### **How Matching Works**

The system matches existing trainees using this logic:

1. **First**: Try to find by `traineeAssociateId`
2. **If not found**: Try to find by `traineeEmail`
3. **If still not found**: Create new trainee

### **Update Existing = TRUE** (Default)
```
Row in CSV → Check if exists → If YES: Update fields
                             → If NO:  Create new
```

**What gets updated**:
- ✅ Trainee Name
- ✅ Email
- ✅ Domain (if provided)
- ✅ Skills (if provided)
- ⚠️ **Does NOT update**: Cohort assignment (use separate assign feature)

### **Update Existing = FALSE**
```
Row in CSV → Check if exists → If YES: Skip (report as SKIPPED)
                             → If NO:  Create new
```

Use this mode when you **only want to add new trainees** without modifying existing ones.

---

## ⚠️ **Common Issues & Solutions**

### **Issue 1: "No rows parsed. Check CSV"**

**Causes**:
- CSV is empty
- Headers are missing or wrong
- File encoding issue

**Fix**:
1. Open CSV in text editor
2. Verify first line has: `traineeName,traineeAssociateId,traineeEmail`
3. Ensure there's at least one data row
4. Save as UTF-8 encoding

---

### **Issue 2: "Domain not found" or Domain not assigned**

**Cause**: The `domainName` in your CSV doesn't match any domain in the database

**Fix**:
1. Check existing domains in admin dashboard → Domains page
2. Use **exact name** from database (case-sensitive)
3. Or leave `domainName` column empty (can assign later)

**Example**:
```csv
❌ Wrong: "Tech","technology","TECHNOLOGY"
✅ Right: "Technology"  (must match DB exactly)
```

---

### **Issue 3: Associate ID already exists**

**Cause**: You're trying to upload a trainee with an associate ID that already exists

**Fix**:
- If you want to **update** the existing trainee: Use `updateExisting = true`
- If you want to **skip** the existing trainee: Use `updateExisting = false`
- If it's truly a duplicate: Remove the row from CSV

---

### **Issue 4: Email validation failed**

**Cause**: Email format is invalid

**Fix**:
- Ensure email has format: `name@domain.com`
- No spaces before/after
- Valid domain extension (.com, .org, etc.)

---

### **Issue 5: CSV has extra columns**

**No Problem!** The parser ignores extra columns. Only these are used:
- `traineeName`
- `traineeAssociateId`
- `traineeEmail`
- `domainName` (optional)
- `skills` (optional)

---

## 📊 **Backend API Details**

### **Endpoint**
```
POST /api/trainee/bulk-upsert?updateExisting=true
```

### **Request Body** (JSON Array)
```json
[
  {
    "traineeName": "John Doe",
    "traineeAssociateId": "TRAIN001",
    "traineeEmail": "john.doe@company.com",
    "domainName": "Technology",
    "skills": "Java,Python,SQL",
    "cohortId": null
  },
  {
    "traineeName": "Jane Smith",
    "traineeAssociateId": "TRAIN002",
    "traineeEmail": "jane.smith@company.com",
    "domainName": "Technology",
    "skills": "React,Angular",
    "cohortId": null
  }
]
```

### **Response** (JSON)
```json
{
  "status": 200,
  "message": "Bulk upsert complete. Created: 45, Updated: 5, Skipped: 0, Failed: 0",
  "bulkResults": [
    {
      "index": 0,
      "traineeAssociateId": "TRAIN001",
      "traineeEmail": "john.doe@company.com",
      "status": "CREATED",
      "reason": null
    },
    {
      "index": 1,
      "traineeAssociateId": "TRAIN002",
      "traineeEmail": "jane.smith@company.com",
      "status": "UPDATED",
      "reason": null
    }
  ]
}
```

---

## 🧪 **Testing the Upload**

### **Test 1: Create 3 New Trainees**

**CSV File** (`test-trainees.csv`):
```csv
traineeName,traineeAssociateId,traineeEmail,domainName,skills
Test User 1,TEST001,test1@company.com,Technology,Java Python
Test User 2,TEST002,test2@company.com,Technology,React Angular
Test User 3,TEST003,test3@company.com,,Excel
```

**Expected Result**:
```
Created: 3, Updated: 0, Skipped: 0, Failed: 0
```

---

### **Test 2: Update Existing Trainee**

1. Upload the same CSV again
2. Change `Test User 1` name to `Modified User 1`

**Expected Result** (with `updateExisting=true`):
```
Created: 0, Updated: 3, Skipped: 0, Failed: 0
```

**Expected Result** (with `updateExisting=false`):
```
Created: 0, Updated: 0, Skipped: 3, Failed: 0
```

---

## 🎯 **Best Practices**

### **1. Start Small**
- Upload 5-10 trainees first to test
- Verify they appear correctly
- Then upload full list

### **2. Use Consistent IDs**
- Use a naming pattern: `TRAIN001`, `TRAIN002`, etc.
- Or use employee IDs from HR system
- Keep IDs unique and permanent

### **3. Verify Domains Exist First**
- Go to Domains page in admin dashboard
- Note exact spelling of domain names
- Use exact names in CSV

### **4. Save Drafts**
- Use the "Save Draft" button while preparing
- Drafts are saved in browser localStorage
- Reload page and click "Load Draft" to continue

### **5. Review Failed Rows**
- After upload, check the report table
- Fix only the failed rows
- Re-upload just those rows

---

## 🔄 **Workflow for Large Uploads**

### **Recommended Process**:

1. **Export from HR System**
   - Get trainee list as Excel/CSV
   - Should have: Name, ID, Email

2. **Clean Data**
   - Remove duplicates
   - Fix email formats
   - Add domain names (if known)

3. **Test Upload (10 rows)**
   - Upload small sample first
   - Verify in admin dashboard
   - Check domains are mapped correctly

4. **Full Upload**
   - Upload complete list
   - Review summary message
   - Check for failed rows

5. **Fix Failures**
   - Export failed rows from report
   - Fix issues (wrong domain, invalid email, etc.)
   - Re-upload just the fixed rows

6. **Assign to Cohorts** (Optional)
   - Go to Trainees List page
   - Select trainees
   - Click "Assign to Cohort"

---

## 🛠️ **Manual Database Insert** (Alternative)

If you prefer to load data directly into the database using SQL:

### **SQL Insert Example**:
```sql
-- Insert into trainee table
INSERT INTO trainee (trainee_name, trainee_associate_id, trainee_email, domain_id, skills, cohort_id)
VALUES 
  ('John Doe', 'TRAIN001', 'john.doe@company.com', 
   (SELECT domain_id FROM domain WHERE domain_name = 'Technology'), 
   'Java,Python,SQL', 
   NULL),
  ('Jane Smith', 'TRAIN002', 'jane.smith@company.com', 
   (SELECT domain_id FROM domain WHERE domain_name = 'Technology'), 
   'React,Angular,TypeScript', 
   NULL);
```

**Note**: The bulk upload UI is much easier and safer than manual SQL!

---

## 📚 **Related Features**

After uploading trainees, you can:

1. **Filter Trainees**:
   - By domain
   - By skills
   - Show only unassigned

2. **Assign to Cohort**:
   - Select multiple trainees
   - Assign all at once to a cohort

3. **Update Individual Trainee**:
   - Edit name, email, domain, skills
   - Reassign to different cohort

4. **Delete Trainees**:
   - Remove individual trainees
   - Bulk delete (select multiple)

---

## 🎉 **Summary**

Your trainee upload system is **fully functional**! Here's what to do:

1. ✅ Prepare CSV with required columns
2. ✅ Navigate to Trainee Upload page
3. ✅ Upload CSV file
4. ✅ Review preview table
5. ✅ Click Upload button
6. ✅ Check results summary
7. ✅ Fix any failed rows and re-upload

**The system handles**:
- ✅ CSV parsing
- ✅ Data validation
- ✅ Duplicate detection
- ✅ Domain mapping
- ✅ Error reporting
- ✅ Batch processing

No code changes needed - just follow this guide! 🚀

---

## 🆘 **Need Help?**

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify backend is running (check `/api/trainee/all-trainees`)
3. Ensure domains exist in database before mapping
4. Use "Save Draft" to preserve your work
5. Test with small CSV first (5 rows)

Let me know if you need help with any specific error messages!

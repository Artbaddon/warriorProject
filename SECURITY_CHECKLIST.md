# 🔒 Security Checklist for Warriors Project

## ✅ **Files Already Protected by .gitignore**

### Environment Variables
- ✅ `.env` files (all variants)
- ✅ Database credentials
- ✅ JWT secrets
- ✅ API keys

### Database Files
- ✅ Local database files (`.db`, `.sqlite`)
- ✅ Database backups and dumps
- ✅ Database configuration files

### Uploaded Files
- ✅ User uploaded images and files
- ✅ Temporary upload files

### System Files
- ✅ Node modules
- ✅ Log files
- ✅ System generated files
- ✅ Editor configurations

## 🚨 **CRITICAL - Review These Files Before Committing**

### 1. Database Schema (warriorsdb.sql)
**Status:** ⚠️ **REVIEW REQUIRED**
- Contains database structure - generally safe
- Check for any hardcoded passwords or sensitive data
- **Action:** Review and ensure no secrets are embedded

### 2. Configuration Files
Check for any hardcoded values in:
- `backend/config/db/connectMysql.js`
- Any database connection files
- JWT configuration files

### 3. Postman Collections
**Files to check:**
- `Warriors_Backend_API_NEW.postman_collection.json`
- `Warriors_Backend_API.postman_collection.json`
- `backend/postman.json`

**Risks:**
- May contain auth tokens
- Could have production URLs
- Might include API keys

## 🛡️ **Security Recommendations**

### 1. Environment Variables Setup
Create your `.env` file (copy from `.env.example`):

```bash
cd backend
cp .env.example .env
# Edit .env with your actual values
```

**Required variables:**
```env
# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_secure_password
DB_NAME=warriors_db

# JWT Secrets (generate strong secrets!)
JWT_SECRET=your_very_long_random_secret_here
JWT_ADMIN_SECRET=another_different_long_secret

# Other sensitive configs
ADMIN_DEFAULT_PASSWORD=change_this_strong_password
```

### 2. Generate Strong Secrets
Use these commands to generate secure secrets:

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online generators (but be cautious)
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### 3. Database Security
- ✅ Never commit database credentials
- ✅ Use environment variables for all DB config
- ✅ Ensure database backups are not committed
- ✅ Use strong database passwords

### 4. File Upload Security
- ✅ Uploaded files are already ignored
- ✅ File size limits are configured
- ✅ File type validation is in place

## 📋 **Before Every Git Commit Checklist**

### Run This Command First:
```bash
# Check what files will be committed
git status
git diff --cached
```

### Verify These Items:
- [ ] No `.env` files are staged
- [ ] No files in `uploads/` directory (except `.gitkeep`)
- [ ] No log files (`.log`)
- [ ] No database files (`.db`, `.sqlite`)
- [ ] No certificate files (`.pem`, `.key`, `.crt`)
- [ ] No backup files (`.backup`, `.dump`)
- [ ] Review Postman collections for auth tokens
- [ ] Check any config files for hardcoded credentials

### If You Accidentally Commit Secrets:

1. **Stop immediately** - don't push to GitHub
2. Remove the file from git:
   ```bash
   git rm --cached filename
   git commit -m "Remove sensitive file"
   ```
3. If already pushed, consider the secrets compromised
4. Regenerate all exposed secrets immediately

## 🔍 **Quick Security Scan Commands**

### Check for potential secrets in your code:
```bash
# Search for common secret patterns
grep -r -i "password\|secret\|key\|token" --include="*.js" --include="*.json" backend/

# Check for hardcoded credentials
grep -r -E "(password|secret|key|token)\s*[:=]\s*['\"][^'\"]+['\"]" backend/

# Look for database credentials
grep -r -i "mysql\|database" --include="*.js" backend/config/
```

### Environment Variable Check:
```bash
# Make sure .env exists and is not tracked
ls -la backend/.env
git status | grep -i env
```

## 🚀 **Production Deployment Security**

When deploying to production:
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Use secure database connections
- [ ] Implement rate limiting
- [ ] Use strong JWT secrets (different from development)
- [ ] Regular security updates
- [ ] Monitor for suspicious activity

## 📞 **Emergency Response**

If you accidentally commit secrets:
1. **Rotate all exposed credentials immediately**
2. **Remove the commit** (if not pushed):
   ```bash
   git reset --hard HEAD~1
   ```
3. **Force push** (if already pushed - dangerous):
   ```bash
   git push --force-with-lease
   ```
4. **Update all affected systems**

Remember: **Once a secret is in Git history, consider it compromised!**

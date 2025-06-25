# Warriors Project Security Setup Guide

## 🚀 Quick Setup (Run These Commands)

### 1. Set up your environment file:
```bash
cd backend
cp .env.example .env
```

### 2. Edit the .env file with your actual values:
```bash
# Use your preferred editor
code .env
# or
notepad .env
```

### 3. Generate secure JWT secrets:
```bash
# Generate two different secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('JWT_ADMIN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Make pre-commit hook executable (Mac/Linux):
```bash
chmod +x .git/hooks/pre-commit
```

### 5. Test the security setup:
```bash
# Check git status
git status

# Make sure .env is not listed (should be ignored)
git add .
git status
```

## ⚠️ **IMPORTANT: First Time Setup**

1. **NEVER commit your actual .env file**
2. **Generate strong, unique passwords**
3. **Use different secrets for JWT_SECRET and JWT_ADMIN_SECRET**
4. **Change default admin password**

## 🔒 **Your .env File Should Look Like This:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=warriors_db
DB_USER=your_actual_db_username
DB_PASSWORD=your_actual_strong_password

# JWT Configuration (use the generated secrets)
JWT_SECRET=your_generated_64_char_secret_here
JWT_ADMIN_SECRET=your_different_generated_64_char_secret_here
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=your_strong_admin_password

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security
BCRYPT_ROUNDS=12
```

## ✅ **Security Verification Checklist**

Before your first commit:
- [ ] `.env` file created with real values
- [ ] `.env` file is NOT tracked by git (`git status` shouldn't show it)
- [ ] Strong passwords generated and set
- [ ] Pre-commit hook is working
- [ ] No sensitive files in staging area

## 🆘 **If You Make a Mistake**

### If you accidentally stage a sensitive file:
```bash
git reset HEAD filename
```

### If you accidentally commit (but haven't pushed):
```bash
git reset --hard HEAD~1
```

### If you need to remove a file from git tracking:
```bash
git rm --cached filename
echo "filename" >> .gitignore
git add .gitignore
git commit -m "Remove sensitive file and update gitignore"
```

## 📞 **Need Help?**

1. Check the `SECURITY_CHECKLIST.md` file
2. Run the security scan commands from the checklist
3. Make sure all secrets are in environment variables, not hardcoded

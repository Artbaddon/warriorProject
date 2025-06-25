import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/warriors',
    'uploads/races',
    'uploads/powers',
    'uploads/magic',
    'uploads/warriorTypes'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on the endpoint
    let uploadPath = 'uploads/';
    
    if (req.route.path.includes('/warriors')) {
      uploadPath += 'warriors/';
    } else if (req.route.path.includes('/races')) {
      uploadPath += 'races/';
    } else if (req.route.path.includes('/powers')) {
      uploadPath += 'powers/';
    } else if (req.route.path.includes('/magic')) {
      uploadPath += 'magic/';
    } else if (req.route.path.includes('/warrior-types')) {
      uploadPath += 'warriorTypes/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Different upload configurations
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Error handling middleware
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files uploaded.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name for file upload.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: 'Only image files are allowed!' });
  }
  
  next(error);
};

export default upload;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Determine if running in serverless environment
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;

// Create uploads directory if it doesn't exist (only in non-serverless environment)
const uploadDir = path.join(__dirname, '../../uploads');
if (!isServerless && !fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create uploads directory:', error);
  }
}

// Configure storage - use memory storage in serverless, disk storage locally
const storage = isServerless 
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      },
    });

// Memory storage for profile images (to upload to ImgBB)
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer instance for local storage (product images)
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Create multer instance for memory storage (profile images)
const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware to handle multiple image uploads
export const uploadProductImages = upload.array('images', 5); // Max 5 images
export const uploadProfileImage = uploadMemory.single('image'); // Changed field name to 'image'
export const uploadReviewImages = upload.array('reviewImages', 3); // Max 3 images for reviews

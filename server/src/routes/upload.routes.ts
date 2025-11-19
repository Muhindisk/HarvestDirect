import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadProductImages, uploadProfileImage } from '../middleware/upload';
import path from 'path';

const router = Router();

// Upload product images
router.post('/product', protect, uploadProductImages, (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    res.json({
      success: true,
      images: imageUrls,
      message: `${imageUrls.length} image(s) uploaded successfully`
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile image
router.post('/profile', protect, uploadProfileImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl,
      message: 'Profile image uploaded successfully'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

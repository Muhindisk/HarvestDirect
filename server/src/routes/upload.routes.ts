import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadProductImages, uploadProfileImage } from '../middleware/upload';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

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

// Upload profile image to ImgBB
router.post('/profile', protect, uploadProfileImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
    if (!IMGBB_API_KEY) {
      return res.status(500).json({ message: 'ImgBB API key not configured' });
    }

    // Create form data for ImgBB
    const formData = new FormData();
    formData.append('image', req.file.buffer.toString('base64'));

    // Upload to ImgBB
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (response.data.success) {
      const imageUrl = response.data.data.url;
      
      res.json({
        success: true,
        imageUrl,
        message: 'Profile image uploaded successfully',
      });
    } else {
      throw new Error('Failed to upload to ImgBB');
    }
  } catch (error: any) {
    console.error('ImgBB upload error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: error.response?.data?.error?.message || error.message || 'Failed to upload image' 
    });
  }
});

export default router;

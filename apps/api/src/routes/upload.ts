import express from 'express';
import cloudinary from '../config/cloudinary';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Upload piano photo (receives base64 data)
router.post('/piano-photo', async (req, res) => {
  try {
    const { imageData, mimeType } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Create data URI from base64
    const dataURI = `data:${mimeType || 'image/jpeg'};base64,${imageData}`;

    // Upload to Cloudinary with transformation for square thumbnail
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'piano-photos',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      resource_type: 'image',
    });

    res.json({
      success: true,
      photoUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update piano with photo URL
router.put('/piano/:id/photo', async (req, res) => {
  try {
    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ error: 'Photo URL is required' });
    }

    const updatedPiano = await prisma.piano.update({
      where: { id },
      data: { photoUrl },
    });

    res.json({
      success: true,
      piano: updatedPiano,
    });
  } catch (error) {
    console.error('Update piano photo error:', error);
    res.status(500).json({ 
      error: 'Failed to update piano photo', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Delete photo from Cloudinary and remove from piano
router.delete('/piano/:id/photo', async (req, res) => {
  try {
    const { id } = req.params;
    let { publicId } = req.body;

    // Get current piano to check if it has a photo
    const piano = await prisma.piano.findUnique({
      where: { id },
      select: { photoUrl: true },
    });

    if (!piano?.photoUrl) {
      return res.status(404).json({ error: 'No photo found for this piano' });
    }

    // If publicId is not provided, extract it from the photoUrl
    if (!publicId && piano.photoUrl) {
      const match = piano.photoUrl.match(/\/piano-photos\/([^./]+)\./);
      publicId = match ? `piano-photos/${match[1]}` : undefined;
    }

    // Delete from Cloudinary if publicId is available
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.warn('Failed to delete from Cloudinary:', cloudinaryError);
        // Continue with database update even if Cloudinary deletion fails
      }
    }

    // Remove photo URL from database
    const updatedPiano = await prisma.piano.update({
      where: { id },
      data: { photoUrl: null },
    });

    res.json({
      success: true,
      piano: updatedPiano,
    });
  } catch (error) {
    console.error('Delete piano photo error:', error);
    res.status(500).json({ 
      error: 'Failed to delete piano photo', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router; 
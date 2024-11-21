// backend/routes/albums.js
const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const Day = require('../models/Day');
const auth = require('../middleware/auth');

// Get a single album by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const album = await Album.findOne({ _id: req.params.id, userId: req.user.id });
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const days = await Day.find({
      userId: req.user.id,
      '_id': { $in: album.images.map(img => img.dayId) }
    });

    const daysMap = days.reduce((acc, day) => {
      acc[day._id.toString()] = day;
      return acc;
    }, {});

    const enhancedImages = album.images.map(img => {
      const day = daysMap[img.dayId.toString()];
      const image = day?.images.id(img.imageId);
      if (!day || !image) return null;
      
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; // Add this
      return {
        ...img.toObject(),
        dayId: img.dayId,
        imageId: img.imageId,
        url: `${baseUrl}/api/days/${day.date.toISOString().split('T')[0]}/images/${img.imageId}`,
        caption: image.caption || '',
        contentType: image.contentType
      };
    }).filter(Boolean); // Remove null entries

    const enhancedAlbum = {
      ...album.toObject(),
      images: enhancedImages
    };

    res.json(enhancedAlbum);
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all albums
router.get('/', auth, async (req, res) => {
  try {
    const albums = await Album.find({ userId: req.user.id });
    res.json(albums);
  } catch (error) {
    console.error('Get albums error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new album
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, images } = req.body;
    
    // Validate images array
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: 'Images must be an array' });
    }

    // Validate each image object
    for (const img of images) {
      if (!img.dayId || !img.imageId) {
        return res.status(400).json({ 
          message: 'Each image must have both dayId and imageId' 
        });
      }
    }
    
    const album = new Album({
      userId: req.user.id,
      name,
      description,
      images
    });

    await album.save();
    res.status(201).json(album);
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update album
router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, description, images } = req.body;
    
    const album = await Album.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $set: {
          name,
          description,
          images,
          updatedAt: Date.now()
        }
      },
      { new: true }
    );

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json(album);
  } catch (error) {
    console.error('Update album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete album
router.delete('/:id', auth, async (req, res) => {
  try {
    const album = await Album.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Delete album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
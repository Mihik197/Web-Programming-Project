const express = require('express');
const router = express.Router();
const multer = require('multer');
const Day = require('../models/Day');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get day data
router.get('/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    let day = await Day.findOne({
      userId: req.user.id,
      date: date
    });

    if (!day) {
      day = new Day({
        userId: req.user.id,
        date: date,
        notes: '',
        images: []
      });
      await day.save();
    }

    // Convert images for response
    const processedDay = {
      ...day.toObject(),
      images: day.images.map(img => ({
        _id: img._id,
        contentType: img.contentType,
        caption: img.caption,
        uploadDate: img.uploadDate,
        url: `/api/days/${req.params.date}/images/${img._id}`
      }))
    };

    res.json(processedDay);
  } catch (error) {
    console.error('Get day error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update day
router.post('/', auth, async (req, res) => {
  try {
    const { date, notes } = req.body;
    
    let day = await Day.findOne({
      userId: req.user.id,
      date: new Date(date)
    });

    if (!day) {
      day = new Day({
        userId: req.user.id,
        date: new Date(date),
        notes: notes || '',
        images: []
      });
    } else {
      if (notes) day.notes = notes;
    }

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notes
router.patch('/:date/notes', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    let day = await Day.findOneAndUpdate(
      {
        userId: req.user.id,
        date: date
      },
      {
        $set: { notes: req.body.notes }
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json(day);
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image
router.post('/:date/images', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    let day = await Day.findOne({
      userId: req.user.id,
      date: date
    });

    if (!day) {
      day = new Day({
        userId: req.user.id,
        date: date,
        notes: '',
        images: []
      });
    }

    day.images.push({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      caption: req.body.caption || ''
    });

    await day.save();

    // Return processed image data
    const newImage = day.images[day.images.length - 1];
    res.json({
      _id: newImage._id,
      contentType: newImage.contentType,
      caption: newImage.caption,
      uploadDate: newImage.uploadDate,
      url: `/api/days/${req.params.date}/images/${newImage._id}`
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get image
router.get('/:date/images/:imageId', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    // Change the query to find by imageId instead of exact date
    const day = await Day.findOne({
      'images._id': req.params.imageId
    });

    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    const image = day.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set({
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31557600',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': 'http://localhost:5173'
    });
    
    res.send(image.data);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete image
router.delete('/:date/images/:imageId', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const day = await Day.findOne({
      userId: req.user.id,
      date: date
    });

    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Use pull instead of remove
    day.images.pull({ _id: req.params.imageId });
    await day.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error); // Add error logging
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all images for user
router.get('/images/all', auth, async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const days = await Day.find({ 
      userId: req.user.id,
      'images.0': { $exists: true }
    });

    const allImages = days.map(day => ({
      date: day.date.toISOString().split('T')[0],
      dayId: day._id,
      images: day.images.map(img => ({
        _id: img._id,
        contentType: img.contentType,
        caption: img.caption,
        uploadDate: img.uploadDate,
        url: `${baseUrl}/api/days/${day.date.toISOString().split('T')[0]}/images/${img._id}`
      }))
    }));

    res.json(allImages);
  } catch (error) {
    console.error('Get all images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
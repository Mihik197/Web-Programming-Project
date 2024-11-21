// backend/routes/days.js
const router = require('express').Router();
const multer = require('multer');
const upload = multer();

router.post('/:date/images', upload.single('image'), async (req, res) => {
  try {
    const day = await Day.findOne({ 
      userId: req.user._id, 
      date: new Date(req.params.date)
    });

    day.images.push({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      caption: req.body.caption
    });

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
});
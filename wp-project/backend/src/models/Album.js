// backend/models/Album.js
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    dayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Day',
      required: true
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Album', albumSchema);
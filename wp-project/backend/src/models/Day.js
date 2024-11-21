// backend/models/Day.js
const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  images: [{
    data: Buffer,
    contentType: String,
    caption: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Add compound index for faster queries
daySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Day', daySchema);
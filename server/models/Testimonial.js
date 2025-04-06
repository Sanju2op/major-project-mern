// models/Testimonial.js
const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true,
    index: true
  },
  author: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    company: {
      type: String
    },
    avatar: {
      type: String
    }
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  answers: [{
    question: String,
    answer: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['direct', 'import', 'social'],
    default: 'direct'
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    facebook: String
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
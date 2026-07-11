const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Card must belong to a user'],
      index: true,
    },
    cardName: {
      type: String,
      default: 'My Business Card',
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    jobTitle: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    template: {
      type: String,
      default: 'Midnight Pro',
    },
    designData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
cardSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Card', cardSchema);

const express = require('express');
const router = express.Router();
const {
  createCard,
  getUserCards,
  getCardById,
  updateCard,
  deleteCard,
  getAllCards,
  getCardStats,
  generateQR,
  getCardQr,
  duplicateCard,
} = require('./cardController');
const { protect, admin } = require('./authMiddleware');

// User card routes (protected)
router.post('/', protect, createCard);
router.get('/my', protect, getUserCards);
router.post('/:id/duplicate', protect, duplicateCard);

// Admin routes (must be before :id to avoid conflicts)
router.get('/stats', protect, admin, getCardStats);
router.get('/all', protect, admin, getAllCards);

// Public QR routes
router.get('/qr/generate', generateQR);
router.get('/:id/qr', getCardQr);

// Public / owner routes
router.get('/:id', getCardById);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;

const mongoose = require('mongoose');
const Card = require('./Card');
const QRCode = require('qrcode');

// @desc    Create a new business card
// @route   POST /api/cards
// @access  Private
const createCard = async (req, res) => {
  try {
    const {
      cardName, fullName, jobTitle, company, department,
      email, phone, website, linkedin, twitter, github,
      template, designData,
    } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    const card = await Card.create({
      userId: req.user._id,
      cardName: cardName || `${fullName}'s Card`,
      fullName,
      jobTitle,
      company,
      department,
      email,
      phone,
      website,
      linkedin,
      twitter,
      github,
      template,
      designData,
    });

    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ message: 'Server error creating card' });
  }
};

// @desc    Get all cards for the authenticated user
// @route   GET /api/cards/my
// @access  Private
const getUserCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching user cards:', error);
    res.status(500).json({ message: 'Server error fetching cards' });
  }
};

// @desc    Get a single card by ID
// @route   GET /api/cards/:id
// @access  Public (for viewing), but editing requires ownership
const getCardById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Card not found' });
  }
  try {
    const card = await Card.findById(req.params.id).populate('userId', 'name email');
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Increment view count for public views
    card.views += 1;
    await card.save();

    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ message: 'Server error fetching card' });
  }
};

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private (owner only)
const updateCard = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Card not found' });
  }
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this card' });
    }

    const updatableFields = [
      'cardName', 'fullName', 'jobTitle', 'company', 'department',
      'email', 'phone', 'website', 'linkedin', 'twitter', 'github',
      'template', 'designData', 'isPublished',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        card[field] = req.body[field];
      }
    });

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Server error updating card' });
  }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private (owner only)
const deleteCard = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Card not found' });
  }
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this card' });
    }

    await card.deleteOne();
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ message: 'Server error deleting card' });
  }
};

// @desc    Get all cards (admin)
// @route   GET /api/cards
// @access  Private + Admin
const getAllCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
            { cardName: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [cards, total] = await Promise.all([
      Card.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Card.countDocuments(query),
    ]);

    res.json({
      cards,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching all cards:', error);
    res.status(500).json({ message: 'Server error fetching cards' });
  }
};

// @desc    Get card statistics (admin)
// @route   GET /api/cards/stats
// @access  Private + Admin
const getCardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalCards, cardsThisMonth, cardsLastMonth, totalViews, topTemplates] = await Promise.all([
      Card.countDocuments(),
      Card.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Card.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Card.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Card.aggregate([
        { $group: { _id: '$template', count: { $sum: 1 }, views: { $sum: '$views' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      totalCards,
      cardsThisMonth,
      cardsLastMonth,
      totalViews: totalViews[0]?.total || 0,
      topTemplates,
    });
  } catch (error) {
    console.error('Error fetching card stats:', error);
    res.status(500).json({ message: 'Server error fetching card stats' });
  }
};

// @desc    Generate and stream a QR code image for arbitrary data
// @route   GET /api/cards/qr/generate
// @access  Public
const generateQR = async (req, res) => {
  const { data, color } = req.query;
  if (!data) {
    return res.status(400).json({ message: 'Data parameter is required' });
  }
  try {
    const darkColor = color || '#000000';
    res.setHeader('Content-Type', 'image/png');
    // Short cache control for email signatures to render dynamically but not flood
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    await QRCode.toFileStream(res, data, {
      color: {
        dark: darkColor,
        light: '#FFFFFF'
      },
      width: 250,
      margin: 1
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating QR code' });
    }
  }
};

// @desc    Get QR code for a saved card linking to its public page
// @route   GET /api/cards/:id/qr
// @access  Public
const getCardQr = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Card not found' });
  }
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const cardUrl = `${frontendUrl}/card/${card._id}`;
    const brandColor = card.designData?.brandColor || '#FF4D4D';

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    await QRCode.toFileStream(res, cardUrl, {
      color: {
        dark: brandColor,
        light: '#FFFFFF'
      },
      width: 250,
      margin: 1
    });
  } catch (error) {
    console.error('Error streaming card QR:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error generating card QR' });
    }
  }
};

// @desc    Duplicate a card
// @route   POST /api/cards/:id/duplicate
// @access  Private (owner only)
const duplicateCard = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Card not found' });
  }
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Check ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to duplicate this card' });
    }

    const duplicateData = card.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.cardName = `${duplicateData.cardName} (Copy)`;
    duplicateData.views = 0;

    const newCard = await Card.create(duplicateData);
    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error duplicating card:', error);
    res.status(500).json({ message: 'Server error duplicating card' });
  }
};

module.exports = {
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
};


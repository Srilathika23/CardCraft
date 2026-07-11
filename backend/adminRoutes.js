const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers } = require('./adminController');
const { protect, admin } = require('./authMiddleware');

// All admin routes require authentication + admin role
router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;

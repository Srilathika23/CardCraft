const User = require('./User');
const Card = require('./Card');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private + Admin
const getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersThisMonth,
      usersLastMonth,
      activeUsers30d,
      totalCards,
      cardsThisMonth,
      cardsLastMonth,
      totalViews,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      User.countDocuments({ updatedAt: { $gte: thirtyDaysAgo } }),
      Card.countDocuments(),
      Card.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Card.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      Card.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    ]);

    // Calculate growth percentages
    const userGrowth = usersLastMonth > 0
      ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
      : usersThisMonth > 0 ? '100.0' : '0.0';

    const cardGrowth = cardsLastMonth > 0
      ? (((cardsThisMonth - cardsLastMonth) / cardsLastMonth) * 100).toFixed(1)
      : cardsThisMonth > 0 ? '100.0' : '0.0';

    res.json({
      totalUsers,
      usersThisMonth,
      userGrowth: parseFloat(userGrowth),
      activeUsers30d,
      totalCards,
      cardsThisMonth,
      cardGrowth: parseFloat(cardGrowth),
      totalViews: totalViews[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

// @desc    Get all users with pagination and search
// @route   GET /api/admin/users
// @access  Private + Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.role = status;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    // Get card counts for each user
    const userIds = users.map((u) => u._id);
    const cardCounts = await Card.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const cardCountMap = {};
    cardCounts.forEach((c) => {
      cardCountMap[c._id.toString()] = c.count;
    });

    const usersWithCards = users.map((u) => ({
      ...u.toObject(),
      cardCount: cardCountMap[u._id.toString()] || 0,
    }));

    res.json({
      users: usersWithCards,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
};

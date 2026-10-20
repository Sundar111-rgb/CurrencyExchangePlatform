
import User from '../models/User.js';
import Conversion from '../models/Conversion.js';

// Existing dashboard statistics.
// Preserves compatibility with any existing frontend using this endpoint.
export const getDashboardStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalConversions,
      monthlyConversions,
      recentConversions,
    ] = await Promise.all([
      User.countDocuments(),
      Conversion.countDocuments(),
      Conversion.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
      Conversion.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      stats: {
        totalUsers,
        totalConversions,
        monthlyConversions,
      },
      recentConversions,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
    });
  }
};

// Admin dashboard with authenticated admin details and live statistics.
export const getAdminDashboard = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      totalConversions,
      conversionsToday,
      monthlyConversions,
      recentConversions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'user' }),
      Conversion.countDocuments(),
      Conversion.countDocuments({
        createdAt: { $gte: startOfDay },
      }),
      Conversion.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
      Conversion.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Return only safe, necessary admin details.
    const admin = req.user
      ? {
          id: req.user._id
            ? req.user._id.toString()
            : req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        }
      : null;

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard data fetched successfully',
      admin,
      stats: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        totalConversions,
        conversionsToday,
        monthlyConversions,
      },
      recentConversions,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard statistics',
    });
  }
};


/**
 * Get paginated conversion history across all users.
 * Admin-only access is enforced by the route middleware.
 */
export const getAdminConversionHistory = async (req, res) => {
  try {
    const page = Math.max(
      1,
      Number.parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const [conversions, total] = await Promise.all([
      Conversion.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Conversion.countDocuments({}),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      conversions,
    });
  } catch (error) {
    console.error('Admin conversion history error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve admin conversion history',
    });
  }
};


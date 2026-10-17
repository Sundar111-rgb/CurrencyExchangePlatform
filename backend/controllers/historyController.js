
import Conversion from '../models/Conversion.js';

export const getConversionHistory = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    
    const filter = {
      user: req.user.id,
    };

    const [conversions, total] = await Promise.all([
      Conversion.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Conversion.countDocuments(filter),
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
    console.error('Conversion history error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve conversion history',
    });
  }
};

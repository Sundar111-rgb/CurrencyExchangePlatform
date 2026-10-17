
import mongoose from 'mongoose';

const conversionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    fromCurrency: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },

    toCurrency: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.000001,
    },

    exchangeRate: {
      type: Number,
      required: true,
      min: 0,
    },

    convertedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    rateTimestamp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

conversionSchema.index({ user: 1, createdAt: -1 });

const Conversion = mongoose.model('Conversion', conversionSchema);

export default Conversion;

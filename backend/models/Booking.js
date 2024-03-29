const mongoose = require('mongoose');
const { upcoming, completed, cancelled } = require('../utils/constants');

const bookingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    }
  ],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: [upcoming, completed, cancelled],
    default: upcoming
  },
  cancelledAt: {
    type: Date
  },
  amount: {
    type: Number,
    required: true
  },
  refundedAmount: {
    type: Number,
    default: 0
  },
},{
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

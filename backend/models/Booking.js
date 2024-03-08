// models/Booking.js

const mongoose = require('mongoose');

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
    enum: ['UPCOMING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING'
  },
  cancelledAt: {
    type: Date
  },
  refundedAmount: {
    type: Number,
    default: 0
  },
},{
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);


const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  roomNumber: {
    type: Number,
    required: true,
    unique: true 
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
  ]
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Room', roomSchema);

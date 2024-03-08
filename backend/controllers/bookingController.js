
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  const { startDate, endDate, sortByTime, status } = req.query;

  // Construct filter object based on the query parameters
  let filter = {};
  if (startDate && !endDate) {
    filter.startTime = { $gte: new Date(startDate) };
  } else if (!startDate && endDate) {
    filter.endTime = { $lte: new Date(endDate) };
  } else if (startDate && endDate) {
    filter.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (status) {
    filter.status = status;
  }

  // Sorting
  let sort = {};
  if (sortByTime) {
    sort.startTime = sortByTime === 'asc' ? 1 : -1;
  }

  try {
    let bookings = await Booking.find(filter)
      .sort(sort)
      .populate('rooms')
      .exec();

    // Update bookings status to COMPLETED if end time is complete by date and time
    bookings = bookings.map(booking => {
      const now = new Date();
      const endTime = new Date(booking.endTime);

      if (now >= endTime) {
        // Update status to COMPLETED if end time is complete by date and time
        booking.status = 'COMPLETED';
        // Save the updated booking
        booking.save();
      }

      return booking;
    });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  const { email, rooms, startTime, endTime, amount } = req.body;

  try {
    // Check if start time is before current time
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start < now) {
      return res.status(400).json({ message: 'Start time cannot be in the past' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'End time must be greater than start time' });
    }

    if(!Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ message: 'At least one room must be selected' });
    }

    // Check room availability
    const isAvailable = await checkRoomAvailability(rooms, start, end);
    if (!isAvailable) {
      return res.status(400).json({ message: 'One or more rooms are not available during the specified time frame' });
    }

    const booking = new Booking({
      email,
      rooms,
      startTime: start,
      endTime: end,
      amount
    });

    await booking.save();

    // Update the corresponding rooms with the booking ID
    await Room.updateMany(
      { _id: { $in: rooms } },
      { $push: { bookings: booking._id } }
    );

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to check room availability
async function checkRoomAvailability(rooms, startTime, endTime) {
  try {
    // Query existing bookings to check for conflicts
    const existingBookings = await Booking.find({
      rooms: { $in: rooms },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $eq: startTime }, endTime: { $eq: endTime } }
      ],
      $or: [
        { status: { $ne: 'CANCELLED' } },
        { status: { $exists: false } }
      ]
    });

    return existingBookings.length === 0;
  } catch (error) {
    throw new Error('Error checking room availability');
  }
}

// Update booking
exports.updateBooking = async (req, res) => {
  const { email, rooms, startTime, endTime, status, refundedAmount, amount } = req.body;

  try {

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.email = email || booking.email;
    booking.rooms = rooms || booking.rooms;
    booking.startTime = new Date(startTime || booking.startTime);
    booking.endTime = new Date(endTime || booking.endTime);
    booking.status = status || "UPCOMING";
    booking.refundedAmount = refundedAmount || booking.refundedAmount;
    booking.amount = amount || booking.amount;

    // Check if start time is before current time
    const now = new Date();
    const start = booking.startTime;
    const end = booking.endTime;
    if (start < now) {
      return res.status(400).json({ message: 'Start time cannot be in the past' });
    }

    // Check if end time is greater than start time
    if (end <= start) {
      return res.status(400).json({ message: 'End time must be greater than start time' });
    }

    // Check room availability
    const isAvailable = await checkRoomAvailabilityForUpdate(booking.rooms, start, end, req.params.id);
    if (!isAvailable) {
      return res.status(400).json({ message: 'One or more rooms are not available during the specified time frame' });
    }

    if (status === 'CANCELLED') {
      booking.cancelledAt = new Date();
    }

    await booking.save();
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function checkRoomAvailabilityForUpdate(rooms, startTime, endTime, currentBookingId) {
  try {
    const existingBookings = await Booking.find({
      _id: { $ne: currentBookingId },
      rooms: { $in: rooms },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $eq: startTime }, endTime: { $eq: endTime } }
      ],
      $or: [
        { status: { $ne: 'CANCELLED' } },
        { status: { $exists: false } }
      ]
    });

    return existingBookings.length === 0;
  } catch (error) {
    throw new Error('Error checking room availability');
  }
}

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Remove the booking ID from the corresponding room's bookings array
    await Room.findOneAndUpdate(
      { bookings: req.params.id },
      { $pull: { bookings: req.params.id } }
    );

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

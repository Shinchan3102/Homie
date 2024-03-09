
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { cancelled, ASC, completed, upcoming, confirmBookingEmail, updateBookingEmail, cancelBookingEmail } = require('../utils/constants');
const { sendEmail } = require('../utils/emailService');

// Function to check room availability
async function checkRoomAvailability(rooms, startTime, endTime, bookingId = null) {
  try {
    const bookings = await Booking.find({ rooms: { $in: rooms } });

    // Filter existing bookings based on overlapping time slots
    const existingBookings = bookings.filter(booking => {
      return (
        ((startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime) ||
          (startTime <= booking.startTime && endTime >= booking.endTime)) &&
        (booking.status !== cancelled) &&
        (!bookingId || booking._id.toString() !== bookingId)
      );
    });

    return existingBookings.length === 0;
  } catch (error) {
    throw new Error('Error checking room availability');
  }
}


exports.getDashboard = async (req, res) => {
  try {
    const ISTOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(Date.now() + ISTOffset); // Current time in IST

    // Set to the beginning of the day in IST
    const todayIST = new Date(nowIST);
    todayIST.setHours(0, 0, 0, 0);

    // Set to the end of the day in IST
    const endOfDayIST = new Date(todayIST);
    endOfDayIST.setHours(23, 59, 59, 999);

    // Count total bookings
    const bookings = await Booking.find();
    const totalBookings = bookings.length;
    const totalUpcomingBookings = bookings.filter(booking => booking.status === upcoming).length;
    
    // Filter today's bookings based on IST day, month, and year
    const todayUpcomingBookings = bookings.filter(booking => {
      const startTimeIST = new Date(booking.startTime);
      const bookingDay = startTimeIST.getDate();
      const bookingMonth = startTimeIST.getMonth();
      const bookingYear = startTimeIST.getFullYear();
      
      const todayDay = todayIST.getDate();
      const todayMonth = todayIST.getMonth();
      const todayYear = todayIST.getFullYear();

      return (
        bookingYear === todayYear &&
        bookingMonth === todayMonth &&
        bookingDay === todayDay &&
        startTimeIST >= nowIST
      );
    }).length;

    const totalCancelledBookings = bookings.filter(booking => booking.status === cancelled).length;

    res.json({
      totalBookings,
      totalUpcomingBookings,
      totalTodayBookings: todayUpcomingBookings, // Use the filtered count
      totalCancelledBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




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
    sort.startTime = sortByTime === ASC ? 1 : -1;
  }
  else{
    sort.updatedAt = -1;
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
        booking.status = completed;
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
    const booking = await Booking.findById(req.params.id).populate('rooms');
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

    if (!Array.isArray(rooms) || rooms.length === 0) {
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

    // Populate rooms
    const populatedRooms = await Room.find({ _id: { $in: rooms } });

    await sendEmail(
      email,
      confirmBookingEmail.title,
      confirmBookingEmail.description
        .replace('{{ROOM_NUMBER}}', populatedRooms[0].roomNumber)
        .replace('{{START_TIME}}', start.toDateString())
        .replace('{{END_TIME}}', end.toDateString())
        .replace('{{AMOUNT}}', amount)
    );

    res.status(201).json({ message: 'Booking created successfully', booking: { ...booking?._doc, rooms: populatedRooms } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  const { email, rooms, startTime, endTime, status, refundedAmount, amount } = req.body;

  try {

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    isRoomUpdated = rooms ? rooms[0] !== booking.rooms[0] : false;

    booking.email = email || booking.email;
    booking.rooms = rooms || booking.rooms;
    booking.startTime = new Date(startTime || booking.startTime);
    booking.endTime = new Date(endTime || booking.endTime);
    booking.status = status || upcoming;
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
    if (status !== cancelled) {
      const isAvailable = await checkRoomAvailability(booking.rooms, start, end, req.params.id);
      if (!isAvailable) {
        return res.status(400).json({ message: 'One or more rooms are not available during the specified time frame' });
      }
    }


    // Update the corresponding rooms with the booking ID
    if (isRoomUpdated) {
      await Room.updateMany(
        { bookings: req.params.id },
        { $pull: { bookings: req.params.id } }
      );

      await Room.updateMany(
        { _id: { $in: booking.rooms } },
        { $push: { bookings: booking._id } }
      );
    }

    let emailSuccess = false;

    if (status === cancelled) {
      booking.cancelledAt = new Date();
      emailSuccess = await sendEmail(
        booking.email,
        cancelBookingEmail.title,
        cancelBookingEmail.description
          .replace('{{START_TIME}}', start.toDateString())
          .replace('{{END_TIME}}', end.toDateString())
          .replace('{{AMOUNT}}', booking.amount)
          .replace('{{REFUNDED_AMOUNT}}', booking.refundedAmount)
      );
    }
    else
      emailSuccess = await sendEmail(
        booking.email,
        updateBookingEmail.title,
        updateBookingEmail.description
          .replace('{{START_TIME}}', start.toDateString())
          .replace('{{END_TIME}}', end.toDateString())
          .replace('{{AMOUNT}}', booking.amount)
      );

    await booking.save();

    const populatedRooms = await Room.find({ _id: { $in: booking.rooms } });

    res.json({ message: 'Booking updated successfully', booking: { ...booking._doc, rooms: populatedRooms }, emailSuccess });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

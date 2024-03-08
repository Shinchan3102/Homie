
const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  const { type, minPrice, maxPrice, sortByPrice, startTime, endTime } = req.query;

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (startTime && endTime && start > end) {
    return res.status(400).json({ message: 'Start date should be less than end date' });
  }

  // Construct filter object
  let filter = {};
  if (type) {
    filter.type = type;
  }
  if (minPrice && maxPrice) {
    filter.pricePerHour = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
    filter.pricePerHour = { $gte: minPrice };
  } else if (maxPrice) {
    filter.pricePerHour = { $lte: maxPrice };
  }

  // Sort
  let sort = {};
  if (sortByPrice) {
    sort.pricePerHour = sortByPrice === 'asc' ? 1 : -1;
  }

  try {
    let roomsQuery = Room.find(filter).sort(sort);

    // Check availability if startDate and endDate are provided
    if (startTime && endTime) {
      roomsQuery = roomsQuery.where({
        $or: [
          { bookings: { $eq: [] } },
          { bookings: { $elemMatch: { start: { $gte: end }, end: { $lte: start }, status: { $ne: 'CANCELLED' } } } }
        ]
      });
    }
    else if (startTime) {
      roomsQuery = roomsQuery.where({
        $or: [
          { bookings: { $eq: [] } },
          { bookings: { $elemMatch: { start: { $gte: start }, status: { $ne: 'CANCELLED' } } } }
        ]
      });
    }
    else if (endTime) {
      roomsQuery = roomsQuery.where({
        $or: [
          { bookings: { $eq: [] } },
          { bookings: { $elemMatch: { end: { $lte: end } } } }
        ]
      });
    }

    const rooms = await roomsQuery.exec();

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get room by ID
exports.getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await Room.distinct('type');
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  const { type, pricePerHour, roomNumber } = req.body;

  try {
    const room = new Room({
      type,
      pricePerHour,
      roomNumber
    });

    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  const { type, pricePerHour, roomNumber } = req.body;

  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.type = type;
    room.pricePerHour = pricePerHour;
    room.roomNumber = roomNumber;

    await room.save();
    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

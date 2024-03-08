
const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  const { type, minPrice, maxPrice, sortByPrice, page = 1, perPage = 10, startDate, endDate } = req.query;

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

  // Pagination
  const skip = (page - 1) * perPage;

  try {
    let roomsQuery = Room.find(filter).sort(sort).skip(skip).limit(perPage);

    // Check availability if startDate and endDate are provided
    if (startDate && endDate) {
      roomsQuery = roomsQuery.where({
        $or: [
          { bookings: { $eq: [] } }, // If no bookings
          { bookings: { $elemMatch: { start: { $gte: endDate }, end: { $lte: startDate } } } } // If bookings don't overlap
        ]
      });
    }
    else if(startDate){
      roomsQuery = roomsQuery.where({
        $or: [
          { bookings: { $eq: [] } }, // If no bookings
          { bookings: { $elemMatch: { start: { $gte: endDate } } } } // If bookings don't overlap
        ]
      });
    }
    else if(endDate){
      roomsQuery = roomsQuery.where({
        $or: [
          { bookings: { $eq: [] } }, // If no bookings
          { bookings: { $elemMatch: { end: { $lte: startDate } } } } // If bookings don't overlap
        ]
      });
    }

    const rooms = await roomsQuery.exec();

    // Count total rooms
    const totalRooms = await Room.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalRooms / perPage);

    res.json({
      rooms: rooms,
      totalPages: totalPages,
      activePage: page
    });
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

// routes/roomRoutes.js

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Define routes for room management
router.get('/', roomController.getAllRooms);
router.get('/types', roomController.getRoomTypes);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;

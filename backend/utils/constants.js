const completed = 'COMPLETED';
const cancelled = 'CANCELLED';
const upcoming = 'UPCOMING';
const ASC = 'ASC';

const confirmBookingEmail = {
  title: 'Booking Confirmation',
  description: `Your booking has been confirmed. Room Number: {{ROOM_NUMBER}}, Start Time: {{START_TIME}}, End Time: {{END_TIME}}, Amount: {{AMOUNT}}`
}

const updateBookingEmail = {
  title: 'Booking Update',
  description: `Your booking has been updated. Start Time: {{START_TIME}}, End Time: {{END_TIME}}, Amount: {{AMOUNT}}`
}

const cancelBookingEmail = {
  title: 'Booking Cancellation',
  description: `Your booking has been cancelled. Start Time: {{START_TIME}}, End Time: {{END_TIME}}, Amount: {{AMOUNT}}, Refunded Amount: {{REFUNDED_AMOUNT}}`
}


module.exports = {
  completed,
  cancelled,
  upcoming,
  ASC,
  confirmBookingEmail,
  updateBookingEmail,
  cancelBookingEmail
}
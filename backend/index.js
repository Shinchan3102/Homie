const express = require('express');
const app = express();
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

const port = process.env.PORT || 5000;
// console.log(new Date().toISOString());

app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: '*' }));

app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);


app.get("/", (req, res) => {
  res.status(200).json({ message: "my server is running" })

})

connectDB(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


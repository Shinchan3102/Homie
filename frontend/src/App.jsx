import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import Booking from "./pages/Booking"
import Room from "./pages/Room"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<MainLayout />} >
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/rooms" element={<Room />} />
          </Route>
          <Route path="*" element={<h1>This page is not working now.</h1>} />
        </Routes>
        </Router>
    </>
  )
}

export default App

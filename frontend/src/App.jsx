import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import Booking from "./pages/Booking"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="" element={<MainLayout />} >
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Booking />} />
          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        </Router>
    </>
  )
}

export default App

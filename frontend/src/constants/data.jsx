import { RxDashboard } from "react-icons/rx";
import { IoBookOutline } from "react-icons/io5";
import { FaBed } from "react-icons/fa";

export const baseUrl = "https://homie-six.vercel.app/api";
export const logo = "HotelAdmin";

export const cancelled = "CANCELLED";
export const completed = "COMPLETED";
export const upcoming = "UPCOMING";
export const deleted = "DELETED";

export const bookingStatus = [
  { id: 1, name: cancelled, checked: true },
  { id: 2, name: completed, checked: true },
  { id: 3, name: upcoming, checked: true },
];

export const sidebarItems = [
  {
    id: 1,
    title: "Dashboard",
    path: "/",
    Icon: RxDashboard,
  },
  {
    id: 2,
    title: "Bookings",
    path: "/bookings",
    Icon: IoBookOutline,
  },
  {
    id: 3,
    title: "Rooms",
    path: "/rooms",
    Icon: FaBed,
  },
];

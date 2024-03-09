import { RxDashboard } from "react-icons/rx";
import { IoBookOutline } from "react-icons/io5";
import { FaBed } from "react-icons/fa";

export const baseUrl='https://homie-six.vercel.app/api';


export const sidebarItems=[
  {
    id: 1,
    title: 'Dashboard',
    path: '/',
    Icon: RxDashboard,
  },
  {
    id: 2,
    title: 'Bookings',
    path: '/bookings',
    Icon: IoBookOutline,
  },
  {
    id: 3,
    title: 'Rooms',
    path: '/rooms',
    Icon: FaBed,
  }
];

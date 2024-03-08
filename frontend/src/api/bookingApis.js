import { baseUrl } from "@/constants/data";
import axios from "axios";

export const getAllBookings = async () => {
  try {
    const res = await axios.get(baseUrl + '/bookings');

    return res.data;
  } catch (error) {
    console.log(error);
    return { message: error?.message, status: 400 };
  }
};

export const createBooking = async ({ data }) => {
  try {
    const res = await axios.post(baseUrl + '/bookings', data);
    return res.data;
  } catch (error) {
    console.log(error);
    return { message: error?.message, status: 400 };
  }
};

export const updateBooking = async ({ bookingId, data }) => {
  try {
    const res = await axios.put(baseUrl + '/bookings/' + bookingId, data);

    return res.data;
  } catch (error) {
    console.log(error);
    return { message: error?.message, status: 400 };
  }
};

export const removeBooking = async ({ bookingId }) => {
  try {
    const res = await axios.delete(baseUrl + '/bookings/' + bookingId);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    return { message: error?.message, status: 400 };
  }
};
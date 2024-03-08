import { baseUrl } from "@/constants/data";
import axios from "axios";

export const getAllRooms = async (query = {}) => {
  try {

    const res = await axios.get(baseUrl + '/rooms', { params: query });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllRoomTypes = async () => {
  try {

    const res = await axios.get(baseUrl + '/rooms/types');

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
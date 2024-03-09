import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!(date instanceof Date)) {
    return "Invalid Date";
  }
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatTimeFromDate(d) {
  const date = new Date(d);

  if (!(date instanceof Date)) {
    return "Invalid Date";
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatAmount(amount = 0) {
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    return "Invalid amount";
  }

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(parsedAmount);

  return formattedAmount;
}

export function formatIndianDateTime(dateString) {
  let date = new Date(dateString);

  // Adjust for Indian Standard Time (IST) by subtracting 5 hours and 30 minutes
  date.setHours(date.getHours());
  date.setMinutes(date.getMinutes());

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };

  // Format the date in dd-mm-yyyy format
  const formattedDate = date.toLocaleString('en-IN', options).replace(/\//g, '-');
  return formattedDate;
}


export function convertToIST(utcDate, utcTime) {

  const [hours, minutes] = utcTime.split(':').map(Number);

  // Set the end time in Indian Standard Time (IST)
  const istDateTime = new Date(
    new Date(utcDate).setHours(hours, minutes)
  );
  return istDateTime;
}

export function getTotalPrice(startTime, endTime, pricePerHour) {
  const timeDiff = endTime.getTime() - startTime.getTime();

  const hours = (timeDiff / (1000 * 60 * 60));

  const totalPrice = pricePerHour * Math.ceil(hours);

  console.log(totalPrice, hours, timeDiff)

  return Math.floor(totalPrice);
}

export function checkDateRangeCompatibility(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (!(start instanceof Date) || !(end instanceof Date)) {
    return false;
  }

  const now = new Date();

  if (start > end) {
    return "Entry Time cannot be after the Exit Time";
  }

  if (start < now) {
    return "Entry Time cannot be in the past";
  }

  const diffInMillis = end - start;
  const diffInHours = diffInMillis / (1000 * 60 * 60);

  if (diffInHours <= 0) {
    return "Should be a valid hour range";
  }

  return false;
}

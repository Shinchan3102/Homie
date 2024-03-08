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

export function formatIndianDateTime(utcDateString) {
  const utcDate = new Date(utcDateString);
  const indianDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata' // Set the time zone to Indian Standard Time
  };

  const formattedDate = indianDate.toLocaleString('en-IN', options);
  return formattedDate;
}

export function getTotalPrice(startTime, endTime, pricePerHour) {
  const timeDiff = endTime.getTime() - startTime.getTime();

  const hours = (timeDiff / (1000 * 60 * 60));

  const totalPrice = pricePerHour * Math.ceil(hours);

  console.log(totalPrice, hours, timeDiff)

  return Math.floor(totalPrice);
}

export function checkDateRangeCompatibility(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    return false;
  }

  const now = new Date();

  if (start > end) {
    return false;
  }

  if (start < now) {
    return false;
  }

  if (start < now) {
    return false;
  }

  return true;
}

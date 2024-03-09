import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cancelled } from "@/constants/data";
import { formatAmount, formatDate, formatIndianDateTime } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";


// ----- Constants and Variables -----
export const bookingColumns = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "roomNumber",
    header: "Room Number",
    cell: ({ row }) => (
      <div className="">{row.original.rooms[0]?.roomNumber}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatAmount(row.getValue("amount"))}
      </div>
    ),
  },
  {
    accessorKey: "refundedAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Refund
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.status === "CANCELLED"
          ? formatAmount(row.getValue("refundedAmount"))
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Booking Date",
    cell: ({ row }) => (
      <div className="min-w-28">
        {formatDate(new Date(row.original.createdAt))}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Cancelled Date",
    cell: ({ row }) => (
      <div className="min-w-28">
        {row.original.status === "CANCELLED"
          ? formatDate(new Date(row.original.updatedAt))
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Begins At",
    cell: ({ row }) => (
      <div className="min-w-28">
        {formatIndianDateTime(row.original.startTime)}
      </div>
    ),
  },
  {
    accessorKey: "endTime",
    header: "Ends At",
    cell: ({ row }) => (
      <div className="min-w-28">
        {formatIndianDateTime(row.original.endTime)}
      </div>
    ),
  },
];

// -----Booking Related Functions -----
export const getCancelBookingMessage = (startDate, amount) => {
  const { refundAmount, refundPercentage, diffInHours } = getRefundedDetails(
    startDate,
    amount
  );

  return `Your booking was cancelled ${diffInHours} hours before the start date. Refund amount: ${refundAmount} INR (${refundPercentage}% of the total amount).`;
};

export const getRefundedDetails = (startDate, amount) => {
  const date = new Date(startDate);
  const today = new Date();

  const diffInHours = Math.floor(Math.abs(date - today) / (1000 * 60 * 60));

  let refundPercentage = 0;
  if (diffInHours >= 48) {
    refundPercentage = 100;
  } else if (diffInHours >= 24) {
    refundPercentage = 50;
  } else {
    refundPercentage = 0;
  }

  const refundAmount = (amount * refundPercentage) / 100;

  return { refundAmount, refundPercentage, diffInHours };
};

export const getFilteredBookingData = (
  booking,
  filterRoomTypes,
  filterStatus,
  startDate,
  endDate,
  searchString
) => {
  const roomType = booking?.rooms[0]?.type;
  const bookingDate = new Date(booking.startTime);
  const isRoomTypeSelected = filterRoomTypes.find(
    (type) => type.name === roomType
  )?.checked;
  const isStatusSelected = filterStatus?.find(
    (status) => status.name === booking.status
  )?.checked;
  const isStartDateSelected = !startDate ? true : bookingDate >= startDate;
  const isEndDateSelected = !endDate ? true : bookingDate <= endDate;
  const isSearchStringMatched =
    booking.email?.includes(searchString) ||
    booking.rooms[0]?.roomNumber?.toString()?.includes(searchString);
  return (
    isRoomTypeSelected &&
    isStatusSelected &&
    isStartDateSelected &&
    isEndDateSelected &&
    isSearchStringMatched
  );
};

export const getActions = (actions) => {
  return {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {actions.map((item, index) => (
              <div className="" key={index}>
                <DropdownMenuItem
                  onClick={() => {
                    item.onClick(booking);
                  }}
                  disabled={item.disabled && booking.status === cancelled}
                >
                  {item.label}
                </DropdownMenuItem>
                {index !== actions.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
};

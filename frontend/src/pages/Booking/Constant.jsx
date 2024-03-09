import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { formatAmount, formatDate, formatIndianDateTime } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

export const bookingColumns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatAmount(row.getValue("amount"))}
      </div>
    ),
  },
  {
    accessorKey: "refundedAmount",
    header: () => <div className="text-right">Refund</div>,
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

import { Button } from "@/components/ui/button";
import { formatAmount, formatDate } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

export const roomColumns = [
  {
    accessorKey: "roomNumber",
    header: "Room Number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("roomNumber")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "pricePerHour",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price(Hourly)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium min-w-20">
        {formatAmount(row.getValue("pricePerHour"))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Added On",
    cell: ({ row }) => (
      <div className="min-w-28">{formatDate(new Date(row.original.createdAt))}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated On",
    cell: ({ row }) => <div className="min-w-28">{formatDate(new Date(row.original.updatedAt))}</div>,
  },
];
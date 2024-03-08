import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatAmount, formatDate } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

export const roomColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    header: () => <div className="text-right">Price(per hour)</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
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

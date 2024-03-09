import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cancelled } from "@/constants/data";
import { formatAmount, formatDate } from "@/lib/utils";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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
      <div className="min-w-28">
        {formatDate(new Date(row.original.createdAt))}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated On",
    cell: ({ row }) => (
      <div className="min-w-28">
        {formatDate(new Date(row.original.updatedAt))}
      </div>
    ),
  },
];

export const getFilteredRoomsData = (room, filterRoomTypes, searchString) => {
  const roomType = room.type;
  const isRoomTypeSelected = filterRoomTypes.find(
    (type) => type.name === roomType
  )?.checked;
  const isSearchStringMatched = room?.roomNumber
    ?.toString()
    ?.includes(searchString);
  return isRoomTypeSelected && isSearchStringMatched;
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

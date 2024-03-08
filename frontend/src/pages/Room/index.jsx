import DataTable from "@/components/tableComponents/DataTable";
// import { Button } from "@/components/ui/button";
// import { IoAdd } from "react-icons/io5";
import { roomColumns } from "./Constant";
import { useEffect, useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal } from "lucide-react";
import { getAllRooms } from "@/api/roomApis";

const Room = () => {
  const [roomData, setRoomData] = useState([]);

  const getRooms=async()=>{
    const data=await getAllRooms();
    setRoomData(data?.rooms);
  }

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div className="bg-white flex-1 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">All Rooms</h1>
        {/* <Button className="flex items-center gap-2">
          <IoAdd className="text-xl" />
          New Booking
        </Button> */}
      </div>

      {/* filter section  */}

      {/* table section  */}
      <div className="mt-8">
        <DataTable 
        columns={[
          ...roomColumns,
          // {
          //   id: "actions",
          //   header: "Actions",
          //   enableHiding: false,
          //   cell: ({ row }) => {
          //     const payment = row.original;
        
          //     return (
          //       <DropdownMenu>
          //         <DropdownMenuTrigger asChild>
          //           <Button variant="ghost" className="h-8 w-8 p-0">
          //             <span className="sr-only">Open menu</span>
          //             <MoreHorizontal className="h-4 w-4" />
          //           </Button>
          //         </DropdownMenuTrigger>
          //         <DropdownMenuContent>
          //           <DropdownMenuItem
          //             onClick={() => navigator.clipboard.writeText(payment.id)}
          //           >
          //             Edit
          //           </DropdownMenuItem>
          //           <DropdownMenuSeparator />
          //           <DropdownMenuItem
          //             onClick={() => navigator.clipboard.writeText(payment.id)}
          //           >
          //             Delete
          //           </DropdownMenuItem>
          //         </DropdownMenuContent>
          //       </DropdownMenu>
          //     );
          //   },
          // },
        ]} 
        data={roomData} 
        />
      </div>
    </div>
  );
};

export default Room;

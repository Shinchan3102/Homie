import DataTable from "@/components/tableComponents/DataTable";
// import { Button } from "@/components/ui/button";
// import { IoAdd } from "react-icons/io5";
import { roomColumns } from "./Constant";
import { useEffect, useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal } from "lucide-react";
import { getAllRoomTypes, getAllRooms, removeRoom } from "@/api/roomApis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useToast } from "@/components/ui/use-toast";
import ModalWrapper from "@/components/modals/ModalWrapper";
import AddAndEditBooking from "@/components/forms/AddAndEditBooking";
import { createBooking } from "@/api/bookingApis";
import NormalInput from "@/components/formComponents/NormalInput";
import MultipleSelect from "@/components/formComponents/MultipleSelect";
import NormalDatePicker from "@/components/formComponents/NormalDatePicker";
import { getTotalPrice } from "@/lib/utils";

const Room = () => {
  const [roomData, setRoomData] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterRoomTypes, setFilterRoomTypes] = useState([]);
  const [isRoomConfirmModalOpen, setIsRoomConfirmModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { toast } = useToast();

  const getRooms = async () => {
    let query = {};
    if (startDate && endDate && startDate > endDate) {
      setStartDate(null);
      setEndDate(null);
      toast({
        title: "Start date should be less than end date",
      });
      return;
    }
    if (startDate && new Date(startDate) < new Date()) {
      setStartDate(null);
      toast({
        title: "Start date should be greater than or equal to today",
      });
      return;
    }

    if (startDate) {
      query.startTime = startDate;
    }
    if (endDate) {
      query.endTime = endDate;
    }

    const data = await getAllRooms(query);
    setRoomData(data?.rooms);
  };

  const getRoomTypes = async () => {
    const res = await getAllRoomTypes();
    setRoomTypes(res);
    setFilterRoomTypes(
      res.map((type, id) => ({ id, name: type, checked: true }))
    );
  };

  const handleAddBooking = async (data) => {
    const res = await createBooking({ data });
    if (res.status === 400) {
      toast({
        title: "Error in adding booking",
        description: res.message || "",
      });
    } else {
      toast({
        title: "Booking added successfully",
      });
      setOpenFormModal(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;
    const res = await removeRoom({ roomId: selectedRoom._id });
    if (res.status === 400) {
      toast({
        title: "Error in deleting room",
        description: res.message,
      });
    } else {
      toast({
        title: "Room deleted successfully",
      });
      setRoomData((prev) =>
        prev.filter((room) => room._id !== selectedRoom._id)
      );
    }
    setIsRoomConfirmModalOpen(false);
  };

  useEffect(() => {
    getRoomTypes();
  }, []);

  useEffect(() => {
    getRooms();
  }, [startDate, endDate]);

  return (
    <div className="bg-white flex-1 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">All Rooms</h1>
      </div>

      {/* filter section  */}
      <div className="mt-8 flex justify-start gap-4 overflow-x-auto items-center">
        <div className="flex-1 min-w-40">
          <NormalInput
            label={"Search here"}
            data={searchString}
            setData={setSearchString}
          />
        </div>
        <MultipleSelect
          options={filterRoomTypes}
          handleToggle={(id, value) => {
            setFilterRoomTypes((prev) =>
              prev.map((type) =>
                type.id === id ? { ...type, checked: value } : type
              )
            );
          }}
          label={"Room Types"}
        />
        <NormalDatePicker
          label={"Start Date"}
          date={startDate}
          setDate={setStartDate}
        />
        <NormalDatePicker
          label={"End Date"}
          date={endDate}
          setDate={setEndDate}
        />
      </div>

      {/* table section  */}
      <div className="mt-3">
        <DataTable
          columns={[
            ...roomColumns,
            {
              id: "actions",
              header: "Actions",
              enableHiding: false,
              cell: ({ row }) => {
                const room = row.original;

                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRoom(room);
                          setOpenFormModal(true);
                        }}
                      >
                        Book
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsRoomConfirmModalOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]}
          data={roomData.filter((room) => {
            const roomType = room.type;
            const isRoomTypeSelected = filterRoomTypes.find(
              (type) => type.name === roomType
            )?.checked;
            const isSearchStringMatched = room?.roomNumber
              ?.toString()
              ?.includes(searchString);
            return isRoomTypeSelected && isSearchStringMatched;
          })}
        />
      </div>

      <ModalWrapper
        open={openFormModal}
        setOpen={setOpenFormModal}
        title={"Add Booking"}
        component={
          <AddAndEditBooking
            roomTypes={roomTypes}
            defaultSelectedRoom={selectedRoom?.roomNumber}
            editedRoom={null}
            isEditMode={false}
            handleClickSubmit={handleAddBooking}
            onCancel={() => {
              setOpenFormModal(false);
              setSelectedRoom(null);
            }}
            initialValues={{
              startDate: startDate ? new Date(startDate) : new Date(),
              startTime: startDate ? new Date(startDate) : null,
              endTime: endDate ? new Date(endDate) : null,
              endDate: endDate ? new Date(endDate) : new Date(),
              roomNumber: selectedRoom?._id,
              entryTime: "00:00",
              exitTime: "00:00",
              amount:
                startDate && endDate
                  ? getTotalPrice(
                      new Date(startDate),
                      new Date(endDate),
                      selectedRoom?.pricePerHour
                    )
                  : 0,
              type: selectedRoom?.type,
              email: "",
            }}
          />
        }
      />

      <ConfirmModal
        open={isRoomConfirmModalOpen}
        onClose={() => {
          setIsRoomConfirmModalOpen(false);
          setSelectedRoom(null);
        }}
        handleConfirm={handleDelete}
        description={
          "Are you sure you want to delete this room? This action cannot be undone."
        }
      />
    </div>
  );
};

export default Room;

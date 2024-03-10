import DataTable from "@/components/tableComponents/DataTable";
import { getActions, getFilteredRoomsData, roomColumns } from "./Constant";
import { useEffect, useState } from "react";
import { getAllRoomTypes, getAllRooms } from "@/api/roomApis";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useToast } from "@/components/ui/use-toast";
import ModalWrapper from "@/components/modals/ModalWrapper";
import AddAndEditBooking from "@/components/forms/AddAndEditBooking";
import { createBooking } from "@/api/bookingApis";
import { getTotalPrice } from "@/lib/utils";
import Loading from "@/components/Loading";
import Filters from "./Filters";

export default function Room() {
  // ----- States -----
  const [roomData, setRoomData] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterRoomTypes, setFilterRoomTypes] = useState([]);
  const [isRoomConfirmModalOpen, setIsRoomConfirmModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----- Hooks -----
  const { toast } = useToast();

  // ----- Variables and Constants -----
  const actions = [
    {
      label: "Book",
      onClick: (room) => {
        setSelectedRoom(room);
        setOpenFormModal(true);
      },
      disabled: false,
    },
    {
      label: "Delete",
      onClick: (room) => {
        setSelectedRoom(room);
        setIsRoomConfirmModalOpen(true);
      },
      disabled: false,
    },
  ];

  // ----- Functions -----
  const getRooms = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
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
    setIsRoomConfirmModalOpen(false);
    return toast({
      title: "Room cannot be deleted",
      description: "Room deletion is restricted for now.",
    });


    // const res = await removeRoom({ roomId: selectedRoom._id });
    // if (res.status === 400) {
    //   toast({
    //     title: "Error in deleting room",
    //     description: res.message,
    //   });
    // } else {
    //   toast({
    //     title: "Room deleted successfully",
    //   });
    //   setRoomData((prev) =>
    //     prev.filter((room) => room._id !== selectedRoom._id)
    //   );
    // }
    // setIsRoomConfirmModalOpen(false);
  };

  // ----- Effects -----
  useEffect(() => {
    getRoomTypes();
  }, []);

  useEffect(() => {
    getRooms();
  }, [startDate, endDate]);

  // ----- Render -----
  return (
    <div className="bg-white flex-1 p-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">All Rooms</h1>
          {isLoading && <Loading isLoading={isLoading} />}
        </div>
      </div>

      {/* filter section  */}
      <div className="mt-8 flex justify-start gap-4 overflow-x-auto items-center">
        <Filters
          searchString={searchString}
          setSearchString={setSearchString}
          filterRoomTypes={filterRoomTypes}
          setFilterRoomTypes={setFilterRoomTypes}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      {/* table section  */}
      <div className="mt-3">
        <DataTable
          columns={[...roomColumns, getActions(actions)]}
          data={roomData.filter((room) => {
            return getFilteredRoomsData(room, filterRoomTypes, searchString)
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
            defaultSelectedRoom={selectedRoom}
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
          "Are you sure you want to delete this room? Deleting a room will delete all bookings of the room."
        }
      />
    </div>
  );
}

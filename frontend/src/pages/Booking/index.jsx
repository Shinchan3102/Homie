import DataTable from "@/components/tableComponents/DataTable";
import { Button } from "@/components/ui/button";
import { IoAdd } from "react-icons/io5";
import {
  bookingColumns,
  getCancelBookingMessage,
  getRefundedDetails,
} from "./Constant";
import { useEffect, useState } from "react";
import {
  createBooking,
  getAllBookings,
  removeBooking,
  updateBooking,
} from "@/api/bookingApis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ModalWrapper from "@/components/modals/ModalWrapper";
import AddAndEditBooking from "@/components/forms/AddAndEditBooking";
import { getAllRoomTypes } from "@/api/roomApis";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useToast } from "@/components/ui/use-toast";
import { formatTimeFromDate } from "@/lib/utils";
import MultipleSelect from "@/components/formComponents/MultipleSelect";
import NormalDatePicker from "@/components/formComponents/NormalDatePicker";
import NormalInput from "@/components/formComponents/NormalInput";

const Booking = () => {
  // ----- States -----
  const [bookingData, setBookingData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filterRoomTypes, setFilterRoomTypes] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState([
    { id: 1, name: "CANCELLED", checked: true },
    { id: 2, name: "COMPLETED", checked: true },
    { id: 3, name: "UPCOMING", checked: true },
  ]);
  const [confirmType, setConfirmType] = useState("DELETE");

  const { toast } = useToast();

  const handleAddBooking = async (data) => {
    const res = await createBooking({ data });
    if (res.status === 400) {
      toast({
        title: "Error in adding booking",
        description: res.message || "",
      });
    } else {
      setBookingData((prev) => [...prev, res?.booking]);
      toast({
        title: "Booking added successfully",
      });
      setOpenFormModal(false);
    }
  };

  const handleCancelBooking = async () => {
    const bookingId = selectedBooking._id;
    if (!bookingId) return console.error("Booking Id is required");
    const { refundAmount } = getRefundedDetails(
      selectedBooking?.startTime,
      selectedBooking?.amount
    );

    const res = await updateBooking({
      bookingId,
      data: { status: "CANCELLED", refundedAmount: refundAmount },
    });
    if (res.status === 400) {
      toast({
        title: "Error in cancelling booking",
        description: res.message || "",
      });
    } else {
      setBookingData((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? res?.booking : booking
        )
      );
      toast({
        title: "Booking cancelled successfully",
      });
      setOpenFormModal(false);
    }
    setSelectedBooking(null);
  };

  const handleUpdateBooking = async (data) => {
    const bookingId = selectedBooking._id;
    if (!bookingId) return console.error("Booking Id is required");
    const res = await updateBooking({ bookingId, data });
    if (res.status === 400) {
      toast({
        title: "Error in updating booking",
        description: res.message || "",
      });
    } else {
      setBookingData((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? res?.booking : booking
        )
      );
      toast({
        title: "Booking updated successfully",
      });
      setOpenFormModal(false);
    }
    setSelectedBooking(null);
  };

  const handleDeleteBooking = async () => {
    const bookingId = selectedBooking._id;
    if (!bookingId) return console.error("Booking Id is required");
    const res = await removeBooking({ bookingId });
    if (res.status === 400) {
      toast({
        title: "Error in deleting booking",
        description: res.message || "",
      });
    } else {
      setBookingData((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
      toast({
        title: "Booking deleted successfully",
      });
    }
    setSelectedBooking(null);
  };

  const getBookings = async () => {
    const data = await getAllBookings();
    setBookingData(data?.bookings);
  };

  const getRoomTypes = async () => {
    const res = await getAllRoomTypes();
    setRoomTypes(res);
    setFilterRoomTypes(
      res.map((type, id) => ({ id, name: type, checked: true }))
    );
  };

  // ----- Effects -----
  useEffect(() => {
    getBookings();
    getRoomTypes();
  }, []);

  // ----- Render -----
  return (
    <div className="bg-white flex-1 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">All Bookings</h1>
        <Button
          onClick={() => setOpenFormModal(true)}
          className="flex items-center gap-2"
        >
          <IoAdd className="text-xl" />
          New <span className="hidden md:block">Booking</span>
        </Button>
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
        <MultipleSelect
          options={filterStatus}
          handleToggle={(id, value) => {
            setFilterStatus((prev) =>
              prev.map((status) =>
                status.id === id ? { ...status, checked: value } : status
              )
            );
          }}
          label={"Status"}
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
      <div className="mt-2">
        <DataTable
          columns={[
            ...bookingColumns,
            {
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedBooking(booking);
                          setOpenFormModal(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={booking.status === "CANCELLED"}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setOpenConfirmModal(true);
                          setConfirmType("CANCEL");
                        }}
                      >
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedBooking(booking);
                          setOpenConfirmModal(true);
                          setConfirmType("DELETE");
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
          data={bookingData.filter((booking) => {
            const roomType = booking.rooms[0]?.type;
            const bookingDate = new Date(booking.startTime);
            const isRoomTypeSelected = filterRoomTypes.find(
              (type) => type.name === roomType
            )?.checked;
            const isStatusSelected = filterStatus.find(
              (status) => status.name === booking.status
            )?.checked;
            const isStartDateSelected = !startDate
              ? true
              : bookingDate >= startDate;
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
          })}
        />
      </div>

      <ModalWrapper
        open={openFormModal}
        setOpen={setOpenFormModal}
        title={!selectedBooking ? "Add Booking" : "Edit Booking"}
        component={
          <AddAndEditBooking
            roomTypes={roomTypes}
            editedRoom={selectedBooking ? selectedBooking?.rooms[0] : null}
            isEditMode={!!selectedBooking}
            handleClickSubmit={
              !selectedBooking ? handleAddBooking : handleUpdateBooking
            }
            onCancel={() => {
              setOpenFormModal(false);
              setSelectedBooking(null);
            }}
            initialValues={
              selectedBooking
                ? {
                    ...selectedBooking,
                    startDate: new Date(selectedBooking.startTime),
                    endDate: new Date(selectedBooking.endTime),
                    startTime: new Date(selectedBooking.startTime),
                    endTime: new Date(selectedBooking.endTime),
                    roomNumber: selectedBooking.rooms[0]._id,
                    entryTime: formatTimeFromDate(selectedBooking.startTime),
                    exitTime: formatTimeFromDate(selectedBooking.endTime),
                    amount: selectedBooking.amount,
                    type: selectedBooking.rooms[0].type,
                  }
                : {
                    email: "",
                    startDate: new Date(),
                    endDate: new Date(),
                    type: "",
                    roomNumber: "",
                    entryTime: "00:00",
                    exitTime: "00:00",
                    amount: 0,
                  }
            }
          />
        }
      />

      <ConfirmModal
        open={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
          setSelectedBooking(null);
        }}
        handleConfirm={
          confirmType === "DELETE" ? handleDeleteBooking : handleCancelBooking
        }
        description={
          confirmType === "DELETE"
            ? "Are you sure you want to delete this booking? This action cannot be undone."
            : getCancelBookingMessage(
                selectedBooking?.startTime,
                selectedBooking?.amount
              )
        }
      />
    </div>
  );
};

export default Booking;

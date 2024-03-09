import DataTable from "@/components/tableComponents/DataTable";
import { Button } from "@/components/ui/button";
import { IoAdd } from "react-icons/io5";
import {
  bookingColumns,
  getActions,
  getCancelBookingMessage,
  getFilteredBookingData,
  getRefundedDetails,
} from "./Constant";
import { useEffect, useState } from "react";
import {
  createBooking,
  getAllBookings,
  removeBooking,
  updateBooking,
} from "@/api/bookingApis";
import ModalWrapper from "@/components/modals/ModalWrapper";
import AddAndEditBooking from "@/components/forms/AddAndEditBooking";
import { getAllRoomTypes } from "@/api/roomApis";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useToast } from "@/components/ui/use-toast";
import { formatTimeFromDate } from "@/lib/utils";
import { bookingStatus, cancelled, deleted } from "@/constants/data";
import Filters from "./Filters";
import Loading from "@/components/Loading";

export default function Booking() {
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
  const [filterStatus, setFilterStatus] = useState(bookingStatus);
  const [confirmType, setConfirmType] = useState(deleted);
  const [isLoading, setIsLoading] = useState(false);

  // ----- Hooks -----
  const { toast } = useToast();

  // ----- Variables and Constants -----
  const actions = [
    {
      label: "Edit",
      onClick: (booking) => {
        setSelectedBooking(booking);
        setOpenFormModal(true);
      },
      disabled: false,
    },
    {
      label: "Cancel",
      onClick: (booking) => {
        setSelectedBooking(booking);
        setOpenConfirmModal(true);
        setConfirmType(cancelled);
      },
      disabled: true,
    },
    {
      label: "Delete",
      onClick: (booking) => {
        setSelectedBooking(booking);
        setOpenConfirmModal(true);
        setConfirmType(deleted);
      },
      disabled: false,
    },
  ];

  // ----- Functions -----
  const getBookings = async () => {
    setIsLoading(true);
    const data = await getAllBookings();
    setBookingData(data?.bookings);
    setIsLoading(false);
  };

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
      data: { status: cancelled, refundedAmount: refundAmount },
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">All Bookings</h1>
          {isLoading && <Loading isLoading={isLoading} />}
        </div>
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
        <Filters
          searchString={searchString}
          setSearchString={setSearchString}
          filterRoomTypes={filterRoomTypes}
          setFilterRoomTypes={setFilterRoomTypes}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      {/* table section  */}
      <div className="mt-2">
        <DataTable
          columns={[...bookingColumns, getActions(actions)]}
          data={bookingData.filter((booking) => {
            return getFilteredBookingData(
              booking,
              filterRoomTypes,
              filterStatus,
              startDate,
              endDate,
              searchString
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
            isEditMode={!!selectedBooking}
            handleClickSubmit={
              !selectedBooking ? handleAddBooking : handleUpdateBooking
            }
            defaultSelectedRoom={selectedBooking?.rooms[0] || null}
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
          confirmType === deleted ? handleDeleteBooking : handleCancelBooking
        }
        description={
          confirmType === deleted
            ? "Are you sure you want to delete this booking? This action cannot be undone."
            : getCancelBookingMessage(
                selectedBooking?.startTime,
                selectedBooking?.amount
              )
        }
      />
    </div>
  );
}

/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SelectSingle from "@/components/formComponents/SelectSingle";
import TextInput from "@/components/formComponents/TextInput";
import { DatePicker } from "@/components/formComponents/DatePicker";
import { useEffect, useState } from "react";
import { getAllRooms } from "@/api/roomApis";
import {
  checkDateRangeCompatibility,
  convertToIST,
  getTotalPrice,
} from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/Loading";

// schema for the form validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  roomNumber: z.string().min(3, { message: "Please select room number." }),
  amount: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  entryTime: z.string().min(1, { message: "Please select entry time." }),
  exitTime: z.string().min(1, { message: "Please select exit time." }),
});

export default function AddAndEditBooking({
  roomTypes,
  onCancel,
  initialValues,
  handleClickSubmit,
  editedRoom,
  isEditMode = false,
  defaultSelectedRoom,
}) {
  // ----- States -----
  const [rooms, setRooms] = useState([]);
  const [showRoomCount, setShowRoomCount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinalLoading, setIsFinalLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    initialValues?.startTime || null,
    initialValues?.endTime || null,
  ]);

  // ----- Hooks -----
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });
  const { toast } = useToast();

  // ----- Variables and Constants -----
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const entryTime = form.watch("entryTime");
  const exitTime = form.watch("exitTime");
  const type = form.watch("type");
  const roomNumber = form.watch("roomNumber");

  // ----- Functions -----
  const getRooms = async () => {
    const startTime = convertToIST(startDate, entryTime);
    const endTime = convertToIST(endDate, exitTime);
    const message = checkDateRangeCompatibility(startTime, endTime);

    if (message) {
      return toast({
        title: "Error in date validation",
        description: message,
      });
    }

    setIsLoading(true);

    let query = {
      startTime,
      endTime,
    };

    setSelectedRange([startTime, endTime]);

    if (type && type !== "ALL") query.type = type;
    if (isEditMode) query.bookingId = initialValues._id;
    const res = await getAllRooms(query);

    setRooms(res?.rooms || []);
    setShowRoomCount(true);
    form.setValue("roomNumber", "");
    form.setValue("amount", 0);
    setIsLoading(false);
  };

  async function onSubmit(values) {
    if(!selectedRange[0] || !selectedRange[1]) {
      return toast({
        title: "Error in date validation",
        description: "Please check available dates before proceeding.",
      });
    }
    setIsFinalLoading(true);
    const data = {
      ...values,
      startTime: selectedRange[0],
      endTime: selectedRange[1],
      rooms: [roomNumber],
    };

    await handleClickSubmit(data);
    form.reset();
    setIsFinalLoading(false);
  }

  useEffect(() => {
    if (
      roomNumber !== "NA" &&
      roomNumber &&
      selectedRange[0] &&
      selectedRange[1] &&
      rooms.length > 0
    ) {
      const selectedRoom = isEditMode
        ? editedRoom
        : rooms.find((item) => item._id === roomNumber);
      console.log(selectedRoom);
      const totalPrice = getTotalPrice(
        selectedRange[0],
        selectedRange[1],
        selectedRoom.pricePerHour
      );
      form.setValue("amount", totalPrice);
    }
  }, [roomNumber]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div className="col-span-2 grid grid-cols-2 items-end gap-6">
          <DatePicker form={form} label="Starting Date*" name={"startDate"} />
          <DatePicker form={form} label="Ending Date*" name={"endDate"} />
          <TextInput
            form={form}
            type="time"
            label={"Entry Time*"}
            name={"entryTime"}
            placeholder={""}
          />
          <TextInput
            form={form}
            type="time"
            label={"Exit Time*"}
            name={"exitTime"}
            placeholder={""}
          />
          <SelectSingle
            form={form}
            label={"Room Type"}
            name={"type"}
            options={[
              { value: "ALL", label: "All" },
              ...roomTypes.map((item) => ({ value: item, label: item })),
            ]}
          />
          <Button
            disabled={isLoading || isFinalLoading}
            className="col-span-2 gap-2"
            type="button"
            onClick={getRooms}
          >
            <Loading isLoading={isLoading} />
            Check Availability
          </Button>
        </div>
        {showRoomCount && (
          <p className="col-span-2 text-center"> {rooms.length} Rooms found</p>
        )}
        <div className="">
          <SelectSingle
            form={form}
            label={"Room Number*"}
            name={"roomNumber"}
            options={
              isLoading
                ? [{ value: "NA", label: "Loading..." }]
                : rooms?.length > 0
                ? rooms.map((item) => ({
                    value: item._id,
                    label: `${item.roomNumber} - (Rs. ${item.pricePerHour} per hour)`,
                  }))
                : roomNumber !== "NA" && roomNumber !== "" && defaultSelectedRoom
                ? [{ value: roomNumber, label: defaultSelectedRoom }]
                : [{ value: "NA", label: "No rooms found" }]
            }
          />
        </div>
        <TextInput
          form={form}
          type="email"
          label={"Email*"}
          name={"email"}
          placeholder={"Enter email"}
        />
        <TextInput
          form={form}
          label={"Total Price"}
          name={"amount"}
          placeholder={""}
          disabled
        />
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <Button type="button" variant={"outline"} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="gap-2"
            disabled={isLoading || isFinalLoading}
            type="submit"
          >
            <Loading isLoading={isFinalLoading} />
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

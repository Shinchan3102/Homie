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
import { LuLoader2 } from "react-icons/lu";
import { checkDateRangeCompatibility, getTotalPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  roomNumber: z.string().min(3, { message: "Please select room number." }),
  amount: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  entryTime: z.string().min(1, { message: "Please select entry time." }),
  exitTime: z.string().min(1, { message: "Please select exit time." }),
});

export default function DemoForm({
  roomTypes,
  onCancel,
  initialValues,
  handleClickSubmit,
}) {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    initialValues.startTime,
    initialValues.endTime,
  ]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const entryTime = form.watch("entryTime");
  const exitTime = form.watch("exitTime");
  const type = form.watch("type");
  const roomNumber = form.watch("roomNumber");

  const { toast } = useToast();

  const getRooms = async () => {
    const startTime = new Date(
      new Date(startDate).setHours(
        entryTime.split(":")[0],
        entryTime.split(":")[1]
      )
    );

    const endTime = new Date(
      new Date(endDate).setHours(exitTime.split(":")[0], exitTime.split(":")[1])
    );

    if (!checkDateRangeCompatibility(startTime, endTime)) {
      return toast({
        title: "Error in date validation",
        description: "Please select valid date range.",
      });
    }

    setIsLoading(true);

    let query = {
      startTime,
      endTime,
    };

    setSelectedRange([startTime, endTime]);

    if (type) query.type = type;
    const res = await getAllRooms(query);
    setRooms(res?.rooms || []);
    form.setValue("roomNumber", "");
    form.setValue("amount", 0);
    setIsLoading(false);
  };

  function onSubmit(values) {
    const data = {
      ...values,
      startTime: selectedRange[0],
      endTime: selectedRange[1],
      rooms: [roomNumber],
    };

    handleClickSubmit(data);
    form.reset();
  }

  useEffect(() => {
    if (
      roomNumber !== "NA" &&
      roomNumber &&
      selectedRange[0] &&
      selectedRange[1] &&
      rooms.length > 0
    ) {
      const selectedRoom = rooms.find((item) => item._id === roomNumber);
      console.log(selectedRoom)
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
            options={roomTypes?.map((item) => ({ value: item, label: item }))}
          />
          <Button
            disabled={isLoading}
            className="col-span-2 gap-2"
            type="button"
            onClick={getRooms}
          >
            <div
              className={`text-lg ${
                !isLoading ? "opacity-0" : "opacity-100 animate-spin"
              }`}
            >
              <LuLoader2 />
            </div>
            Check Availability
          </Button>
        </div>

        <SelectSingle
          form={form}
          label={"Room Number*"}
          name={"roomNumber"}
          options={
            isLoading
              ? [{ value: "loading", label: "Loading..." }]
              : rooms?.map((item) => ({
                  value: item._id,
                  label: `${item.roomNumber} - (Rs. ${item.pricePerHour} per hour)`,
                }))
          }
        />
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
          <Button disabled={isLoading} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

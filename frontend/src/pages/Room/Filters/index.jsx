/* eslint-disable react/prop-types */
import MultipleSelect from "@/components/formComponents/MultipleSelect";
import NormalDatePicker from "@/components/formComponents/NormalDatePicker";
import NormalInput from "@/components/formComponents/NormalInput";

export default function Filters({
  searchString,
  setSearchString,
  filterRoomTypes,
  setFilterRoomTypes,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <>
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
    </>
  );
}

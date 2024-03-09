/* eslint-disable react/prop-types */
import { CiCompass1 } from "react-icons/ci";

export default function BriefSummaryCard({
  label,
  data = 0,
  Icon = CiCompass1,
}) {
  return (
    <div className="rounded-xl shadow-sm bg-white p-5 flex items-center gap-3 justify-between">
      <div className="rounded-lg text-3xl bg-muted p-2.5">
        <Icon />
      </div>
      <div className="flex-1 flex flex-col">
        <div className=" text-muted-foreground text-sm">{label}</div>
        <div className="text-xl font-semibold">{data}</div>
      </div>
    </div>
  );
}

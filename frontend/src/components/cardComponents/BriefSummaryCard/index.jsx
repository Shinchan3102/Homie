/* eslint-disable react/prop-types */
import { CiCompass1 } from "react-icons/ci";

const BriefSummaryCard = ({ label, data=0, Icon = CiCompass1 }) => {
  return (
    <div className="rounded-xl shadow-sm bg-white px-6 py-5 flex items-center gap-4 justify-between">
      <div className="rounded-lg text-2xl bg-muted p-3">
        <Icon />
      </div>
      <div className="flex-1 flex flex-col">
        <div className=" text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{data}</div>
      </div>
    </div>
  );
};

export default BriefSummaryCard;

import { CiCompass1 } from "react-icons/ci";


const BriefSummaryCard = () => {
  return (
    <div className="rounded-xl shadow-sm bg-primary-bg px-6 py-5 flex items-center gap-4 justify-between">
      <div className="rounded-lg text-2xl bg-muted-bg p-3">
        <CiCompass1 />
      </div>
      <div className="flex-1 flex flex-col">
        <div className=" text-secondary-color">
          Total Revenue
        </div>
        <div className="text-xl font-bold text-primary-color">
          $1,200
        </div>
      </div>

    </div>
  )
}

export default BriefSummaryCard

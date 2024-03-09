import { CiCompass1 } from "react-icons/ci";


const BriefSummaryCard = () => {
  return (
    <div className="rounded-xl shadow-sm bg-white px-6 py-5 flex items-center gap-4 justify-between">
      <div className="rounded-lg text-2xl bg-muted p-3">
        <CiCompass1 />
      </div>
      <div className="flex-1 flex flex-col">
        <div className=" text-muted-foreground">
          Total Revenue
        </div>
        <div className="text-xl font-semibold">
          Rs. 1,200
        </div>
      </div>

    </div>
  )
}

export default BriefSummaryCard

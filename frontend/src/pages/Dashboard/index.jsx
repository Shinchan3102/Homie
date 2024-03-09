import BriefSummaryCard from "../../components/cardComponents/BriefSummaryCard"

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-4 gap-4">
        <BriefSummaryCard />
        <BriefSummaryCard />
        <BriefSummaryCard />
        <BriefSummaryCard />
      </div>
    </div>
  )
}

export default Dashboard

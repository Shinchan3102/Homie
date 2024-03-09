import { getDashboardData } from "@/api/bookingApis";
import BriefSummaryCard from "../../components/cardComponents/BriefSummaryCard";
import { useEffect, useState } from "react";
import { IoTodayOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { LuCalendarX2 } from "react-icons/lu";
import Loading from "@/components/Loading";

export default function Dashboard() {
  // ----- States -----
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----- Functions -----
  const getDashboard = async () => {
    setIsLoading(true);
    const data = await getDashboardData();
    setDashboardData(data);
    setIsLoading(false);
  };

  // ----- Effects -----
  useEffect(() => {
    getDashboard();
  }, []);

  // ----- Render -----
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {isLoading && <Loading isLoading={isLoading} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <BriefSummaryCard
          label="Total Bookings"
          data={dashboardData?.totalBookings}
        />
        <BriefSummaryCard
          label={"Total Active Bookings"}
          data={dashboardData?.totalUpcomingBookings}
          Icon={IoCalendarOutline}
        />
        <BriefSummaryCard
          label={"Today Active Bookings"}
          data={dashboardData?.totalTodayBookings}
          Icon={IoTodayOutline}
        />
        <BriefSummaryCard
          label={"Total Cancelled Bookings"}
          data={dashboardData?.totalCancelledBookings}
          Icon={LuCalendarX2}
        />
      </div>
    </div>
  );
}

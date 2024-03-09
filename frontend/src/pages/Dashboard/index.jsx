import { getDashboardData } from "@/api/bookingApis";
import BriefSummaryCard from "../../components/cardComponents/BriefSummaryCard";
import { useEffect, useState } from "react";
import { IoTodayOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { LuCalendarX2 } from "react-icons/lu";




const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const getDashboard = async () => {
    const data = await getDashboardData();
    setDashboardData(data);
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
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
};

export default Dashboard;

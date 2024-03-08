import { useLocation } from "react-router-dom"
import { sidebarItems } from "../../constants/data"
import SidebarItem from "./SidebarItem"

const Sidebar = () => {
  const location=useLocation();

  return (
    <div className="bg-white md:min-w-72 h-full md:p-6 py-8">
      <ul className="flex flex-col gap-2">
        {
          sidebarItems.map((item) => (
            <li key={item.id} className="">
              <SidebarItem
                title={item.title}
                path={item.path}
                Icon={item.Icon}
                isActive={item.path === location.pathname}
              />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Sidebar

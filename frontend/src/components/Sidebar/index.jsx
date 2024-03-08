import { sidebarItems } from "../../constants/data"
import SidebarItem from "./SidebarItem"

const Sidebar = () => {
  return (
    <div className="bg-primary-bg min-w-72 border-r h-full p-8 py-10">
      <ul className="flex flex-col gap-2">
        {
          sidebarItems.map((item) => (
            <li key={item.id} className="">
              <SidebarItem
                title={item.title}
                path={item.path}
                Icon={item.Icon}
              />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Sidebar

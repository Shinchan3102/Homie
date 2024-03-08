/* eslint-disable react/prop-types */

import { Link } from "react-router-dom"

const SidebarItem = ({title, path, Icon}) => {
  return (
    <Link to={path} className="flex items-center hover:bg-muted-bg py-3 px-4 gap-3 text-xl rounded-lg ">
      <Icon className='text-secondary-color' />
      <div className="font-semibold text-lg">
        {title}
      </div>
    </Link>
  )
}

export default SidebarItem

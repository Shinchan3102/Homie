import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const MainLayout = () => {
  return (
    <div className='h-screen'>
      <Navbar />
      <div className='flex h-full'>
        <Sidebar />
        <div className='flex-1 bg-secondary-bg overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout

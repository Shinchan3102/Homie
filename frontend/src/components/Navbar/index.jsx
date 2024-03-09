import Logo from "../Logo"
import Sidebar from "../Sidebar"
import SlideOver from "../SlideOver"

const Navbar = () => {
  return (
    <div className="h-16 min-h-16 flex items-center justify-between gap-4 bg-primary-bg px-8 border-b">
      <Logo />

      <div className="flex items-center gap-4 md:block hidden">
        <div className="h-10 w-10 rounded-full bg-secondary" />
      </div>
      <div className="md:hidden block">
        <SlideOver>
          <Sidebar />
        </SlideOver>
      </div>
    </div>
  )
}

export default Navbar

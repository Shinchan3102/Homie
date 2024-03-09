import Logo from "../Logo";
import Sidebar from "../Sidebar";
import SlideOver from "../SlideOver";

export default function Navbar() {
  return (
    <div className="h-16 min-h-16 flex items-center justify-between gap-4 bg-primary-bg px-8 border-b">
      <Logo />

      <div className="items-center gap-4 md:block hidden">
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-600 text-white">
          A
        </div>
      </div>
      <div className="md:hidden block">
        <SlideOver>
          <Sidebar />
        </SlideOver>
      </div>
    </div>
  );
}

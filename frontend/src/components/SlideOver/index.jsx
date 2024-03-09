/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../Logo";
import { MdOutlineMenu } from "react-icons/md";

export default function SlideOver({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="icon" className="text-xl">
          <MdOutlineMenu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="h-full flex flex-col justify-between">
          <div className="">
            <SheetHeader>
              <Logo />
            </SheetHeader>
            <div className="">{children}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              A
            </div>
            <div className="text-lg font-semibold">Admin</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

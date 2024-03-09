/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ModalWrapper({ title, open, setOpen, component }) {
  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent className="max-w-[800px] md:w-[80vw] min-w-[360px] max-h-[80vh]">
        <DialogHeader className={"h-20 md:h-16"}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <div className="">Book a room for your customer easily.</div>
            <div className="text-red-500 text-xs">
              All charges will be calculated on hourly basis even for incomplete
              hours.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(80vh-10rem)] md:max-h-[calc(80vh-8rem)] overflow-y-auto">
          {component}
        </div>
      </DialogContent>
    </Dialog>
  );
}

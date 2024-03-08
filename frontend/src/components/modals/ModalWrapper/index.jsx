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
      <DialogContent className="max-w-[800px] w-fit">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Book a room for your customer easily.
          </DialogDescription>
        </DialogHeader>
        <div className="">{component}</div>
      </DialogContent>
    </Dialog>
  );
}

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
        <DialogHeader className={'h-12'}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Book a room for your customer easily.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(80vh-6rem)] overflow-y-auto">{component}</div>
      </DialogContent>
    </Dialog>
  );
}

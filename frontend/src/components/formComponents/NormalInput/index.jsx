/* eslint-disable react/prop-types */
import { Input } from "@/components/ui/input";

export default function NormalInput({ label, data, setData }) {
  return (
    <Input
      placeholder={label}
      value={data}
      onChange={(e) => setData(e.target.value)}
    />
  );
}

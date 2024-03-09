/* eslint-disable react/prop-types */
import { Input } from "@/components/ui/input";

const NormalInput = ({ label, data, setData }) => {
  return (
    <Input
      placeholder={label}
      value={data}
      onChange={(e) => setData(e.target.value)}
    />
  );
};

export default NormalInput;

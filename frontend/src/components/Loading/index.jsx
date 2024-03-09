/* eslint-disable react/prop-types */
import { LuLoader2 } from "react-icons/lu";

export default function Loading({ isLoading }) {
  return (
    <div
      className={`text-lg ${
        !isLoading ? "opacity-0" : "opacity-100 animate-spin"
      }`}
    >
      <LuLoader2 />
    </div>
  );
}

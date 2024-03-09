/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function SidebarItem({ title, path, Icon, isActive }) {
  return (
    <Link
      to={path}
      className={`flex items-center hover:bg-muted py-3 px-5 gap-3 text-xl rounded-lg ${
        isActive ? "bg-muted" : ""
      }`}
    >
      <Icon className="text-muted-foreground" />
      <div className="font-semibold text-lg">{title}</div>
    </Link>
  );
}

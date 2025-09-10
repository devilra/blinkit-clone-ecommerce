"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathName = usePathname();

  const hideNavbar = ["/login", "/register"].includes(pathName);

  if (hideNavbar) return null;

  return <Navbar />;
}

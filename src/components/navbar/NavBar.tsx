import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NextUIProvider,
} from "@nextui-org/react";
import Image from "next/image";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { LuUserSquare } from "react-icons/lu";
import { GiTicket } from "react-icons/gi";

function NavBar() {
  return (
    // <NextUIProvider>
    //<div className="flex flex-col w-full">
    <Navbar
      //style={{ maxWidth: "none !important" }}
      className="w-full px-1 md:px-10 flex justify-between bg-[#121519] h-16"
    >
      <NavbarBrand className="">
        <Image src="/tutiLogo.png" alt="tuti" width={80} height={40} />
      </NavbarBrand>
      <NavbarContent className="pr-0.5 md:pr-5" justify="end">
        <NavbarItem>
          <PiMagnifyingGlassLight color="#0BDB8F" size={25} />
        </NavbarItem>
        <NavbarItem>
          <LuUserSquare color="#0BDB8F" size={25} />
        </NavbarItem>
        <NavbarItem>
          <GiTicket color="#0BDB8F" size={25} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    // </div>
    //</NextUIProvider>
  );
}

export default NavBar;

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
    <NextUIProvider>
      <div className="flex flex-col w-full">
        <Navbar
          style={{ maxWidth: "none !important" }}
          className="flex justify-between bg-[#121519]"
        >
          <NavbarBrand className="ml-8">
            <Image src="/tutiLogo.png" alt="tuti" width={100} height={100} />
          </NavbarBrand>
          <NavbarContent className="mr-8" justify="end">
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
      </div>
    </NextUIProvider>
  );
}

export default NavBar;

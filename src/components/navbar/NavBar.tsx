import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem
} from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';
import { GiTicket } from 'react-icons/gi';
import { LuUserSquare } from 'react-icons/lu';
import { PiMagnifyingGlassLight } from 'react-icons/pi';

function NavBar() {
  return (
    <Navbar className="flex h-16 w-full justify-between bg-[#121519] px-1 md:px-10">
      <NavbarBrand className="">
        <Image
          className="w-auto"
          src="/tutiLogo.png"
          alt="tuti"
          width={60}
          height={40}
        />
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
  );
}

export default NavBar;

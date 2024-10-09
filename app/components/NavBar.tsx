'use client'; // Ensure this is at the top
import React from 'react';
import { FaCableCar } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use usePathname to get the current path

const NavBar = () => {
    const pathname = usePathname(); // Get the current pathname

    const menuItems = [
        {
            id: 1,
            href: "/",
            name: 'Home'
        },
        {
            id: 2,
            href: "/my-rides",
            name: 'My Rides'
        },
        {
            id: 3,
            href: "/about",
            name: 'About'
        },
        {
            id: 4,
            href: "/settings",
            name: 'Settings'
        },
    ];

    return (
        <nav className='pt-10 flex justify-between px-4 items-center max-w-6xl mx-auto'>
            <Link href='/' className='flex items-center gap-2'>
                <FaCableCar className='text-xl text-indigo-500' />
                <h1 className='text-4xl font-bold'>Riddy</h1>
            </Link>
            <div className='lg:flex hidden gap-6 font-thin text-gray-500'>
                {menuItems.map(({  id, href, name }) => (
                    <Link
                        key={id}
                        href={href}
                        className={`cursor-pointer ${pathname === href ? 'border-indigo-500 border-b ' : 'text-gray-500 font-thin'}`}
                    >
                        {name}
                    </Link>
                ))}
            </div>
            <div className='flex items-center gap-1 rounded-full cursor-pointer'>
                <p className='text-gray-500 py-2 px-1 rounded-xl'>EN</p>
                <p className='text-gray-500 py-2 px-4 rounded-xl'>Help</p>
                <div className='w-[50px] h-[50px] bg-red-400 flex items-center gap-1 rounded-full cursor-pointer'>
                    <img
                        src="james.jpeg"
                        alt="Profile of James Oluwaleye"
                        className='rounded-full'
                    />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

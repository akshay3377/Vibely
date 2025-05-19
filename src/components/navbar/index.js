"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import ThemeToggle from "../theme-toggle";
import { CloseIcon, MenuIcons, DocumentIcon } from "@/icons";
import { data } from "./data";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <nav
      className={`sticky top-0 right-0 z-[9999] w-full  transition-all duration-300 ${
        isOpen
          ? "bg-white dark:bg-gray-900" // Solid background for mobile open
          : scrolled
          ? "bg-white/50 dark:bg-gray-900/50 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link className="my-12" href="/">
              <Image
                src="/images/timeline.webp"
                alt="Logo"
                width={60}
                height={60}
              />
            </Link>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white"
              >
                <MenuIcons />
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          {!isOpen && (
            <div className="hidden md:flex space-x-2 ">
              {data.map((navlink, index) => (
                <a
                  key={index}
                  href={`#${navlink.id}`}
                  className="   hover:bg-ghost rounded-xl   py-1 px-2"
                >
                  {navlink.title}
                </a>
              ))}
            </div>
          )}

          {/* Right Buttons */}

          <div className="flex items-center space-x-4 md:flex">
            <ThemeToggle />

            <a
            target="_blank"
              href="/resume"
              className="px-2 py-1 border-2 flex justify-center items-center  text-sm md:text-md border-primary group  gap-2 rounded-md hover:bg-gray-800 text-primary transition"
            >
              Resume
              <DocumentIcon className="fill-primary  h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 opacity-95  bg-white dark:bg-gray-900 flex flex-col items-center justify-center space-y-6 p-6"
          >
            {/* Close Button */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-black dark:text-white"
              aria-label="Close Menu"
            >
              <CloseIcon />
            </button>

            {/* Mobile Nav Links */}
            <ul className="flex flex-col items-center space-y-4 text-lg">
              {data.map((navlink, index) => (
                <li key={index}>
                  <a
                    href={`#${navlink.id}`}
                    onClick={() => setIsOpen(false)}
                    className="text-[#999797] font-bold dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    {navlink.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

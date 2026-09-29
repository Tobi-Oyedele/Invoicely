import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Logo } from "../brand/Logo";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <DesktopMenu />
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-fg-muted hover:text-fg transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <FiMenu className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

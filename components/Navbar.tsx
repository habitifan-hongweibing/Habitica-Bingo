
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserIcon, PlusCircleIcon, CollectionIcon, InformationCircleIcon } from './icons';

const NavItem: React.FC<{ to: string; children: React.ReactNode; }> = ({ to, children }) => {
  const activeClass = 'bg-habitica-dark text-white';
  const inactiveClass = 'text-habitica-text-secondary hover:bg-habitica-dark hover:text-white';
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`
      }
    >
      {children}
    </NavLink>
  );
};

const Navbar: React.FC = () => {
  return (
    <header className="bg-habitica-main shadow-lg sticky top-0 z-10">
      <nav className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            Habitica <span className="text-habitica-light">Bingo</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <NavItem to="/about">
              <InformationCircleIcon className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">About</span>
            </NavItem>
            <NavItem to="/my-bingos">
              <CollectionIcon className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">My Bingos</span>
            </NavItem>
            <NavItem to="/create">
              <PlusCircleIcon className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Create New</span>
            </NavItem>
            <NavItem to="/profile">
              <UserIcon className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </NavItem>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
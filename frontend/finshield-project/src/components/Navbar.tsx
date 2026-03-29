import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/approvals', label: 'Approvals' },
  { to: '/audit', label: 'Audit Logs' },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="FinShield" className="w-8 h-8" />
          <span className="text-xl font-extrabold text-primary tracking-tight">FinShield</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
            >
              {l.label}
              {location.pathname === l.to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-card px-4 overflow-hidden"
          >
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm font-medium ${
                  location.pathname === l.to ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

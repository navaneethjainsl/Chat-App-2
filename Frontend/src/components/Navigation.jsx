
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MessageSquare, User, Home } from 'lucide-react';

import axios from 'axios';
import Cookies from "js-cookie";

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/auth', label: 'Sign In', icon: User },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const authtoken = Cookies.get("authtoken");

    if (!authtoken) {// Redirect to auth page if not logged in
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="text-primary font-semibold text-xl flex items-center">
            <span className="mr-2 bg-primary text-primary-foreground rounded-lg p-1.5">
              <MessageSquare size={18} />
            </span>
            Messenger
          </Link>
        </motion.div>

        <motion.ul
          className="flex items-center space-x-1 sm:space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {navItems.map((item) => {
            let { path, label, icon} = item;
            if (path === "/auth" && isAuthenticated) {
              path = "/logout"
              label = "Log Out"
            }

            const isActive = location.pathname === path;
            const Icon = icon;

            return (
              <li key={path}>
                <Link
                  to={path}
                  className={cn(
                    "relative px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                  )}
                >
                  <Icon size={16} className="mr-1.5" />
                  <span className="hidden sm:inline">{label}</span>
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-lg border border-primary"
                      layoutId="nav-indicator"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </motion.nav>
  );
};

export default Navigation;

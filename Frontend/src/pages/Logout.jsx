
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("authtoken");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out. Redirecting to the home page...",
    });

    setTimeout(() => {
      navigate("/");
    }, 1500); // Allow time for the toast to appear before redirecting
  }, [navigate]);

  return null;
};

export default Logout;

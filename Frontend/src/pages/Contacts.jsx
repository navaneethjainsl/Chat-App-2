
import { motion } from 'framer-motion';
import { useLocation } from "react-router-dom";
import Navigation from '@/components/Navigation';
import ContactInterface from '@/components/ContactInterface';

const Contacts = () => {  
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navigation />
      <div className="container mx-auto p-6 pt-24 h-screen">
        <div className="h-[calc(100vh-6rem)]">
          <ContactInterface/>
        </div>
      </div>
    </motion.div>
  );
};

export default Contacts;

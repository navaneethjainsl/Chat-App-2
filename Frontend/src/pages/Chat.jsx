
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
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
          <ChatInterface />
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;

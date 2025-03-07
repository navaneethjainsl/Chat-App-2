
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navigation />
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(circle_at_center,rgba(210,210,255,0.2)_0%,rgba(255,255,255,0)_60%)]" />
        </div>
        
        <AuthForm />
      </div>
    </motion.div>
  );
};

export default Auth;

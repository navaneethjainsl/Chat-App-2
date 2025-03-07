
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    description: 'Communicate instantly with smooth, real-time messaging experiences.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'End-to-end encryption ensures your conversations remain private.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance for seamless communication without delays.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 px-6">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(circle_at_center,rgba(210,210,255,0.2)_0%,rgba(255,255,255,0)_60%)]" />
      </div>
      
      <motion.div
        className="container max-w-5xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="inline-block">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-accent text-accent-foreground mb-6">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary/70 animate-pulse-light" />
            Introducing our messenger platform
          </span>
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary mb-6"
        >
          A better way to
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            connect and chat
          </span>
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Experience seamless communication with our elegant, intuitive messenger platform. 
          Designed with simplicity and performance in mind.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Button asChild size="lg" className="group">
            <Link to="/chat">
              Try It Now
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth">Sign In</Link>
          </Button>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-accent/50 backdrop-blur-2xs border border-border transition-all hover:shadow-md hover:bg-accent/80 hover:-translate-y-1"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center p-2 mb-4 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="mt-24 flex justify-center"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-xl border border-border">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto" />
            <motion.img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop"
              alt="Messenger Interface Preview"
              className="w-full h-auto"
              initial={{ scale: 1.05, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

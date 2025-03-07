
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, EyeOff, Key, Lock, Mail, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    toast({
      title: "Login successful",
      description: "Redirecting to chat...",
    });
    
    setTimeout(() => {
      navigate('/chat');
    }, 1500);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    toast({
      title: "Registration successful",
      description: "You can now log in with your credentials",
    });
    
    setActiveTab('login');
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-border p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
          >
            <Lock className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {activeTab === 'login' 
              ? 'Enter your credentials to continue' 
              : 'Fill in your details to get started'}
          </motion.p>
        </div>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="login" className="mt-0">
              <motion.div
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="your@email.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? 
                                  <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                }
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full mt-6">
                      Sign In
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <motion.div
                key="register-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="John Doe"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="your@email.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? 
                                  <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                }
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? 
                                  <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                }
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full mt-6">
                      Create Account
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuthForm;

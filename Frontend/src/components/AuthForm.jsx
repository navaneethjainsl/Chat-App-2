
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
import axios from 'axios';
import Cookies from "js-cookie";
// import dotenv from 'dotenv/config';

// const BACKENDURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const BACKENDURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const loginSchema = z.object({
	// email: z.string().email('Invalid email address'),
	username: z.string().min(5, 'Username must have at least 5 characters'),
	password: z.string().min(5, 'Password must be at least 5 characters'),
});

const registerSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	phnum: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
	username: z.string().min(5, 'Username must have at least 5 characters'),
	password: z.string().min(5, 'Password must be at least 5 characters'),
	confirmPassword: z.string().min(5, 'Password must be at least 5 characters'),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

// type LoginFormValues = z.infer<typeof loginSchema>;
// type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthForm = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('login');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const loginForm = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			// email: '',
			username: '',
			password: '',
		},
	});

	const registerForm = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			phnum: '',
			username: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onLoginSubmit = async (data) => {
		// console.log("data");
		// console.log(data);

		try {
			const response = await axios.post(`http://localhost:5000/api/auth/login`,
				data,
				{
					headers: {
						"Content-Type": "application/json", // Specify JSON content
					}
				}
			);
			console.log("response");
			console.log(response);

			// localStorage.setItem("auth-token", response.accessToken);
			Cookies.set("authtoken", response.data.authtoken, { secure: true, sameSite: "Strict" });
			// const authtoken = Cookies.get("authtoken");
			// console.log("authtoken");
			// console.log(authtoken);

			toast({
				title: "Login successful",
				description: "Redirecting to chat...",
			});

			setTimeout(() => {
				navigate('/contacts');
			}, 1500);
		}
		catch (error) {
			console.log("error");
			console.log(error);
			console.log("error 2.O");
			console.log(error.response.data);

			toast({
				title: "Try again",
				description: error.response.data.message,
			});

			// setTimeout(() => {
			//   navigate('/contacts');
			// }, 1500);
		}

	};

	const onRegisterSubmit = async (data) => {
		console.log("data");
		console.log(data);

		try {
			const response = await axios.post(`http://localhost:5000/api/auth/signup`,
				data,
				{
					headers: {
						"Content-Type": "application/json", // Specify JSON content
					}
				}
			);
			// console.log("response");
			// console.log(response);

			// localStorage.setItem("auth-token", response.accessToken);
			Cookies.set("authtoken", response.data.authtoken, { secure: true, sameSite: "Strict" });

			toast({
				title: "Registration successful",
				description: "You can now log in with your credentials",
			});

			setActiveTab('login');
		}
		catch (error) {
			console.log("error");
			console.log(error.response.data);

			toast({
				title: "Try again",
				description: error.response.data.message,
			});
		}

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
										{/* <FormField
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
                    /> */}

										<FormField
											control={loginForm.control}
											name="username"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
															<Input
																placeholder="Username"
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
											name="username"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
															<Input
																placeholder="username"
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
											name="phnum"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
															<Input
																placeholder="9999999999"
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

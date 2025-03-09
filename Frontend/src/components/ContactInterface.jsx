
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Phone, Search, UserCircle, Clock, Star, ArrowUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from 'axios';
import Cookies from 'js-cookie';

// Backend URL configuration
const BACKEND_URL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const ContactInterface = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("lastContacted");
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const authtoken = Cookies.get("authtoken");

        if (!authtoken) {
            toast({
                title: "Access Denied",
                description: "You need to log in to access chats."
            });
            navigate("/auth");
        } else {
            setIsAuthenticated(authtoken);
        }
    }, [navigate, toast]);

    // Generate some mock contacts
    useEffect(() => {
        const bgColors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100"];

        // Mock data
        const mockContacts = [
            {
                _id: 1,
                name: "Alex Johnson",
                phone: "+1 (555) 123-4567",
                email: "alex@example.com",
                username: "alex@example.com",
                lastContacted: "2023-07-12T10:30:00",
                favorite: true,
                avatarColor: bgColors[0]
            },
        ];

        const fetchMessages = async () => {
            if (!isAuthenticated) return;

            try {
                setIsLoading(true);
                const response = await axios.get(`${BACKEND_URL}/api/user/contacts`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": isAuthenticated
                    }
                });

                console.log("response.data.allContacts")
                console.log(response.data.allContacts)

                setContacts(response.data.allContacts.map((contact) => ({
                    _id: contact.receiver_id,
                    name: contact.name,
                    phone: contact.phnum,
                    email: contact.email,
                    username: contact.username,
                    lastContacted: contact.lastContacted,
                    favorite: contact.favorite,
                    avatarColor: contact.avatarColor,
                })));
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching messages:", error);
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to load messages",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        // // Simulate API call
        // setTimeout(() => {
        //   setContacts(mockContacts);
        //   setIsLoading(false);
        // }, 800);
    }, [isAuthenticated, toast]);

    // Function to filter contacts based on search term
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to sort contacts
    const sortedContacts = [...filteredContacts].sort((a, b) => {
        if (sortBy === "name") {
            return a.name.localeCompare(b.name);
        } else {
            return new Date(b.lastContacted).getTime() - new Date(a.lastContacted).getTime();
        }
    });

    // Function to format date
    const formatDate = (dateString) => {
        // console.log(dateString)
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    // Function to toggle favorite
    const toggleFavorite = async (contact) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/favorite`,
                {
                    "receiver_id": contact._id,
                    "favorite": !contact.favorite
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": isAuthenticated
                    }
                }
            );

            console.log(response.data)
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to star the contact",
                variant: "destructive"
            });
        } finally {
            setContacts(contacts.map(c =>
                c._id === contact._id ? { ...c, favorite: !c.favorite } : c
            ));

            contact = contacts.find(c => c._id === contact._id);
            if (contact) {
                toast({
                    title: `${contact.name} ${!contact.favorite ? 'added to' : 'removed from'} favorites`,
                    duration: 2000,
                });
            }
        }
    };

    return (
        <div className="container max-w-5xl px-4 py-8 mx-auto animate-fade-in">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="text-gradient">Contacts</span>
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage your recent contacts
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortBy(sortBy === "name" ? "lastContacted" : "name")}
                            className="space-x-1"
                        >
                            {sortBy === "name" ? "Name" : "Recent"}
                            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Contacts</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                        <TabsTrigger value="recent">Recent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="animate-slide-up">
                        <ContactList
                            contacts={sortedContacts}
                            onToggleFavorite={toggleFavorite}
                            isLoading={isLoading}
                            formatDate={formatDate}
                            user={user}
                        />
                    </TabsContent>

                    <TabsContent value="favorites" className="animate-slide-up">
                        <ContactList
                            contacts={sortedContacts.filter(c => c.favorite)}
                            onToggleFavorite={toggleFavorite}
                            isLoading={isLoading}
                            formatDate={formatDate}
                            user={user}
                        />
                    </TabsContent>

                    <TabsContent value="recent" className="animate-slide-up">
                        <ContactList
                            contacts={
                                sortedContacts
                                    .filter(c => c.lastContacted !== 0)
                                    .slice(0, 3)
                            }
                            onToggleFavorite={toggleFavorite}
                            isLoading={isLoading}
                            formatDate={formatDate}
                            user={user.filter}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

const ContactList = ({ contacts, onToggleFavorite, isLoading, formatDate, user }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="space-y-4 mt-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6 h-20"></CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="text-center py-12">
                <Phone className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No contacts found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-4">
            {contacts.map((contact) => (
                <Card
                    key={contact._id}
                    className="overflow-hidden glass-card hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("/chat", { state: { user: user, receiver: contact } })}
                >
                    <CardContent className="p-0">
                        <div className="flex items-center p-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium ${contact.avatarColor}`}>
                                {contact.name.charAt(0)}
                            </div>

                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">
                                        {contact.name}
                                        {contact.favorite && (
                                            <Badge className="ml-2 bg-messenger-blue">Favorite</Badge>
                                        )}
                                    </h3>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onToggleFavorite(contact)
                                        }}
                                        className="h-8 w-8 text-gray-400 hover:text-yellow-500"
                                    >
                                        <Star className={`h-4 w-4 ${contact.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                    </Button>
                                </div>

                                <div className="text-sm text-gray-500 mt-1">{contact.phone}</div>
                                <div className="text-sm text-gray-500">{contact.email}</div>
                                <div className="text-sm text-gray-500">{contact.username}</div>

                                <div className="flex items-center mt-2 text-xs text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {console.log(contact)}
                                    Last contacted: {formatDate(contact.lastContacted)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ContactInterface;
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, SmileIcon, Paperclip, Image, Mic } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';
import DateSeparator from './DateSeparator';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Cookies from 'js-cookie';

// Backend URL configuration
const BACKEND_URL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Function to merge chats from user and receiver
function mergeChats(userchat = [], receiverchat = []) {
  let chatMap = new Map();

  // Function to process chat arrays
  function processChats(chats, isOwn) {
    chats.forEach(({ date, message }) => {
      if (!chatMap.has(date)) {
        chatMap.set(date, []);
      }
      // Add isOwn property to messages and push
      chatMap.get(date).push(...message.map(msg => ({ ...msg, isOwn })));
    });
  }

  // Process user and receiver chat data
  processChats(userchat, true);
  processChats(receiverchat, false);

  // Convert map to sorted array of objects
  let mergedChat = Array.from(chatMap.entries()).map(([date, messages]) => ({
    date,
    message: messages.sort((a, b) => a.timeMsg - b.timeMsg)
  }));

  // Flatten all messages into a single sorted array
  let allMessages = mergedChat.flatMap(({ message }) => message)
    .sort((a, b) => a.timeMsg - b.timeMsg)
    .map(msg => ({
      id: msg._id || uuidv4(),
      content: msg.text,
      timestamp: new Date(msg.timeMsg) || new Date(),
      isOwn: msg.isOwn,
      status: 'read'
    }));

  return allMessages;
}

const ChatInterface = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Mock data - in a real app, this would come from a route or context
  const chatParticipants = {
    user: {
      _id: "67c70fd4079df57639ea617a",
      name: "Navaneeth",
      username: "navaneethjainsl5"
    },
    receiver: {
      _id: "67c9ae5457543933f4bcfc5e",
      name: "Navaneeth",
      username: "navaneethjainsl6"
    }
  };

  // Check authentication on mount
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

  // Fetch messages when authenticated
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/user/Messages`, {
          params: {
            user: chatParticipants.user,
            receiver: chatParticipants.receiver
          },
          headers: {
            "Content-Type": "application/json",
            "auth-token": isAuthenticated
          }
        });

        console.log(response.data)

        const { userData, receiverData } = response.data;

        // Process chat data
        const userchat = userData?.chat || [];
        const receiverchat = receiverData?.chat || [];

        // Merge and set messages
        const mergedMessages = mergeChats(userchat, receiverchat);
        setMessages(mergedMessages);
        console.log(mergedMessages)
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
  }, [isAuthenticated, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    // Create new message object
    const messageObj = {
      id: uuidv4(),
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
      status: 'sending'
    };

    // Add to UI immediately
    setMessages(prev => [...prev, messageObj]);
    setNewMessage('');

    try {
      // Here you would send the message to your backend
      const response = await axios.post(`${BACKEND_URL}/api/user/messages`,
        { ...chatParticipants, message:   newMessage },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": isAuthenticated
          }
        }
      );

      // Simulate message status changes for now
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m =>
            m.id === messageObj.id ? { ...m, status: 'sent' } : m
          )
        );

        setTimeout(() => {
          setMessages(prev =>
            prev.map(m =>
              m.id === messageObj.id ? { ...m, status: 'delivered' } : m
            )
          );

          setTimeout(() => {
            setMessages(prev =>
              prev.map(m =>
                m.id === messageObj.id ? { ...m, status: 'read' } : m
              )
            );
          }, 1000);
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);

      // Update UI to show error
      setMessages(prev =>
        prev.map(m =>
          m.id === messageObj.id ? { ...m, status: 'error' } : m
        )
      );

      toast({
        title: "Message Failed",
        description: "Couldn't send your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state
  if (isAuthenticated === null) {
    return null;
  }

  let currentDate = format(new Date(), 'yyyy-MM-dd');
  function checkDate(date) {
    const msgDate = format(date, 'yyyy-MM-dd');
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      return true;
    }
    return false;
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <span className="text-primary font-medium">AI</span>
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">Assistant</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <div key={message.id}>
                  {/* {console.log(message)} */}
                  {/* <DateSeparator date={message.timestamp} /> */}
                  {checkDate(message.timestamp) && <DateSeparator date={message.timestamp} />}
                  <MessageBubble key={message.id} message={message} />
                </div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <motion.div
        className="border-t border-border p-4 bg-card"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="pr-12 py-6"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
                <SmileIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <Button
            size="icon"
            className="rounded-full h-11 w-11 flex-shrink-0"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === '' || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center mt-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
              <Image className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
              <Mic className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;

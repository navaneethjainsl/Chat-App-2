
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, SmileIcon, PaperclipIcon, ImageIcon, MicIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';
import Cookies from "js-cookie";

const BACKENDURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

// const initialMessages = [
//   {
//     id: '1',
//     content: 'Hi there! How can I help you today?',
//     timestamp: new Date(Date.now() - 1000 * 60 * 5),
//     isOwn: false,
//     status: 'read',
//   },
//   {
//     id: '2',
//     content: 'I have a question about the new feature.',
//     timestamp: new Date(Date.now() - 1000 * 60 * 4),
//     isOwn: true,
//     status: 'read',
//   },
//   {
//     id: '3',
//     content: 'Of course, I\'d be happy to help. What would you like to know?',
//     timestamp: new Date(Date.now() - 1000 * 60 * 3),
//     isOwn: false,
//     status: 'read',
//   },
// ];
const Messages = [];


function mergeChats(userchat, receiverchat) {
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
      message: messages.sort((a, b) => a.timeMsg - b.timeMsg)  // Sort messages by time
  }));

  // Flatten all messages into a single sorted array
  let allMessages = mergedChat.flatMap(({ message }) => message).sort((a, b) => a.timeMsg - b.timeMsg);

  // return { mergedChat, allMessages };
  return allMessages;
}

const ChatInterface = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  // const [authtoken, setAuthtoken] = useState("null");
  const [messages, setMessages] = useState(Messages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const { user, receiver } = {
    "user": {
      "_id": "67c70fd4079df57639ea617a",
      "name": "Navaneeth",
      "username": "navaneethjainsl5",
      "__v": 0
    },
    "receiver": {
      "_id": "67c9ae5457543933f4bcfc5e",
      "name": "Navaneeth",
      "username": "navaneethjainsl6",
      "__v": 0
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const authtoken = Cookies.get("authtoken");

    if (!authtoken) {
      toast({
        title: "Access Denied",
        description: "You need to log in to access chats.",
      });
      navigate("/auth"); // Redirect to auth page if not logged in
    } else {
      setIsAuthenticated(authtoken);
    }
  }, [navigate]);


  // Prevent rendering before auth check
  if (isAuthenticated === null) {
    return null;
  }

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/user/Messages`,
          {
            params: { user, receiver },
            headers: {
              "Content-Type": "application/json", // Specify JSON content
              "auth-token": isAuthenticated,
            }
          }
        );
        const { userData: { chat: userchat }, receiverData: { chat: receiverchat } } = response.data;
        
        // Merge and set messages
        const mergedMessages = mergeChats(userchat, receiverchat);
        setMessages(mergedMessages);
      } 
      catch (error) {
        console.log("error");
        console.log(error);
        console.log("error 2.O");
        console.log(error.response.data);
  
        // toast({
        //   title: "Try again",
        //   description: error.response.data.message,
        // });
  
        // setTimeout(() => {
        //   navigate('/chat');
        // }, 1500);
      }
    };

    fetchMessages();
  }, [isAuthenticated]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: uuidv4(),
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
      status: 'sending',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status changes
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === message.id
            ? { ...m, status: 'sent' }
            : m
        )
      );

      setTimeout(() => {
        setMessages(prev =>
          prev.map(m =>
            m.id === message.id
              ? { ...m, status: 'delivered' }
              : m
          )
        );

        setTimeout(() => {
          setMessages(prev =>
            prev.map(m =>
              m.id === message.id
                ? { ...m, status: 'read' }
                : m
            )
          );

          // // Simulate response
          // const responseMessage = {
          //   id: uuidv4(),
          //   content: 'I see you\'re interested in our features. Let me help you with that!',
          //   timestamp: new Date(),
          //   isOwn: false,
          //   status: 'read',
          // };

          // setMessages(prev => [...prev, responseMessage]);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.timeMsg} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
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
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
                <SmileIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
                <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <Button
            size="icon"
            className="rounded-full h-11 w-11 flex-shrink-0"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center mt-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
              <MicIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;



// import { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from '@/components/ui/use-toast';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Send, SmileIcon, PaperclipIcon, ImageIcon, MicIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import MessageBubble from './MessageBubble';
// import { v4 as uuidv4 } from 'uuid';

// import axios from 'axios';
// import Cookies from "js-cookie";

// // const initialMessages = [
// //   {
// //     id: '1',
// //     content: 'Hi there! How can I help you today?',
// //     timestamp: new Date(Date.now() - 1000 * 60 * 5),
// //     isOwn: false,
// //     status: 'read',
// //   },
// //   {
// //     id: '2',
// //     content: 'I have a question about the new feature.',
// //     timestamp: new Date(Date.now() - 1000 * 60 * 4),
// //     isOwn: true,
// //     status: 'read',
// //   },
// //   {
// //     id: '3',
// //     content: 'Of course, I\'d be happy to help. What would you like to know?',
// //     timestamp: new Date(Date.now() - 1000 * 60 * 3),
// //     isOwn: false,
// //     status: 'read',
// //   },
// // ];
// const Messages = [];

// const ChatInterface = () => {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   // const [authtoken, setAuthtoken] = useState("null");
//   const [messages, setMessages] = useState([Messages]);
//   const [newMessage, setNewMessage] = useState('');
//   const messagesEndRef = useRef(null);

//   // const { user, receiver } = {
//   //   "user": {
//   //     "_id": "67c70fd4079df57639ea617a",
//   //     "name": "Navaneeth",
//   //     "username": "navaneethjainsl5",
//   //     "__v": 0
//   //   },
//   //   "receiver": {
//   //     "_id": "67c9ae5457543933f4bcfc5e",
//   //     "name": "Navaneeth",
//   //     "username": "navaneethjainsl6",
//   //     "__v": 0
//   //   }
//   // }

//   // Check authentication on mount
//   useEffect(() => {
//     const authtoken = Cookies.get("authtoken");

//     if (!authtoken) {
//       toast({
//         title: "Access Denied",
//         description: "You need to log in to access chats.",
//       });
//       navigate("/auth"); // Redirect to auth page if not logged in
//     } else {
//       setIsAuthenticated(authtoken);
//     }
//   }, [navigate]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Prevent rendering before auth check
//   if (isAuthenticated === null) {
//     return null;
//   }

//   // try {
//     // const response = await axios.get(`http://localhost:5000/api/user/Messages`,
//     //   { user, receiver },
//     //   {
//     //     headers: {
//     //       "Content-Type": "application/json", // Specify JSON content
//     //       "auth-token": isAuthenticated,
//     //     }
//     //   }
//     // );
//     // console.log("response");
//     // console.log(response);


//   // }
//   // catch (error) {
//   //   console.log("error");
//   //   console.log(error);
//   //   console.log("error 2.O");
//   //   console.log(error.response.data);

//   //   // toast({
//   //   //   title: "Try again",
//   //   //   description: error.response.data.message,
//   //   // });

//   //   // setTimeout(() => {
//   //   //   navigate('/chat');
//   //   // }, 1500);
//   // }

//   const handleSendMessage = () => {
//     if (newMessage.trim() === '') return;

//     const message = {
//       id: uuidv4(),
//       content: newMessage,
//       timestamp: new Date(),
//       isOwn: true,
//       status: 'sending',
//     };

//     setMessages(prev => [...prev, message]);
//     setNewMessage('');

//     // Simulate message status changes
//     setTimeout(() => {
//       setMessages(prev =>
//         prev.map(m =>
//           m.id === message.id
//             ? { ...m, status: 'sent' }
//             : m
//         )
//       );

//       setTimeout(() => {
//         setMessages(prev =>
//           prev.map(m =>
//             m.id === message.id
//               ? { ...m, status: 'delivered' }
//               : m
//           )
//         );

//         setTimeout(() => {
//           setMessages(prev =>
//             prev.map(m =>
//               m.id === message.id
//                 ? { ...m, status: 'read' }
//                 : m
//             )
//           );

//           // // Simulate response
//           // const responseMessage = {
//           //   id: uuidv4(),
//           //   content: 'I see you\'re interested in our features. Let me help you with that!',
//           //   timestamp: new Date(),
//           //   isOwn: false,
//           //   status: 'read',
//           // };

//           // setMessages(prev => [...prev, responseMessage]);
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
//       <div className="flex items-center justify-between p-4 border-b border-border bg-card">
//         <div className="flex items-center">
//           <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
//             <span className="text-primary font-medium">AI</span>
//           </div>
//           <div>
//             <h3 className="font-medium text-card-foreground">Assistant</h3>
//             <p className="text-xs text-muted-foreground">Online</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         <AnimatePresence initial={false}>
//           {messages.map((message) => (
//             <MessageBubble key={message.id} message={message} />
//           ))}
//         </AnimatePresence>
//         <div ref={messagesEndRef} />
//       </div>

//       <motion.div
//         className="border-t border-border p-4 bg-card"
//         initial={{ y: 100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <div className="flex items-center gap-2">
//           <div className="flex-1 relative">
//             <Input
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Type a message..."
//               className="pr-12 py-6"
//             />
//             <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
//               <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
//                 <SmileIcon className="h-5 w-5 text-muted-foreground" />
//               </Button>
//               <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
//                 <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
//               </Button>
//             </div>
//           </div>

//           <Button
//             size="icon"
//             className="rounded-full h-11 w-11 flex-shrink-0"
//             onClick={handleSendMessage}
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>

//         <div className="flex justify-center mt-3">
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
//               <ImageIcon className="h-4 w-4 text-muted-foreground" />
//             </Button>
//             <Button variant="ghost" size="icon" type="button" className="h-8 w-8 rounded-full">
//               <MicIcon className="h-4 w-4 text-muted-foreground" />
//             </Button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ChatInterface;

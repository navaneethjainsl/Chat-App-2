import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

const MessageBubble = ({ message }) => {
  const { content, timestamp, isOwn, status } = message;
  
  return (
    <motion.div
      className={cn(
        "flex",
        isOwn ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
          isOwn 
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-accent text-accent-foreground rounded-tl-none"
        )}
      >
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{content}</p>
        <div className={cn(
          "flex items-center justify-end text-xs gap-1 mt-1",
          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          <span>{format(timestamp, 'h:mm a')}</span>
          
          {isOwn && (
            <span className="ml-1">
              {status === 'sending' && (
                <span className="inline-block h-3 w-3">
                  <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-primary-foreground/70" />
                </span>
              )}
              
              {status === 'sent' && (
                <Check className="h-3 w-3" />
              )}
              
              {status === 'delivered' && (
                <CheckCheck className="h-3 w-3" />
              )}
              
              {status === 'read' && (
                <CheckCheck className="h-3 w-3 text-blue-400" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;

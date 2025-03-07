
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const DateSeparator = ({ date }) => {
  return (
    <motion.div 
      className="flex justify-center my-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-muted/30 text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
        {format(new Date(date), 'MMMM d, yyyy')}
      </div>
    </motion.div>
  );
};

export default DateSeparator;
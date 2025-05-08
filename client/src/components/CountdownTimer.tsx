import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CountdownTimer() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number }>({ hours: 0, minutes: 0 });
  const [timerClass, setTimerClass] = useState<string>("");
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadlineHour = 16;
      const deadlineTime = new Date(now);
      deadlineTime.setHours(deadlineHour, 0, 0, 0);
      
      // Calculate remaining time
      let remainingTime = deadlineTime.getTime() - now.getTime();
      
      // If deadline has passed for today, set for tomorrow
      if (remainingTime < 0) {
        deadlineTime.setDate(deadlineTime.getDate() + 1);
        remainingTime = deadlineTime.getTime() - now.getTime();
      }
      
      // Calculate hours and minutes
      const hoursLeft = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutesLeft = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ hours: hoursLeft, minutes: minutesLeft });
      
      // Update color based on time left
      if (hoursLeft < 1 && minutesLeft <= 30) {
        setTimerClass("bg-red-100 text-red-800");
      } else if (hoursLeft < 2) {
        setTimerClass("bg-yellow-100 text-yellow-800");
      } else {
        setTimerClass("bg-green-100 text-green-800");
      }
    };
    
    // Initial calculation
    calculateTimeLeft();
    
    // Set up interval to update countdown
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`text-sm font-medium px-3 py-1 rounded-full ${timerClass}`}>
      {t('header.countdown')} ({timeLeft.hours}h {timeLeft.minutes}m)
    </div>
  );
}

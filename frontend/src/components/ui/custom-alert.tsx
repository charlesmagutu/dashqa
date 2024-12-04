import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CustomAlertProps {
  type: "success" | "error";
  message: string;
  isVisible: boolean;
  duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ type, message, isVisible, duration = 4500 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      setProgress(100); 
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 100 / (duration / 100)));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isVisible, duration]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Alert variant={type === "error" ? "destructive" : "default"}>
        <AlertCircle className="h-4 w-4" />
        <div>
          <AlertTitle>{type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </Alert>
      {/* Progress Bar */}
      <div className="relative mt-2 h-1 w-full bg-gray-200">
        <div
          className={`absolute top-0 left-0 h-full ${
            type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
          style={{
            width: `${progress}%`,
            transition: "width 100ms linear",
          }}
        />
      </div>
    </div>
  );
};

export default CustomAlert;

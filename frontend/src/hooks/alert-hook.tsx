import { useState } from "react";

const useAlert = () => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setAlert({ type: "", message: "" }), 500);
    }, 4500);
  };

  return { alert, isVisible, showAlert };
};

export default useAlert;

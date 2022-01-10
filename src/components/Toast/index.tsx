import { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import styles from "./styles.module.scss";

type ToastProps = {
  type: string;
  message: string;
  icon?: JSX.Element;
  position: string;
  timeout: number;
  onClose: () => void;
}

const Toast = ( { type, message, icon, position, timeout, onClose } : ToastProps) => {
  const [toastSituation, setToastSituation] = useState<string>("opening");
  
  useEffect(() => {
    setTimeout(() => {
      setToastSituation("closing");
    }, timeout - 500);

    setTimeout(() => {
      onClose();
    }, timeout);

    return () => {
      clearTimeout(timeout);
      setToastSituation("");
      onClose();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${styles.toastContainer} ${styles[type]} ${styles[`toast-${toastSituation}`]} ${styles[`toast-${position}`]}`}>
      <VscClose onClick={onClose} />
      <div className={styles.toastContent}>
        {icon}
        <p>{message}</p>
      </div>
    </div>
  );
}

export { Toast };
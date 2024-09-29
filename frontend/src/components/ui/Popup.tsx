import React, { useRef, useEffect, ReactNode } from "react";
import styles from "./Popup.module.css";
import IconButton from "../IconButton";
import { LuX as CloseIcon } from "react-icons/lu";

interface PopupProps {
  content: ReactNode;
  position: { x: number; y: number };
  header?: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({
  content,
  position,
  header,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className={styles.popup}
      style={{
        top: position.y + window.scrollY,
        left: position.x + window.scrollX,
      }}
    >
      <div className={styles["popup-header"]}>
        {header && <h5>{header}</h5>}
        <div className={styles["close-container"]}>
          <IconButton
            icon={<CloseIcon color="var(--text-color)" />}
            color="clear"
            onClick={onClose}
          />
        </div>
      </div>
      <div className={styles["popup-content"]}>{content}</div>
    </div>
  );
};

export default Popup;

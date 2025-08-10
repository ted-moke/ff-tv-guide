import React, { useState } from "react";
import styles from "./Collapsible.module.css";
import { LuChevronDown } from "react-icons/lu";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  onClear?: () => void;
  showClear?: boolean;
  clearLabel?: string;
  className?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultCollapsed = true,
  onClear,
  showClear = false,
  clearLabel = "Clear",
  className = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
  };

  return (
    <div className={`${styles.collapsible} ${className}`}>
      <div
        className={styles.header}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <p className={styles.title}>{title}</p>
        <div className={styles.actions}>
          {showClear && onClear && (
            <button
              className={styles.clearButton}
              onClick={handleClear}
            >
              {clearLabel}
            </button>
          )}
          <LuChevronDown
            className={`${styles.collapseIcon} ${isCollapsed ? styles.collapsed : ''}`}
            color="var(--text-color)"
          />
        </div>
      </div>
      {!isCollapsed && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;

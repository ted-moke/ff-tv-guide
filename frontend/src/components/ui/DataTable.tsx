import React, { useState } from "react";
import styles from "./DataTable.module.css";
import { LuChevronDown } from "react-icons/lu";
import Button from "./Button";

interface DataTableProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  columns: Array<{
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    format?: (value: string | number) => string | number;
  }>;
  className?: string;
  striped?: boolean;
  compact?: boolean;
  collapsible?: {
    topRows?: number;
    bottomRows?: number;
    defaultCollapsed?: boolean;
  };
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  className = "",
  striped = true,
  compact = false,
  collapsible,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsible?.defaultCollapsed ?? true);
  
  const topRows = collapsible?.topRows ?? 3;
  const bottomRows = collapsible?.bottomRows ?? 3;
  
  const shouldShowCollapsible = collapsible && data.length > topRows + bottomRows;
  
  const getVisibleRows = () => {
    if (!shouldShowCollapsible || !isCollapsed) {
      return data;
    }
    
    const top = data.slice(0, topRows);
    const bottom = data.slice(-bottomRows);
    return [...top, ...bottom];
  };
  
  const getHiddenCount = () => {
    if (!shouldShowCollapsible || !isCollapsed) {
      return 0;
    }
    return data.length - topRows - bottomRows;
  };
  
  const visibleRows = getVisibleRows();
  const hiddenCount = getHiddenCount();
  
  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={`${styles.table} ${compact ? styles.compact : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={styles.header}
                style={{
                  textAlign: column.align || 'left',
                  width: column.width,
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, index) => {
            const originalIndex = data.indexOf(row);
            const isFromTop = originalIndex < topRows;
            
            return (
              <React.Fragment key={originalIndex}>
                <tr
                  className={`${styles.row} ${striped && originalIndex % 2 === 1 ? styles.striped : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={styles.cell}
                      style={{
                        textAlign: column.align || 'left',
                      }}
                    >
                      {column.format ? column.format(row[column.key]) : row[column.key]}
                    </td>
                  ))}
                </tr>
                
                                 {/* Add separator between top and bottom rows when collapsed */}
                 {shouldShowCollapsible && isCollapsed && isFromTop && index === topRows - 1 && (
                   <tr className={styles.separatorRow}>
                     <td 
                       colSpan={columns.length}
                       className={styles.separatorCell}
                     >
                       <Button
                         color="clear"
                         onClick={() => setIsCollapsed(false)}
                         className={styles.separatorButton}
                       >
                         <div className={styles.separatorContent}>
                           <span className={styles.separatorText}>... {hiddenCount} teams hidden ...</span>
                         </div>
                       </Button>
                     </td>
                   </tr>
                 )}
              </React.Fragment>
            );
          })}
          
          {shouldShowCollapsible && !isCollapsed && (
            <tr className={styles.collapseRow}>
              <td 
                colSpan={columns.length}
                className={styles.collapseCell}
              >
                <button
                  className={styles.collapseButton}
                  onClick={() => setIsCollapsed(true)}
                >
                  <LuChevronDown className={`${styles.collapseIcon} ${styles.collapsed}`} />
                  Show less
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

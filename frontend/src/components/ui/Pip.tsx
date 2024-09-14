import React from 'react';
import styles from './Pip.module.css';

enum PipType {
    Self = 'self',
    Opponent = 'opponent'
}

enum PipStyle {
    Full = 'full',
    Stroked = 'stroked',
    Dash = 'dash'
}

interface PipProps {
    type: 'self' | 'opponent'; // Accept string literals directly
    style: 'full' | 'stroked' | 'dash'; // Accept string literals directly
}

const Pip: React.FC<PipProps> = ({ type, style }) => {
    const getClassName = () => {
        switch (style) {
            case PipStyle.Full:
                return styles.full;
            case PipStyle.Stroked:
                return styles.stroked;
            case PipStyle.Dash:
                return styles.dash;
            default:
                return '';
        }
    };

    return (
        <div className={`${styles.pip} ${getClassName()} ${type === PipType.Self ? styles.self : styles.opponent}`}></div>
    );
};

export default Pip;
export { PipType, PipStyle };

import React from "react";
import Button, { ButtonColor } from "../components/ui/Button";
import styles from "./ButtonShow.module.css";

const ButtonShow: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Button Styles</h1>
      <div className={styles.buttonGroup}>
        <Button color={ButtonColor.PRIMARY}>Primary Button</Button>
        <Button color={ButtonColor.SECONDARY}>Secondary Button</Button>
        <Button color={ButtonColor.CLEAR}>Clear Button</Button>
        <Button color={ButtonColor.DANGER}>Danger Button</Button>
      </div>
      <div className={styles.buttonGroup}>
        <Button color={ButtonColor.PRIMARY} disabled>
          Disabled Primary
        </Button>
        <Button color={ButtonColor.SECONDARY} disabled>
          Disabled Secondary
        </Button>
        <Button color={ButtonColor.CLEAR} disabled>
          Disabled Clear
        </Button>
        <Button color={ButtonColor.DANGER} disabled>
          Disabled Danger
        </Button>
      </div>
    </div>
  );
};

export default ButtonShow;
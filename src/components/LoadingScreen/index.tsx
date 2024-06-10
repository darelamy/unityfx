import React from "react";
import styles from "./LoadingScreen.module.scss";
import { SyncLoader } from "react-spinners";

const LoadingScreen = ({ isLoading }: { isLoading?: boolean }) => {
  const [fadeOut, setFadeOut] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
        setVisible(false);
      }, 700);
    } else {
      setVisible(true);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.loadingContainer} ${fadeOut ? styles.fadeOut : ""}`}
    >
      <div className="flex flex-col items-center gap-2">
        <SyncLoader color="#fff" />
        <span className={styles.loadingText}>Загрузка</span>
      </div>
    </div>
  );
};

export default LoadingScreen;

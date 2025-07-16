import styles from "./mainContainer.module.css";

const MainContainer = ({ children }) => {
  return <main className={styles.container}>{children}</main>;
};

export default MainContainer;

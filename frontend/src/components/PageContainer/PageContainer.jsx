import Header from "../Header/Header";
import MainContainer from "../MainContainer/mainContainer";
import styles from "./PageContainer.module.css";

const PageContainer = ({ children, homeUrl }) => {
  return (
    <div className={styles.pageContainer}>
      <Header homeUrl={homeUrl} />
      <MainContainer>{children}</MainContainer>
    </div>
  );
};

export default PageContainer;

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import MainContainer from "../MainContainer/mainContainer";
import "./PageContainer.css";

const PageContainer = ({ children }, { usuario }) => {
  return (
    <div className="PageContainer">
      <Header usuario={usuario} />
      <MainContainer>
        {children}
      </MainContainer>
      <Footer />
    </div>
  );
};

export default PageContainer;

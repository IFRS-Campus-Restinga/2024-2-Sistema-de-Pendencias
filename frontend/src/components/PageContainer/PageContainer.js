import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import MainContainer from "../MainContainer/mainContainer";
import "./PageContainer.css";

const PageContainer = ({ children, homeUrl }) => {  
  return (
    <div className="PageContainer">
      <Header homeUrl={homeUrl}/>
        <MainContainer>
          {children}
        </MainContainer>
      <Footer />
    </div>
  );
};

export default PageContainer;

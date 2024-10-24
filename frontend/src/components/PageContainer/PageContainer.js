import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./PageContainer.css";

const PageContainer = ({ children }, { homeUrl }) => {  
  return (
    <div className="PageContainer">
      <Header homeUrl={homeUrl} />
      {children}
      <Footer />
    </div>
  );
};

export default PageContainer;

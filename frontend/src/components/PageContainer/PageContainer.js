import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./PageContainer.css";

const PageContainer = ({ children }, { usuario }) => {
  return (
    <div className="PageContainer">
      <Header usuario={usuario} />
      {children}
      <Footer />
    </div>
  );
};

export default PageContainer;

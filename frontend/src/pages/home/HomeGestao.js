import { Outlet } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";
import NavBar from "../../components/NavBar/NavBar";

const HomeGestao = ({ usuario }) => {

  return (
    <PageContainer usuario={usuario}>
      <NavBar/>
      <Outlet />
    </PageContainer>
  );
};

export default HomeGestao;

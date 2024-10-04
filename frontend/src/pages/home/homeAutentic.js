import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./homeAutentic.css";

const HomeAutentic = () => {
  return (
    <PageContainer>
      <Header
        usuario={{
          nome: "Cássio Renan",
        }}
      />
      <div className="content">
        <p>PARABÉNS, VOCÊ FOI AUTENTICADO!</p>
      </div>
      {/* Conteúdo da Home depois de autenticado */}
      <Footer />
    </PageContainer>
  );
};

export default HomeAutentic;

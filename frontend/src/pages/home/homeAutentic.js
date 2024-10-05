import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import PageContainer from "../../components/PageContainer/PageContainer";
import testeService from "../../services/testeService";
import "./homeAutentic.css";

const HomeAutentic = () => {
  const envioHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const mensagem = formData.get("teste").toString();

    const params = { mensagem };

    const res = await testeService.create(params);

    if (res.status === 200)
      alert(`A mensagem enviada ao servidor foi: "${res.data.mensagem}"`);

    alert("Algo deu errado!");
  };

  return (
    <PageContainer>
      <Header
        usuario={{
          nome: "Cássio Renan",
        }}
      />
      <div className="content">
        <h3>FORM TESTE</h3>
        <form onSubmit={envioHandler}>
          <input
            type="text"
            name="teste"
            onChange={(e) => {
              e.value = e.target.value;
            }}
          />
          <button type="submit">ENVIAR</button>
        </form>
      </div>
      {/* Conteúdo da Home depois de autenticado */}
      <Footer />
    </PageContainer>
  );
};

export default HomeAutentic;

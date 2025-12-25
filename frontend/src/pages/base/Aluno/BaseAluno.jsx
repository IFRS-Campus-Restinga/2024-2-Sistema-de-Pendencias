import { Outlet, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { UserContext } from "../../../store/UserContext";
import CustomLoading from "../../../components/customLoading/CustomLoading";

const BaseAluno = () => {
  const { user, loading } = useContext(UserContext);
  const redirect = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      redirect("/session");
      return;
    }

    if (user.group !== "aluno") {
      redirect(`/session/${user.group}/home/`);
    }
  }, [user, loading, redirect]);

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <PageContainer homeUrl="/session/aluno/home/">
      <ToastContainer position="botto-right" autoClose={2000}/>
      <Outlet />
    </PageContainer>
  );
};


export default BaseAluno;

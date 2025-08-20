import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer autoClose={2000} position="bottom-center" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;

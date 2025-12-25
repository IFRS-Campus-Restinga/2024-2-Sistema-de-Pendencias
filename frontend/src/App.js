import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { UserProvider } from "./store/UserContext";

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />;
    </UserProvider>
  )
};

export default App;

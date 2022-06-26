import "semantic-ui-css/semantic.min.css";
import "./App.css";

import NavBar from "./components/NavBar";
import { Container } from "semantic-ui-react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth-slice";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import CreateTodo from "./pages/CreateTodo";

interface IExactProp {
  exact: boolean;
}
const exactProp: IExactProp = { exact: true };
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { id, email, verified } = jwtDecode(token) as {
        id: string;
        email: string;
        verified: boolean;
      };
      dispatch(authActions.signin({ id, email, verified }));
    }
  }, [dispatch]);
  return (
    <Container className="App">
      <NavBar />
      <Container className="content-container">
        <Routes>
          <Route {...exactProp} path="/" element={<Home />} />
          <Route {...exactProp} path="/signin" element={<Signin />} />
          <Route {...exactProp} path="/register" element={<Register />} />
          <Route {...exactProp} path="/verify" element={<Verify />} />
          <Route {...exactProp} path="/forgot-password" element={<Forgot />} />
          <Route {...exactProp} path="/create-todo" element={<CreateTodo />} />
          <Route
            {...exactProp}
            path="/reset-password/:id/:token"
            element={<Reset />}
          />
        </Routes>
      </Container>
    </Container>
  );
}

export default App;

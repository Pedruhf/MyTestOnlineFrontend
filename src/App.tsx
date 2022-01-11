import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { AuthContext } from "./contexts/AuthContext";
import { AuthRoute } from "./routes/AuthRoute";
import { Auth } from "./screens/Auth";
import { Home } from "./screens/Home";
import { UserArea } from "./screens/UserArea";
import { ConfirmedEmail } from "./screens/ConfirmedEmail";
import { ResetedPassword } from "./screens/ResetedPassword";
import { CreateAssessment } from "./screens/CreateAssessment";
import { Assessment } from "./screens/Assessment";
import { EnterRoom } from "./screens/EnterRoom";
import { CreateRoom } from "./screens/CreateRoom";
import { ErrorPage } from "./screens/Error";
import { CreatedRoom } from "./screens/CreateRoom/CreatedRoom";
import { EnteredRoom } from "./screens/EnterRoom/EnteredRoom";
import { ProfessorRoute } from "./routes/ProfessorRoute";
import { Answers } from "./screens/Answers";


function App() {
  const navigate = useNavigate();
  const { setUser, setUserToken } = useContext(AuthContext);

  useEffect(() => {
    const token = process.env.REACT_APP_STORAGE_TOKEN;

    const storage = localStorage.getItem(`${token}`);
    if (storage) {
      const { user, token, tokenExpires } = JSON.parse(storage);
      const now = (Number(new Date())) / 1000;

      if (now > tokenExpires) {
        return localStorage.removeItem(`${token}`);
      }
      
      setUser(user);
      setUserToken(token);
      return navigate("#");
    }

    else {
      const storage = sessionStorage.getItem(`${token}`);
      if (storage) {
        const { user, token } = JSON.parse(storage);
        setUser(user);
        setUserToken(token);
        return navigate("#");
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={
          <AuthRoute>
            <Home />
          </AuthRoute>
        } />
        <Route path="/perfil" element={
          <AuthRoute>
            <UserArea />
          </AuthRoute>
        } />
        <Route path="/avaliacoes" element={
          <ProfessorRoute>
            <CreateAssessment />
          </ProfessorRoute>
        } />
        <Route path="/avaliacoes/:id" element={
          <ProfessorRoute>
            <Assessment />
          </ProfessorRoute>
        } />
        <Route path="/avalicoes/respostas/:id" element={
          <ProfessorRoute>
            <Answers />
          </ProfessorRoute>
        } />
        <Route path="/salas/criar" element={
          <ProfessorRoute>
            <CreateRoom />
          </ProfessorRoute>
        } />
        <Route path="/salas/criar/:id" element={
          <ProfessorRoute>
            <CreatedRoom />
          </ProfessorRoute>
        } />
        <Route path="/salas/entrar" element={
          <AuthRoute>
            <EnterRoom />
          </AuthRoute>
        } />
        <Route path="/salas/entrar/:id" element={
          <AuthRoute>
            <EnteredRoom />
          </AuthRoute>
        } />
        
        <Route path="/auth" element={<Auth />} />
        <Route path="/confirmed-email" element={<ConfirmedEmail />} />
        <Route path="/reseted-password" element={<ResetedPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;

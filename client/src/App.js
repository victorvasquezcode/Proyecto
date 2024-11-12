import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Problems from "./components/Problems";
import Discussion from "./components/Discussion";
import ExerciseDetail from "./components/ExerciseDetail";
import ExerciseList from "./components/ExerciseList"; // Asegúrate de importar ExerciseList
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirección inicial */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/problems" : "/login"} />}
        />

        {/* Rutas públicas */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/problems"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Layout>
                <Problems />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/discussion"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Layout>
                <Discussion />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/exercises/:topicId"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Layout>
                <ExerciseList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/exercise/:exerciseId"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Layout>
                <ExerciseDetail />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

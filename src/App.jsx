import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import HomePage from "./components/Home/HomePage";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import Dashboard from "./components/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile/UserProfile";
import Team from "./components/Team/Team";
import EquipmentList from "./components/Equipment/EquipmentList";
import EquipmentForm from "./components/Equipment/EquipmentForm";
import EquipmentDetails from "./components/Equipment/EquipmentDetails";
import ComingSoon from "./components/ComingSoon/ComingSoon";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  FaWrench,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <LoginPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Navbar />
                  <SignupPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/terms"
              element={
                <>
                  <Navbar />
                  <TermsAndConditions />
                  <Footer />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <ProtectedRoute>
                  <EquipmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/new"
              element={
                <ProtectedRoute>
                  <EquipmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/:id"
              element={
                <ProtectedRoute>
                  <EquipmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/:id/edit"
              element={
                <ProtectedRoute>
                  <EquipmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <ComingSoon
                    title="Manutenção"
                    description="O módulo de manutenção está em desenvolvimento e estará disponível em breve."
                    icon={FaWrench}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ComingSoon
                    title="Relatórios"
                    description="A seção de relatórios está em desenvolvimento e estará disponível em breve."
                    icon={FaChartBar}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <ComingSoon
                    title="Inventário"
                    description="O módulo de inventário está em desenvolvimento e estará disponível em breve."
                    icon={FaClipboardList}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ComingSoon
                    title="Configurações"
                    description="A página de configurações está em desenvolvimento e estará disponível em breve."
                    icon={FaCog}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <ComingSoon
                    title="Ajuda"
                    description="A seção de ajuda está em desenvolvimento e estará disponível em breve."
                    icon={FaQuestionCircle}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;


import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ConfirmEmail from './pages/EmailConfirmed';
import ConfirmationRejected from './pages/ConfirmationRejected';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/email-confirmed" element={<ConfirmEmail />} />
      <Route path="/confirmation-rejected" element={<ConfirmationRejected />} />
    </Routes>
  );
}

export default App;

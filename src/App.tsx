import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Layout from './Layout';
import SignupPage from './pages/signup/SignupPage';
import OAuthGoogleCallbackPage from './pages/signup/OAuthGoogleCallbackPage';
import OAuthSignupPage from './pages/signup/OAuthSignupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" />
          {/* auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth/callback/google" element={<OAuthGoogleCallbackPage />} />
          <Route path="/oauth/signup" element={<OAuthSignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

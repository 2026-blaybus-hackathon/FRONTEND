import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Layout from './Layout';
import SignupPage from './pages/signup/SignupPage';
import OAuthCallbackPage from './pages/signup/OAuthCallbackPage';
import OAuthSignupPage from './pages/signup/OAuthSignupPage';
import MainPage from './pages/MainPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            /* routes는 임의로 했습니다 변경하셔도 됩니다. */
            <Route path="/planner" element={<PlaceholderPage name="플래너" />} />
            <Route path="/report" element={<PlaceholderPage name="리포트" />} />
            <Route path="/my" element={<PlaceholderPage name="마이" />} />
            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
            <Route path="/oauth2/signup" element={<OAuthSignupPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import Layout from './Layout';
import MainPage from './pages/MainPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            {/* auth */}
            <Route path="/login" element={<LoginPage />}>
              <Route path="mentee" element={<></>} />
              <Route path="mentor" element={<></>} />
            </Route>

            {/* mentee */}
            <Route path="/mentee" element={<></>}>
              <Route path="planner" element={<></>}/>
              <Route path="me" element={<></>} />
              <Route path="feedback/:taskId" element={<></>} />
            </Route>

            {/* mentor */}
            <Route path="/mentor" element={<></>}>
              <Route path="mentee">
                <Route index element={<></>} />
                <Route path=":menteeId" element={<></>} />
              </Route>
              <Route path="feedback">
                <Route index element={<></>} />
                <Route path=":menteeId" element={<></>} />
                <Route path=":menteeId/:taskId" element={<></>} />
              </Route>
              <Route path="task">
                <Route index element={<></>} />
                <Route path=":menteeId" element={<></>} />
                <Route path=":menteeId/new" element={<></>} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

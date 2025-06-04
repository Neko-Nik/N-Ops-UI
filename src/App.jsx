import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/login';
import HomePage from './pages/home';
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from './pages/dashboard';
import PlayBooks from './pages/commandcenter';
import ExecSQL from './pages/runsql';
import SecureNotes from './pages/securenotes';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* No Protection */}
                <Route path="/" element={<HomePage />}/>
                <Route path="/login" element={<LoginPage />}/>

                {/* Protected pages */}
                <Route element={<ProtectedRoutes/>}>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/command-center" element={<PlayBooks />}/>
                    <Route path="/exec-sql" element={<ExecSQL />}/>
                    <Route path="/secure-notes" element={<SecureNotes />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App

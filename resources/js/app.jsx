
import React, {
    useState,
    useEffect,
} from "react";

import ReactDOM from "react-dom/client";


import { LanguageProvider } from "./LanguageContext";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Certifications from "./pages/Certifications";
import Messages from "./pages/Messages";

import "../css/app.css";
import "../css/Dashboard.css";
import "../css/project.css";


function App() {
    return (
        <LanguageProvider>

            <BrowserRouter>

                <Routes>

                    {/* =========================
                        PUBLIC
                    ========================== */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    {/* =========================
                        ADMIN
                    ========================== */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/admin/services"
                        element={<Services />}
                    />

                    <Route
                        path="/skills"
                        element={<Skills />}
                    />

                    <Route
                        path="/experience"
                        element={<Experience />}
                    />

                    <Route
                        path="/education"
                        element={<Education />}
                    />

                    <Route
                        path="/certifications"
                        element={<Certifications />}
                    />

                    <Route
                        path="/messages"
                        element={<Messages />}
                    />

                    {/* =========================
                        404
                    ========================== */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </LanguageProvider>
    );
}



/* =========================================================
   REACT MOUNT
========================================================= */

const rootElement =
    document.getElementById("app");


if (!rootElement) {

    console.error(
        "React root element #app was not found."
    );

} else {

    ReactDOM
        .createRoot(rootElement)
        .render(

            <React.StrictMode>

                <App />

            </React.StrictMode>

        );
}



import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
}) {
    const location = useLocation();

    const { t, isRTL } = useLanguage();

    // =========================================
    // CLOSE SIDEBAR
    // =========================================

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // =========================================
    // ACTIVE LINK
    // =========================================

    const isActive = (path) => {
        return location.pathname === path;
    };

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("fitzone_token");

        window.location.href = "/login";
    };

    return (
        <>
            {/* OVERLAY */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`dashboard-sidebar ${
                    sidebarOpen ? "sidebar-open" : ""
                }`}
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* LOGO */}
                <div className="dashboard-logo">
                    <div className="dashboard-logo-mark">
                        SK
                    </div>

                    <div className="dashboard-logo-info">
                        <strong>SHAKIR</strong>

                        <span>
                            {t("sidebar.adminPanel")}
                        </span>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="dashboard-nav">

                    {/* MAIN MENU */}
                    <div className="nav-section-title">
                        {t("sidebar.mainMenu")}
                    </div>

                    {/* DASHBOARD */}
                    <Link
                        to="/dashboard"
                        className={`dashboard-nav-link ${
                            isActive("/dashboard")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">⌂</span>

                        <span className="nav-text">
                            {t("sidebar.dashboard")}
                        </span>
                    </Link>

                    {/* PROJECTS */}
                    <Link
                        to="/projects"
                        className={`dashboard-nav-link ${
                            isActive("/projects")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">▣</span>

                        <span className="nav-text">
                            {t("sidebar.projects")}
                        </span>

                        <span className="nav-count">
                            12
                        </span>
                    </Link>

                    {/* SERVICES */}
                    <Link
                        to="/admin/services"
                        className={`dashboard-nav-link ${
                            isActive("/admin/services")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">⚡</span>

                        <span className="nav-text">
                            {t("sidebar.services")}
                        </span>
                    </Link>

                    {/* SKILLS */}
                    <Link
                        to="/skills"
                        className={`dashboard-nav-link ${
                            isActive("/skills")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">✦</span>

                        <span className="nav-text">
                            {t("sidebar.skills")}
                        </span>
                    </Link>

                    {/* PROFILE SECTION */}
                    <div className="nav-section-title">
                        {t("sidebar.profile")}
                    </div>

                    {/* EXPERIENCE */}
                    <Link
                        to="/experience"
                        className={`dashboard-nav-link ${
                            isActive("/experience")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">◈</span>

                        <span className="nav-text">
                            {t("sidebar.experience")}
                        </span>
                    </Link>

                    {/* EDUCATION */}
                    <Link
                        to="/education"
                        className={`dashboard-nav-link ${
                            isActive("/education")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">◇</span>

                        <span className="nav-text">
                            {t("sidebar.education")}
                        </span>
                    </Link>

                    {/* CERTIFICATIONS */}
                    <Link
                        to="/certifications"
                        className={`dashboard-nav-link ${
                            isActive("/certifications")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">★</span>

                        <span className="nav-text">
                            {t("sidebar.certifications")}
                        </span>
                    </Link>

                    {/* COMMUNICATION */}
                    <div className="nav-section-title">
                        {t("sidebar.communication")}
                    </div>

                    {/* MESSAGES */}
                    <Link
                        to="/messages"
                        className={`dashboard-nav-link ${
                            isActive("/messages")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">✉</span>

                        <span className="nav-text">
                            {t("sidebar.messages")}
                        </span>

                        <span className="nav-count notification">
                            4
                        </span>
                    </Link>

                    {/* MY PROFILE */}
                    <Link
                        to="/profile"
                        className={`dashboard-nav-link ${
                            isActive("/profile")
                                ? "active"
                                : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <span className="nav-icon">●</span>

                        <span className="nav-text">
                            {t("sidebar.myProfile")}
                        </span>
                    </Link>
                </nav>

                {/* SIDEBAR BOTTOM */}
                <div className="sidebar-bottom">

                    {/* USER */}
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            SK
                        </div>

                        <div className="sidebar-user-info">
                            <strong>
                                Shakir Khairkhah
                            </strong>

                            <span>
                                {t("sidebar.administrator")}
                            </span>
                        </div>
                    </div>

                    {/* LOGOUT */}
                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>

                        <span>
                            {t("sidebar.logout")}
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}


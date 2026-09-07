
import React, { useState } from "react";
import { useLanguage } from "../../LanguageContext";

export default function Header({
    sidebarOpen,
    setSidebarOpen,
    title = "Dashboard",
    subtitle = "ADMINISTRATION",
}) {

    // =========================================
    // LANGUAGE CONTEXT
    // =========================================

    const {
        language,
        changeLanguage,
        t,
        isRTL,
    } = useLanguage();

    // =========================================
    // LANGUAGE DROPDOWN
    // =========================================

    const [languageOpen, setLanguageOpen] = useState(false);

    // =========================================
    // CHANGE LANGUAGE
    // =========================================

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
        setLanguageOpen(false);
    };

    // =========================================
    // LANGUAGE NAMES
    // =========================================

    const languageNames = {
        en: "English",
        ps: "پښتو",
        fa: "فارسی",
    };

    return (
        <header
            className="dashboard-topbar"
            dir={isRTL ? "rtl" : "ltr"}
        >

            {/* =================================
                MOBILE MENU BUTTON
            ================================== */}

            <button
                type="button"
                className="mobile-menu-button"
                onClick={() =>
                    setSidebarOpen(!sidebarOpen)
                }
                aria-label="Toggle sidebar"
            >
                ☰
            </button>


            {/* =================================
                TITLE
            ================================== */}

            <div className="topbar-title">

                <span>
                    {subtitle}
                </span>

                <h1>
                    {title}
                </h1>

            </div>


            {/* =================================
                ACTIONS
            ================================== */}

            <div className="topbar-actions">

                {/* =================================
                    LANGUAGE DROPDOWN
                ================================== */}

                <div className="language-dropdown">

                    <button
                        type="button"
                        className="language-button"
                        onClick={() =>
                            setLanguageOpen(!languageOpen)
                        }
                        aria-expanded={languageOpen}
                    >

                        <span className="language-icon">
                            🌐
                        </span>

                        <span>
                            {languageNames[language]}
                        </span>

                        <span className="language-arrow">
                            ▾
                        </span>

                    </button>


                    {/* =================================
                        LANGUAGE MENU
                    ================================== */}

                    {languageOpen && (
                        <div className="language-menu">

                            {/* ENGLISH */}

                            <button
                                type="button"
                                className={
                                    language === "en"
                                        ? "language-option active"
                                        : "language-option"
                                }
                                onClick={() =>
                                    handleLanguageChange("en")
                                }
                            >

                                <span>
                                    🇬🇧
                                </span>

                                <span>
                                    English
                                </span>

                            </button>


                            {/* PASHTO */}

                            <button
                                type="button"
                                className={
                                    language === "ps"
                                        ? "language-option active"
                                        : "language-option"
                                }
                                onClick={() =>
                                    handleLanguageChange("ps")
                                }
                            >

                                <span>
                                    🇦🇫
                                </span>

                                <span>
                                    پښتو
                                </span>

                            </button>


                            {/* DARI / PERSIAN */}

                            <button
                                type="button"
                                className={
                                    language === "fa"
                                        ? "language-option active"
                                        : "language-option"
                                }
                                onClick={() =>
                                    handleLanguageChange("fa")
                                }
                            >

                                <span>
                                    🇦🇫
                                </span>

                                <span>
                                    فارسی
                                </span>

                            </button>

                        </div>
                    )}

                </div>


                {/* =================================
                    DIVIDER
                ================================== */}

                <div className="topbar-divider"></div>


                {/* =================================
                    NOTIFICATIONS
                ================================== */}

                <button
                    type="button"
                    className="topbar-icon"
                    aria-label={t("header.notifications")}
                >

                    🔔

                    <span></span>

                </button>


                {/* =================================
                    DIVIDER
                ================================== */}

                <div className="topbar-divider"></div>


                {/* =================================
                    PROFILE
                ================================== */}

                <div className="topbar-profile">

                    <div className="topbar-avatar">
                        SK
                    </div>


                    <div className="topbar-profile-info">

                        <strong>
                            Shakir Khairkhah
                        </strong>

                        <span>
                            {t("sidebar.administrator")}
                        </span>

                    </div>


                    <span className="profile-arrow">
                        ▾
                    </span>

                </div>

            </div>

        </header>
    );
}


import React, { useEffect, useState } from "react";
import "../../css/admin-layout.css";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import Footer from "../components/dashboard/Footer";

export default function AdminLayout({
    children,
    title = "Dashboard",
    subtitle = "ADMINISTRATION",
}) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    /* =========================================
       LANGUAGE
    ========================================= */

    const [language, setLanguage] = useState(() => {
        try {
            const savedLanguage =
                localStorage.getItem("language");

            return ["en", "ps", "fa"].includes(savedLanguage)
                ? savedLanguage
                : "en";
        } catch {
            return "en";
        }
    });


    /* =========================================
       RTL / LTR
    ========================================= */

    useEffect(() => {

        const updateLanguage = () => {

            try {

                const savedLanguage =
                    localStorage.getItem("language") || "en";

                const currentLanguage =
                    ["en", "ps", "fa"].includes(savedLanguage)
                        ? savedLanguage
                        : "en";

                setLanguage(currentLanguage);


                const isRTL =
                    currentLanguage === "ps" ||
                    currentLanguage === "fa";


                /* HTML Direction */
                document.documentElement.dir =
                    isRTL ? "rtl" : "ltr";


                /* HTML Language */
                document.documentElement.lang =
                    currentLanguage;


                /* Body Direction */
                document.body.dir =
                    isRTL ? "rtl" : "ltr";


                /* Body Classes */
                document.body.classList.toggle(
                    "rtl",
                    isRTL
                );

                document.body.classList.toggle(
                    "ltr",
                    !isRTL
                );


            } catch (error) {

                console.error(
                    "Language direction error:",
                    error
                );

            }
        };


        /* Run when page loads */
        updateLanguage();


        /* Listen for language changes */
        window.addEventListener(
            "languageChanged",
            updateLanguage
        );


        /*
         * Backup:
         * Detect changes made directly to localStorage.
         */
        const languageInterval = setInterval(
            updateLanguage,
            500
        );


        return () => {

            window.removeEventListener(
                "languageChanged",
                updateLanguage
            );

            clearInterval(languageInterval);

        };

    }, []);


    /* =========================================
       RTL CHECK
    ========================================= */

    const isRTL =
        language === "ps" ||
        language === "fa";


    /* =========================================
       CLOSE SIDEBAR WHEN LANGUAGE CHANGES
    ========================================= */

    useEffect(() => {

        setSidebarOpen(false);

    }, [language]);


    return (
        <div
            className={`admin-layout ${
                isRTL
                    ? "rtl-layout"
                    : "ltr-layout"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
        >

            {/* =================================
                SIDEBAR
            ================================== */}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />


            {/* =================================
                CONTENT AREA
            ================================== */}

            <div className="admin-content">

                {/* =================================
                    HEADER
                ================================== */}

                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    title={title}
                    subtitle={subtitle}
                />


                {/* =================================
                    MAIN
                ================================== */}

                <main className="admin-main">
                    {children}
                </main>


                {/* =================================
                    FOOTER
                ================================== */}

                <Footer />

            </div>

        </div>
    );
}
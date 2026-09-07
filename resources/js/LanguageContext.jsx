import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import en from "./locales/en";
import ps from "./locales/ps";
import fa from "./locales/fa";

// =====================================================
// TRANSLATIONS
// =====================================================

const translations = {
    en,
    ps,
    fa,
};

// =====================================================
// LANGUAGE CONTEXT
// =====================================================

const LanguageContext = createContext(null);

// =====================================================
// LANGUAGE PROVIDER
// =====================================================

export function LanguageProvider({ children }) {

    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "en";
    });

    // =================================================
    // CHANGE LANGUAGE
    // =================================================

    const changeLanguage = (lang) => {

        if (!translations[lang]) {
            console.error("Language not found:", lang);
            return;
        }

        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    // =================================================
    // RTL / LTR
    // =================================================

    useEffect(() => {

        const rtl = language === "ps" || language === "fa";

        document.documentElement.lang = language;
        document.documentElement.dir = rtl ? "rtl" : "ltr";

        document.body.classList.toggle("rtl", rtl);
        document.body.classList.toggle("ltr", !rtl);

    }, [language]);

    // =================================================
    // TRANSLATION FUNCTION
    // =================================================

    const t = (key) => {

        if (!key) {
            return "";
        }

        const keys = key.split(".");

        // Selected language
        let value = translations[language];

        for (const keyPart of keys) {

            if (value === undefined || value === null) {
                break;
            }

            value = value[keyPart];
        }

        // Selected language translation found
        if (value !== undefined && value !== null) {
            return value;
        }

        // =================================================
        // ENGLISH FALLBACK
        // =================================================

        value = translations.en;

        for (const keyPart of keys) {

            if (value === undefined || value === null) {
                break;
            }

            value = value[keyPart];
        }

        // English translation found
        if (value !== undefined && value !== null) {
            return value;
        }

        // =================================================
        // KEY FALLBACK
        // =================================================

        return key;
    };

    // =================================================
    // CONTEXT VALUE
    // =================================================

    const contextValue = {
        language,
        setLanguage: changeLanguage,
        changeLanguage,
        t,
        isRTL: language === "ps" || language === "fa",
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

// =====================================================
// USE LANGUAGE
// =====================================================

export function useLanguage() {

    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default LanguageContext;
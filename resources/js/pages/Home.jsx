import React, {
    useEffect,
    useState,
    useMemo,
} from "react";

import { useLanguage } from "../LanguageContext";

import "../../css/app.css";

/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL = "http://127.0.0.1:8000/api";

const API = {
    projects: `${API_BASE_URL}/projects`,
    skills: `${API_BASE_URL}/skills`,
    services: `${API_BASE_URL}/services`,
    education: `${API_BASE_URL}/educations`,
    experiences: `${API_BASE_URL}/experiences`,
    certifications: `${API_BASE_URL}/certifications`,
    testimonials: `${API_BASE_URL}/testimonials`,
    messages: `${API_BASE_URL}/messages`,
};

/* =========================================================
   ICON SYSTEM
========================================================= */

const Icon = ({
    children,
    size = 20,
    strokeWidth = 1.8,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const ArrowUpRight = ({ size = 18 }) => (
    <Icon size={size}>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
    </Icon>
);

const ArrowRight = ({ size = 18 }) => (
    <Icon size={size}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
    </Icon>
);

const CodeIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
    </Icon>
);

const DatabaseIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <ellipse
            cx="12"
            cy="5"
            rx="8"
            ry="3"
        />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </Icon>
);

const LayersIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <path d="m12 3-9 5 9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
    </Icon>
);

const SparkIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
        <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </Icon>
);

const BriefcaseIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <rect
            x="3"
            y="7"
            width="18"
            height="13"
            rx="2"
        />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
        <path d="M10 12v2h4v-2" />
    </Icon>
);

const GraduationIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <path d="m3 10 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12v5c2.8 2 7.2 2 10 0v-5" />
        <path d="M21 10v6" />
    </Icon>
);

const CertificateIcon = ({ size = 24 }) => (
    <Icon size={size}>
        <circle
            cx="12"
            cy="8"
            r="5"
        />
        <path d="m9.5 12.5-1 8 3.5-2 3.5 2-1-8" />
    </Icon>
);

const MenuIcon = ({ size = 22 }) => (
    <Icon size={size}>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
    </Icon>
);

const CloseIcon = ({ size = 22 }) => (
    <Icon size={size}>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
    </Icon>
);

/* =========================================================
   HELPERS
========================================================= */

const getToken = () => {
    try {
        return localStorage.getItem(
            "fitzone_token"
        );
    } catch {
        return null;
    }
};

const getValue = (...values) => {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return value;
        }
    }

    return "";
};

const extractData = (response) => {
    if (!response) {
        return [];
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    if (
        response.data &&
        Array.isArray(response.data.data)
    ) {
        return response.data.data;
    }

    const possibleKeys = [
        "projects",
        "skills",
        "services",
        "education",
        "educations",
        "experiences",
        "certifications",
        "testimonials",
        "records",
        "results",
        "items",
    ];

    for (const key of possibleKeys) {
        if (Array.isArray(response[key])) {
            return response[key];
        }
    }

    return [];
};

const getTechnologies = (value) => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (
                    typeof item === "object"
                ) {
                    return getValue(
                        item.name,
                        item.title,
                        item.technology,
                        item.technology_name
                    );
                }

                return String(item).trim();
            })
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(/[,|]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const formatDate = (
    date,
    locale = "en-US"
) => {
    if (!date) {
        return "";
    }

    const value = String(date).trim();

    if (!value) {
        return "";
    }

    if (/^\d{4}$/.test(value)) {
        return value;
    }

    if (/^\d{4}-\d{2}$/.test(value)) {
        const [year, month] =
            value.split("-");

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const index =
            Number(month) - 1;

        return months[index]
            ? `${months[index]} ${year}`
            : value;
    }

    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(
            locale,
            {
                year: "numeric",
                month: "short",
            }
        );
    }

    return value;
};

const truncate = (
    value,
    max = 180
) => {
    const text = String(
        value || ""
    ).trim();

    if (text.length <= max) {
        return text;
    }

    return `${text
        .substring(0, max)
        .trim()}...`;
};

const safeUrl = (url) => {
    if (!url) {
        return "";
    }

    const value = String(url).trim();

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    return "";
};

/* =========================================================
   API REQUEST
========================================================= */

const fetchAPI = async (url) => {
    try {
        const token = getToken();

        const response = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Accept:
                        "application/json",

                    ...(token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {}),
                },
            }
        );

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        const data =
            contentType.includes(
                "application/json"
            )
                ? await response.json()
                : await response.text();

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error(
            "API REQUEST ERROR:",
            url,
            error
        );

        return null;
    }
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
    icon = (
        <SparkIcon size={26} />
    ),
    title = "Nothing available",
    text = "Content will appear here when it is added.",
}) => (
    <div className="portfolio-empty">

        <div className="empty-icon">
            {icon}
        </div>

        <h3>
            {title}
        </h3>

        <p>
            {text}
        </p>

    </div>
);

/* =========================================================
   SECTION LABEL
========================================================= */

const SectionLabel = ({
    number,
    children,
}) => (
    <div className="section-label">

        <span>
            {number}
        </span>

        {children}

    </div>
);

/* =========================================================
   HOME
========================================================= */

export default function Home() {

    /* =====================================================
       LANGUAGE
    ===================================================== */

    const {
        language,
        t,
        changeLanguage,
        isRTL,
    } = useLanguage();

    const [
        languageOpen,
        setLanguageOpen,
    ] = useState(false);


    /* =====================================================
       DATA STATES
    ===================================================== */

    const [
        projects,
        setProjects,
    ] = useState([]);

    const [
        skills,
        setSkills,
    ] = useState([]);

    const [
        services,
        setServices,
    ] = useState([]);

    const [
        education,
        setEducation,
    ] = useState([]);

    const [
        experiences,
        setExperiences,
    ] = useState([]);

    const [
        certifications,
        setCertifications,
    ] = useState([]);

    const [
        testimonials,
        setTestimonials,
    ] = useState([]);


    /* =====================================================
       GENERAL STATES
    ===================================================== */

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        mobileMenu,
        setMobileMenu,
    ] = useState(false);


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const [
        contactForm,
        setContactForm,
    ] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [
        contactLoading,
        setContactLoading,
    ] = useState(false);

    const [
        contactSuccess,
        setContactSuccess,
    ] = useState("");

    const [
        contactError,
        setContactError,
    ] = useState("");


    /* =====================================================
       LANGUAGE DIRECTION
       LanguageContext already controls the document
       direction. This effect only keeps the main page
       direction synchronized.
    ===================================================== */

    useEffect(() => {

        document.documentElement.dir =
            isRTL
                ? "rtl"
                : "ltr";

        document.documentElement.lang =
            language;

        document.body.dir =
            isRTL
                ? "rtl"
                : "ltr";

    }, [
        language,
        isRTL,
    ]);


    /* =====================================================
       CHANGE LANGUAGE
    ===================================================== */

    const handleLanguageChange = (
        lang
    ) => {

        changeLanguage(lang);

        setLanguageOpen(false);

        setMobileMenu(false);
    };


    /* =====================================================
       CONTACT CHANGE
    ===================================================== */

    const handleContactChange = (
        e
    ) => {

        const {
            name,
            value,
        } = e.target;

        setContactForm(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );

        setContactSuccess("");

        setContactError("");
    };


    /* =====================================================
       CONTACT SUBMIT
    ===================================================== */

    const handleContactSubmit =
        async (e) => {

            e.preventDefault();

            if (contactLoading) {
                return;
            }

            setContactLoading(true);

            setContactSuccess("");

            setContactError("");

            try {

                const response =
                    await fetch(
                        API.messages,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json",
                            },

                            body: JSON.stringify(
                                contactForm
                            ),
                        }
                    );

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";

                const data =
                    contentType.includes(
                        "application/json"
                    )
                        ? await response.json()
                        : {};

                if (!response.ok) {

                    if (
                        response.status ===
                            422 &&
                        data.errors
                    ) {

                        const firstError =
                            Object.values(
                                data.errors
                            )
                                .flat()
                                .at(0);

                        throw new Error(
                            firstError ||
                                t(
                                    "checkInformation"
                                )
                        );
                    }

                    throw new Error(
                        data.message ||
                            `Request failed (${response.status})`
                    );
                }

                setContactSuccess(
                    data.message ||
                        t(
                            "messageSent"
                        )
                );

                setContactForm({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });

            } catch (error) {

                console.error(
                    "CONTACT FORM ERROR:",
                    error
                );

                setContactError(
                    error.message ||
                        t(
                            "messageFailed"
                        )
                );

            } finally {

                setContactLoading(
                    false
                );

            }
        };


    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {

        let mounted = true;

        const loadData =
            async () => {

                setLoading(true);

                const responses =
                    await Promise.all([
                        fetchAPI(
                            API.projects
                        ),
                        fetchAPI(
                            API.skills
                        ),
                        fetchAPI(
                            API.services
                        ),
                        fetchAPI(
                            API.education
                        ),
                        fetchAPI(
                            API.experiences
                        ),
                        fetchAPI(
                            API.certifications
                        ),
                        fetchAPI(
                            API.testimonials
                        ),
                    ]);

                if (!mounted) {
                    return;
                }

                setProjects(
                    extractData(
                        responses[0]
                    )
                );

                setSkills(
                    extractData(
                        responses[1]
                    )
                );

                setServices(
                    extractData(
                        responses[2]
                    )
                );

                setEducation(
                    extractData(
                        responses[3]
                    )
                );

                setExperiences(
                    extractData(
                        responses[4]
                    )
                );

                setCertifications(
                    extractData(
                        responses[5]
                    )
                );

                setTestimonials(
                    extractData(
                        responses[6]
                    )
                );

                setLoading(false);
            };

        loadData();

        return () => {
            mounted = false;
        };

    }, []);


    /* =====================================================
       TECHNOLOGIES
    ===================================================== */

    const technologies =
        useMemo(() => {

            const list = [];

            skills.forEach(
                (skill) => {

                    const name =
                        getValue(
                            skill.name,
                            skill.title,
                            skill.skill_name,
                            skill.skillName,
                            skill.technology,
                            skill.technology_name
                        );

                    if (!name) {
                        return;
                    }

                    const exists =
                        list.some(
                            (item) =>
                                item.toLowerCase() ===
                                String(
                                    name
                                ).toLowerCase()
                        );

                    if (!exists) {
                        list.push(
                            String(
                                name
                            )
                        );
                    }
                }
            );

            return list;

        }, [skills]);


    /* =====================================================
       STATS
    ===================================================== */

    const stats = [
        {
            value:
                `${projects.length}+`,

            label:
                t(
                    "projectsBuilt"
                ),
        },

        {
            value:
                `${technologies.length}+`,

            label:
                t(
                    "technologies"
                ),
        },

        {
            value: "100%",

            label:
                t(
                    "commitment"
                ),
        },

        {
            value: "24/7",

            label:
                t(
                    "learningMindset"
                ),
        },
    ];


    /* =====================================================
       SKILL ICON
    ===================================================== */

    const getSkillIcon = (
        name
    ) => {

        const value =
            String(
                name || ""
            ).toLowerCase();

        if (
            value.includes("mysql") ||
            value.includes("sql") ||
            value.includes("database") ||
            value.includes("mongodb")
        ) {

            return (
                <DatabaseIcon
                    size={27}
                />
            );
        }

        if (
            value.includes("react") ||
            value.includes("javascript") ||
            value.includes("frontend") ||
            value.includes("html") ||
            value.includes("css") ||
            value.includes("vue") ||
            value.includes("next")
        ) {

            return (
                <CodeIcon
                    size={27}
                />
            );
        }

        if (
            value.includes("laravel") ||
            value.includes("php") ||
            value.includes("backend") ||
            value.includes("node")
        ) {

            return (
                <LayersIcon
                    size={27}
                />
            );
        }

        return (
            <SparkIcon
                size={27}
            />
        );
    };


    /* =====================================================
       CLOSE MOBILE MENU
    ===================================================== */

    const handleNavClick = () => {

        setMobileMenu(false);

        setLanguageOpen(false);
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <main className="portfolio-home">

                <div className="home-loading">

                    <div className="loading-spinner"></div>

                    <span className="loading-label">
                        PORTFOLIO
                    </span>

                    <h2>
                        {t(
                            "loadingExperience"
                        )}
                    </h2>

                    <p>
                        {t(
                            "loadingPortfolio"
                        )}
                    </p>

                </div>

            </main>
        );
    }


    /* =====================================================
       MAIN
    ===================================================== */

    return (
        <main className="portfolio-home">

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="navbar-menu">

                <div className="nav-inner">

                    {/* LOGO */}

                    <a
                        href="#home"
                        className="nav-logo"
                        onClick={
                            handleNavClick
                        }
                    >
                        <span>
                            SK
                        </span>
                    </a>


                    {/* MOBILE BUTTON */}

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileMenu(
                                !mobileMenu
                            )
                        }
                        aria-label={
                            t(
                                "toggleNavigation"
                            )
                        }
                    >
                        {mobileMenu ? (
                            <CloseIcon />
                        ) : (
                            <MenuIcon />
                        )}
                    </button>


                    {/* NAV LINKS */}

                    <div
                        className={`nav-links ${
                            mobileMenu
                                ? "mobile-open"
                                : ""
                        }`}
                    >

                        <a
                            href="#home"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navHome")}
                        </a>

                        <a
                            href="#about"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navAbout")}
                        </a>

                        <a
                            href="#services"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navServices")}
                        </a>

                        <a
                            href="#skills"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navSkills")}
                        </a>

                        <a
                            href="#experience"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navExperience")}
                        </a>

                        <a
                            href="#education"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navEducation")}
                        </a>

                        <a
                            href="#projects"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navProjects")}
                        </a>

                        <a
                            href="#contact"
                            onClick={
                                handleNavClick
                            }
                        >
                            {t("navContact")}
                        </a>

                    </div>


                    {/* LANGUAGE */}

                    <div className="language-dropdown">

                        <button
                            type="button"
                            className="language-button"
                            onClick={() =>
                                setLanguageOpen(
                                    !languageOpen
                                )
                            }
                            aria-label={
                                t(
                                    "selectLanguage"
                                )
                            }
                        >

                            <span className="language-globe">
                                🌐
                            </span>

                            <span className="language-current">

                                {language === "en"
                                    ? "English"
                                    : language === "ps"
                                    ? "پښتو"
                                    : "فارسی"}

                            </span>

                            <span
                                className={`language-arrow ${
                                    languageOpen
                                        ? "open"
                                        : ""
                                }`}
                            >
                                ▾
                            </span>

                        </button>


                        {languageOpen && (

                            <div className="language-menu">

                                {/* English */}

                                <button
                                    type="button"
                                    className={
                                        language ===
                                        "en"
                                            ? "language-option active"
                                            : "language-option"
                                    }
                                    onClick={() =>
                                        handleLanguageChange(
                                            "en"
                                        )
                                    }
                                >

                                    <span className="language-flag">
                                        🇬🇧
                                    </span>

                                    <span>
                                        English
                                    </span>

                                </button>


                                {/* Pashto */}

                                <button
                                    type="button"
                                    className={
                                        language ===
                                        "ps"
                                            ? "language-option active"
                                            : "language-option"
                                    }
                                    onClick={() =>
                                        handleLanguageChange(
                                            "ps"
                                        )
                                    }
                                >

                                    <span className="language-flag">
                                        🇦🇫
                                    </span>

                                    <span>
                                        پښتو
                                    </span>

                                </button>


                                {/* Persian */}

                                <button
                                    type="button"
                                    className={
                                        language ===
                                        "fa"
                                            ? "language-option active"
                                            : "language-option"
                                    }
                                    onClick={() =>
                                        handleLanguageChange(
                                            "fa"
                                        )
                                    }
                                >

                                    <span className="language-flag">
                                        🇦🇫
                                    </span>

                                    <span>
                                        فارسی
                                    </span>

                                </button>

                            </div>

                        )}

                    </div>


                    {/* LOGIN */}

                    <a
                        href="/login"
                        className="nav-login"
                    >

                        {t("navLogin")}

                        <ArrowUpRight
                            size={16}
                        />

                    </a>

                </div>

            </nav>


            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="hero"
                id="home"
            >

                <div className="hero-background">

                    <div className="hero-grid"></div>

                    <div className="hero-glow glow-blue"></div>

                    <div className="hero-glow glow-purple"></div>

                    <div className="hero-glow glow-cyan"></div>

                </div>


                <div className="hero-container">

                    <div className="hero-content">

                        <div className="availability">

                            <span className="availability-dot"></span>

                            <span>
                                {t(
                                    "availableOpportunities"
                                )}
                            </span>

                            <ArrowUpRight
                                size={14}
                            />

                        </div>


                        <span className="hero-label">
                            {t(
                                "fullStackDeveloper"
                            )}
                        </span>


                        <h1 className="hero-title">

                            <span>
                                {t(
                                    "hero.firstName"
                                )}
                            </span>

                            <strong>
                                {t(
                                    "hero.lastName"
                                )}
                            </strong>

                        </h1>


                        <div className="hero-role">

                            <span></span>

                            <p>
                                {t(
                                    "digitalProducts"
                                )}
                            </p>

                        </div>


                        <p className="hero-description">

                            {t(
                                "heroDescription"
                            )}

                        </p>


                        {technologies.length >
                            0 && (

                            <div className="technology-list">

                                {technologies
                                    .slice(
                                        0,
                                        8
                                    )
                                    .map(
                                        (
                                            technology
                                        ) => (

                                            <span
                                                key={
                                                    technology
                                                }
                                                className="technology-tag"
                                            >
                                                <i></i>

                                                {
                                                    technology
                                                }

                                            </span>

                                        )
                                    )}

                            </div>

                        )}


                        <div className="hero-buttons">

                            <a
                                href="#projects"
                                className="primary-button"
                            >

                                {t(
                                    "exploreWork"
                                )}

                                <ArrowUpRight
                                    size={18}
                                />

                            </a>


                            <a
                                href="#contact"
                                className="secondary-button"
                            >

                                {t(
                                    "letsTalk"
                                )}

                                <ArrowRight
                                    size={17}
                                />

                            </a>

                        </div>

                    </div>


                    {/* HERO VISUAL */}

                    <div className="hero-visual">

                        <div className="visual-orbit orbit-one"></div>

                        <div className="visual-orbit orbit-two"></div>

                        <div className="visual-orbit orbit-three"></div>


                        <div className="profile-container">

                            <div className="profile-ring ring-one"></div>

                            <div className="profile-ring ring-two"></div>

                            <div className="profile-ring ring-three"></div>

                            <div className="profile-glow"></div>


                            <div className="profile-circle">

                                <img
                                    src="/images/khairkhawa.jpg"
                                    alt="Shakir Khairkhawa"
                                    className="profile-image"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                            </div>


                            <div className="profile-status">

                                <span></span>

                                {t(
                                    "openToWork"
                                )}

                            </div>

                        </div>


                        {/* FLOATING CARD 1 */}

                        <div className="floating-card floating-one">

                            <div className="floating-icon">

                                <CodeIcon
                                    size={21}
                                />

                            </div>

                            <div>

                                <strong>
                                    {t(
                                        "cleanCode"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "modernArchitecture"
                                    )}
                                </small>

                            </div>

                            <b>
                                ✓
                            </b>

                        </div>


                        {/* FLOATING CARD 2 */}

                        <div className="floating-card floating-two">

                            <div className="floating-icon purple">

                                <SparkIcon
                                    size={21}
                                />

                            </div>

                            <div>

                                <strong>
                                    {t(
                                        "fastScalable"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "performanceFocused"
                                    )}
                                </small>

                            </div>

                            <b>
                                ✓
                            </b>

                        </div>

                    </div>

                </div>


                <a
                    href="#about"
                    className="scroll-indicator"
                >

                    <span>
                        {t(
                            "scrollExplore"
                        )}
                    </span>

                    <i></i>

                </a>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats">

                <div className="stats-container">

                    {stats.map(
                        (stat) => (

                            <div
                                className="stat"
                                key={
                                    stat.label
                                }
                            >

                                <strong>
                                    {
                                        stat.value
                                    }
                                </strong>

                                <span>
                                    {
                                        stat.label
                                    }
                                </span>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* =================================================
                ABOUT
            ================================================= */}

            <section
                className="about section-space"
                id="about"
            >

                <div className="about-bg-text">
                    {t("navAbout")}
                </div>


                <div className="container about-container">

                    <div className="about-visual">

                        <div className="about-grid"></div>


                        <div className="about-card">

                            <div className="about-card-top">

                                <span>
                                    ● developer.config
                                </span>

                                <span>
                                    • • •
                                </span>

                            </div>


                            <div className="about-code">

                                <div>

                                    <span>
                                        const
                                    </span>{" "}

                                    developer = {"{"}

                                </div>


                                <div className="code-indent">

                                    <p>
                                        <b>
                                            name:
                                        </b>{" "}
                                        "Shakir"
                                    </p>

                                    <p>
                                        <b>
                                            role:
                                        </b>{" "}
                                        "Full-Stack"
                                    </p>

                                    <p>
                                        <b>
                                            focus:
                                        </b>{" "}
                                        "Innovation"
                                    </p>

                                </div>


                                <div>
                                    {"}"}
                                </div>

                            </div>


                            <div className="about-code-footer">

                                <span>
                                    ●
                                </span>

                                {t(
                                    "buildingGreat"
                                )}

                            </div>

                        </div>


                        <div className="creative-badge">

                            <small>
                                {t(
                                    "crafting"
                                )}
                            </small>

                            <strong>
                                {t(
                                    "digital"
                                )}
                            </strong>

                            <span>
                                {t(
                                    "experiences"
                                )}
                            </span>

                        </div>

                    </div>


                    <div className="about-content">

                        <SectionLabel number="01">

                            {t(
                                "aboutMe"
                            )}

                        </SectionLabel>


                        <h2>

                            {t(
                                "iDontJust"
                            )}

                            <br />

                            {t(
                                "writeCode"
                            )}

                            <span>
                                {t(
                                    "solveProblems"
                                )}
                            </span>

                        </h2>


                        <div className="about-intro">

                            <p>
                                {t(
                                    "aboutParagraph1"
                                )}
                            </p>

                            <p>
                                {t(
                                    "aboutParagraph2"
                                )}
                            </p>

                        </div>


                        <div className="about-features">

                            {[
                                [
                                    "01",
                                    "cleanArchitecture",
                                    "cleanArchitectureText",
                                ],

                                [
                                    "02",
                                    "modernTechnologies",
                                    "modernTechnologiesText",
                                ],

                                [
                                    "03",
                                    "userFocused",
                                    "userFocusedText",
                                ],

                                [
                                    "04",
                                    "scalableSolutions",
                                    "scalableSolutionsText",
                                ],

                            ].map(
                                (
                                    item
                                ) => (

                                    <div
                                        className="about-feature"
                                        key={
                                            item[0]
                                        }
                                    >

                                        <span>
                                            {
                                                item[0]
                                            }
                                        </span>

                                        <div>

                                            <strong>
                                                {t(
                                                    item[1]
                                                )}
                                            </strong>

                                            <p>
                                                {t(
                                                    item[2]
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                PROJECTS
            ================================================= */}

            <section
                className="projects section-space"
                id="projects"
            >

                <div className="container">

                    <div className="section-heading">

                        <div>

                            <SectionLabel number="02">

                                {t(
                                    "selectedProjects"
                                )}

                            </SectionLabel>

                            <h2>

                                {t(
                                    "workThat"
                                )}{" "}

                                <span>
                                    {t(
                                        "makesImpact"
                                    )}
                                </span>

                            </h2>

                        </div>


                        <p>

                            {t(
                                "projectsDescription"
                            )}

                        </p>

                    </div>


                    {projects.length >
                    0 ? (

                        <div className="projects-grid">

                            {projects.map(
                                (
                                    project,
                                    index
                                ) => {

                                    const name =
                                        getValue(
                                            project.name,
                                            project.title,
                                            t(
                                                "untitledProject"
                                            )
                                        );
                                        
                                        
                                    const description =
                                        getValue(
                                            project.description,
                                            project.details,
                                            t(
                                                "defaultProjectDescription"
                                            )
                                        );

                                    const technologiesData =
                                        getTechnologies(
                                            project.technologies ||
                                                project.tech
                                        );

                                    const liveUrl =
                                        safeUrl(
                                            project.live_url
                                        );

                                    const githubUrl =
                                        safeUrl(
                                            project.github_url
                                        );

                                    const projectUrl =
                                        liveUrl ||
                                        githubUrl;

                                    return (
                                        <article
                                            className="project-card"
                                            key={
                                                project.id ||
                                                project.project_id ||
                                                index
                                            }
                                        >
                                            <div className="project-header">

                                                <span className="project-number">
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                                <span className="project-type">
                                                    {getValue(
                                                        project.type,
                                                        project.project_type,
                                                        t(
                                                            "fullStack"
                                                        )
                                                    )}
                                                </span>

                                                <span className="project-arrow">
                                                    <ArrowUpRight
                                                        size={19}
                                                    />
                                                </span>

                                            </div>


                                            <div className="project-preview">

                                                <div className="browser-window">

                                                    <div className="browser-top">

                                                        <div className="browser-dots">
                                                            <i></i>
                                                            <i></i>
                                                            <i></i>
                                                        </div>

                                                        <div className="browser-address">

                                                            {String(name)
                                                                .toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )
                                                                .slice(
                                                                    0,
                                                                    25
                                                                )}
                                                            .dev

                                                        </div>

                                                    </div>


                                                    <div className="browser-content">

                                                        <div className="preview-sidebar">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>


                                                        <div className="preview-main">

                                                            <div className="preview-topbar">
                                                                <span></span>
                                                                <span></span>
                                                            </div>


                                                            <div className="preview-heading">

                                                                <div className="preview-icon">

                                                                    <SparkIcon
                                                                        size={22}
                                                                    />

                                                                </div>

                                                                <div>
                                                                    <b></b>
                                                                    <small></small>
                                                                </div>

                                                            </div>


                                                            <div className="preview-stat-row">
                                                                <span></span>
                                                                <span></span>
                                                                <span></span>
                                                            </div>


                                                            <div className="preview-chart">
                                                                <i></i>
                                                                <i></i>
                                                                <i></i>
                                                                <i></i>
                                                                <i></i>
                                                                <i></i>
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="project-content">

                                                <div className="project-title-row">

                                                    <h3>
                                                        {name}
                                                    </h3>

                                                    <span>
                                                        <CodeIcon
                                                            size={21}
                                                        />
                                                    </span>

                                                </div>


                                                <p className="project-description">

                                                    {truncate(
                                                        description,
                                                        170
                                                    )}

                                                </p>


                                                {technologiesData.length > 0 && (

                                                    <div className="project-technologies">

                                                        {technologiesData
                                                            .slice(0, 5)
                                                            .map(
                                                                (tech) => (
                                                                    <span
                                                                        key={
                                                                            tech
                                                                        }
                                                                    >
                                                                        {tech}
                                                                    </span>
                                                                )
                                                            )}


                                                        {technologiesData.length >
                                                            5 && (

                                                            <span>
                                                                +
                                                                {technologiesData.length -
                                                                    5}
                                                            </span>

                                                        )}

                                                    </div>

                                                )}


                                                {projectUrl ? (

                                                    <a
                                                        href={
                                                            projectUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="project-link"
                                                    >

                                                        {t(
                                                            "viewProject"
                                                        )}

                                                        <ArrowUpRight
                                                            size={17}
                                                        />

                                                    </a>

                                                ) : (

                                                    <span className="project-link disabled">

                                                        {t(
                                                            "projectDetails"
                                                        )}

                                                    </span>

                                                )}

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <EmptyState
                            title={t(
                                "noProjects"
                            )}
                            text={t(
                                "projectsWillAppear"
                            )}
                        />

                    )}


                    {projects.length > 0 && (

                        <div className="view-all">

                            <a href="/projects">

                                {t(
                                    "viewAllProjects"
                                )}

                                <ArrowRight
                                    size={18}
                                />

                            </a>

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
                EDUCATION
            ================================================= */}

            <section
                className="education"
                id="education"
            >

                <div className="container">

                    <div className="education-heading">

                        <div className="education-heading-left">

                            <div className="section-label">

                                <span>
                                    03
                                </span>

                                {t("navEducation")}

                            </div>


                            <h2>

                                {t(
                                    "academicJourney"
                                )}{" "}

                                <span>
                                    {t(
                                        "journey"
                                    )}
                                </span>

                            </h2>

                        </div>


                        <p>
                            {t(
                                "educationDescription"
                            )}
                        </p>

                    </div>


                    {education.length > 0 ? (

                        <div className="education-list">

                            {education.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const degree =
                                        getValue(
                                            item.degree,
                                            item.education,
                                            item.education_title,
                                            item.degree_name,
                                            item.title,
                                            item.program,
                                            item.program_name,
                                            item.qualification,
                                            item.course,
                                            t(
                                                "education"
                                            )
                                        );

                                    const institution =
                                        getValue(
                                            item.institution,
                                            item.institution_name,
                                            item.school,
                                            item.school_name,
                                            item.university,
                                            item.university_name,
                                            item.college,
                                            item.college_name,
                                            item.organization,
                                            item.institute,
                                            t(
                                                "institution"
                                            )
                                        );

                                    const field =
                                        getValue(
                                            item.field,
                                            item.field_of_study,
                                            item.fieldOfStudy,
                                            item.major,
                                            item.subject,
                                            item.department,
                                            item.specialization
                                        );

                                    const startDate =
                                        getValue(
                                            item.start_date,
                                            item.startDate,
                                            item.from,
                                            item.from_date,
                                            item.fromDate,
                                            item.start_year,
                                            item.startYear
                                        );

                                    const endDate =
                                        getValue(
                                            item.end_date,
                                            item.endDate,
                                            item.to,
                                            item.to_date,
                                            item.toDate,
                                            item.end_year,
                                            item.endYear
                                        );

                                    const description =
                                        getValue(
                                            item.description,
                                            item.details,
                                            item.summary,
                                            item.about,
                                            item.note,
                                            item.content
                                        );

                                    const isCurrent =
                                        item.current === true ||
                                        item.current === 1 ||
                                        item.current === "1" ||
                                        item.status === "current";


                                    return (

                                        <article
                                            className="education-record"
                                            key={
                                                item.id ||
                                                item.education_id ||
                                                `education-${index}`
                                            }
                                        >

                                            <div className="education-index">

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </div>


                                            <div className="education-line">

                                                <div className="education-dot">

                                                    <GraduationIcon
                                                        size={17}
                                                    />

                                                </div>


                                                {index !==
                                                    education.length - 1 && (

                                                    <span className="education-connector"></span>

                                                )}

                                            </div>


                                            <div className="education-card">

                                                <div className="education-card-top">

                                                    <div className="education-type">

                                                        <span></span>

                                                        {t(
                                                            "academic"
                                                        )}

                                                    </div>


                                                    {(startDate ||
                                                        endDate ||
                                                        isCurrent) && (

                                                        <div className="education-period">

                                                            <span>

                                                                {startDate
                                                                    ? formatDate(
                                                                          startDate,
                                                                          language ===
                                                                              "ps"
                                                                              ? "ps-AF"
                                                                              : language ===
                                                                                "fa"
                                                                              ? "fa-AF"
                                                                              : "en-US"
                                                                      )
                                                                    : "—"}

                                                            </span>


                                                            <b>
                                                                →
                                                            </b>


                                                            <span
                                                                className={
                                                                    isCurrent
                                                                        ? "education-present"
                                                                        : ""
                                                                }
                                                            >

                                                                {isCurrent
                                                                    ? t(
                                                                          "present"
                                                                      )
                                                                    : endDate
                                                                    ? formatDate(
                                                                          endDate,
                                                                          language ===
                                                                              "ps"
                                                                              ? "ps-AF"
                                                                              : language ===
                                                                                "fa"
                                                                              ? "fa-AF"
                                                                              : "en-US"
                                                                      )
                                                                    : "—"}

                                                            </span>

                                                        </div>

                                                    )}

                                                </div>


                                                <div className="education-card-content">

                                                    <div className="education-info">

                                                        <h3>
                                                            {degree}
                                                        </h3>


                                                        <div className="education-institution">

                                                            <span className="education-small-icon">

                                                                <GraduationIcon
                                                                    size={14}
                                                                />

                                                            </span>

                                                            <strong>
                                                                {institution}
                                                            </strong>

                                                        </div>


                                                        {field && (

                                                            <span className="education-field">
                                                                {field}
                                                            </span>

                                                        )}


                                                        {description && (

                                                            <p className="education-description">
                                                                {description}
                                                            </p>

                                                        )}

                                                    </div>


                                                    <div className="education-badge">

                                                        <GraduationIcon
                                                            size={24}
                                                        />

                                                        <span>

                                                            {String(
                                                                index + 1
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <EmptyState
                            icon={
                                <GraduationIcon
                                    size={25}
                                />
                            }
                            title={t(
                                "noEducation"
                            )}
                            text={t(
                                "educationWillAppear"
                            )}
                        />

                    )}

                </div>

            </section>


            {/* =================================================
                SKILLS
            ================================================= */}

            <section
                className="skills section-space"
                id="skills"
            >

                <div className="container">

                    <div className="center-heading">

                        <SectionLabel number="04">

                            {t(
                                "expertise"
                            )}

                        </SectionLabel>


                        <h2>

                            {t(
                                "technologiesI"
                            )}{" "}

                            <span>

                                {t(
                                    "workWith"
                                )}

                            </span>

                        </h2>


                        <p>

                            {t(
                                "skillsDescription"
                            )}

                        </p>

                    </div>


                    {skills.length > 0 ? (

                        <div className="skills-grid">

                            {skills.map(
                                (
                                    skill,
                                    index
                                ) => {

                                    const name =
                                        getValue(
                                            skill.name,
                                            skill.title,
                                            skill.skill_name,
                                            skill.skillName,
                                            skill.technology,
                                            skill.technology_name,
                                            t(
                                                "skill"
                                            )
                                        );

                                    const description =
                                        getValue(
                                            skill.description,
                                            skill.details,
                                            skill.about,
                                            t(
                                                "professionalSkill"
                                            )
                                        );


                                    return (

                                        <article
                                            className="skill-card"
                                            key={
                                                skill.id ||
                                                skill.skill_id ||
                                                index
                                            }
                                        >

                                            <div className="skill-top">

                                                <span>

                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>


                                                <div className="skill-icon">

                                                    {getSkillIcon(
                                                        name
                                                    )}

                                                </div>

                                            </div>


                                            <div className="skill-content">

                                                <h3>
                                                    {name}
                                                </h3>

                                                <p>

                                                    {truncate(
                                                        description,
                                                        120
                                                    )}

                                                </p>

                                            </div>


                                            <div className="skill-bottom">

                                                <span>

                                                    {t(
                                                        "expertise"
                                                    ).toUpperCase()}

                                                </span>

                                                <ArrowUpRight
                                                    size={16}
                                                />

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <EmptyState
                            title={t(
                                "noSkills"
                            )}
                            text={t(
                                "skillsWillAppear"
                            )}
                        />

                    )}

                </div>

            </section>


            {/* =================================================
                SERVICES
            ================================================= */}

            <section
                className="services section-space"
                id="services"
            >

                <div className="container">

                    <div className="services-heading">

                        <div>

                            <SectionLabel number="05">

                                {t("navServices")}

                            </SectionLabel>


                            <h2>

                                {t(
                                    "whatIBuild"
                                )}{" "}

                                <span>

                                    {t(
                                        "build"
                                    )}

                                </span>

                            </h2>

                        </div>


                        <p>

                            {t(
                                "servicesDescription"
                            )}

                        </p>

                    </div>


                    {services.length > 0 ? (

                        <div className="services-grid">

                            {services.map(
                                (
                                    service,
                                    index
                                ) => {

                                    const name =
                                        getValue(
                                            service.name,
                                            service.title,
                                            service.service_name,
                                            t(
                                                "service"
                                            )
                                        );

                                    const description =
                                        getValue(
                                            service.description,
                                            service.details,
                                            t(
                                                "defaultServiceDescription"
                                            )
                                        );

                                    const tech =
                                        getTechnologies(
                                            service.technologies ||
                                                service.tech
                                        );


                                    return (

                                        <article
                                            className="service-card"
                                            key={
                                                service.id ||
                                                service.service_id ||
                                                index
                                            }
                                        >

                                            <div className="service-top">

                                                <span>

                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>


                                                <div>

                                                    <CodeIcon
                                                        size={24}
                                                    />

                                                </div>

                                            </div>


                                            <div className="service-content">

                                                <h3>
                                                    {name}
                                                </h3>

                                                <p>

                                                    {truncate(
                                                        description,
                                                        150
                                                    )}

                                                </p>

                                            </div>


                                            {tech.length > 0 && (

                                                <div className="service-tech">

                                                    {tech
                                                        .slice(
                                                            0,
                                                            4
                                                        )
                                                        .map(
                                                            (
                                                                item
                                                            ) => (

                                                                <span
                                                                    key={
                                                                        item
                                                                    }
                                                                >
                                                                    {item}
                                                                </span>

                                                            )
                                                        )}

                                                </div>

                                            )}


                                            <div className="service-arrow">

                                                <ArrowUpRight
                                                    size={19}
                                                />

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <EmptyState
                            title={t(
                                "noServices"
                            )}
                            text={t(
                                "servicesWillAppear"
                            )}
                        />

                    )}


                    <div className="services-cta">

                        <div>

                            <span>

                                {t(
                                    "projectInMind"
                                )}

                            </span>

                            <strong>

                                {t(
                                    "buildTogether"
                                )}

                            </strong>

                        </div>


                        <a
                            href="#contact"
                            className="services-cta-button"
                        >

                            {t(
                                "startProject"
                            )}

                            <ArrowUpRight
                                size={18}
                            />

                        </a>

                    </div>

                </div>

            </section>


            {/* =================================================
                EXPERIENCE
            ================================================= */}

            <section
                className="experience"
                id="experience"
            >

                <div className="container">

                    <div className="experience-heading">

                        <div className="experience-heading-main">

                            <div className="section-label">

                                <span>
                                    06
                                </span>

                                {t("navExperience")}

                            </div>


                            <h2>

                                {t(
                                    "professionalJourney"
                                )}{" "}

                                <span>

                                    {t(
                                        "journey"
                                    )}

                                </span>

                            </h2>

                        </div>


                        <p>

                            {t(
                                "experienceDescription"
                            )}

                        </p>

                    </div>


                    {experiences.length > 0 ? (

                        <div className="experience-list">

                            {experiences.map(
                                (
                                    experience,
                                    index
                                ) => {

                                    const title =
                                        getValue(
                                            experience.title,
                                            experience.position,
                                            experience.job_title,
                                            experience.jobTitle,
                                            t(
                                                "fullStackDeveloper"
                                            )
                                        );

                                    const company =
                                        getValue(
                                            experience.company,
                                            experience.organization,
                                            experience.company_name,
                                            experience.companyName
                                        );

                                    const description =
                                        getValue(
                                            experience.description,
                                            experience.details,
                                            experience.responsibilities,
                                            experience.summary
                                        );

                                    const start =
                                        getValue(
                                            experience.start_date,
                                            experience.startDate,
                                            experience.from,
                                            experience.from_date,
                                            experience.fromDate,
                                            experience.start_year,
                                            experience.startYear
                                        );

                                    const end =
                                        getValue(
                                            experience.end_date,
                                            experience.endDate,
                                            experience.to,
                                            experience.to_date,
                                            experience.toDate,
                                            experience.end_year,
                                            experience.endYear
                                        );

                                    const type =
                                        getValue(
                                            experience.type,
                                            experience.experience_type,
                                            t(
                                                "professionalExperience"
                                            )
                                        );

                                    const technologiesData =
                                        getTechnologies(
                                            experience.technologies ||
                                                experience.tech ||
                                                experience.technology
                                        );

                                    const isCurrent =
                                        experience.current ===
                                            true ||
                                        experience.current ===
                                            1 ||
                                        experience.current ===
                                            "1";

                                    const locale =
                                        language === "ps"
                                            ? "ps-AF"
                                            : language === "fa"
                                            ? "fa-AF"
                                            : "en-US";

                                    const startFormatted =
                                        start
                                            ? formatDate(
                                                  start,
                                                  locale
                                              )
                                            : "";

                                    const endFormatted =
                                        end
                                            ? formatDate(
                                                  end,
                                                  locale
                                              )
                                            : "";


                                    return (

                                        <article
                                            className="experience-card-item"
                                            key={
                                                experience.id ||
                                                experience.experience_id ||
                                                index
                                            }
                                        >

                                            <div className="experience-number">

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </div>


                                            <div className="experience-timeline-column">

                                                <div className="experience-timeline-icon">

                                                    <BriefcaseIcon
                                                        size={18}
                                                    />

                                                </div>


                                                {index !==
                                                    experiences.length -
                                                        1 && (

                                                    <div className="experience-timeline-line"></div>

                                                )}

                                            </div>


                                            <div className="experience-content-card">

                                                <div className="experience-card-top">

                                                    <div className="experience-main-info">

                                                        <div className="experience-type">

                                                            <span></span>

                                                            {type}

                                                        </div>


                                                        <h3>
                                                            {title}
                                                        </h3>


                                                        {company && (

                                                            <div className="experience-company">

                                                                <span>
                                                                    @
                                                                </span>

                                                                {company}

                                                            </div>

                                                        )}

                                                    </div>


                                                    {(startFormatted ||
                                                        endFormatted ||
                                                        isCurrent) && (

                                                        <div className="experience-date-box">

                                                            <span>
                                                                {startFormatted ||
                                                                    "—"}
                                                            </span>

                                                            <b>
                                                                →
                                                            </b>

                                                            <span
                                                                className={
                                                                    isCurrent
                                                                        ? "present"
                                                                        : ""
                                                                }
                                                            >

                                                                {isCurrent
                                                                    ? t(
                                                                          "present"
                                                                      )
                                                                    : endFormatted ||
                                                                      "—"}

                                                            </span>

                                                        </div>

                                                    )}

                                                </div>


                                                {description && (

                                                    <div className="experience-description">

                                                        <p>
                                                            {description}
                                                        </p>

                                                    </div>

                                                )}


                                                {technologiesData.length >
                                                    0 && (

                                                    <div className="experience-bottom">

                                                        <div className="experience-tech-list">

                                                            {technologiesData
                                                                .slice(
                                                                    0,
                                                                    8
                                                                )
                                                                .map(
                                                                    (
                                                                        technology
                                                                    ) => (

                                                                        <span
                                                                            key={
                                                                                technology
                                                                            }
                                                                        >
                                                                            {
                                                                                technology
                                                                            }
                                                                        </span>

                                                                    )
                                                                )}


                                                            {technologiesData.length >
                                                                8 && (

                                                                <span className="experience-tech-more">

                                                                    +
                                                                    {technologiesData.length -
                                                                        8}

                                                                </span>

                                                            )}

                                                        </div>


                                                        <div className="experience-card-index">

                                                            {t(
                                                                "experienceShort"
                                                            )}{" "}

                                                            {String(
                                                                index + 1
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}

                                                        </div>

                                                    </div>

                                                )}

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <EmptyState
                            icon={
                                <BriefcaseIcon
                                    size={25}
                                />
                            }
                            title={t(
                                "noExperience"
                            )}
                            text={t(
                                "experienceWillAppear"
                            )}
                        />

                    )}

                </div>

            </section>


            {/* =================================================
                CERTIFICATIONS
            ================================================= */}

            <section
                className="certifications section-space"
                id="certifications"
            >

                <div className="container">

                    <div className="certifications-heading">

                        <div>

                            <SectionLabel number="07">

                                {t(
                                    "certifications"
                                )}

                            </SectionLabel>


                            <h2>

                                {t(
                                    "credentials"
                                )}{" "}

                                <span>

                                    {t(
                                        "matter"
                                    )}

                                </span>

                            </h2>

                        </div>


                        <p>

                            {t(
                                "certificationsDescription"
                            )}

                        </p>

                    </div>


                    {certifications.length > 0 ? (

                        <div className="certifications-grid">

                            {certifications.map(
                                (
                                    certificate,
                                    index
                                ) => {

                                    const name =
                                        getValue(
                                            certificate.name,
                                            certificate.title,
                                            certificate.certification_name,
                                            t(
                                                "certification"
                                            )
                                        );

                                    const organization =
                                        getValue(
                                            certificate.organization,
                                            certificate.issuer,
                                            certificate.company,
                                            certificate.institution
                                        );

                                    const description =
                                        getValue(
                                            certificate.description,
                                            certificate.details,
                                            t(
                                                "certificationDescription"
                                            )
                                        );

                                    const credentialUrl =
                                        safeUrl(
                                            certificate.credential_url
                                        );

                                    const issueDate =
                                        getValue(
                                            certificate.issue_date,
                                            certificate.date,
                                            certificate.issued_at
                                        );


                                    return (

                                        <article
                                            className="certificate-card"
                                            key={
                                                certificate.id ||
                                                certificate.certification_id ||
                                                index
                                            }
                                        >

                                            <div className="certificate-top">

                                                <div className="certificate-icon">

                                                    <CertificateIcon
                                                        size={24}
                                                    />

                                                </div>


                                                <span>

                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}

                                                </span>

                                            </div>


                                            <div className="certificate-content">

                                                <small>

                                                    {getValue(
                                                        certificate.type,
                                                        t(
                                                            "professionalCertification"
                                                        )
                                                    )}

                                                </small>


                                                <h3>
                                                    {name}
                                                </h3>


                                                <p>

                                                    {truncate(
                                                        description,
                                                        135
                                                    )}

                                                </p>


                                                {organization && (

                                                    <strong>
                                                        {organization}
                                                    </strong>

                                                )}


                                                {certificate.credential_id && (

                                                    <span className="credential-id">

                                                        {t(
                                                            "credentialId"
                                                        )}

                                                        :{" "}

                                                        {
                                                            certificate.credential_id
                                                        }

                                                    </span>

                                                )}

                                            </div>


                                            <div className="certificate-footer">

                                                <span>

                                                    {formatDate(
                                                        issueDate,
                                                        language ===
                                                            "ps"
                                                            ? "ps-AF"
                                                            : language ===
                                                              "fa"
                                                            ? "fa-AF"
                                                            : "en-US"
                                                    )}

                                                </span>


                                                {credentialUrl && (

                                                    <a
                                                        href={
                                                            credentialUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >

                                                        {t(
                                                            "viewCredential"
                                                        )}

                                                        <ArrowUpRight
                                                            size={15}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <EmptyState
                            icon={
                                <CertificateIcon
                                    size={25}
                                />
                            }
                            title={t(
                                "noCertifications"
                            )}
                            text={t(
                                "certificationsWillAppear"
                            )}
                        />

                    )}

                </div>

            </section>


            {/* =================================================
                CONTACT
            ================================================= */}

            <section
                className="contact section-space"
                id="contact"
            >

                <div className="contact-background">

                    <div className="contact-grid"></div>

                    <div className="contact-glow contact-glow-one"></div>

                    <div className="contact-glow contact-glow-two"></div>

                </div>


                <div className="container">

                    <div className="contact-header">

                        <SectionLabel number="09">

                            {t(
                                "letsConnect"
                            )}

                        </SectionLabel>


                        <h2>

                            {t(
                                "haveIdea"
                            )}

                            <br />

                            <span>

                                {t(
                                    "letsBuildIt"
                                )}

                            </span>

                        </h2>


                        <p>

                            {t(
                                "contactDescription"
                            )}

                        </p>

                    </div>


                    <div className="contact-wrapper">

                        {/* LEFT */}

                        <div className="contact-info">

                            <div className="contact-info-label">

                                <span></span>

                                {t(
                                    "getInTouch"
                                )}

                            </div>


                            <h3>

                                {t(
                                    "createSomething"
                                )}

                                <span>

                                    {t(
                                        "meaningful"
                                    )}

                                </span>

                            </h3>


                            <p>

                                {t(
                                    "contactParagraph"
                                )}

                            </p>


                            <div className="contact-info-item">

                                <div className="contact-info-icon">

                                    <ArrowUpRight
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <small>
                                        {t(
                                            "email"
                                        )}
                                    </small>

                                    <a href="mailto:shakerkhairkhawa804@gmail.com">
                                        shakerkhairkhawa804@gmail.com
                                    </a>

                                </div>

                            </div>


                            <div className="contact-info-item">

                                <div className="contact-info-icon">

                                    <CodeIcon
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <small>
                                        {t(
                                            "specialization"
                                        )}
                                    </small>

                                    <strong>

                                        {t(
                                            "fullStackWebDevelopment"
                                        )}

                                    </strong>

                                </div>

                            </div>


                            <div className="contact-availability">

                                <span></span>

                                <div>

                                    <strong>

                                        {t(
                                            "availableProjects"
                                        )}

                                    </strong>

                                    <small>

                                        {t(
                                            "replyTime"
                                        )}

                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* FORM */}

                        <div className="contact-form-card">

                            <div className="contact-form-header">

                                <div>

                                    <span>
                                        01
                                    </span>

                                    <strong>

                                        {t(
                                            "sendMessage"
                                        ).toUpperCase()}

                                    </strong>

                                </div>


                                <span className="contact-form-status">

                                    {t(
                                        "online"
                                    )}

                                </span>

                            </div>


                            <form
                                onSubmit={
                                    handleContactSubmit
                                }
                                className="contact-form"
                            >

                                <div className="contact-form-row">

                                    <div className="contact-field">

                                        <label htmlFor="name">

                                            {t(
                                                "yourName"
                                            )}

                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={
                                                contactForm.name
                                            }
                                            onChange={
                                                handleContactChange
                                            }
                                            placeholder={t(
                                                "namePlaceholder"
                                            )}
                                            required
                                            maxLength={100}
                                        />

                                    </div>


                                    <div className="contact-field">

                                        <label htmlFor="email">

                                            {t(
                                                "emailAddress"
                                            )}

                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={
                                                contactForm.email
                                            }
                                            onChange={
                                                handleContactChange
                                            }
                                            placeholder="you@example.com"
                                            required
                                            maxLength={150}
                                        />

                                    </div>

                                </div>


                                <div className="contact-field">

                                    <label htmlFor="subject">

                                        {t(
                                            "subject"
                                        )}

                                    </label>

                                    <input
                                        id="subject"
                                        type="text"
                                        name="subject"
                                        value={
                                            contactForm.subject
                                        }
                                        onChange={
                                            handleContactChange
                                        }
                                        placeholder={t(
                                            "subjectPlaceholder"
                                        )}
                                        maxLength={200}
                                    />

                                </div>


                                <div className="contact-field">

                                    <label htmlFor="message">

                                        {t(
                                            "yourMessage"
                                        )}

                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        value={
                                            contactForm.message
                                        }
                                        onChange={
                                            handleContactChange
                                        }
                                        placeholder={t(
                                            "messagePlaceholder"
                                        )}
                                        rows="6"
                                        required
                                        minLength={5}
                                    />

                                </div>


                                {contactSuccess && (

                                    <div className="contact-alert contact-alert-success">

                                        <span>
                                            ✓
                                        </span>

                                        {contactSuccess}

                                    </div>

                                )}


                                {contactError && (

                                    <div className="contact-alert contact-alert-error">

                                        <span>
                                            !
                                        </span>

                                        {contactError}

                                    </div>

                                )}


                                <button
                                    type="submit"
                                    className="contact-submit"
                                    disabled={
                                        contactLoading
                                    }
                                >

                                    {contactLoading ? (

                                        <>

                                            <span className="contact-spinner"></span>

                                            {t(
                                                "sending"
                                            )}

                                        </>

                                    ) : (

                                        <>

                                            {t(
                                                "sendMessage"
                                            )}

                                            <ArrowUpRight
                                                size={18}
                                            />

                                        </>

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>


                <div className="contact-decoration">

                    {t(
                        "available"
                    )}

                    <span></span>

                    {t(
                        "forWork"
                    )}

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="final-statement">

                <div className="container">

                    <div className="final-statement-inner">

                        <span className="final-mark">
                            SK
                        </span>


                        <p>

                            {t(
                                "designing"
                            )}

                            <span>

                                {t(
                                    "building"
                                )}

                            </span>

                            <strong>

                                {t(
                                    "evolving"
                                )}

                            </strong>

                        </p>


                        <span className="final-year">

                            ©{" "}
                            {new Date().getFullYear()}

                        </span>

                    </div>

                </div>

            </footer>

        </main>
    );
}
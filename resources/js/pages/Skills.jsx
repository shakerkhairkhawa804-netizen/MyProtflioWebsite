
import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";
import { useLanguage } from "../LanguageContext";

import "../../css/skills.css";


function Skills() {

    /* =====================================================
       CONSTANTS
    ===================================================== */

    const DEFAULT_ICON = "💻";

    const API_URL =
        "http://127.0.0.1:8000/api/skills";


    /* =====================================================
       LANGUAGE CONTEXT
    ===================================================== */

    const {
        t,
        language,
        isRTL,
    } = useLanguage();


    /* =====================================================
       RTL / LTR
       LanguageContext already manages the global direction.
       This keeps this page synchronized as well.
    ===================================================== */

    useEffect(() => {

        document.documentElement.lang =
            language;

        document.documentElement.dir =
            isRTL
                ? "rtl"
                : "ltr";

    }, [
        language,
        isRTL,
    ]);


    /* =====================================================
       EMPTY FORM
    ===================================================== */

    const emptyForm = {
        name: "",
        category: "Frontend",
        level: 80,
        icon: DEFAULT_ICON,
        description: "",
        status: "Active",
    };


    /* =====================================================
       STATES
    ===================================================== */

    const [skills, setSkills] =
        useState([]);

    const [formData, setFormData] =
        useState({
            ...emptyForm,
        });

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =====================================================
       CATEGORY TRANSLATION
    ===================================================== */

    const getCategoryLabel = (
        category
    ) => {

        const categoryKeys = {

            Frontend:
                "skills.frontend",

            Backend:
                "skills.backend",

            Database:
                "skills.database",

            Mobile:
                "skills.mobile",

            Tools:
                "skills.tools",

            Other:
                "skills.other",

        };

        return t(
            categoryKeys[category] ||
                "skills.other"
        );

    };


    /* =====================================================
       STATUS TRANSLATION
    ===================================================== */

    const getStatusLabel = (
        status
    ) => {

        return status === "Active"
            ? t(
                "skills.active",
                "Active"
            )
            : t(
                "skills.inactive",
                "Inactive"
            );

    };


    /* =====================================================
       GET ALL SKILLS
    ===================================================== */

    const fetchSkills =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await fetch(
                            API_URL,
                            {
                                method:
                                    "GET",

                                headers: {
                                    Accept:
                                        "application/json",
                                },
                            }
                        );


                    let result = {};

                    try {

                        result =
                            await response.json();

                    } catch {

                        result = {};

                    }


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                                t(
                                    "skills.failedFetch",
                                    "Failed to load skills."
                                )
                        );

                    }


                    setSkills(
                        Array.isArray(
                            result.data
                        )
                            ? result.data
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Fetch Skills Error:",
                        error
                    );


                    setError(
                        error.message ||
                            t(
                                "skills.unableLoad",
                                "Unable to load skills."
                            )
                    );

                } finally {

                    setLoading(false);

                }

            },
            [t]
        );


    /* =====================================================
       LOAD SKILLS
    ===================================================== */

    useEffect(() => {

        fetchSkills();

    }, [
        fetchSkills,
    ]);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (
        e
    ) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]:
                    name === "level"
                        ? Number(value)
                        : value,
            })
        );

    };


    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm = () => {

        setFormData({
            ...emptyForm,
        });

        setEditingId(null);

    };


    /* =====================================================
       CLOSE FORM
    ===================================================== */

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

        resetForm();

    };


    /* =====================================================
       ADD / UPDATE SKILL
    ===================================================== */

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        /* ---------------------------------------------
           CLEAR PREVIOUS ERROR
        --------------------------------------------- */

        setError("");


        /* ---------------------------------------------
           REQUIRED NAME
        --------------------------------------------- */

        if (
            !formData.name.trim()
        ) {

            const message =
                t(
                    "skills.requiredName",
                    "Skill name is required."
                );

            setError(message);

            return;

        }


        /* ---------------------------------------------
           REQUIRED CATEGORY
        --------------------------------------------- */

        if (
            !formData.category.trim()
        ) {

            const message =
                t(
                    "skills.requiredCategory",
                    "Category is required."
                );

            setError(message);

            return;

        }


        /* ---------------------------------------------
           LEVEL
        --------------------------------------------- */

        const level =
            Math.min(
                100,
                Math.max(
                    1,
                    Number(
                        formData.level
                    ) || 0
                )
            );


        /* ---------------------------------------------
           DATA
        --------------------------------------------- */

        const skillData = {

            name:
                formData.name.trim(),

            category:
                formData.category,

            level,

            icon:
                formData.icon &&
                formData.icon.trim()
                    ? formData.icon.trim()
                    : DEFAULT_ICON,

            description:
                formData.description &&
                formData.description.trim()
                    ? formData.description.trim()
                    : null,

            status:
                formData.status ||
                "Active",

        };


        try {

            setSaving(true);

            setError("");


            const isEditing =
                editingId !== null;


            const url =
                isEditing
                    ? `${API_URL}/${editingId}`
                    : API_URL;


            const response =
                await fetch(
                    url,
                    {

                        method:
                            isEditing
                                ? "PUT"
                                : "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",

                        },

                        body:
                            JSON.stringify(
                                skillData
                            ),

                    }
                );


            let result = {};

            try {

                result =
                    await response.json();

            } catch {

                result = {};

            }


            /* ---------------------------------------------
               API ERROR
            --------------------------------------------- */

            if (!response.ok) {

                console.error(
                    "API Validation Error:",
                    result
                );


                if (
                    result.errors
                ) {

                    const errors =
                        Object.values(
                            result.errors
                        ).flat();


                    throw new Error(
                        errors.join(" ") ||
                            result.message ||
                            t(
                                "skills.validationFailed",
                                "Validation failed."
                            )
                    );

                }


                throw new Error(
                    result.message ||
                        t(
                            "skills.failedSave",
                            "Failed to save skill."
                        )
                );

            }


            /* ---------------------------------------------
               SAVED DATA
            --------------------------------------------- */

            const savedSkill =
                result.data;


            /* ---------------------------------------------
               UPDATE
            --------------------------------------------- */

            if (
                isEditing
            ) {

                if (
                    savedSkill
                ) {

                    setSkills(
                        (previous) =>
                            previous.map(
                                (skill) =>
                                    skill.id ===
                                    editingId
                                        ? savedSkill
                                        : skill
                            )
                    );

                } else {

                    await fetchSkills();

                }

            }


            /* ---------------------------------------------
               CREATE
            --------------------------------------------- */

            else {

                if (
                    savedSkill
                ) {

                    setSkills(
                        (previous) => [
                            savedSkill,
                            ...previous,
                        ]
                    );

                } else {

                    await fetchSkills();

                }

            }


            /* ---------------------------------------------
               CLOSE FORM
            --------------------------------------------- */

            setShowForm(false);

            resetForm();


        } catch (error) {

            console.error(
                "Save Skill Error:",
                error
            );


            setError(
                error.message ||
                    t(
                        "skills.unableSave",
                        "Unable to save skill."
                    )
            );

        } finally {

            setSaving(false);

        }

    };


    /* =====================================================
       EDIT SKILL
    ===================================================== */

    const handleEdit = (
        skill
    ) => {

        setEditingId(
            skill.id
        );


        setFormData({

            name:
                skill.name || "",

            category:
                skill.category ||
                "Frontend",

            level:
                Number(
                    skill.level
                ) || 80,

            icon:
                skill.icon &&
                skill.icon.trim()
                    ? skill.icon
                    : DEFAULT_ICON,

            description:
                skill.description ||
                "",

            status:
                skill.status ||
                "Active",

        });


        setError("");

        setShowForm(true);


        window.scrollTo({

            top: 0,

            behavior:
                "smooth",

        });

    };


    /* =====================================================
       DELETE SKILL
    ===================================================== */

    const handleDelete = async (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                t(
                    "skills.deleteConfirm",
                    "Are you sure you want to delete this skill?"
                )
            );


        if (
            !confirmDelete
        ) {

            return;

        }


        try {

            setError("");


            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {

                        method:
                            "DELETE",

                        headers: {

                            Accept:
                                "application/json",

                        },

                    }
                );


            let result = {};

            try {

                result =
                    await response.json();

            } catch {

                result = {};

            }


            if (!response.ok) {

                throw new Error(
                    result.message ||
                        t(
                            "skills.failedDelete",
                            "Failed to delete skill."
                        )
                );

            }


            setSkills(
                (previousSkills) =>
                    previousSkills.filter(
                        (skill) =>
                            skill.id !== id
                    )
            );


            if (
                editingId === id
            ) {

                setShowForm(false);

                resetForm();

            }


        } catch (error) {

            console.error(
                "Delete Skill Error:",
                error
            );


            setError(
                error.message ||
                    t(
                        "skills.unableDelete",
                        "Unable to delete skill."
                    )
            );

        }

    };


    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalSkills =
        skills.length;


    const activeSkills =
        skills.filter(
            (skill) =>
                skill.status ===
                "Active"
        ).length;


    const averageLevel =
        skills.length > 0
            ? Math.round(

                skills.reduce(
                    (
                        total,
                        skill
                    ) =>
                        total +
                        Number(
                            skill.level ||
                                0
                        ),
                    0
                ) /
                    skills.length

            )
            : 0;


    /* =====================================================
       RETURN
    ===================================================== */

    return (

        <AdminLayout>

            <main
                className="skills-page"
                dir={
                    isRTL
                        ? "rtl"
                        : "ltr"
                }
            >

                <section
                    className="skills-section"
                    id="skills"
                >

                    <div
                        className="skills-container"
                    >

                        {/* =================================================
                           PAGE HEADER
                        ================================================= */}

                        <div
                            className="skills-header"
                        >

                            <div
                                className="skills-heading"
                            >

                                <span
                                    className="skills-subtitle"
                                >

                                    {t(
                                        "skills.management",
                                        "SKILLS MANAGEMENT"
                                    )}

                                </span>


                                <h1>

                                    {t(
                                        "skills.title",
                                        "Skills"
                                    )}

                                </h1>


                                <p>

                                    {t(
                                        "skills.subtitle",
                                        "Manage your professional skills."
                                    )}

                                </p>

                            </div>


                            <button
                                type="button"
                                className="add-skill-btn"
                                onClick={() => {

                                    if (
                                        showForm
                                    ) {

                                        closeForm();

                                        return;

                                    }


                                    resetForm();

                                    setError("");

                                    setShowForm(
                                        true
                                    );

                                }}
                            >

                                {showForm
                                    ? `✕ ${t(
                                          "skills.close",
                                          "Close"
                                      )}`
                                    : `+ ${t(
                                          "skills.addSkill",
                                          "Add Skill"
                                      )}`}

                            </button>

                        </div>


                        {/* =================================================
                           ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="skills-error-message"
                                role="alert"
                            >

                                {error}

                            </div>

                        )}


                        {/* =================================================
                           ADD / EDIT FORM
                        ================================================= */}

                        {showForm && (

                            <div
                                className="skill-form-card"
                            >

                                <div
                                    className="form-title"
                                >

                                    <div>

                                        <span>

                                            {editingId
                                                ? t(
                                                      "skills.updateSkill",
                                                      "UPDATE SKILL"
                                                  )
                                                : t(
                                                      "skills.createNew",
                                                      "CREATE NEW"
                                                  )}

                                        </span>


                                        <h2>

                                            {editingId
                                                ? t(
                                                      "skills.editSkill",
                                                      "Edit Skill"
                                                  )
                                                : t(
                                                      "skills.addNewSkill",
                                                      "Add New Skill"
                                                  )}

                                        </h2>


                                        <p>

                                            {editingId
                                                ? t(
                                                      "skills.updateSkillDescription",
                                                      "Update your skill information."
                                                  )
                                                : t(
                                                      "skills.addSkillDescription",
                                                      "Add a new professional skill."
                                                  )}

                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="form-close-btn"
                                        onClick={
                                            closeForm
                                        }
                                        disabled={
                                            saving
                                        }
                                    >

                                        ✕

                                    </button>

                                </div>


                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >

                                    <div
                                        className="form-grid"
                                    >

                                        {/* =================================================
                                           NAME
                                        ================================================= */}

                                        <div
                                            className="form-group"
                                        >

                                            <label>

                                                {t(
                                                    "skills.skillName",
                                                    "Skill Name"
                                                )}

                                            </label>


                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "skills.skillNamePlaceholder",
                                                    "React.js"
                                                )}
                                                required
                                            />

                                        </div>


                                        {/* =================================================
                                           CATEGORY
                                        ================================================= */}

                                        <div
                                            className="form-group"
                                        >

                                            <label>

                                                {t(
                                                    "skills.category",
                                                    "Category"
                                                )}

                                            </label>


                                            <select
                                                name="category"
                                                value={
                                                    formData.category
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option value="Frontend">

                                                    {t(
                                                        "skills.frontend",
                                                        "Frontend"
                                                    )}

                                                </option>


                                                <option value="Backend">

                                                    {t(
                                                        "skills.backend",
                                                        "Backend"
                                                    )}

                                                </option>


                                                <option value="Database">

                                                    {t(
                                                        "skills.database",
                                                        "Database"
                                                    )}

                                                </option>


                                                <option value="Mobile">

                                                    {t(
                                                        "skills.mobile",
                                                        "Mobile"
                                                    )}

                                                </option>


                                                <option value="Tools">

                                                    {t(
                                                        "skills.tools",
                                                        "Tools"
                                                    )}

                                                </option>


                                                <option value="Other">

                                                    {t(
                                                        "skills.other",
                                                        "Other"
                                                    )}

                                                </option>

                                            </select>

                                        </div>


                                        {/* =================================================
                                           LEVEL
                                        ================================================= */}

                                        <div
                                            className="form-group"
                                        >

                                            <div
                                                className="label-row"
                                            >

                                                <label>

                                                    {t(
                                                        "skills.skillLevel",
                                                        "Skill Level"
                                                    )}

                                                </label>


                                                <strong>

                                                    {
                                                        formData.level
                                                    }%

                                                </strong>

                                            </div>


                                            <input
                                                className="skill-range"
                                                type="range"
                                                name="level"
                                                min="1"
                                                max="100"
                                                value={
                                                    formData.level
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>


                                        {/* =================================================
                                           ICON
                                        ================================================= */}

                                        <div
                                            className="form-group"
                                        >

                                            <label>

                                                {t(
                                                    "skills.icon",
                                                    "Icon"
                                                )}

                                            </label>


                                            <input
                                                type="text"
                                                name="icon"
                                                value={
                                                    formData.icon
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "skills.iconPlaceholder",
                                                    "💻"
                                                )}
                                            />


                                            <small
                                                className="input-help"
                                            >

                                                {t(
                                                    "skills.iconHelp",
                                                    "You can use an emoji as the skill icon."
                                                )}

                                            </small>

                                        </div>


                                        {/* =================================================
                                           STATUS
                                        ================================================= */}

                                        <div
                                            className="form-group"
                                        >

                                            <label>

                                                {t(
                                                    "skills.status",
                                                    "Status"
                                                )}

                                            </label>


                                            <select
                                                name="status"
                                                value={
                                                    formData.status
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option value="Active">

                                                    {t(
                                                        "skills.active",
                                                        "Active"
                                                    )}

                                                </option>


                                                <option value="Inactive">

                                                    {t(
                                                        "skills.inactive",
                                                        "Inactive"
                                                    )}

                                                </option>

                                            </select>

                                        </div>

                                    </div>


                                    {/* =================================================
                                       DESCRIPTION
                                    ================================================= */}

                                    <div
                                        className="form-group full-width"
                                    >

                                        <label>

                                            {t(
                                                "skills.description",
                                                "Description"
                                            )}

                                        </label>


                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="4"
                                            placeholder={t(
                                                "skills.descriptionPlaceholder",
                                                "Write a short description..."
                                            )}
                                        />

                                    </div>


                                    {/* =================================================
                                       ACTIONS
                                    ================================================= */}

                                    <div
                                        className="form-actions"
                                    >

                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={
                                                closeForm
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            {t(
                                                "skills.cancel",
                                                "Cancel"
                                            )}

                                        </button>


                                        <button
                                            type="submit"
                                            className="save-skill-btn"
                                            disabled={
                                                saving
                                            }
                                        >

                                            {saving
                                                ? t(
                                                      "skills.saving",
                                                      "Saving..."
                                                  )
                                                : editingId
                                                ? `✓ ${t(
                                                      "skills.updateSkillButton",
                                                      "Update Skill"
                                                  )}`
                                                : `✓ ${t(
                                                      "skills.saveSkill",
                                                      "Save Skill"
                                                  )}`}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        )}


                        {/* =================================================
                           STATISTICS
                        ================================================= */}

                        <div
                            className="skills-stats"
                        >

                            {/* TOTAL */}

                            <div
                                className="skill-stat-card"
                            >

                                <div
                                    className="stat-icon"
                                >
                                    💡
                                </div>


                                <div>

                                    <span>

                                        {t(
                                            "skills.totalSkills",
                                            "Total Skills"
                                        )}

                                    </span>


                                    <strong>

                                        {
                                            totalSkills
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* ACTIVE */}

                            <div
                                className="skill-stat-card"
                            >

                                <div
                                    className="stat-icon"
                                >
                                    ✓
                                </div>


                                <div>

                                    <span>

                                        {t(
                                            "skills.activeSkills",
                                            "Active Skills"
                                        )}

                                    </span>


                                    <strong>

                                        {
                                            activeSkills
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* AVERAGE */}

                            <div
                                className="skill-stat-card"
                            >

                                <div
                                    className="stat-icon"
                                >
                                    ⚡
                                </div>


                                <div>

                                    <span>

                                        {t(
                                            "skills.averageLevel",
                                            "Average Level"
                                        )}

                                    </span>


                                    <strong>

                                        {
                                            averageLevel
                                        }%

                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                           LOADING
                        ================================================= */}

                        {loading && (

                            <div
                                className="skills-loading"
                            >

                                <div>
                                    ⏳
                                </div>

                                <span>

                                    {t(
                                        "skills.loading",
                                        "Loading skills..."
                                    )}

                                </span>

                            </div>

                        )}


                        {/* =================================================
                           SKILLS GRID
                        ================================================= */}

                        {!loading && (
                            <div
                                className="skills-grid"
                            >

                                {skills.map(
                                    (
                                        skill,
                                        index
                                    ) => (

                                        <article
                                            className="skill-card"
                                            key={
                                                skill.id
                                            }
                                            style={{
                                                "--skill-level":
                                                    `${Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            Number(
                                                                skill.level
                                                            ) || 0
                                                        )
                                                    )}%`,

                                                animationDelay:
                                                    `${index *
                                                        0.06}s`,
                                            }}
                                        >

                                            {/* SKILL TOP */}

                                            <div
                                                className="skill-top"
                                            >

                                                <div
                                                    className="skill-icon"
                                                >

                                                    {
                                                        skill.icon?.trim() ||
                                                        DEFAULT_ICON
                                                    }

                                                </div>


                                                <div
                                                    className="skill-info"
                                                >

                                                    <h3>

                                                        {
                                                            skill.name
                                                        }

                                                    </h3>


                                                    <span>

                                                        {
                                                            getCategoryLabel(
                                                                skill.category
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                <div
                                                    className="skill-percentage"
                                                >

                                                    {
                                                        Number(
                                                            skill.level
                                                        ) || 0
                                                    }%

                                                </div>

                                            </div>


                                            {/* PROGRESS */}

                                            <div
                                                className="skill-progress"
                                            >

                                                <div
                                                    className="skill-progress-bar"
                                                ></div>

                                            </div>


                                            {/* DESCRIPTION */}

                                            {skill.description && (

                                                <p
                                                    className="skill-description"
                                                >

                                                    {
                                                        skill.description
                                                    }

                                                </p>

                                            )}


                                            {/* FOOTER */}

                                            <div
                                                className="skill-footer"
                                            >

                                                <span
                                                    className={
                                                        skill.status ===
                                                        "Active"
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }
                                                >

                                                    ●{" "}

                                                    {
                                                        getStatusLabel(
                                                            skill.status
                                                        )
                                                    }

                                                </span>


                                                <div
                                                    className="skill-actions"
                                                >

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="edit-skill-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                skill
                                                            )
                                                        }
                                                    >

                                                        {t(
                                                            "skills.edit",
                                                            "Edit"
                                                        )}

                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="delete-skill-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                skill.id
                                                            )
                                                        }
                                                    >

                                                        {t(
                                                            "skills.delete",
                                                            "Delete"
                                                        )}

                                                    </button>

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>
                        )}


                        {/* =================================================
                           EMPTY STATE
                        ================================================= */}

                        {!loading &&
                            skills.length ===
                                0 && (

                                <div
                                    className="empty-skills"
                                >

                                    <div
                                        className="empty-icon"
                                    >
                                        💡
                                    </div>


                                    <h3>

                                        {t(
                                            "skills.noSkillsFound",
                                            "No skills found"
                                        )}

                                    </h3>


                                    <p>

                                        {t(
                                            "skills.noSkillsDescription",
                                            "Add your first skill to get started."
                                        )}

                                    </p>


                                    <button
                                        type="button"
                                        className="add-skill-btn"
                                        onClick={() => {

                                            resetForm();

                                            setError("");

                                            setShowForm(
                                                true
                                            );

                                        }}
                                    >

                                        +{" "}

                                        {t(
                                            "skills.addFirstSkill",
                                            "Add First Skill"
                                        )}

                                    </button>

                                </div>

                            )}

                    </div>

                </section>

            </main>

        </AdminLayout>

    );
}


export default Skills;


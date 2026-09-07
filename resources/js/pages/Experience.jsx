import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import "../../css/experience.css";
import { useLanguage } from "../LanguageContext";

function Experience() {
    const API_URL =
        "http://127.0.0.1:8000/api/experiences";

    // =====================================================
    // LANGUAGE CONTEXT
    // =====================================================

    const {
        language,
        t,
        isRTL,
    } = useLanguage();

    // =====================================================
    // EMPTY FORM
    // =====================================================

    const emptyForm = {
        company: "",
        position: "",
        location: "",
        type: "Full-time",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        status: "Active",
    };

    // =====================================================
    // STATES
    // =====================================================

    const [experiences, setExperiences] = useState([]);

    const [formData, setFormData] =
        useState(emptyForm);

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

    // =====================================================
    // RTL / LTR
    // =====================================================

    useEffect(() => {
        document.documentElement.lang =
            language;

        document.documentElement.dir =
            isRTL ? "rtl" : "ltr";
    }, [language, isRTL]);

    // =====================================================
    // FETCH EXPERIENCES
    // =====================================================

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        t(
                            "experience.failedLoad",
                            "Failed to load experiences."
                        )
                );
            }

            setExperiences(
                Array.isArray(result.data)
                    ? result.data
                    : []
            );
        } catch (err) {
            console.error(
                "Fetch Experiences Error:",
                err
            );

            setError(
                err.message ||
                    t(
                        "experience.unableLoad",
                        "Unable to load experiences. Please try again."
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {
        fetchExperiences();
    }, []);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            ...emptyForm,
        });

        setEditingId(null);
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        setShowForm(false);
        resetForm();
    };

    // =====================================================
    // MONTH TO DATE
    // 2025-01 -> 2025-01-01
    // =====================================================

    const monthToDate = (month) => {
        if (!month) {
            return null;
        }

        return `${month}-01`;
    };

    // =====================================================
    // DATE TO MONTH
    // 2025-01-01 -> 2025-01
    // =====================================================

    const dateToMonth = (date) => {
        if (!date) {
            return "";
        }

        return String(date).substring(0, 7);
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!formData.company.trim()) {
            alert(
                t(
                    "experience.requiredCompany",
                    "Please enter company name."
                )
            );

            return;
        }

        if (!formData.position.trim()) {
            alert(
                t(
                    "experience.requiredPosition",
                    "Please enter your position."
                )
            );

            return;
        }

        if (!formData.startDate) {
            alert(
                t(
                    "experience.requiredStartDate",
                    "Please select start date."
                )
            );

            return;
        }

        if (
            !formData.current &&
            !formData.endDate
        ) {
            alert(
                t(
                    "experience.requiredEndDate",
                    "Please select end date or mark Current Job."
                )
            );

            return;
        }

        if (
            formData.endDate &&
            !formData.current &&
            formData.endDate <
                formData.startDate
        ) {
            alert(
                t(
                    "experience.invalidDate",
                    "End date cannot be before start date."
                )
            );

            return;
        }

        // -------------------------------------------------
        // PAYLOAD
        // -------------------------------------------------

        const payload = {
            job_title:
                formData.position.trim(),

            company:
                formData.company.trim(),

            location:
                formData.location.trim() ||
                null,

            employment_type:
                formData.type,

            start_date:
                monthToDate(
                    formData.startDate
                ),

            end_date:
                formData.current
                    ? null
                    : monthToDate(
                          formData.endDate
                      ),

            is_current:
                Boolean(
                    formData.current
                ),

            description:
                formData.description.trim() ||
                null,

            status:
                formData.current
                    ? "Active"
                    : formData.status,
        };

        try {
            setSaving(true);
            setError("");

            const isEditing =
                editingId !== null;

            const url = isEditing
                ? `${API_URL}/${editingId}`
                : API_URL;

            const response = await fetch(url, {
                method: isEditing
                    ? "PUT"
                    : "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Accept:
                        "application/json",
                },

                body: JSON.stringify(
                    payload
                ),
            });

            const result =
                await response.json();

            if (!response.ok) {
                console.error(
                    "Experience API Response:",
                    result
                );

                if (result.errors) {
                    const firstError =
                        Object.values(
                            result.errors
                        )[0]?.[0];

                    throw new Error(
                        firstError ||
                            result.message ||
                            t(
                                "experience.validationFailed",
                                "Validation failed."
                            )
                    );
                }

                throw new Error(
                    result.message ||
                        t(
                            "experience.failedSave",
                            "Failed to save experience."
                        )
                );
            }

            if (!result.data) {
                throw new Error(
                    t(
                        "experience.savedNoData",
                        "Experience saved, but no data was returned by the server."
                    )
                );
            }

            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            if (isEditing) {
                setExperiences(
                    (prev) =>
                        prev.map(
                            (item) =>
                                Number(
                                    item.id
                                ) ===
                                Number(
                                    editingId
                                )
                                    ? result.data
                                    : item
                        )
                );

                alert(
                    t(
                        "experience.updatedSuccess",
                        "Experience updated successfully."
                    )
                );
            }

            // -------------------------------------------------
            // ADD
            // -------------------------------------------------

            else {
                setExperiences(
                    (prev) => [
                        result.data,
                        ...prev,
                    ]
                );

                alert(
                    t(
                        "experience.addedSuccess",
                        "Experience added successfully."
                    )
                );
            }

            closeForm();
        } catch (err) {
            console.error(
                "Save Experience Error:",
                err
            );

            setError(
                err.message ||
                    t(
                        "experience.unableSave",
                        "Unable to save experience. Please try again."
                    )
            );

            alert(
                err.message ||
                    t(
                        "experience.unableSave",
                        "Unable to save experience. Please try again."
                    )
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (experience) => {
        setEditingId(
            experience.id
        );

        setFormData({
            company:
                experience.company || "",

            position:
                experience.job_title || "",

            location:
                experience.location || "",

            type:
                experience.employment_type ||
                "Full-time",

            startDate:
                dateToMonth(
                    experience.start_date
                ),

            endDate:
                dateToMonth(
                    experience.end_date
                ),

            current:
                Boolean(
                    experience.is_current
                ),

            description:
                experience.description ||
                "",

            status:
                experience.status ||
                "Active",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmDelete =
            window.confirm(
                t(
                    "experience.deleteConfirm",
                    "Are you sure you want to delete this experience?"
                )
            );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        t(
                            "experience.failedDelete",
                            "Failed to delete experience."
                        )
                );
            }

            setExperiences(
                (prev) =>
                    prev.filter(
                        (item) =>
                            Number(
                                item.id
                            ) !==
                            Number(id)
                    )
            );

            alert(
                t(
                    "experience.deletedSuccess",
                    "Experience deleted successfully."
                )
            );

            if (
                editingId !== null &&
                Number(editingId) ===
                    Number(id)
            ) {
                closeForm();
            }
        } catch (err) {
            console.error(
                "Delete Experience Error:",
                err
            );

            setError(
                err.message ||
                    t(
                        "experience.unableDelete",
                        "Unable to delete experience. Please try again."
                    )
            );

            alert(
                err.message ||
                    t(
                        "experience.unableDelete",
                        "Unable to delete experience. Please try again."
                    )
            );
        }
    };

    // =====================================================
    // EMPLOYMENT TYPE TRANSLATION
    // =====================================================

    const getEmploymentType = (type) => {
        const types = {
            "Full-time":
                "experience.fullTime",

            "Part-time":
                "experience.partTime",

            Freelance:
                "experience.freelance",

            Contract:
                "experience.contract",

            Internship:
                "experience.internship",
        };

        return t(
            types[type] || "",
            type || ""
        );
    };

    // =====================================================
    // STATUS TRANSLATION
    // =====================================================

    const getStatus = (status) => {
        if (status === "Active") {
            return t(
                "experience.active",
                "Active"
            );
        }

        if (status === "Inactive") {
            return t(
                "experience.inactive",
                "Inactive"
            );
        }

        return status;
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return t(
                "experience.present",
                "Present"
            );
        }

        const value =
            String(date).substring(
                0,
                7
            );

        const [year, month] =
            value.split("-");

        if (!year || !month) {
            return String(date);
        }

        const months = [
            t(
                "experience.january",
                "January"
            ),
            t(
                "experience.february",
                "February"
            ),
            t(
                "experience.march",
                "March"
            ),
            t(
                "experience.april",
                "April"
            ),
            t(
                "experience.may",
                "May"
            ),
            t(
                "experience.june",
                "June"
            ),
            t(
                "experience.july",
                "July"
            ),
            t(
                "experience.august",
                "August"
            ),
            t(
                "experience.september",
                "September"
            ),
            t(
                "experience.october",
                "October"
            ),
            t(
                "experience.november",
                "November"
            ),
            t(
                "experience.december",
                "December"
            ),
        ];

        const monthIndex =
            Number(month) - 1;

        if (
            monthIndex < 0 ||
            monthIndex > 11
        ) {
            return String(date);
        }

        return `${months[monthIndex]} ${year}`;
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalExperience =
        experiences.length;

    const activeExperience =
        experiences.filter(
            (experience) =>
                Boolean(
                    experience.is_current
                )
        ).length;

    const completedExperience =
        experiences.filter(
            (experience) =>
                !Boolean(
                    experience.is_current
                )
        ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <AdminLayout>
            <main
                className="experience-page"
                dir={isRTL ? "rtl" : "ltr"}
            >
                <section className="experience-section">

                    <div className="experience-container">

                        {/* =========================================
                            PAGE HEADER
                        ========================================== */}

                        <div className="experience-header">

                            <div className="experience-heading">

                                <span className="experience-subtitle">
                                    {t(
                                        "experience.management",
                                        "PORTFOLIO MANAGEMENT"
                                    )}
                                </span>

                                <h1>
                                    {t(
                                        "experience.work",
                                        "Work"
                                    )}{" "}
                                    <span>
                                        {t(
                                            "experience.title",
                                            "Experience"
                                        )}
                                    </span>
                                </h1>

                                <p>
                                    {t(
                                        "experience.subtitle",
                                        "Manage your professional experience and career history."
                                    )}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="add-experience-btn"
                                onClick={() => {
                                    if (showForm) {
                                        closeForm();
                                    } else {
                                        resetForm();
                                        setShowForm(
                                            true
                                        );
                                    }
                                }}
                            >
                                {showForm
                                    ? `✕ ${t(
                                          "experience.close",
                                          "Close"
                                      )}`
                                    : `+ ${t(
                                          "experience.addExperience",
                                          "Add Experience"
                                      )}`}
                            </button>

                        </div>

                        {/* =========================================
                            ERROR
                        ========================================== */}

                        {error && (
                            <div
                                style={{
                                    marginBottom:
                                        "20px",
                                    padding:
                                        "14px 16px",
                                    borderRadius:
                                        "10px",
                                    background:
                                        "#fef2f2",
                                    border:
                                        "1px solid #fecaca",
                                    color:
                                        "#dc2626",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* =========================================
                            STATISTICS
                        ========================================== */}

                        <div className="experience-stats">

                            <div className="experience-stat-card">

                                <div className="experience-stat-icon">
                                    💼
                                </div>

                                <div>

                                    <span>
                                        {t(
                                            "experience.totalExperience",
                                            "Total Experience"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            totalExperience
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="experience-stat-card">

                                <div className="experience-stat-icon">
                                    🟢
                                </div>

                                <div>

                                    <span>
                                        {t(
                                            "experience.currentPosition",
                                            "Current Position"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            activeExperience
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="experience-stat-card">

                                <div className="experience-stat-icon">
                                    ✓
                                </div>

                                <div>

                                    <span>
                                        {t(
                                            "experience.completed",
                                            "Completed"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            completedExperience
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* =========================================
                            FORM
                        ========================================== */}

                        {showForm && (
                            <div className="experience-form-card">

                                <div className="experience-form-header">

                                    <div>

                                        <span>
                                            {editingId !==
                                            null
                                                ? t(
                                                      "experience.updateExperience",
                                                      "UPDATE EXPERIENCE"
                                                  )
                                                : t(
                                                      "experience.createNew",
                                                      "CREATE NEW"
                                                  )}
                                        </span>

                                        <h2>
                                            {editingId !==
                                            null
                                                ? t(
                                                      "experience.editExperience",
                                                      "Edit Experience"
                                                  )
                                                : t(
                                                      "experience.addNewExperience",
                                                      "Add New Experience"
                                                  )}
                                        </h2>

                                        <p>
                                            {t(
                                                "experience.formDescription",
                                                "Add your professional work experience details."
                                            )}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="experience-close-btn"
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

                                    <div className="experience-form-grid">

                                        {/* COMPANY */}

                                        <div className="experience-form-group">

                                            <label>
                                                {t(
                                                    "experience.company",
                                                    "Company Name"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="company"
                                                value={
                                                    formData.company
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "experience.companyPlaceholder",
                                                    "e.g. Google"
                                                )}
                                                required
                                            />

                                        </div>


                                        {/* POSITION */}

                                        <div className="experience-form-group">

                                            <label>
                                                {t(
                                                    "experience.position",
                                                    "Job Title / Position"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="position"
                                                value={
                                                    formData.position
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "experience.positionPlaceholder",
                                                    "e.g. Full Stack Developer"
                                                )}
                                                required
                                            />

                                        </div>


                                        {/* LOCATION */}

                                        <div className="experience-form-group">

                                            <label>
                                                {t(
                                                    "experience.location",
                                                    "Location"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="location"
                                                value={
                                                    formData.location
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "experience.locationPlaceholder",
                                                    "e.g. Kabul, Afghanistan"
                                                )}
                                            />

                                        </div>


                                        {/* EMPLOYMENT TYPE */}

                                        <div className="experience-form-group">

                                            <label>
                                                {t(
                                                    "experience.employmentType",
                                                    "Employment Type"
                                                )}
                                            </label>

                                            <select
                                                name="type"
                                                value={
                                                    formData.type
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option value="Full-time">
                                                    {t(
                                                        "experience.fullTime",
                                                        "Full-time"
                                                    )}
                                                </option>

                                                <option value="Part-time">
                                                    {t(
                                                        "experience.partTime",
                                                        "Part-time"
                                                    )}
                                                </option>

                                                <option value="Freelance">
                                                    {t(
                                                        "experience.freelance",
                                                        "Freelance"
                                                    )}
                                                </option>

                                                <option value="Contract">
                                                    {t(
                                                        "experience.contract",
                                                        "Contract"
                                                    )}
                                                </option>

                                                <option value="Internship">
                                                    {t(
                                                        "experience.internship",
                                                        "Internship"
                                                    )}
                                                </option>

                                            </select>

                                        </div>


                                        {/* START DATE */}

                                        <div className="experience-form-group">

                                            <label>
                                                {t(
                                                    "experience.startDate",
                                                    "Start Date"
                                                )}
                                            </label>

                                            <input
                                                type="month"
                                                name="startDate"
                                                value={
                                                    formData.startDate
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                        {/* END DATE */}

                                        <div className="experience-form-group">

                                            <label>
                                                {t(
                                                    "experience.endDate",
                                                    "End Date"
                                                )}
                                            </label>

                                            <input
                                                type="month"
                                                name="endDate"
                                                value={
                                                    formData.endDate
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    formData.current
                                                }
                                            />

                                        </div>

                                    </div>


                                    {/* CURRENT JOB */}

                                    <div className="current-job-box">

                                        <label className="current-job-label">

                                            <input
                                                type="checkbox"
                                                name="current"
                                                checked={
                                                    formData.current
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                            <span>
                                                {t(
                                                    "experience.currentJob",
                                                    "I currently work here"
                                                )}
                                            </span>

                                        </label>

                                        <small>
                                            {t(
                                                "experience.currentJobHelp",
                                                "Select this if this is your current position."
                                            )}
                                        </small>

                                    </div>


                                    {/* STATUS */}

                                    <div className="experience-form-group">

                                        <label>
                                            {t(
                                                "experience.status",
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
                                            disabled={
                                                formData.current
                                            }
                                        >

                                            <option value="Active">
                                                {t(
                                                    "experience.active",
                                                    "Active"
                                                )}
                                            </option>

                                            <option value="Inactive">
                                                {t(
                                                    "experience.inactive",
                                                    "Inactive"
                                                )}
                                            </option>

                                        </select>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div className="experience-form-group full-width">

                                        <label>
                                            {t(
                                                "experience.description",
                                                "Job Description"
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
                                            rows="5"
                                            placeholder={t(
                                                "experience.descriptionPlaceholder",
                                                "Describe your responsibilities, achievements and technologies you worked with..."
                                            )}
                                        />

                                    </div>


                                    {/* FORM ACTIONS */}

                                    <div className="experience-form-actions">

                                        <button
                                            type="button"
                                            className="experience-cancel-btn"
                                            onClick={
                                                closeForm
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            {t(
                                                "experience.cancel",
                                                "Cancel"
                                            )}
                                        </button>


                                        <button
                                            type="submit"
                                            className="experience-save-btn"
                                            disabled={
                                                saving
                                            }
                                        >

                                            {saving
                                                ? t(
                                                      "experience.saving",
                                                      "Saving..."
                                                  )
                                                : editingId !==
                                                  null
                                                ? `✓ ${t(
                                                      "experience.updateButton",
                                                      "Update Experience"
                                                  )}`
                                                : `+ ${t(
                                                      "experience.saveButton",
                                                      "Save Experience"
                                                  )}`}

                                        </button>

                                    </div>

                                </form>

                            </div>
                        )}


                        {/* =========================================
                            LOADING
                        ========================================== */}

                        {loading && (
                            <div
                                style={{
                                    padding:
                                        "50px 20px",
                                    textAlign:
                                        "center",
                                    color:
                                        "#6b7280",
                                }}
                            >
                                {t(
                                    "experience.loading",
                                    "Loading experiences..."
                                )}
                            </div>
                        )}


                        {/* =========================================
                            EXPERIENCE LIST
                        ========================================== */}

                        {!loading &&
                            experiences.length >
                                0 && (
                                <div className="experience-list">

                                    {experiences.map(
                                        (
                                            experience,
                                            index
                                        ) => (
                                            <article
                                                className="experience-card"
                                                key={
                                                    experience.id
                                                }
                                            >

                                                {/* TIMELINE */}

                                                <div className="experience-timeline">

                                                    <div className="experience-timeline-dot">

                                                        <span>
                                                            💼
                                                        </span>

                                                    </div>

                                                    {index !==
                                                        experiences.length -
                                                            1 && (
                                                        <div className="experience-timeline-line"></div>
                                                    )}

                                                </div>


                                                {/* CONTENT */}

                                                <div className="experience-content">

                                                    {/* TOP */}

                                                    <div className="experience-card-top">

                                                        <div>

                                                            <span className="experience-company">
                                                                {
                                                                    experience.company
                                                                }
                                                            </span>

                                                            <h2>
                                                                {
                                                                    experience.job_title
                                                                }
                                                            </h2>

                                                        </div>


                                                        <span
                                                            className={
                                                                experience.is_current
                                                                    ? "experience-status current"
                                                                    : "experience-status completed"
                                                            }
                                                        >

                                                            ●{" "}

                                                            {experience.is_current
                                                                ? t(
                                                                      "experience.current",
                                                                      "Current"
                                                                  )
                                                                : t(
                                                                      "experience.completedStatus",
                                                                      "Completed"
                                                                  )}

                                                        </span>

                                                    </div>


                                                    {/* META */}

                                                    <div className="experience-meta">

                                                        <span>
                                                            📍{" "}
                                                            {experience.location ||
                                                                t(
                                                                    "experience.locationNotSpecified",
                                                                    "Location not specified"
                                                                )}
                                                        </span>

                                                        <span>
                                                            💼{" "}
                                                            {getEmploymentType(
                                                                experience.employment_type
                                                            )}
                                                        </span>

                                                        <span>
                                                            📅{" "}
                                                            {formatDate(
                                                                experience.start_date
                                                            )}

                                                            {" — "}

                                                            {experience.is_current
                                                                ? t(
                                                                      "experience.present",
                                                                      "Present"
                                                                  )
                                                                : formatDate(
                                                                      experience.end_date
                                                                  )}
                                                        </span>

                                                    </div>


                                                    {/* DESCRIPTION */}

                                                    {experience.description && (
                                                        <p className="experience-description">
                                                            {
                                                                experience.description
                                                            }
                                                        </p>
                                                    )}


                                                    {/* FOOTER */}

                                                    <div className="experience-card-footer">

                                                        <div className="experience-tags">

                                                            <span>
                                                                {getEmploymentType(
                                                                    experience.employment_type
                                                                )}
                                                            </span>

                                                            <span>
                                                                {experience.is_current
                                                                    ? t(
                                                                          "experience.currentlyWorking",
                                                                          "Currently Working"
                                                                      )
                                                                    : t(
                                                                          "experience.previousExperience",
                                                                          "Previous Experience"
                                                                      )}
                                                            </span>

                                                        </div>


                                                        <div className="experience-actions">

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                className="experience-edit-btn"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        experience
                                                                    )
                                                                }
                                                            >
                                                                ✏️{" "}
                                                                {t(
                                                                    "experience.edit",
                                                                    "Edit"
                                                                )}
                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                className="experience-delete-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        experience.id
                                                                    )
                                                                }
                                                            >
                                                                🗑{" "}
                                                                {t(
                                                                    "experience.delete",
                                                                    "Delete"
                                                                )}
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            </article>
                                        )
                                    )}

                                </div>
                            )}


                        {/* =========================================
                            EMPTY STATE
                        ========================================== */}

                        {!loading &&
                            experiences.length ===
                                0 && (
                                <div className="experience-empty">

                                    <div className="experience-empty-icon">
                                        💼
                                    </div>

                                    <h3>
                                        {t(
                                            "experience.noExperience",
                                            "No Experience Added"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "experience.noExperienceDescription",
                                            "Your database does not contain any experience yet."
                                        )}
                                    </p>

                                    <button
                                        type="button"
                                        className="add-experience-btn"
                                        onClick={() => {
                                            resetForm();

                                            setShowForm(
                                                true
                                            );
                                        }}
                                    >
                                        +{" "}
                                        {t(
                                            "experience.addExperience",
                                            "Add Experience"
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

export default Experience;
import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import "../../css/education.css";
import { useLanguage } from "../LanguageContext";

function Education() {
    const { t, language, isRTL } = useLanguage();

    const API_URL =
        "http://127.0.0.1:8000/api/educations";

    /* =====================================================
       EMPTY FORM
    ===================================================== */

    const emptyForm = {
        degree: "",
        institution: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        status: "Active",
    };

    /* =====================================================
       STATES
    ===================================================== */

    const [educations, setEducations] = useState([]);

    const [formData, setFormData] =
        useState({ ...emptyForm });

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

    const [success, setSuccess] =
        useState("");

    /* =====================================================
       RTL / LTR
    ===================================================== */

    useEffect(() => {
        document.documentElement.lang =
            language;

        document.documentElement.dir =
            isRTL ? "rtl" : "ltr";
    }, [language, isRTL]);

    /* =====================================================
       FETCH EDUCATIONS
    ===================================================== */

    const fetchEducations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL, {
                method: "GET",

                headers: {
                    Accept:
                        "application/json",
                },
            });

            const text =
                await response.text();

            let result = {};

            try {
                result = text
                    ? JSON.parse(text)
                    : {};
            } catch {
                throw new Error(
                    t(
                        "education.invalidResponse",
                        "Laravel returned an invalid response."
                    )
                );
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        t(
                            "education.loadFailed",
                            "Failed to load education records."
                        )
                );
            }

            setEducations(
                Array.isArray(result.data)
                    ? result.data
                    : []
            );

        } catch (err) {
            console.error(
                "FETCH EDUCATION ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "education.loadError",
                        "Unable to load education records."
                    )
            );

        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchEducations();
    }, []);

    /* =====================================================
       HANDLE INPUT
    ===================================================== */

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

        setError("");
        setSuccess("");
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
        setShowForm(false);

        resetForm();

        setError("");
        setSuccess("");
    };

    /* =====================================================
       NORMALIZE DATE
    ===================================================== */

    const normalizeDate = (value) => {
        if (!value) {
            return null;
        }

        const stringValue =
            String(value).trim();

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                stringValue
            )
        ) {
            return stringValue;
        }

        if (
            /^\d{4}-\d{2}-\d{2}T/.test(
                stringValue
            )
        ) {
            return stringValue.substring(
                0,
                10
            );
        }

        return null;
    };

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (value) => {
        if (!value) {
            return t(
                "education.present",
                "Present"
            );
        }

        const dateValue =
            normalizeDate(value);

        if (!dateValue) {
            return String(value);
        }

        const date =
            new Date(
                `${dateValue}T00:00:00`
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return dateValue;
        }

        let locale = "en-US";

        if (language === "ps") {
            locale = "ps-AF";
        } else if (language === "fa") {
            locale = "fa-AF";
        }

        return date.toLocaleDateString(
            locale,
            {
                year: "numeric",
                month: "long",
            }
        );
    };

    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        /* ================= VALIDATION ================= */

        if (!formData.degree.trim()) {
            setError(
                t(
                    "education.degreeRequired",
                    "Please enter your degree."
                )
            );

            return;
        }

        if (
            !formData.institution.trim()
        ) {
            setError(
                t(
                    "education.institutionRequired",
                    "Please enter institution name."
                )
            );

            return;
        }

        if (!formData.field.trim()) {
            setError(
                t(
                    "education.fieldRequired",
                    "Please enter your field of study."
                )
            );

            return;
        }

        if (!formData.startDate) {
            setError(
                t(
                    "education.startDateRequired",
                    "Please select Start Date."
                )
            );

            return;
        }

        if (
            !formData.current &&
            !formData.endDate
        ) {
            setError(
                t(
                    "education.endDateRequired",
                    "Please select End Date or mark Currently Studying."
                )
            );

            return;
        }

        const startDate =
            normalizeDate(
                formData.startDate
            );

        const endDate =
            formData.current
                ? null
                : normalizeDate(
                      formData.endDate
                  );

        if (!startDate) {
            setError(
                t(
                    "education.invalidStartDate",
                    "Please select a valid Start Date."
                )
            );

            return;
        }

        if (
            !formData.current &&
            !endDate
        ) {
            setError(
                t(
                    "education.invalidEndDate",
                    "Please select a valid End Date."
                )
            );

            return;
        }

        if (
            endDate &&
            endDate < startDate
        ) {
            setError(
                t(
                    "education.dateOrderError",
                    "End date cannot be before start date."
                )
            );

            return;
        }

        /* ================= API DATA ================= */

        const educationData = {
            degree:
                formData.degree.trim(),

            institution:
                formData.institution.trim(),

            field_of_study:
                formData.field.trim(),

            location:
                formData.location.trim() ||
                null,

            start_date:
                startDate,

            end_date:
                endDate,

            is_current:
                formData.current === true,

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

            const isEditing =
                editingId !== null;

            const url = isEditing
                ? `${API_URL}/${editingId}`
                : API_URL;

            const response =
                await fetch(url, {
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
                        educationData
                    ),
                });

            const responseText =
                await response.text();

            let result = {};

            try {
                result =
                    responseText
                        ? JSON.parse(
                              responseText
                          )
                        : {};
            } catch {
                throw new Error(
                    t(
                        "education.invalidResponse",
                        "Laravel returned an invalid response."
                    )
                );
            }

            /* ================= 422 ================= */

            if (
                response.status === 422
            ) {
                if (result.errors) {
                    const messages =
                        Object.values(
                            result.errors
                        )
                            .flat()
                            .join("\n");

                    throw new Error(
                        messages
                    );
                }

                throw new Error(
                    result.message ||
                        t(
                            "education.validationFailed",
                            "Validation failed."
                        )
                );
            }

            /* ================= SERVER ERROR ================= */

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        `${t(
                            "education.requestFailed",
                            "Request failed with status"
                        )} ${response.status}.`
                );
            }

            if (!result.data) {
                throw new Error(
                    t(
                        "education.noSavedRecord",
                        "Laravel did not return the saved education record."
                    )
                );
            }

            /* ================= SUCCESS ================= */

            setSuccess(
                isEditing
                    ? t(
                          "education.updatedSuccess",
                          "Education updated successfully."
                      )
                    : t(
                          "education.addedSuccess",
                          "Education added successfully."
                      )
            );

            await fetchEducations();

            setShowForm(false);

            resetForm();

        } catch (err) {
            console.error(
                "SAVE EDUCATION ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "education.saveError",
                        "Unable to save education."
                    )
            );

        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (education) => {
        setError("");
        setSuccess("");

        setEditingId(
            education.id
        );

        setFormData({
            degree:
                education.degree || "",

            institution:
                education.institution || "",

            field:
                education.field_of_study ||
                "",

            location:
                education.location || "",

            startDate:
                normalizeDate(
                    education.start_date
                ) || "",

            endDate:
                normalizeDate(
                    education.end_date
                ) || "",

            current:
                Boolean(
                    education.is_current
                ),

            description:
                education.description ||
                "",

            status:
                education.status ||
                "Active",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                t(
                    "education.deleteConfirm",
                    "Are you sure you want to delete this education?"
                )
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

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

            const text =
                await response.text();

            let result = {};

            try {
                result = text
                    ? JSON.parse(text)
                    : {};
            } catch {
                result = {};
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        t(
                            "education.deleteFailed",
                            "Failed to delete education."
                        )
                );
            }

            setSuccess(
                t(
                    "education.deletedSuccess",
                    "Education deleted successfully."
                )
            );

            await fetchEducations();

            if (
                editingId !== null &&
                Number(editingId) ===
                    Number(id)
            ) {
                setShowForm(false);

                resetForm();
            }

        } catch (err) {
            console.error(
                "DELETE EDUCATION ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "education.deleteError",
                        "Unable to delete education."
                    )
            );
        }
    };

    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalEducation =
        educations.length;

    const currentEducation =
        educations.filter(
            (education) =>
                Boolean(
                    education.is_current
                )
        ).length;

    const completedEducation =
        educations.filter(
            (education) =>
                !Boolean(
                    education.is_current
                )
        ).length;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <AdminLayout>

            <main
                className="education-page"
                dir={
                    isRTL
                        ? "rtl"
                        : "ltr"
                }
            >

                <section className="education-section">

                    <div className="education-container">

                        {/* ================= HEADER ================= */}

                        <div className="education-header">

                            <div className="education-heading">

                                <span className="education-subtitle">
                                    {t(
                                        "education.portfolioManagement",
                                        "PORTFOLIO MANAGEMENT"
                                    )}
                                </span>

                                <h1>
                                    {t(
                                        "education.my",
                                        "My"
                                    )}{" "}

                                    <span>
                                        {t(
                                            "education.education",
                                            "Education"
                                        )}
                                    </span>
                                </h1>

                                <p>
                                    {t(
                                        "education.manageDescription",
                                        "Manage your academic background and educational achievements."
                                    )}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="add-education-btn"
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
                                          "common.close",
                                          "Close"
                                      )}`
                                    : `+ ${t(
                                          "education.addEducation",
                                          "Add Education"
                                      )}`}
                            </button>

                        </div>

                        {/* ================= SUCCESS ================= */}

                        {success && (
                            <div className="education-success-message">
                                ✓ {success}
                            </div>
                        )}

                        {/* ================= ERROR ================= */}

                        {error && (
                            <div className="education-error-message">
                                {error}
                            </div>
                        )}

                        {/* ================= STATS ================= */}

                        <div className="education-stats">

                            <div className="education-stat-card">

                                <div className="education-stat-icon">
                                    🎓
                                </div>

                                <div>

                                    <span>
                                        {t(
                                            "education.totalEducation",
                                            "Total Education"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            totalEducation
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="education-stat-card">

                                <div className="education-stat-icon">
                                    📚
                                </div>

                                <div>

                                    <span>
                                        {t(
                                            "education.currentlyStudying",
                                            "Currently Studying"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            currentEducation
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="education-stat-card">

                                <div className="education-stat-icon">
                                    ✓
                                </div>

                                <div>

                                    <span>
                                        {t(
                                            "education.completed",
                                            "Completed"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            completedEducation
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* ================= FORM ================= */}

                        {showForm && (
                            <div className="education-form-card">

                                <div className="education-form-header">

                                    <div>

                                        <span>
                                            {editingId !==
                                            null
                                                ? t(
                                                      "education.updateEducation",
                                                      "UPDATE EDUCATION"
                                                  )
                                                : t(
                                                      "education.createNew",
                                                      "CREATE NEW"
                                                  )}
                                        </span>

                                        <h2>
                                            {editingId !==
                                            null
                                                ? t(
                                                      "education.editEducation",
                                                      "Edit Education"
                                                  )
                                                : t(
                                                      "education.addNewEducation",
                                                      "Add New Education"
                                                  )}
                                        </h2>

                                        <p>
                                            {t(
                                                "education.enterAcademicInfo",
                                                "Enter your academic information below."
                                            )}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="education-close-btn"
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

                                    <div className="education-form-grid">

                                        {/* DEGREE */}

                                        <div className="education-form-group">

                                            <label>
                                                {t(
                                                    "education.degreeQualification",
                                                    "Degree / Qualification"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="degree"
                                                value={
                                                    formData.degree
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "education.degreePlaceholder",
                                                    "e.g. Bachelor's Degree"
                                                )}
                                                required
                                            />

                                        </div>


                                        {/* INSTITUTION */}

                                        <div className="education-form-group">

                                            <label>
                                                {t(
                                                    "education.institutionUniversity",
                                                    "Institution / University"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="institution"
                                                value={
                                                    formData.institution
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "education.institutionPlaceholder",
                                                    "e.g. Ghazni University"
                                                )}
                                                required
                                            />

                                        </div>


                                        {/* FIELD */}

                                        <div className="education-form-group">

                                            <label>
                                                {t(
                                                    "education.fieldOfStudy",
                                                    "Field of Study"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="field"
                                                value={
                                                    formData.field
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "education.fieldPlaceholder",
                                                    "e.g. Computer Science"
                                                )}
                                                required
                                            />

                                        </div>


                                        {/* LOCATION */}

                                        <div className="education-form-group">

                                            <label>
                                                {t(
                                                    "education.location",
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
                                                    "education.locationPlaceholder",
                                                    "e.g. Ghazni, Afghanistan"
                                                )}
                                            />

                                        </div>


                                        {/* START DATE */}

                                        <div className="education-form-group">

                                            <label>
                                                {t(
                                                    "education.startDate",
                                                    "Start Date"
                                                )}
                                            </label>

                                            <input
                                                type="date"
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

                                        <div className="education-form-group">

                                            <label>
                                                {t(
                                                    "education.endDate",
                                                    "End Date"
                                                )}
                                            </label>

                                            <input
                                                type="date"
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


                                    {/* CURRENTLY STUDYING */}

                                    <div className="currently-studying-box">

                                        <label className="currently-studying-label">

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
                                                    "education.currentlyStudyingHere",
                                                    "I am currently studying here"
                                                )}
                                            </span>

                                        </label>

                                        <small>
                                            {t(
                                                "education.currentlyStudyingHelp",
                                                "Check this option if you are currently studying at this institution."
                                            )}
                                        </small>

                                    </div>


                                    {/* STATUS */}

                                    <div className="education-form-group">

                                        <label>
                                            {t(
                                                "common.status",
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
                                                    "common.active",
                                                    "Active"
                                                )}
                                            </option>

                                            <option value="Inactive">
                                                {t(
                                                    "common.inactive",
                                                    "Inactive"
                                                )}
                                            </option>

                                        </select>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div className="education-form-group full-width">

                                        <label>
                                            {t(
                                                "common.description",
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
                                            rows="5"
                                            placeholder={t(
                                                "education.descriptionPlaceholder",
                                                "Write a short description about your education..."
                                            )}
                                        />

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="education-form-actions">

                                        <button
                                            type="button"
                                            className="education-cancel-btn"
                                            onClick={
                                                closeForm
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            {t(
                                                "common.cancel",
                                                "Cancel"
                                            )}
                                        </button>


                                        <button
                                            type="submit"
                                            className="education-save-btn"
                                            disabled={
                                                saving
                                            }
                                        >

                                            {saving
                                                ? t(
                                                      "common.saving",
                                                      "Saving..."
                                                  )
                                                : editingId !==
                                                  null
                                                ? `✓ ${t(
                                                      "education.updateEducation",
                                                      "Update Education"
                                                  )}`
                                                : `+ ${t(
                                                      "education.saveEducation",
                                                      "Save Education"
                                                  )}`}

                                        </button>

                                    </div>

                                </form>

                            </div>
                        )}


                        {/* ================= LOADING ================= */}

                        {loading && (
                            <div className="education-loading">
                                {t(
                                    "education.loading",
                                    "Loading education..."
                                )}
                            </div>
                        )}


                        {/* ================= LIST ================= */}

                        {!loading &&
                            educations.length >
                                0 && (
                                <div className="education-list">

                                    {educations.map(
                                        (
                                            education,
                                            index
                                        ) => (

                                            <article
                                                className="education-card"
                                                key={
                                                    education.id
                                                }
                                            >

                                                {/* TIMELINE */}

                                                <div className="education-timeline">

                                                    <div className="education-timeline-dot">
                                                        🎓
                                                    </div>

                                                    {index !==
                                                        educations.length -
                                                            1 && (
                                                        <div className="education-timeline-line"></div>
                                                    )}

                                                </div>


                                                {/* CONTENT */}

                                                <div className="education-content">

                                                    {/* TOP */}

                                                    <div className="education-card-top">

                                                        <div>

                                                            <span className="education-institution">
                                                                {
                                                                    education.institution
                                                                }
                                                            </span>

                                                            <h2>
                                                                {
                                                                    education.degree
                                                                }
                                                            </h2>

                                                            <h3>
                                                                {
                                                                    education.field_of_study
                                                                }
                                                            </h3>

                                                        </div>


                                                        <span
                                                            className={
                                                                education.is_current
                                                                    ? "education-status current"
                                                                    : "education-status completed"
                                                            }
                                                        >

                                                            ●{" "}

                                                            {education.is_current
                                                                ? t(
                                                                      "education.currentlyStudying",
                                                                      "Currently Studying"
                                                                  )
                                                                : t(
                                                                      "education.completed",
                                                                      "Completed"
                                                                  )}

                                                        </span>

                                                    </div>


                                                    {/* META */}

                                                    <div className="education-meta">

                                                        <span>
                                                            📍{" "}

                                                            {
                                                                education.location ||
                                                                t(
                                                                    "education.locationNotSpecified",
                                                                    "Location not specified"
                                                                )
                                                            }

                                                        </span>

                                                        <span>
                                                            📅{" "}

                                                            {formatDate(
                                                                education.start_date
                                                            )}

                                                            {" — "}

                                                            {education.is_current
                                                                ? t(
                                                                      "education.present",
                                                                      "Present"
                                                                  )
                                                                : formatDate(
                                                                      education.end_date
                                                                  )}

                                                        </span>

                                                    </div>


                                                    {/* DESCRIPTION */}

                                                    {education.description && (
                                                        <p className="education-description">
                                                            {
                                                                education.description
                                                            }
                                                        </p>
                                                    )}


                                                    {/* FOOTER */}

                                                    <div className="education-card-footer">

                                                        <div className="education-tags">

                                                            <span>
                                                                {
                                                                    education.field_of_study
                                                                }
                                                            </span>

                                                            <span>
                                                                {education.is_current
                                                                    ? t(
                                                                          "education.inProgress",
                                                                          "In Progress"
                                                                      )
                                                                    : t(
                                                                          "education.completed",
                                                                          "Completed"
                                                                      )}
                                                            </span>

                                                        </div>


                                                        <div className="education-actions">

                                                            <button
                                                                type="button"
                                                                className="education-edit-btn"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        education
                                                                    )
                                                                }
                                                            >
                                                                ✏️{" "}
                                                                {t(
                                                                    "common.edit",
                                                                    "Edit"
                                                                )}
                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="education-delete-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        education.id
                                                                    )
                                                                }
                                                            >
                                                                🗑{" "}
                                                                {t(
                                                                    "common.delete",
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


                        {/* ================= EMPTY ================= */}

                        {!loading &&
                            educations.length ===
                                0 && (
                                <div className="education-empty">

                                    <div className="education-empty-icon">
                                        🎓
                                    </div>

                                    <h3>
                                        {t(
                                            "education.noEducationAdded",
                                            "No Education Added"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "education.noEducationDescription",
                                            "You have not added any education records yet."
                                        )}
                                    </p>

                                    <button
                                        type="button"
                                        className="add-education-btn"
                                        onClick={() => {

                                            resetForm();

                                            setShowForm(
                                                true
                                            );

                                        }}
                                    >
                                        +{" "}

                                        {t(
                                            "education.addEducation",
                                            "Add Education"
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

export default Education;
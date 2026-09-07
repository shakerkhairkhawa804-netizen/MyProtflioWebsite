import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import "../../css/certifications.css";
import { useLanguage } from "../LanguageContext";

const API_URL =
    "http://127.0.0.1:8000/api/certifications";

const emptyForm = {
    name: "",
    organization: "",
    credentialId: "",
    credentialUrl: "",
    issueDate: "",
    expiryDate: "",
    noExpiry: true,
    description: "",
    status: "Active",
};

function Certifications() {
    const { t, language, isRTL } = useLanguage();

    const [certifications, setCertifications] =
        useState([]);

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

    const [deletingId, setDeletingId] =
        useState(null);

    const [error, setError] =
        useState("");

    // =====================================================
    // LANGUAGE + RTL
    // =====================================================

    useEffect(() => {
        document.documentElement.lang = language;

        document.documentElement.dir = isRTL
            ? "rtl"
            : "ltr";
    }, [language, isRTL]);

    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem(
            "fitzone_token"
        );
    };

    // =====================================================
    // FETCH CERTIFICATIONS
    // =====================================================

    const fetchCertifications = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            const response = await fetch(API_URL, {
                method: "GET",

                headers: {
                    Accept: "application/json",

                    ...(token
                        ? {
                              Authorization:
                                  `Bearer ${token}`,
                          }
                        : {}),
                },
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t(
                            "certifications.loadFailed"
                        )
                );
            }

            const certificationData =
                Array.isArray(data.data)
                    ? data.data
                    : data.data?.data || [];

            setCertifications(
                certificationData
            );
        } catch (err) {
            console.error(
                "FETCH CERTIFICATIONS ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "certifications.loadError"
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        fetchCertifications();
    }, []);

    // =====================================================
    // HANDLE CHANGE
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
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {
        setEditingId(null);

        setFormData({
            ...emptyForm,
        });

        setError("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!formData.name.trim()) {
            setError(
                t(
                    "certifications.nameRequired"
                )
            );
            return;
        }

        if (!formData.organization.trim()) {
            setError(
                t(
                    "certifications.organizationRequired"
                )
            );
            return;
        }

        if (!formData.issueDate) {
            setError(
                t(
                    "certifications.issueDateRequired"
                )
            );
            return;
        }

        // =================================================
        // EXPIRY VALIDATION
        // =================================================

        if (
            !formData.noExpiry &&
            !formData.expiryDate
        ) {
            setError(
                t(
                    "certifications.expiryDateRequired"
                )
            );
            return;
        }

        // =================================================
        // DATE VALIDATION
        // =================================================

        if (
            formData.expiryDate &&
            !formData.noExpiry &&
            formData.expiryDate <
                formData.issueDate
        ) {
            setError(
                t(
                    "certifications.expiryBeforeIssue"
                )
            );
            return;
        }

        // =================================================
        // URL VALIDATION
        // =================================================

        if (
            formData.credentialUrl.trim()
        ) {
            try {
                const url =
                    new URL(
                        formData.credentialUrl.trim()
                    );

                if (
                    url.protocol !==
                        "http:" &&
                    url.protocol !==
                        "https:"
                ) {
                    setError(
                        t(
                            "certifications.urlProtocol"
                        )
                    );
                    return;
                }
            } catch {
                setError(
                    t(
                        "certifications.invalidUrl"
                    )
                );
                return;
            }
        }

        // =================================================
        // API PAYLOAD
        // =================================================

        const payload = {
            name:
                formData.name.trim(),

            organization:
                formData.organization.trim(),

            credential_id:
                formData.credentialId.trim() ||
                null,

            credential_url:
                formData.credentialUrl.trim() ||
                null,

            issue_date:
                formData.issueDate,

            expiry_date:
                formData.noExpiry
                    ? null
                    : formData.expiryDate,

            no_expiry:
                formData.noExpiry,

            description:
                formData.description.trim() ||
                null,

            status:
                formData.status ===
                    "Expired"
                    ? "Inactive"
                    : "Active",
        };

        console.log(
            "CERTIFICATION PAYLOAD:",
            payload
        );

        // =================================================
        // SAVE
        // =================================================

        try {
            setSaving(true);

            const token = getToken();

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            const response =
                await fetch(url, {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",

                        ...(token
                            ? {
                                  Authorization:
                                      `Bearer ${token}`,
                              }
                            : {}),
                    },

                    body: JSON.stringify(
                        payload
                    ),
                });

            const data =
                await response.json();

            console.log(
                "SAVE RESPONSE:",
                data
            );

            // =================================================
            // VALIDATION ERROR
            // =================================================

            if (!response.ok) {
                console.error(
                    "SAVE ERROR:",
                    data
                );

                if (data.errors) {
                    const validationMessages =
                        Object.values(
                            data.errors
                        )
                            .flat()
                            .join(" ");

                    throw new Error(
                        validationMessages
                    );
                }

                throw new Error(
                    data.message ||
                        t(
                            "certifications.saveFailed"
                        )
                );
            }

            // =================================================
            // SUCCESS
            // =================================================

            await fetchCertifications();

            closeForm();

            alert(
                editingId
                    ? t(
                          "certifications.updatedSuccess"
                      )
                    : t(
                          "certifications.addedSuccess"
                      )
            );
        } catch (err) {
            console.error(
                "SAVE CERTIFICATION ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "certifications.saveError"
                    )
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (
        certification
    ) => {
        setEditingId(
            certification.id
        );

        setFormData({
            name:
                certification.name ||
                "",

            organization:
                certification.organization ||
                "",

            credentialId:
                certification.credential_id ||
                "",

            credentialUrl:
                certification.credential_url ||
                "",

            issueDate:
                certification.issue_date
                    ? certification.issue_date.substring(
                          0,
                          10
                      )
                    : "",

            expiryDate:
                certification.expiry_date
                    ? certification.expiry_date.substring(
                          0,
                          10
                      )
                    : "",

            noExpiry:
                Boolean(
                    certification.no_expiry
                ),

            description:
                certification.description ||
                "",

            status:
                certification.status ===
                    "Inactive"
                    ? "Expired"
                    : "Active",
        });

        setError("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (
        id
    ) => {
        const confirmDelete =
            window.confirm(
                t(
                    "certifications.deleteConfirm"
                )
            );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingId(id);

            setError("");

            const token = getToken();

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Accept:
                                "application/json",

                            ...(token
                                ? {
                                      Authorization:
                                          `Bearer ${token}`,
                                  }
                                : {}),
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t(
                            "certifications.deleteFailed"
                        )
                );
            }

            setCertifications(
                (prev) =>
                    prev.filter(
                        (
                            certification
                        ) =>
                            certification.id !==
                            id
                    )
            );

            alert(
                t(
                    "certifications.deletedSuccess"
                )
            );
        } catch (err) {
            console.error(
                "DELETE CERTIFICATION ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "certifications.deleteError"
                    )
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        setShowForm(false);

        setEditingId(null);

        setFormData({
            ...emptyForm,
        });

        setError("");
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return t(
                "certifications.notAvailable"
            );
        }

        const datePart =
            date.substring(0, 10);

        const [
            year,
            month,
            day,
        ] = datePart.split("-");

        const months = [
            t("certifications.january"),
            t("certifications.february"),
            t("certifications.march"),
            t("certifications.april"),
            t("certifications.may"),
            t("certifications.june"),
            t("certifications.july"),
            t("certifications.august"),
            t("certifications.september"),
            t("certifications.october"),
            t("certifications.november"),
            t("certifications.december"),
        ];

        const monthIndex =
            Number(month) - 1;

        if (
            !year ||
            !month ||
            !day ||
            !months[monthIndex]
        ) {
            return date;
        }

        return `${months[monthIndex]} ${day}, ${year}`;
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalCertifications =
        certifications.length;

    const activeCertifications =
        certifications.filter(
            (certification) =>
                certification.status ===
                "Active"
        ).length;

    const noExpiryCertifications =
        certifications.filter(
            (certification) =>
                Boolean(
                    certification.no_expiry
                )
        ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <AdminLayout>

            <main
                className="certifications-page"
                dir={
                    isRTL
                        ? "rtl"
                        : "ltr"
                }
            >

                <section className="certifications-section">

                    <div className="certifications-container">

                        {/* PAGE HEADER */}

                        <div className="certifications-header">

                            <div className="certifications-heading">

                                <span className="certifications-subtitle">
                                    {t(
                                        "certifications.portfolioManagement"
                                    )}
                                </span>

                                <h1>
                                    {t(
                                        "certifications.my"
                                    )}{" "}
                                    <span>
                                        {t(
                                            "certifications.certifications"
                                        )}
                                    </span>
                                </h1>

                                <p>
                                    {t(
                                        "certifications.manageDescription"
                                    )}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="add-certification-btn"
                                onClick={
                                    showForm
                                        ? closeForm
                                        : openAddForm
                                }
                            >
                                {showForm
                                    ? `✕ ${t(
                                          "common.close"
                                      )}`
                                    : `+ ${t(
                                          "certifications.addCertification"
                                      )}`}
                            </button>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="certification-error">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* STATISTICS */}

                        <div className="certification-stats">

                            <div className="certification-stat-card">

                                <div className="certification-stat-icon">
                                    🏆
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "certifications.totalCertifications"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            totalCertifications
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="certification-stat-card">

                                <div className="certification-stat-icon">
                                    ✓
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "common.active"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            activeCertifications
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="certification-stat-card">

                                <div className="certification-stat-icon">
                                    ♾️
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "certifications.noExpiration"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            noExpiryCertifications
                                        }
                                    </strong>
                                </div>

                            </div>

                        </div>

                        {/* FORM */}

                        {showForm && (

                            <div className="certification-form-card">

                                <div className="certification-form-header">

                                    <div>

                                        <span>
                                            {editingId
                                                ? t(
                                                      "certifications.updateCertification"
                                                  )
                                                : t(
                                                      "certifications.createNew"
                                                  )}
                                        </span>

                                        <h2>
                                            {editingId
                                                ? t(
                                                      "certifications.editCertification"
                                                  )
                                                : t(
                                                      "certifications.addNewCertification"
                                                  )}
                                        </h2>

                                        <p>
                                            {t(
                                                "certifications.enterInformation"
                                            )}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="certification-close-btn"
                                        onClick={
                                            closeForm
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

                                    <div className="certification-form-grid">

                                        {/* NAME */}

                                        <div className="certification-form-group">

                                            <label>
                                                {t(
                                                    "certifications.certificationName"
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
                                                    "certifications.namePlaceholder"
                                                )}
                                                required
                                            />

                                        </div>

                                        {/* ORGANIZATION */}

                                        <div className="certification-form-group">

                                            <label>
                                                {t(
                                                    "certifications.issuingOrganization"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="organization"
                                                value={
                                                    formData.organization
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "certifications.organizationPlaceholder"
                                                )}
                                                required
                                            />

                                        </div>

                                        {/* CREDENTIAL ID */}

                                        <div className="certification-form-group">

                                            <label>
                                                {t(
                                                    "certifications.credentialId"
                                                )}
                                            </label>

                                            <input
                                                type="text"
                                                name="credentialId"
                                                value={
                                                    formData.credentialId
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "certifications.credentialIdPlaceholder"
                                                )}
                                            />

                                        </div>

                                        {/* CREDENTIAL URL */}

                                        <div className="certification-form-group">

                                            <label>
                                                {t(
                                                    "certifications.credentialUrl"
                                                )}
                                            </label>

                                            <input
                                                type="url"
                                                name="credentialUrl"
                                                value={
                                                    formData.credentialUrl
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder={t(
                                                    "certifications.credentialUrlPlaceholder"
                                                )}
                                            />

                                        </div>

                                        {/* ISSUE DATE */}

                                        <div className="certification-form-group">

                                            <label>
                                                {t(
                                                    "certifications.issueDate"
                                                )}
                                            </label>

                                            <input
                                                type="date"
                                                name="issueDate"
                                                value={
                                                    formData.issueDate
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                            <small>
                                                {t(
                                                    "certifications.issueDateHelp"
                                                )}
                                            </small>

                                        </div>

                                        {/* EXPIRY DATE */}

                                        <div className="certification-form-group">

                                            <label>
                                                {t(
                                                    "certifications.expiryDate"
                                                )}
                                            </label>

                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={
                                                    formData.expiryDate
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    formData.noExpiry
                                                }
                                                min={
                                                    formData.issueDate ||
                                                    undefined
                                                }
                                            />

                                            <small>
                                                {t(
                                                    "certifications.expiryDateHelp"
                                                )}
                                            </small>

                                        </div>

                                    </div>

                                    {/* NO EXPIRATION */}

                                    <div className="no-expiration-box">

                                        <label>

                                            <input
                                                type="checkbox"
                                                name="noExpiry"
                                                checked={
                                                    formData.noExpiry
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                            <span>
                                                {t(
                                                    "certifications.noExpirationLabel"
                                                )}
                                            </span>

                                        </label>

                                        <small>
                                            {t(
                                                "certifications.noExpirationHelp"
                                            )}
                                        </small>

                                    </div>

                                    {/* STATUS */}

                                    <div className="certification-form-group">

                                        <label>
                                            {t(
                                                "common.status"
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
                                                    "common.active"
                                                )}
                                            </option>

                                            <option value="Expired">
                                                {t(
                                                    "certifications.expired"
                                                )}
                                            </option>

                                        </select>

                                    </div>

                                    {/* DESCRIPTION */}

                                    <div className="certification-form-group full-width">

                                        <label>
                                            {t(
                                                "common.description"
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
                                                "certifications.descriptionPlaceholder"
                                            )}
                                        />

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="certification-form-actions">

                                        <button
                                            type="button"
                                            className="certification-cancel-btn"
                                            onClick={
                                                closeForm
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            {t(
                                                "common.cancel"
                                            )}
                                        </button>

                                        <button
                                            type="submit"
                                            className="certification-save-btn"
                                            disabled={
                                                saving
                                            }
                                        >
                                            {saving
                                                ? t(
                                                      "common.saving"
                                                  )
                                                : editingId
                                                ? `✓ ${t(
                                                      "certifications.updateCertificationButton"
                                                  )}`
                                                : `+ ${t(
                                                      "certifications.saveCertification"
                                                  )}`}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        )}

                        {/* LOADING */}

                        {loading ? (

                            <div className="certification-empty">

                                <div className="certification-empty-icon">
                                    ⏳
                                </div>

                                <h3>
                                    {t(
                                        "certifications.loading"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "certifications.loadingDescription"
                                    )}
                                </p>

                            </div>

                        ) : certifications.length > 0 ? (

                            /* CERTIFICATIONS LIST */

                            <div className="certifications-grid">

                                {certifications.map(
                                    (
                                        certification
                                    ) => (

                                        <article
                                            className="certification-card"
                                            key={
                                                certification.id
                                            }
                                        >

                                            {/* CARD TOP */}

                                            <div className="certification-card-top">

                                                <div className="certification-icon">
                                                    🏆
                                                </div>

                                                <span
                                                    className={
                                                        certification.status ===
                                                        "Active"
                                                            ? "certification-status active"
                                                            : "certification-status expired"
                                                    }
                                                >
                                                    ●{" "}
                                                    {
                                                        certification.status ===
                                                        "Inactive"
                                                            ? t(
                                                                  "certifications.expired"
                                                              )
                                                            : t(
                                                                  "common.active"
                                                              )
                                                    }
                                                </span>

                                            </div>

                                            {/* CARD BODY */}

                                            <div className="certification-card-body">

                                                <span className="certification-organization">

                                                    {
                                                        certification.organization
                                                    }

                                                </span>

                                                <h2>

                                                    {
                                                        certification.name
                                                    }

                                                </h2>

                                                <div className="certification-info">

                                                    <span>

                                                        📅{" "}
                                                        {t(
                                                            "certifications.issued"
                                                        )}{" "}

                                                        {
                                                            formatDate(
                                                                certification.issue_date
                                                            )
                                                        }

                                                    </span>

                                                    <span>

                                                        ⏳{" "}

                                                        {certification.no_expiry
                                                            ? t(
                                                                  "certifications.noExpiration"
                                                              )
                                                            : `${t(
                                                                  "certifications.expires"
                                                              )}: ${formatDate(
                                                                  certification.expiry_date
                                                              )}`}

                                                    </span>

                                                </div>

                                                {/* CREDENTIAL ID */}

                                                {certification.credential_id && (

                                                    <div className="credential-id">

                                                        <strong>
                                                            {t(
                                                                "certifications.credentialId"
                                                            )}
                                                            :
                                                        </strong>{" "}

                                                        {
                                                            certification.credential_id
                                                        }

                                                    </div>

                                                )}

                                                {/* DESCRIPTION */}

                                                {certification.description && (

                                                    <p className="certification-description">

                                                        {
                                                            certification.description
                                                        }

                                                    </p>

                                                )}

                                            </div>

                                            {/* CARD FOOTER */}

                                            <div className="certification-card-footer">

                                                {certification.credential_url ? (

                                                    <a
                                                        href={
                                                            certification.credential_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="credential-link"
                                                    >
                                                        🔗{" "}
                                                        {t(
                                                            "certifications.viewCredential"
                                                        )}
                                                    </a>

                                                ) : (

                                                    <span className="no-credential">
                                                        {t(
                                                            "certifications.noCredentialUrl"
                                                        )}
                                                    </span>

                                                )}

                                                <div className="certification-actions">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="certification-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                certification
                                                            )
                                                        }
                                                    >
                                                        ✏️{" "}
                                                        {t(
                                                            "common.edit"
                                                        )}
                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="certification-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                certification.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            certification.id
                                                        }
                                                    >
                                                        {deletingId ===
                                                        certification.id
                                                            ? t(
                                                                  "certifications.deleting"
                                                              )
                                                            : `🗑 ${t(
                                                                  "common.delete"
                                                              )}`}
                                                    </button>

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        ) : (

                            /* EMPTY STATE */

                            <div className="certification-empty">

                                <div className="certification-empty-icon">
                                    🏆
                                </div>

                                <h3>
                                    {t(
                                        "certifications.noCertificationsFound"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "certifications.emptyDescription"
                                    )}
                                </p>

                                <button
                                    type="button"
                                    className="add-certification-btn"
                                    onClick={
                                        openAddForm
                                    }
                                >
                                    +{" "}
                                    {t(
                                        "certifications.addCertification"
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

export default Certifications;
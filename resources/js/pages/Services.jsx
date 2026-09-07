
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";
import { useLanguage } from "../LanguageContext";
import "../../css/service.css";


// =====================================================
// API
// =====================================================

const API_URL =
    "http://127.0.0.1:8000/api/services";


// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
    title: "",
    category: "",
    description: "",
    features: "",
    icon: "⚡",
    gradient: "service-cyan",
    price: "",
    status: "New",
};


// =====================================================
// SERVICES COMPONENT
// =====================================================

export default function Services() {

    const {
        t,
        isRTL,
    } = useLanguage();


    // =================================================
    // STATES
    // =================================================

    const [services, setServices] =
        useState([]);

    const [form, setForm] =
        useState({
            ...emptyForm,
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [showModal, setShowModal] =
        useState(false);

    const [editingService, setEditingService] =
        useState(null);


    // =================================================
    // GET SERVICES
    // =================================================

    const fetchServices = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json",
                            },
                        }
                    );


                const result =
                    await response
                        .json()
                        .catch(() => ({}));


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        t(
                            "services.failedLoad"
                        )
                    );

                }


                setServices(
                    Array.isArray(result.data)
                        ? result.data
                        : []
                );


            } catch (err) {

                console.error(
                    "Fetch services error:",
                    err
                );


                setError(
                    err.message ||
                    t(
                        "services.unableLoad"
                    )
                );


            } finally {

                setLoading(false);

            }

        },
        [t]
    );


    // =================================================
    // LOAD SERVICES
    // =================================================

    useEffect(() => {

        fetchServices();

    }, [fetchServices]);


    // =================================================
    // INPUT CHANGE
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // =================================================
    // OPEN ADD MODAL
    // =================================================

    const openAddModal = () => {

        setEditingService(null);

        setForm({
            ...emptyForm,
        });

        setMessage("");
        setError("");

        setShowModal(true);

    };


    // =================================================
    // OPEN EDIT MODAL
    // =================================================

    const openEditModal = (service) => {

        setEditingService(service);

        setForm({

            title:
                service.title || "",

            category:
                service.category || "",

            description:
                service.description || "",

            features:
                Array.isArray(
                    service.features
                )
                    ? service.features.join(", ")
                    : service.features || "",

            icon:
                service.icon || "⚡",

            gradient:
                service.gradient ||
                "service-cyan",

            price:
                service.price || "",

            status:
                service.status || "New",

        });

        setMessage("");
        setError("");

        setShowModal(true);

    };


    // =================================================
    // CLOSE MODAL
    // =================================================

    const closeModal = () => {

        if (saving) {
            return;
        }

        setShowModal(false);

        setEditingService(null);

        setForm({
            ...emptyForm,
        });

    };


    // =================================================
    // SUBMIT FORM
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !form.title.trim() ||
            !form.description.trim()
        ) {

            setError(
                t(
                    "services.requiredFields"
                )
            );

            return;

        }


        // ---------------------------------------------
        // FEATURES
        // ---------------------------------------------

        const features =
            form.features
                .split(",")
                .map(
                    (item) =>
                        item.trim()
                )
                .filter(Boolean);


        // ---------------------------------------------
        // PAYLOAD
        // ---------------------------------------------

        const payload = {

            title:
                form.title.trim(),

            category:
                form.category.trim() ||
                null,

            description:
                form.description.trim(),

            features,

            icon:
                form.icon.trim() ||
                "⚡",

            gradient:
                form.gradient ||
                "service-cyan",

            price:
                form.price.trim() ||
                null,

            status:
                form.status ||
                "New",

        };


        try {

            setSaving(true);


            const isEditing =
                Boolean(editingService);


            const url =
                isEditing
                    ? `${API_URL}/${editingService.id}`
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
                                payload
                            ),

                    }
                );


            const result =
                await response
                    .json()
                    .catch(() => ({}));


            // -----------------------------------------
            // API ERROR
            // -----------------------------------------

            if (!response.ok) {

                if (result.errors) {

                    const errors =
                        Object.values(
                            result.errors
                        ).flat();


                    throw new Error(
                        errors.join(" ")
                    );

                }


                throw new Error(
                    result.message ||
                    t(
                        "services.failedSave"
                    )
                );

            }


            // -----------------------------------------
            // UPDATE
            // -----------------------------------------

            if (isEditing) {

                if (result.data) {

                    setServices(
                        (previous) =>
                            previous.map(
                                (service) =>
                                    service.id ===
                                    editingService.id
                                        ? result.data
                                        : service
                            )
                    );

                } else {

                    await fetchServices();

                }


                setMessage(
                    t(
                        "services.updatedSuccess"
                    )
                );

            }


            // -----------------------------------------
            // ADD
            // -----------------------------------------

            else {

                if (result.data) {

                    setServices(
                        (previous) => [
                            result.data,
                            ...previous,
                        ]
                    );

                } else {

                    await fetchServices();

                }


                setMessage(
                    t(
                        "services.addedSuccess"
                    )
                );

            }


            // -----------------------------------------
            // RESET
            // -----------------------------------------

            setShowModal(false);

            setEditingService(null);

            setForm({
                ...emptyForm,
            });


        } catch (err) {

            console.error(
                "Save service error:",
                err
            );


            setError(
                err.message ||
                t(
                    "services.somethingWrong"
                )
            );


        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // DELETE SERVICE
    // =================================================

    const deleteService = async (id) => {

        const confirmed =
            window.confirm(
                t(
                    "services.deleteConfirm"
                )
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");
            setMessage("");


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
                await response
                    .json()
                    .catch(() => ({}));


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    t(
                        "services.failedDelete"
                    )
                );

            }


            setServices(
                (previous) =>
                    previous.filter(
                        (service) =>
                            service.id !== id
                    )
            );


            setMessage(
                t(
                    "services.deletedSuccess"
                )
            );


        } catch (err) {

            console.error(
                "Delete service error:",
                err
            );


            setError(
                err.message ||
                t(
                    "services.unableDelete"
                )
            );

        }

    };


    // =================================================
    // FILTER SERVICES
    // =================================================

    const filteredServices =
        useMemo(() => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            return services.filter(
                (service) => {

                    const title =
                        service.title
                            ?.toString()
                            .toLowerCase() ||
                        "";


                    const category =
                        service.category
                            ?.toString()
                            .toLowerCase() ||
                        "";


                    const description =
                        service.description
                            ?.toString()
                            .toLowerCase() ||
                        "";


                    const matchesSearch =
                        !searchText ||
                        title.includes(
                            searchText
                        ) ||
                        category.includes(
                            searchText
                        ) ||
                        description.includes(
                            searchText
                        );


                    const matchesStatus =
                        statusFilter === "all" ||
                        service.status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            services,
            search,
            statusFilter,
        ]);


    // =================================================
    // STATISTICS
    // =================================================

    const totalServices =
        services.length;


    const activeServices =
        services.filter(
            (service) =>
                service.status ===
                "Active"
        ).length;


    const featuredServices =
        services.filter(
            (service) =>
                service.status ===
                "Featured"
        ).length;


    const newServices =
        services.filter(
            (service) =>
                service.status ===
                "New"
        ).length;


    // =================================================
    // STATUS TRANSLATION
    // =================================================

    const getStatusLabel = (status) => {

        const statusKeys = {

            New:
                "services.statusNew",

            Featured:
                "services.statusFeatured",

            Active:
                "services.statusActive",

            Inactive:
                "services.statusInactive",

        };


        const key =
            statusKeys[status];


        return key
            ? t(key)
            : status || "-";

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <AdminLayout>

            <div
                className="services-admin-page"
                dir={
                    isRTL
                        ? "rtl"
                        : "ltr"
                }
            >


                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <div className="services-page-header">

                    <div>

                        <span className="services-page-label">

                            {t(
                                "services.management"
                            )}

                        </span>


                        <h1>

                            {t(
                                "services.title"
                            )}

                        </h1>


                        <p>

                            {t(
                                "services.subtitle"
                            )}

                        </p>

                    </div>


                    <button
                        type="button"
                        className="service-add-btn"
                        onClick={
                            openAddModal
                        }
                    >

                        <span>
                            +
                        </span>

                        {t(
                            "services.addService"
                        )}

                    </button>

                </div>


                {/* =====================================
                    ERROR
                ====================================== */}

                {error && (

                    <div className="service-alert service-alert-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    SUCCESS
                ====================================== */}

                {message && (

                    <div className="service-alert service-alert-success">

                        {message}

                    </div>

                )}


                {/* =====================================
                    STATISTICS
                ====================================== */}

                <div className="service-stat-grid">


                    {/* TOTAL */}

                    <div className="service-stat-card">

                        <div className="service-stat-icon cyan">
                            ⚡
                        </div>

                        <div>

                            <span>

                                {t(
                                    "services.total"
                                )}

                            </span>

                            <strong>

                                {totalServices}

                            </strong>

                        </div>

                    </div>


                    {/* ACTIVE */}

                    <div className="service-stat-card">

                        <div className="service-stat-icon green">
                            ✓
                        </div>

                        <div>

                            <span>

                                {t(
                                    "services.active"
                                )}

                            </span>

                            <strong>

                                {activeServices}

                            </strong>

                        </div>

                    </div>


                    {/* FEATURED */}

                    <div className="service-stat-card">

                        <div className="service-stat-icon purple">
                            ★
                        </div>

                        <div>

                            <span>

                                {t(
                                    "services.featured"
                                )}

                            </span>

                            <strong>

                                {featuredServices}

                            </strong>

                        </div>

                    </div>


                    {/* NEW */}

                    <div className="service-stat-card">

                        <div className="service-stat-icon orange">
                            +
                        </div>

                        <div>

                            <span>

                                {t(
                                    "services.new"
                                )}

                            </span>

                            <strong>

                                {newServices}

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    SERVICE TABLE
                ====================================== */}

                <div className="service-admin-card">


                    {/* TABLE HEADER */}

                    <div className="service-table-header">

                        <div>

                            <span>

                                {t(
                                    "services.allServices"
                                )}

                            </span>


                            <h2>

                                {t(
                                    "services.serviceList"
                                )}

                            </h2>

                        </div>


                        {/* FILTERS */}

                        <div className="service-filters">

                            <input
                                type="text"
                                placeholder={t(
                                    "services.search"
                                )}
                                value={
                                    search
                                }
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />


                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="all">

                                    {t(
                                        "services.allStatus"
                                    )}

                                </option>


                                <option value="New">

                                    {t(
                                        "services.statusNew"
                                    )}

                                </option>


                                <option value="Featured">

                                    {t(
                                        "services.statusFeatured"
                                    )}

                                </option>


                                <option value="Active">

                                    {t(
                                        "services.statusActive"
                                    )}

                                </option>


                                <option value="Inactive">

                                    {t(
                                        "services.statusInactive"
                                    )}

                                </option>

                            </select>


                            <button
                                type="button"
                                className="service-refresh-btn"
                                onClick={
                                    fetchServices
                                }
                                title={t(
                                    "services.refresh"
                                )}
                            >
                                ↻
                            </button>

                        </div>

                    </div>


                    {/* =================================
                        LOADING
                    ================================== */}

                    {loading ? (

                        <div className="service-loading">

                            <div className="service-spinner"></div>

                            <span>

                                {t(
                                    "services.loading"
                                )}

                            </span>

                        </div>

                    ) : (


                        /* =================================
                           TABLE
                        ================================== */

                        <div className="service-table-wrapper">

                            <table className="services-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            {t(
                                                "services.service"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "services.category"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "services.features"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "services.price"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "services.status"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "services.actions"
                                            )}
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredServices.length >
                                    0 ? (

                                        filteredServices.map(
                                            (
                                                service,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        service.id
                                                    }
                                                >


                                                    {/* NUMBER */}

                                                    <td className="service-number">

                                                        {String(
                                                            index +
                                                                1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}

                                                    </td>


                                                    {/* SERVICE */}

                                                    <td>

                                                        <div className="table-service">

                                                            <div
                                                                className={`table-service-icon ${
                                                                    service.gradient ||
                                                                    "service-cyan"
                                                                }`}
                                                            >

                                                                {
                                                                    service.icon ||
                                                                    "⚡"
                                                                }

                                                            </div>


                                                            <div>

                                                                <strong>

                                                                    {
                                                                        service.title
                                                                    }

                                                                </strong>


                                                                <small>

                                                                    {
                                                                        service.description
                                                                    }

                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                        <span className="service-category">

                                                            {
                                                                service.category ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* FEATURES */}

                                                    <td>

                                                        <div className="service-features">

                                                            {Array.isArray(
                                                                service.features
                                                            ) &&
                                                            service.features.length >
                                                                0 ? (

                                                                service.features
                                                                    .slice(
                                                                        0,
                                                                        3
                                                                    )
                                                                    .map(
                                                                        (
                                                                            feature,
                                                                            featureIndex
                                                                        ) => (

                                                                            <span
                                                                                key={`${feature}-${featureIndex}`}
                                                                            >

                                                                                {
                                                                                    feature
                                                                                }

                                                                            </span>

                                                                        )
                                                                    )

                                                            ) : (

                                                                <span>
                                                                    -
                                                                </span>

                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* PRICE */}

                                                    <td>

                                                        <span className="service-price">

                                                            {
                                                                service.price ||
                                                                t(
                                                                    "services.free"
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={`service-status service-status-${service.status
                                                                ?.toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )}`}
                                                        >

                                                            <i></i>

                                                            {getStatusLabel(
                                                                service.status
                                                            )}

                                                        </span>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>

                                                        <div className="service-actions">

                                                            <button
                                                                type="button"
                                                                className="service-edit-btn"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        service
                                                                    )
                                                                }
                                                            >

                                                                {t(
                                                                    "services.edit"
                                                                )}

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="service-delete-btn"
                                                                onClick={() =>
                                                                    deleteService(
                                                                        service.id
                                                                    )
                                                                }
                                                            >

                                                                {t(
                                                                    "services.delete"
                                                                )}

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="service-empty"
                                            >

                                                <div>
                                                    ⚡
                                                </div>


                                                <strong>

                                                    {t(
                                                        "services.noServices"
                                                    )}

                                                </strong>


                                                <span>

                                                    {t(
                                                        "services.noServicesDescription"
                                                    )}

                                                </span>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        openAddModal
                                                    }
                                                >

                                                    +
                                                    {" "}

                                                    {t(
                                                        "services.addService"
                                                    )}

                                                </button>

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* =====================================
                    MODAL
                ====================================== */}

                {showModal && (

                    <div
                        className="service-modal-overlay"
                        onMouseDown={(e) => {

                            if (
                                e.target ===
                                e.currentTarget
                            ) {
                                closeModal();
                            }

                        }}
                    >

                        <div
                            className="service-modal"
                            dir={
                                isRTL
                                    ? "rtl"
                                    : "ltr"
                            }
                        >


                            {/* =================================
                                MODAL HEADER
                            ================================== */}

                            <div className="service-modal-header">

                                <div>

                                    <span>

                                        {editingService
                                            ? t(
                                                "services.updateLabel"
                                            )
                                            : t(
                                                "services.newService"
                                            )}

                                    </span>


                                    <h2>

                                        {editingService
                                            ? t(
                                                "services.editService"
                                            )
                                            : t(
                                                "services.addService"
                                            )}

                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    className="service-modal-close"
                                    aria-label={t(
                                        "services.close"
                                    )}
                                >

                                    ×

                                </button>

                            </div>


                            {/* =================================
                                FORM
                            ================================== */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="service-form"
                            >

                                <div className="service-form-grid">


                                    {/* TITLE */}

                                    <div className="service-form-group">

                                        <label>

                                            {t(
                                                "services.serviceTitle"
                                            )}

                                            {" *"}

                                        </label>


                                        <input
                                            type="text"
                                            name="title"
                                            value={
                                                form.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "services.serviceTitlePlaceholder"
                                            )}
                                            required
                                        />

                                    </div>


                                    {/* CATEGORY */}

                                    <div className="service-form-group">

                                        <label>

                                            {t(
                                                "services.category"
                                            )}

                                        </label>


                                        <input
                                            type="text"
                                            name="category"
                                            value={
                                                form.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "services.categoryPlaceholder"
                                            )}
                                        />

                                    </div>


                                    {/* PRICE */}

                                    <div className="service-form-group">

                                        <label>

                                            {t(
                                                "services.price"
                                            )}

                                        </label>


                                        <input
                                            type="text"
                                            name="price"
                                            value={
                                                form.price
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "services.pricePlaceholder"
                                            )}
                                        />

                                    </div>


                                    {/* STATUS */}

                                    <div className="service-form-group">

                                        <label>

                                            {t(
                                                "services.status"
                                            )}

                                        </label>


                                        <select
                                            name="status"
                                            value={
                                                form.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="New">
                                                {t(
                                                    "services.statusNew"
                                                )}
                                            </option>

                                            <option value="Featured">
                                                {t(
                                                    "services.statusFeatured"
                                                )}
                                            </option>

                                            <option value="Active">
                                                {t(
                                                    "services.statusActive"
                                                )}
                                            </option>

                                            <option value="Inactive">
                                                {t(
                                                    "services.statusInactive"
                                                )}
                                            </option>

                                        </select>

                                    </div>


                                    {/* ICON */}

                                    <div className="service-form-group">

                                        <label>

                                            {t(
                                                "services.icon"
                                            )}

                                        </label>


                                        <input
                                            type="text"
                                            name="icon"
                                            value={
                                                form.icon
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="⚡"
                                        />

                                    </div>


                                    {/* COLOR */}

                                    <div className="service-form-group">

                                        <label>

                                            {t(
                                                "services.serviceColor"
                                            )}

                                        </label>


                                        <select
                                            name="gradient"
                                            value={
                                                form.gradient
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="service-cyan">

                                                {t(
                                                    "services.cyan"
                                                )}

                                            </option>


                                            <option value="service-purple">

                                                {t(
                                                    "services.purple"
                                                )}

                                            </option>


                                            <option value="service-pink">

                                                {t(
                                                    "services.pink"
                                                )}

                                            </option>


                                            <option value="service-green">

                                                {t(
                                                    "services.green"
                                                )}

                                            </option>

                                        </select>

                                    </div>


                                    {/* FEATURES */}

                                    <div className="service-form-group service-full">

                                        <label>

                                            {t(
                                                "services.features"
                                            )}

                                        </label>


                                        <input
                                            type="text"
                                            name="features"
                                            value={
                                                form.features
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "services.featuresPlaceholder"
                                            )}
                                        />


                                        <small>

                                            {t(
                                                "services.featuresHelp"
                                            )}

                                        </small>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div className="service-form-group service-full">

                                        <label>

                                            {t(
                                                "services.description"
                                            )}

                                            {" *"}

                                        </label>


                                        <textarea
                                            name="description"
                                            value={
                                                form.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "services.descriptionPlaceholder"
                                            )}
                                            rows="5"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* =================================
                                    FORM FOOTER
                                ================================== */}

                                <div className="service-form-footer">

                                    <button
                                        type="button"
                                        className="service-cancel-btn"
                                        onClick={
                                            closeModal
                                        }
                                        disabled={
                                            saving
                                        }
                                    >

                                        {t(
                                            "services.cancel"
                                        )}

                                    </button>


                                    <button
                                        type="submit"
                                        className="service-save-btn"
                                        disabled={
                                            saving
                                        }
                                    >

                                        {saving

                                            ? t(
                                                "services.saving"
                                            )

                                            : editingService

                                            ? "✓ " +
                                              t(
                                                  "services.updateService"
                                              )

                                            : "+ " +
                                              t(
                                                  "services.addService"
                                              )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>

        </AdminLayout>

    );
}


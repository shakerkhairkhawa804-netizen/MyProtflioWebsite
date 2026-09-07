
import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";
import { useLanguage } from "../LanguageContext";

import "../../css/project.css";


// =====================================================
// API
// =====================================================

const API_URL =
    "http://127.0.0.1:8000/api/projects";


// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
    title: "",
    category: "",
    description: "",
    technologies: "",
    status: "New",
    liveUrl: "",
    githubUrl: "",
    icon: "⚡",
    gradient: "project-cyan",
};


// =====================================================
// PROJECTS
// =====================================================

export default function Projects() {

    const { t } = useLanguage();


    // =================================================
    // STATES
    // =================================================

    const [projects, setProjects] =
        useState([]);

    const [form, setForm] =
        useState(emptyForm);

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


    // =================================================
    // GET PROJECTS
    // =================================================

    const fetchProjects = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        API_URL,
                        {
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
                            "projects.failedLoad"
                        )
                    );

                }


                setProjects(
                    Array.isArray(result.data)
                        ? result.data
                        : []
                );

            } catch (err) {

                console.error(
                    "Fetch projects error:",
                    err
                );

                setError(
                    err.message ||
                    t(
                        "projects.unableLoad"
                    )
                );

            } finally {

                setLoading(false);

            }

        },
        [t]
    );


    // =================================================
    // LOAD PROJECTS
    // =================================================

    useEffect(() => {

        fetchProjects();

    }, [fetchProjects]);


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
    // ADD PROJECT
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
            !form.category.trim() ||
            !form.description.trim()
        ) {

            setError(
                t(
                    "projects.requiredFields"
                )
            );

            return;

        }


        // ---------------------------------------------
        // TECHNOLOGIES
        // ---------------------------------------------

        const technologies =
            form.technologies
                .split(",")
                .map(
                    (item) =>
                        item.trim()
                )
                .filter(Boolean);


        try {

            setSaving(true);


            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        body: JSON.stringify({

                            title:
                                form.title.trim(),

                            category:
                                form.category.trim(),

                            description:
                                form.description.trim(),

                            technologies:
                                technologies,

                            status:
                                form.status,

                            icon:
                                form.icon ||
                                "⚡",

                            gradient:
                                form.gradient,

                            live_url:
                                form.liveUrl.trim() ||
                                null,

                            github_url:
                                form.githubUrl.trim() ||
                                null,

                        }),
                    }
                );


            const result =
                await response
                    .json()
                    .catch(() => ({}));


            if (!response.ok) {

                // Laravel validation errors
                if (result.errors) {

                    const validationErrors =
                        Object.values(
                            result.errors
                        ).flat();


                    throw new Error(
                        validationErrors.join(" ")
                    );

                }


                throw new Error(
                    result.message ||
                    t(
                        "projects.failedAdd"
                    )
                );

            }


            // -----------------------------------------
            // ADD NEW PROJECT
            // -----------------------------------------

            if (result.data) {

                setProjects(
                    (previous) => [
                        result.data,
                        ...previous,
                    ]
                );

            } else {

                await fetchProjects();

            }


            // -----------------------------------------
            // RESET FORM
            // -----------------------------------------

            setForm({
                ...emptyForm,
            });


            // -----------------------------------------
            // SUCCESS MESSAGE
            // -----------------------------------------

            setMessage(
                t(
                    "projects.addedSuccess"
                )
            );


        } catch (err) {

            console.error(
                "Add project error:",
                err
            );


            setError(
                err.message ||
                t(
                    "projects.somethingWrong"
                )
            );


        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // DELETE PROJECT
    // =================================================

    const deleteProject = async (id) => {

        const confirmed =
            window.confirm(
                t(
                    "projects.deleteConfirm"
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
                        "projects.failedDelete"
                    )
                );

            }


            // -----------------------------------------
            // REMOVE PROJECT
            // -----------------------------------------

            setProjects(
                (previous) =>
                    previous.filter(
                        (project) =>
                            project.id !== id
                    )
            );


            setMessage(
                t(
                    "projects.deletedSuccess"
                )
            );


        } catch (err) {

            console.error(
                "Delete project error:",
                err
            );


            setError(
                err.message ||
                t(
                    "projects.unableDelete"
                )
            );

        }

    };


    // =================================================
    // FILTER PROJECTS
    // =================================================

    const filteredProjects =
        projects.filter(
            (project) => {

                const searchText =
                    search
                        .trim()
                        .toLowerCase();


                const title =
                    project.title
                        ?.toString()
                        .toLowerCase() || "";


                const category =
                    project.category
                        ?.toString()
                        .toLowerCase() || "";


                const matchesSearch =
                    title.includes(
                        searchText
                    ) ||
                    category.includes(
                        searchText
                    );


                const matchesStatus =
                    statusFilter === "all" ||
                    project.status ===
                        statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    // =================================================
    // RENDER
    // =================================================

    return (

        <AdminLayout>

            <div className="projects-admin-page">


                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <div className="projects-admin-header">

                    <div>

                        <span className="admin-page-label">

                            {t(
                                "projects.management"
                            )}

                        </span>


                        <h1>

                            {t(
                                "projects.title"
                            )}

                        </h1>


                        <p>

                            {t(
                                "projects.subtitle"
                            )}

                        </p>

                    </div>


                    <div className="projects-total-box">

                        <strong>

                            {projects.length}

                        </strong>


                        <span>

                            {t(
                                "projects.total"
                            )}

                        </span>

                    </div>

                </div>


                {/* =====================================
                    ERROR
                ====================================== */}

                {error && (

                    <div className="project-alert project-alert-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    SUCCESS
                ====================================== */}

                {message && (

                    <div className="project-alert project-alert-success">

                        {message}

                    </div>

                )}


                {/* =====================================
                    ADD PROJECT
                ====================================== */}

                <div className="project-admin-card">

                    <div className="project-card-header">

                        <div>

                            <span>

                                {t(
                                    "projects.newProject"
                                )}

                            </span>


                            <h2>

                                {t(
                                    "projects.addProject"
                                )}

                            </h2>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="project-admin-form"
                    >

                        <div className="project-form-grid">


                            {/* TITLE */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.projectTitle"
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
                                    placeholder="FITZONE GYM"
                                    required
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.category"
                                    )}

                                    {" *"}

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
                                        "projects.categoryPlaceholder"
                                    )}
                                    required
                                />

                            </div>


                            {/* TECHNOLOGIES */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.technologies"
                                    )}

                                </label>


                                <input
                                    type="text"
                                    name="technologies"
                                    value={
                                        form.technologies
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Laravel, React.js, MySQL"
                                />

                            </div>


                            {/* STATUS */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.status"
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
                                            "projects.statusNew"
                                        )}
                                    </option>


                                    <option value="Featured">
                                        {t(
                                            "projects.statusFeatured"
                                        )}
                                    </option>


                                    <option value="Completed">
                                        {t(
                                            "projects.statusCompleted"
                                        )}
                                    </option>


                                    <option value="Current">
                                        {t(
                                            "projects.statusCurrent"
                                        )}
                                    </option>


                                    <option value="In Progress">
                                        {t(
                                            "projects.statusInProgress"
                                        )}
                                    </option>

                                </select>

                            </div>


                            {/* ICON */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.icon"
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

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.projectColor"
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

                                    <option value="project-cyan">
                                        {t(
                                            "projects.cyan"
                                        )}
                                    </option>


                                    <option value="project-purple">
                                        {t(
                                            "projects.purple"
                                        )}
                                    </option>


                                    <option value="project-pink">
                                        {t(
                                            "projects.pink"
                                        )}
                                    </option>

                                </select>

                            </div>


                            {/* LIVE URL */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.liveUrl"
                                    )}

                                </label>


                                <input
                                    type="url"
                                    name="liveUrl"
                                    value={
                                        form.liveUrl
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://example.com"
                                />

                            </div>


                            {/* GITHUB */}

                            <div className="project-form-group">

                                <label>

                                    {t(
                                        "projects.githubUrl"
                                    )}

                                </label>


                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={
                                        form.githubUrl
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://github.com/..."
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="project-form-group project-full">

                                <label>

                                    {t(
                                        "projects.description"
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
                                        "projects.descriptionPlaceholder"
                                    )}
                                    rows="5"
                                    required
                                />

                            </div>

                        </div>


                        {/* FORM FOOTER */}

                        <div className="project-form-footer">

                            <button
                                type="submit"
                                disabled={saving}
                                className="project-save-btn"
                            >

                                {saving
                                    ? t(
                                        "projects.saving"
                                    )
                                    : t(
                                        "projects.addProjectButton"
                                    )
                                }

                            </button>

                        </div>

                    </form>

                </div>


                {/* =====================================
                    PROJECT LIST
                ====================================== */}

                <div className="project-admin-card">

                    <div className="project-table-header">

                        <div>

                            <span>

                                {t(
                                    "projects.allProjects"
                                )}

                            </span>


                            <h2>

                                {t(
                                    "projects.projectList"
                                )}

                            </h2>

                        </div>


                        {/* FILTERS */}

                        <div className="project-filters">

                            <input
                                type="text"
                                placeholder={t(
                                    "projects.search"
                                )}
                                value={search}
                                onChange={
                                    (e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                }
                            />


                            <select
                                value={
                                    statusFilter
                                }
                                onChange={
                                    (e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="all">

                                    {t(
                                        "projects.allStatus"
                                    )}

                                </option>


                                <option value="New">

                                    {t(
                                        "projects.statusNew"
                                    )}

                                </option>


                                <option value="Featured">

                                    {t(
                                        "projects.statusFeatured"
                                    )}

                                </option>


                                <option value="Completed">

                                    {t(
                                        "projects.statusCompleted"
                                    )}

                                </option>


                                <option value="Current">

                                    {t(
                                        "projects.statusCurrent"
                                    )}

                                </option>


                                <option value="In Progress">

                                    {t(
                                        "projects.statusInProgress"
                                    )}

                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =====================================
                        TABLE
                    ====================================== */}

                    {loading ? (

                        <div className="project-table-loading">

                            {t(
                                "projects.loading"
                            )}

                        </div>

                    ) : (

                        <div className="project-table-wrapper">

                            <table className="projects-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            {t(
                                                "projects.project"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "projects.category"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "projects.technologies"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "projects.status"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "projects.live"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "projects.github"
                                            )}
                                        </th>

                                        <th>
                                            {t(
                                                "projects.action"
                                            )}
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredProjects.length > 0 ? (

                                        filteredProjects.map(
                                            (
                                                project,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        project.id
                                                    }
                                                >

                                                    {/* NUMBER */}

                                                    <td>

                                                        {String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}

                                                    </td>


                                                    {/* PROJECT */}

                                                    <td>

                                                        <div className="table-project-name">

                                                            <span>

                                                                {project.icon ||
                                                                    "⚡"}

                                                            </span>


                                                            <strong>

                                                                {
                                                                    project.title
                                                                }

                                                            </strong>

                                                        </div>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                        {
                                                            project.category
                                                        }

                                                    </td>


                                                    {/* TECHNOLOGIES */}

                                                    <td>

                                                        <div className="table-tech">

                                                            {Array.isArray(
                                                                project.technologies
                                                            ) ? (

                                                                project.technologies.map(
                                                                    (
                                                                        tech,
                                                                        techIndex
                                                                    ) => (

                                                                        <span
                                                                            key={
                                                                                techIndex
                                                                            }
                                                                        >
                                                                            {
                                                                                tech
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


                                                    {/* STATUS */}

                                                    <td>

                                                        <span className="table-status">

                                                            {project.status}

                                                        </span>

                                                    </td>


                                                    {/* LIVE */}

                                                    <td>

                                                        {project.live_url ? (

                                                            <a
                                                                href={
                                                                    project.live_url
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="table-link"
                                                            >

                                                                {t(
                                                                    "projects.view"
                                                                )}

                                                                {" ↗"}

                                                            </a>

                                                        ) : (

                                                            "-"

                                                        )}

                                                    </td>


                                                    {/* GITHUB */}

                                                    <td>

                                                        {project.github_url ? (

                                                            <a
                                                                href={
                                                                    project.github_url
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="table-link"
                                                            >

                                                                {t(
                                                                    "projects.github"
                                                                )}

                                                                {" ↗"}

                                                            </a>

                                                        ) : (

                                                            "-"

                                                        )}

                                                    </td>


                                                    {/* DELETE */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="table-delete-btn"
                                                            onClick={() =>
                                                                deleteProject(
                                                                    project.id
                                                                )
                                                            }
                                                        >

                                                            {t(
                                                                "projects.delete"
                                                            )}

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="no-projects"
                                            >

                                                {t(
                                                    "projects.noProjects"
                                                )}

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>

    );

}


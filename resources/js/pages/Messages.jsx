import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";
import "../../css/messages.css";
import { useLanguage } from "../LanguageContext";

const API_URL =
    "http://127.0.0.1:8000/api/messages";

function Messages() {
    const { t, language, isRTL } =
        useLanguage();

    // =====================================================
    // STATE
    // =====================================================

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [selectedMessage, setSelectedMessage] =
        useState(null);

    const [updatingId, setUpdatingId] =
        useState(null);

    const [starringId, setStarringId] =
        useState(null);

    const [deletingId, setDeletingId] =
        useState(null);

    // =====================================================
    // RTL
    // =====================================================

    useEffect(() => {
        document.documentElement.lang =
            language || "en";

        document.documentElement.dir =
            isRTL ? "rtl" : "ltr";
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
    // HEADERS
    // =====================================================

    const getHeaders = (
        includeContentType = false
    ) => {
        const token = getToken();

        return {
            Accept: "application/json",

            ...(includeContentType
                ? {
                      "Content-Type":
                          "application/json",
                  }
                : {}),

            ...(token
                ? {
                      Authorization:
                          `Bearer ${token}`,
                  }
                : {}),
        };
    };

    // =====================================================
    // FETCH MESSAGES
    // =====================================================

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const data =
                await response.json();

            console.log(
                "MESSAGES RESPONSE:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t(
                            "messages.errors.loadFailed"
                        )
                );
            }

            const messageData =
                Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(
                          data.data?.data
                      )
                    ? data.data.data
                    : Array.isArray(data)
                    ? data
                    : [];

            setMessages(messageData);
        } catch (err) {
            console.error(
                "FETCH MESSAGES ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "messages.errors.loadFailed"
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {
        fetchMessages();
    }, []);

    // =====================================================
    // READ STATUS
    // =====================================================

    const isMessageRead = (message) => {
        if (
            typeof message.is_read !==
            "undefined"
        ) {
            return (
                message.is_read === true ||
                message.is_read === 1 ||
                message.is_read === "1"
            );
        }

        return message.status === "Read";
    };

    // =====================================================
    // STAR STATUS
    // =====================================================

    const isMessageStarred = (message) => {
        if (
            typeof message.is_starred !==
            "undefined"
        ) {
            return (
                message.is_starred === true ||
                message.is_starred === 1 ||
                message.is_starred === "1"
            );
        }

        if (
            typeof message.starred !==
            "undefined"
        ) {
            return (
                message.starred === true ||
                message.starred === 1 ||
                message.starred === "1"
            );
        }

        return false;
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        try {
            const locale =
                language === "ps"
                    ? "ps-AF"
                    : language === "fa"
                    ? "fa-AF"
                    : "en-US";

            return new Date(
                date
            ).toLocaleDateString(
                locale,
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            );
        } catch {
            return date;
        }
    };

    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        try {
            const locale =
                language === "ps"
                    ? "ps-AF"
                    : language === "fa"
                    ? "fa-AF"
                    : "en-US";

            return new Date(
                date
            ).toLocaleTimeString(
                locale,
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch {
            return "";
        }
    };

    // =====================================================
    // FILTER
    // =====================================================

    const filteredMessages = useMemo(() => {
        return messages.filter(
            (message) => {
                const searchText =
                    search
                        .toLowerCase()
                        .trim();

                const name =
                    String(
                        message.name || ""
                    ).toLowerCase();

                const email =
                    String(
                        message.email || ""
                    ).toLowerCase();

                const subject =
                    String(
                        message.subject ||
                            ""
                    ).toLowerCase();

                const messageText =
                    String(
                        message.message ||
                            ""
                    ).toLowerCase();

                const phone =
                    String(
                        message.phone || ""
                    ).toLowerCase();

                const matchesSearch =
                    !searchText ||
                    name.includes(
                        searchText
                    ) ||
                    email.includes(
                        searchText
                    ) ||
                    subject.includes(
                        searchText
                    ) ||
                    messageText.includes(
                        searchText
                    ) ||
                    phone.includes(
                        searchText
                    );

                const read =
                    isMessageRead(
                        message
                    );

                const matchesStatus =
                    statusFilter ===
                        "All" ||
                    (statusFilter ===
                        "Read" &&
                        read) ||
                    (statusFilter ===
                        "Unread" &&
                        !read);

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );
    }, [
        messages,
        search,
        statusFilter,
    ]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalMessages =
        messages.length;

    const unreadMessages =
        messages.filter(
            (message) =>
                !isMessageRead(
                    message
                )
        ).length;

    const readMessages =
        messages.filter(
            (message) =>
                isMessageRead(
                    message
                )
        ).length;

    const starredMessages =
        messages.filter(
            (message) =>
                isMessageStarred(
                    message
                )
        ).length;

    // =====================================================
    // VIEW MESSAGE
    // =====================================================

    const handleView = async (
        message
    ) => {
        setSelectedMessage({
            ...message,
        });

        if (!isMessageRead(message)) {
            await markAsRead(
                message.id,
                false
            );
        }
    };

    // =====================================================
    // MARK READ / UNREAD
    // =====================================================

    const markAsRead = async (
        id,
        showLoading = true
    ) => {
        try {
            if (showLoading) {
                setUpdatingId(id);
            }

            const message =
                messages.find(
                    (item) =>
                        item.id === id
                );

            if (!message) {
                return;
            }

            const currentRead =
                isMessageRead(
                    message
                );

            const newRead =
                !currentRead;

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers:
                            getHeaders(
                                true
                            ),

                        body: JSON.stringify({
                            is_read:
                                newRead,

                            status: newRead
                                ? "Read"
                                : "Unread",
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t(
                            "messages.errors.updateFailed"
                        )
                );
            }

            setMessages(
                (prevMessages) =>
                    prevMessages.map(
                        (item) =>
                            item.id === id
                                ? {
                                      ...item,
                                      is_read:
                                          newRead,
                                      status:
                                          newRead
                                              ? "Read"
                                              : "Unread",
                                  }
                                : item
                    )
            );

            setSelectedMessage(
                (prev) => {
                    if (
                        !prev ||
                        prev.id !== id
                    ) {
                        return prev;
                    }

                    return {
                        ...prev,
                        is_read:
                            newRead,
                        status:
                            newRead
                                ? "Read"
                                : "Unread",
                    };
                }
            );
        } catch (err) {
            console.error(
                "UPDATE MESSAGE ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "messages.errors.updateFailed"
                    )
            );
        } finally {
            if (showLoading) {
                setUpdatingId(null);
            }
        }
    };

    // =====================================================
    // TOGGLE STATUS
    // =====================================================

    const toggleStatus = async (
        id
    ) => {
        await markAsRead(
            id,
            true
        );
    };

    // =====================================================
    // TOGGLE STAR
    // =====================================================

    const toggleStar = async (
        id
    ) => {
        try {
            setStarringId(id);

            const message =
                messages.find(
                    (item) =>
                        item.id === id
                );

            if (!message) {
                return;
            }

            const newStarStatus =
                !isMessageStarred(
                    message
                );

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers:
                            getHeaders(
                                true
                            ),

                        body: JSON.stringify({
                            is_starred:
                                newStarStatus,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t(
                            "messages.errors.starFailed"
                        )
                );
            }

            setMessages(
                (prevMessages) =>
                    prevMessages.map(
                        (item) =>
                            item.id === id
                                ? {
                                      ...item,
                                      is_starred:
                                          newStarStatus,
                                  }
                                : item
                    )
            );

            setSelectedMessage(
                (prev) => {
                    if (
                        !prev ||
                        prev.id !== id
                    ) {
                        return prev;
                    }

                    return {
                        ...prev,
                        is_starred:
                            newStarStatus,
                    };
                }
            );
        } catch (err) {
            console.error(
                "STAR MESSAGE ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "messages.errors.starFailed"
                    )
            );
        } finally {
            setStarringId(null);
        }
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
                    "messages.confirmDelete"
                )
            );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE",
                        headers:
                            getHeaders(),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        t(
                            "messages.errors.deleteFailed"
                        )
                );
            }

            setMessages(
                (prevMessages) =>
                    prevMessages.filter(
                        (message) =>
                            message.id !==
                            id
                    )
            );

            if (
                selectedMessage?.id ===
                id
            ) {
                setSelectedMessage(
                    null
                );
            }
        } catch (err) {
            console.error(
                "DELETE MESSAGE ERROR:",
                err
            );

            setError(
                err.message ||
                    t(
                        "messages.errors.deleteFailed"
                    )
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // CLOSE
    // =====================================================

    const closeMessage = () => {
        setSelectedMessage(null);
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <AdminLayout>

            <main className="messages-page">

                <section className="messages-section">

                    <div className="messages-container">

                        {/* =================================================
                            HEADER
                        ================================================== */}

                        <div className="messages-header">

                            <div className="messages-heading">

                                <span className="messages-subtitle">
                                    {t(
                                        "messages.communicationCenter"
                                    )}
                                </span>

                                <h1>
                                    {t(
                                        "messages.my"
                                    )}{" "}
                                    <span>
                                        {t(
                                            "messages.messages"
                                        )}
                                    </span>
                                </h1>

                                <p>
                                    {t(
                                        "messages.description"
                                    )}
                                </p>

                            </div>

                        </div>

                        {/* =================================================
                            ERROR
                        ================================================== */}

                        {error && (
                            <div className="messages-error">

                                ⚠️ {error}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            ""
                                        )
                                    }
                                >
                                    ✕
                                </button>

                            </div>
                        )}

                        {/* =================================================
                            STATISTICS
                        ================================================== */}

                        <div className="messages-stats">

                            <div className="message-stat-card">

                                <div className="message-stat-icon">
                                    📩
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "messages.totalMessages"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            totalMessages
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="message-stat-card">

                                <div className="message-stat-icon unread">
                                    🔵
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "messages.unread"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            unreadMessages
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="message-stat-card">

                                <div className="message-stat-icon read">
                                    ✓
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "messages.read"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            readMessages
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="message-stat-card">

                                <div className="message-stat-icon starred">
                                    ⭐
                                </div>

                                <div>
                                    <span>
                                        {t(
                                            "messages.starred"
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            starredMessages
                                        }
                                    </strong>
                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            TOOLBAR
                        ================================================== */}

                        <div className="messages-toolbar">

                            <div className="message-search">

                                <span>
                                    🔎
                                </span>

                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder={t(
                                        "messages.searchPlaceholder"
                                    )}
                                />

                            </div>

                            <div className="message-filter">

                                <label>
                                    {t(
                                        "messages.filter"
                                    )}
                                </label>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setStatusFilter(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                >

                                    <option value="All">
                                        {t(
                                            "messages.allMessages"
                                        )}
                                    </option>

                                    <option value="Unread">
                                        {t(
                                            "messages.unread"
                                        )}
                                    </option>

                                    <option value="Read">
                                        {t(
                                            "messages.read"
                                        )}
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* =================================================
                            LOADING
                        ================================================== */}

                        {loading ? (

                            <div className="messages-empty">

                                <div className="messages-empty-icon">
                                    ⏳
                                </div>

                                <h3>
                                    {t(
                                        "messages.loading"
                                    )}
                                </h3>

                                <p>
                                    {t(
                                        "messages.loadingDescription"
                                    )}
                                </p>

                            </div>

                        ) : (

                            <>
                                {/* =========================================
                                    LIST
                                ========================================== */}

                                {filteredMessages.length >
                                0 ? (

                                    <div className="messages-list">

                                        {filteredMessages.map(
                                            (
                                                message
                                            ) => {

                                                const read =
                                                    isMessageRead(
                                                        message
                                                    );

                                                const starred =
                                                    isMessageStarred(
                                                        message
                                                    );

                                                return (
                                                    <article
                                                        className={`message-card ${
                                                            !read
                                                                ? "message-unread"
                                                                : ""
                                                        }`}
                                                        key={
                                                            message.id
                                                        }
                                                    >

                                                        {/* AVATAR */}

                                                        <div className="message-avatar">

                                                            {String(
                                                                message.name ||
                                                                    "?"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}

                                                        </div>

                                                        {/* MAIN */}

                                                        <div className="message-main">

                                                            {/* TOP */}

                                                            <div className="message-top">

                                                                <div className="message-sender">

                                                                    <h3>

                                                                        {
                                                                            message.name ||
                                                                                t(
                                                                                    "messages.unknown"
                                                                                )
                                                                        }

                                                                        {!read && (
                                                                            <span className="unread-dot"></span>
                                                                        )}

                                                                    </h3>

                                                                    <span>
                                                                        {
                                                                            message.email
                                                                        }
                                                                    </span>

                                                                </div>

                                                                <div className="message-date">

                                                                    <span>
                                                                        {formatDate(
                                                                            message.created_at ||
                                                                                message.date
                                                                        )}
                                                                    </span>

                                                                    <small>
                                                                        {formatTime(
                                                                            message.created_at
                                                                        ) ||
                                                                            message.time ||
                                                                            ""}
                                                                    </small>

                                                                </div>

                                                            </div>

                                                            {/* SUBJECT */}

                                                            <h4>
                                                                {
                                                                    message.subject ||
                                                                        t(
                                                                            "messages.noSubject"
                                                                        )
                                                                }
                                                            </h4>

                                                            {/* MESSAGE */}

                                                            <p>
                                                                {
                                                                    message.message ||
                                                                        t(
                                                                            "messages.noMessage"
                                                                        )
                                                                }
                                                            </p>

                                                            {/* ACTIONS */}

                                                            <div className="message-actions">

                                                                {/* VIEW */}

                                                                <button
                                                                    type="button"
                                                                    className="view-message-btn"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            message
                                                                        )
                                                                    }
                                                                >
                                                                    👁{" "}
                                                                    {t(
                                                                        "messages.view"
                                                                    )}
                                                                </button>

                                                                {/* STATUS */}

                                                                <button
                                                                    type="button"
                                                                    className="read-message-btn"
                                                                    onClick={() =>
                                                                        toggleStatus(
                                                                            message.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updatingId ===
                                                                        message.id
                                                                    }
                                                                >

                                                                    {updatingId ===
                                                                    message.id
                                                                        ? t(
                                                                              "messages.updating"
                                                                          )
                                                                        : read
                                                                        ? `🔵 ${t(
                                                                              "messages.markUnread"
                                                                          )}`
                                                                        : `✓ ${t(
                                                                              "messages.markRead"
                                                                          )}`}

                                                                </button>

                                                                {/* STAR */}

                                                                <button
                                                                    type="button"
                                                                    className={`star-message-btn ${
                                                                        starred
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        toggleStar(
                                                                            message.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        starringId ===
                                                                        message.id
                                                                    }
                                                                >
                                                                    {starred
                                                                        ? "★"
                                                                        : "☆"}
                                                                </button>

                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    className="delete-message-btn"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            message.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingId ===
                                                                        message.id
                                                                    }
                                                                >
                                                                    {deletingId ===
                                                                    message.id
                                                                        ? t(
                                                                              "messages.deleting"
                                                                          )
                                                                        : `🗑 ${t(
                                                                              "messages.delete"
                                                                          )}`}
                                                                </button>

                                                            </div>

                                                        </div>

                                                    </article>
                                                );
                                            }
                                        )}

                                    </div>

                                ) : (

                                    <div className="messages-empty">

                                        <div className="messages-empty-icon">
                                            📭
                                        </div>

                                        <h3>
                                            {t(
                                                "messages.noMessages"
                                            )}
                                        </h3>

                                        <p>
                                            {t(
                                                "messages.noMessagesDescription"
                                            )}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                        >
                                            {t(
                                                "messages.clearFilters"
                                            )}
                                        </button>

                                    </div>

                                )}
                            </>
                        )}

                    </div>

                </section>

                {/* =====================================================
                    MESSAGE MODAL
                ====================================================== */}

                {selectedMessage && (

                    <div
                        className="message-modal-overlay"
                        onClick={
                            closeMessage
                        }
                    >

                        <div
                            className="message-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* MODAL HEADER */}

                            <div className="message-modal-header">

                                <div>

                                    <span>
                                        {t(
                                            "messages.messageDetails"
                                        )}
                                    </span>

                                    <h2>
                                        {
                                            selectedMessage.subject ||
                                                t(
                                                    "messages.noSubject"
                                                )
                                        }
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        closeMessage
                                    }
                                    className="message-modal-close"
                                >
                                    ✕
                                </button>

                            </div>

                            {/* MODAL BODY */}

                            <div className="message-modal-body">

                                {/* SENDER */}

                                <div className="modal-sender">

                                    <div className="modal-avatar">

                                        {String(
                                            selectedMessage.name ||
                                                "?"
                                        )
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                selectedMessage.name ||
                                                    t(
                                                        "messages.unknown"
                                                    )
                                            }
                                        </h3>

                                        {selectedMessage.email && (

                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                            >
                                                {
                                                    selectedMessage.email
                                                }
                                            </a>

                                        )}

                                        {selectedMessage.phone && (

                                            <span>
                                                📱{" "}
                                                {
                                                    selectedMessage.phone
                                                }
                                            </span>

                                        )}

                                    </div>

                                </div>

                                {/* INFO */}

                                <div className="modal-message-info">

                                    <div>

                                        <span>
                                            {t(
                                                "messages.date"
                                            )}
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedMessage.created_at ||
                                                    selectedMessage.date
                                            )}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            {t(
                                                "messages.time"
                                            )}
                                        </span>

                                        <strong>
                                            {formatTime(
                                                selectedMessage.created_at
                                            ) ||
                                                selectedMessage.time ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            {t(
                                                "messages.status"
                                            )}
                                        </span>

                                        <strong>
                                            {isMessageRead(
                                                selectedMessage
                                            )
                                                ? t(
                                                      "messages.read"
                                                  )
                                                : t(
                                                      "messages.unread"
                                                  )}
                                        </strong>

                                    </div>

                                </div>

                                {/* MESSAGE */}

                                <div className="modal-message-content">

                                    <span>
                                        {t(
                                            "messages.message"
                                        )}
                                    </span>

                                    <p>
                                        {
                                            selectedMessage.message ||
                                                t(
                                                    "messages.noMessage"
                                                )
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* FOOTER */}

                            <div className="message-modal-footer">

                                <button
                                    type="button"
                                    className="modal-delete-btn"
                                    onClick={() =>
                                        handleDelete(
                                            selectedMessage.id
                                        )
                                    }
                                    disabled={
                                        deletingId ===
                                        selectedMessage.id
                                    }
                                >
                                    {deletingId ===
                                    selectedMessage.id
                                        ? t(
                                              "messages.deleting"
                                          )
                                        : `🗑 ${t(
                                              "messages.delete"
                                          )}`}
                                </button>

                                <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={
                                        closeMessage
                                    }
                                >
                                    {t(
                                        "messages.close"
                                    )}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </AdminLayout>
    );
}

export default Messages;
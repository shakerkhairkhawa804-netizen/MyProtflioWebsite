import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../LanguageContext";

export default function MainContent() {
    const { t } = useLanguage();

    return (
        <div className="dashboard-content">

            {/* =========================
                WELCOME HERO
            ========================= */}
            <section className="dashboard-welcome">

                <div className="welcome-content">

                    <div className="dashboard-label">
                        <span className="label-dot"></span>
                        {t("dashboard.adminDashboard")}
                    </div>

                    <h2>
                        {t("dashboard.welcomeBack")}
                        <span> Shakir.</span>
                    </h2>

                    <p>
                        {t("dashboard.welcomeDescription")}
                    </p>

                    <div className="welcome-actions">

                        <Link
                            to="/projects"
                            className="dashboard-primary-btn"
                        >
                            <span>+</span>
                            {t("dashboard.addProject")}
                        </Link>

                        <Link
                            to="/projects"
                            className="dashboard-secondary-btn"
                        >
                            {t("dashboard.viewProjects")}
                            <span>↗</span>
                        </Link>

                    </div>

                </div>

                {/* Status Card */}

                <div className="dashboard-status-card">

                    <div className="status-card-top">

                        <div className="status-icon">
                            ✓
                        </div>

                        <div className="status-live">
                            <span></span>
                            {t("dashboard.live")}
                        </div>

                    </div>

                    <strong>
                        {t("dashboard.systemOnline")}
                    </strong>

                    <p>
                        {t("dashboard.systemRunning")}
                    </p>

                    <div className="status-progress">
                        <span></span>
                    </div>

                    <small>
                        {t("dashboard.allSystemsOperational")}
                    </small>

                </div>

            </section>


            {/* =========================
                STATISTICS
            ========================= */}
            <section className="dashboard-section">

                <div className="section-mini-heading">
                    <span>{t("dashboard.overview")}</span>
                    <h3>{t("dashboard.portfolioStatistics")}</h3>
                </div>

                <div className="stats-grid">

                    {/* Total Projects */}
                    <div className="dashboard-stat-card cyan-card">

                        <div className="stat-card-top">

                            <div className="stat-icon cyan">
                                ▣
                            </div>

                            <span className="stat-trend">
                                +12%
                            </span>

                        </div>

                        <strong>12</strong>

                        <span>
                            {t("dashboard.totalProjects")}
                        </span>

                        <div className="stat-bottom">

                            <span>
                                {t("dashboard.projectsInPortfolio")}
                            </span>

                            <b>↗</b>

                        </div>

                    </div>


                    {/* Services */}
                    <div className="dashboard-stat-card purple-card">

                        <div className="stat-card-top">

                            <div className="stat-icon purple">
                                ◆
                            </div>

                            <span className="stat-trend">
                                +8%
                            </span>

                        </div>

                        <strong>08</strong>

                        <span>
                            {t("dashboard.services")}
                        </span>

                        <div className="stat-bottom">

                            <span>
                                {t("dashboard.professionalServices")}
                            </span>

                            <b>↗</b>

                        </div>

                    </div>


                    {/* Messages */}
                    <div className="dashboard-stat-card pink-card">

                        <div className="stat-card-top">

                            <div className="stat-icon pink">
                                ✉
                            </div>

                            <span className="stat-trend">
                                +24%
                            </span>

                        </div>

                        <strong>24</strong>

                        <span>
                            {t("dashboard.messages")}
                        </span>

                        <div className="stat-bottom">

                            <span>
                                {t("dashboard.contactMessages")}
                            </span>

                            <b>↗</b>

                        </div>

                    </div>


                    {/* Certifications */}
                    <div className="dashboard-stat-card green-card">

                        <div className="stat-card-top">

                            <div className="stat-icon green">
                                ★
                            </div>

                            <span className="stat-trend">
                                +5%
                            </span>

                        </div>

                        <strong>07</strong>

                        <span>
                            {t("dashboard.certifications")}
                        </span>

                        <div className="stat-bottom">

                            <span>
                                {t("dashboard.professionalCertificates")}
                            </span>

                            <b>↗</b>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                MAIN GRID
            ========================= */}
            <section className="dashboard-main-grid">

                {/* =========================
                    RECENT PROJECTS
                ========================= */}
                <div className="dashboard-panel projects-panel">

                    <div className="panel-header">

                        <div>
                            <span>
                                {t("dashboard.portfolio")}
                            </span>

                            <h3>
                                {t("dashboard.recentProjects")}
                            </h3>
                        </div>

                        <Link to="/projects">
                            {t("dashboard.viewAll")}
                            <span>↗</span>
                        </Link>

                    </div>


                    <div className="project-list">

                        {/* Project 01 */}
                        <div className="dashboard-project">

                            <div className="project-number">
                                01
                            </div>

                            <div className="project-icon cyan">
                                &lt;/&gt;
                            </div>

                            <div className="project-info">

                                <strong>
                                    Portfolio Website
                                </strong>

                                <span>
                                    React • Laravel • MySQL
                                </span>

                            </div>

                            <span className="project-status completed">
                                {t("dashboard.completed")}
                            </span>

                        </div>


                        {/* Project 02 */}
                        <div className="dashboard-project">

                            <div className="project-number">
                                02
                            </div>

                            <div className="project-icon purple">
                                ⚡
                            </div>

                            <div className="project-info">

                                <strong>
                                    FITZONE GYM
                                </strong>

                                <span>
                                    Laravel • React • MySQL
                                </span>

                            </div>

                            <span className="project-status progress">
                                {t("dashboard.inProgress")}
                            </span>

                        </div>


                        {/* Project 03 */}
                        <div className="dashboard-project">

                            <div className="project-number">
                                03
                            </div>

                            <div className="project-icon pink">
                                ▣
                            </div>

                            <div className="project-info">

                                <strong>
                                    Inventory Management
                                </strong>

                                <span>
                                    CodeIgniter • MySQL
                                </span>

                            </div>

                            <span className="project-status completed">
                                {t("dashboard.completed")}
                            </span>

                        </div>


                        {/* Project 04 */}
                        <div className="dashboard-project">

                            <div className="project-number">
                                04
                            </div>

                            <div className="project-icon green">
                                ◈
                            </div>

                            <div className="project-info">

                                <strong>
                                    Course Management
                                </strong>

                                <span>
                                    PHP • MySQL • Bootstrap
                                </span>

                            </div>

                            <span className="project-status pending">
                                {t("dashboard.pending")}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                    QUICK ACTIONS
                ========================= */}
                <div className="dashboard-panel quick-panel">

                    <div className="panel-header">

                        <div>
                            <span>
                                {t("dashboard.actions")}
                            </span>

                            <h3>
                                {t("dashboard.quickAccess")}
                            </h3>
                        </div>

                    </div>


                    <div className="quick-actions">

                        {/* Add Project */}
                        <Link to="/projects">

                            <div className="quick-icon cyan">
                                +
                            </div>

                            <div className="quick-info">

                                <strong>
                                    {t("dashboard.addProject")}
                                </strong>

                                <small>
                                    {t("dashboard.createNewProject")}
                                </small>

                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>


                        {/* Add Service */}
                        <Link to="/services">

                            <div className="quick-icon purple">
                                +
                            </div>

                            <div className="quick-info">

                                <strong>
                                    {t("dashboard.addService")}
                                </strong>

                                <small>
                                    {t("dashboard.addProfessionalService")}
                                </small>

                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>


                        {/* Messages */}
                        <Link to="/messages">

                            <div className="quick-icon pink">
                                ✉
                            </div>

                            <div className="quick-info">

                                <strong>
                                    {t("dashboard.viewMessages")}
                                </strong>

                                <small>
                                    {t("dashboard.unreadMessages")}
                                </small>

                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>


                        {/* Profile */}
                        <Link to="/profile">

                            <div className="quick-icon green">
                                ●
                            </div>

                            <div className="quick-info">

                                <strong>
                                    {t("dashboard.editProfile")}
                                </strong>

                                <small>
                                    {t("dashboard.updateInformation")}
                                </small>

                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>

                    </div>

                </div>

            </section>


            {/* =========================
                ACTIVITY
            ========================= */}
            <section className="dashboard-panel activity-panel">

                <div className="panel-header">

                    <div>
                        <span>
                            {t("dashboard.activity")}
                        </span>

                        <h3>
                            {t("dashboard.recentActivity")}
                        </h3>
                    </div>

                    <span className="activity-date">
                        AUG 2026
                    </span>

                </div>


                <div className="activity-list">

                    {/* Activity 01 */}
                    <div className="activity-item">

                        <div className="activity-icon cyan">
                            ✓
                        </div>

                        <div className="activity-content">

                            <strong>
                                {t("dashboard.portfolioProjectUpdated")}
                            </strong>

                            <span>
                                {t("dashboard.portfolioProjectDescription")}
                            </span>

                        </div>

                        <time>
                            {t("dashboard.twoHoursAgo")}
                        </time>

                    </div>


                    {/* Activity 02 */}
                    <div className="activity-item">

                        <div className="activity-icon purple">
                            +
                        </div>

                        <div className="activity-content">

                            <strong>
                                {t("dashboard.newServiceAdded")}
                            </strong>

                            <span>
                                {t("dashboard.newServiceDescription")}
                            </span>

                        </div>

                        <time>
                            {t("dashboard.fiveHoursAgo")}
                        </time>

                    </div>


                    {/* Activity 03 */}
                    <div className="activity-item">

                        <div className="activity-icon pink">
                            ✉
                        </div>

                        <div className="activity-content">

                            <strong>
                                {t("dashboard.newContactMessage")}
                            </strong>

                            <span>
                                {t("dashboard.newContactDescription")}
                            </span>

                        </div>

                        <time>
                            {t("dashboard.yesterday")}
                        </time>

                    </div>

                </div>

            </section>


            {/* =========================
                BOTTOM CTA
            ========================= */}
            <section className="dashboard-cta">

                <div>

                    <span>
                        {t("dashboard.buildSomethingGreat")}
                    </span>

                    <h3>
                        {t("dashboard.readyToAdd")}
                        <strong>
                            {" "}
                            {t("dashboard.nextProject")}
                        </strong>
                    </h3>

                </div>

                <Link to="/projects">
                    {t("dashboard.addProject")}
                    <span>↗</span>
                </Link>

            </section>

        </div>
    );
}
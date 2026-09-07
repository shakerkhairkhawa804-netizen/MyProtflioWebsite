import React from "react";

import AdminLayout from "../layouts/AdminLayout";
import MainContent from "../components/dashboard/MainContent";

import "../../css/Dashboard.css";

export default function Dashboard() {
    return (
        <AdminLayout
            title="Dashboard"
            subtitle="ADMINISTRATION"
        >
            <MainContent />
        </AdminLayout>
    );
}
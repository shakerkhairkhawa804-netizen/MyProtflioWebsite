import React from "react";

export default function Footer() {

    return (
        <footer className="dashboard-footer">

            <div className="footer-left">

                <span>
                    © {new Date().getFullYear()}
                </span>

                <strong>
                    Shakir Khairkhah
                </strong>

                <span>
                    All rights reserved.
                </span>

            </div>


            <div className="footer-right">

                <span>
                    Portfolio Admin
                </span>

                <span className="footer-dot">
                    •
                </span>

                <span>
                    v1.0.0
                </span>

            </div>

        </footer>
    );
}
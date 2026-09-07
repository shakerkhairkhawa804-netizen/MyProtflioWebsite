import React, { useState } from 'react';
import '../../css/Login.css';

export default function Login() {

    // =====================================================
    // STATES
    // =====================================================

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    // =====================================================
    // LOGIN
    // =====================================================

const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(
                data.message || 'Email or password is incorrect.'
            );
            return;
        }

        // Save user
        localStorage.setItem(
            'user',
            JSON.stringify(data.user)
        );

        // Go to dashboard
        window.location.href = '/dashboard';

    } catch (error) {

        console.error(error);

        setError(
            'Unable to connect to the server.'
        );

    } finally {
        setLoading(false);
    }
};


    return (

        <main className="login-page">


            {/* =================================================
                BACKGROUND
            ================================================= */}

            <div className="login-background">

                <div className="login-grid"></div>

                <div className="login-glow login-glow-one"></div>

                <div className="login-glow login-glow-two"></div>

                <div className="login-orb orb-one"></div>

                <div className="login-orb orb-two"></div>

            </div>


            {/* =================================================
                BACK TO HOME
            ================================================= */}

            <a
                href="/"
                className="back-home"
            >

                <span className="back-icon">
                    ←
                </span>

                <span>
                    Back to Portfolio
                </span>

            </a>


            {/* =================================================
                LOGIN WRAPPER
            ================================================= */}

            <div className="login-wrapper">


                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="login-brand">

                    <div className="brand-mark">
                        SK
                    </div>

                    <div className="brand-info">

                        <strong>
                            Shakir Khairkhah
                        </strong>

                        <span>
                            Full-Stack Developer
                        </span>

                    </div>

                </div>


                {/* =================================================
                    LOGIN CARD
                ================================================= */}

                <div className="login-card">

                    <div className="login-card-glow"></div>


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="login-header">

                        <div className="login-icon-box">
                            🔐
                        </div>

                        <span className="login-label">
                            SECURE ACCESS
                        </span>

                        <h1>
                            Welcome <span>Back.</span>
                        </h1>

                        <p>
                            Sign in to access your account
                            and continue your journey.
                        </p>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="login-message login-error">

                            <span>
                                ⚠
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (

                        <div className="login-message login-success">

                            <span>
                                ✓
                            </span>

                            <span>
                                {success}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="input-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div className="input-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <a
                                    href="#"
                                    className="forgot-link"
                                    onClick={(e) =>
                                        e.preventDefault()
                                    }
                                >
                                    Forgot password?
                                </a>

                            </div>


                            <div className="input-wrapper">

                                <span className="input-icon">
                                    •
                                </span>

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />


                                {/* SHOW PASSWORD */}

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >

                                    {showPassword
                                        ? '◉'
                                        : '◌'
                                    }

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            REMEMBER ME
                        ================================================= */}

                        <label className="remember">

                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) =>
                                    setRemember(
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="custom-check">

                                {remember && '✓'}

                            </span>

                            <span>
                                Remember me
                            </span>

                        </label>


                        {/* =================================================
                            LOGIN BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className={`login-submit ${
                                loading
                                    ? 'loading'
                                    : ''
                            }`}
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="login-spinner"></span>

                                    <span>
                                        Signing In...
                                    </span>

                                </>

                            ) : (

                                <>

                                    <span>
                                        Sign In
                                    </span>

                                    <span className="submit-arrow">
                                        →
                                    </span>

                                </>

                            )}

                        </button>

                    </form>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <div className="login-security">

                        <span className="security-dot"></span>

                        <span>
                            Secure & encrypted connection
                        </span>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="login-footer">

                    <span>
                        © {new Date().getFullYear()}
                        {' '}
                        Shakir Khairkhah
                    </span>

                    <span className="footer-dot">
                        •
                    </span>

                    <span>
                        All Rights Reserved
                    </span>

                </div>

            </div>

        </main>
    );
}
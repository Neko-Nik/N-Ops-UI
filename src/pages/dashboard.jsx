import React from "react";

const Dashboard = () => {
    const linksToGo = {
        "/command-center": "🚀 Command Center",
        "/exec-sql": "🛠️ SQL Runner",
        "/secure-notes": "📝 Secure Notes",
        "/": "🏠 Home",
        "/login": "🔑 Login",
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                padding: "2rem",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    maxWidth: "960px",
                    margin: "0 auto",
                    padding: "2rem",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
            >
                <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                    Welcome to the Dashboard
                </h1>

                <p
                    style={{
                        fontSize: "1.1rem",
                        color: "#cbd5e1",
                        marginBottom: "2rem",
                    }}
                >
                    This is your control center. From here you can navigate to the
                    <strong style={{ color: "#a5b4fc" }}> Command Center</strong> to run
                    Playbooks, monitor activity, or log out.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                        marginBottom: "2rem",
                    }}
                >
                    {Object.entries(linksToGo).map(([path, label]) => (
                        <a
                            key={path}
                            href={path}
                            style={{
                                textDecoration: "none",
                                background:
                                    "linear-gradient(to right, #6366f1, #8b5cf6)",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "12px",
                                color: "#fff",
                                fontWeight: "600",
                                transition: "transform 0.2s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >
                            {label}
                        </a>
                    ))}
                </div>

                {/* Placeholder for future dashboard content */}
                <div
                    style={{
                        padding: "2rem",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#94a3b8",
                        fontStyle: "italic",
                        textAlign: "center",
                    }}
                >
                    Dashboard widgets like stats, tables, or charts will go here.
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

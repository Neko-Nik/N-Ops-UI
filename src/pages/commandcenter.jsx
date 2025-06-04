import React, { useEffect, useState } from "react";
import { formatLogLine, getPlayBooksData } from "../utils/SecureNotes";


const API_BASE_URL = "https://NekoNik.com"; // TODO: Make this as an environment variable
const HEADERS = {
    "accept": "application/json",
    "API-Key": "API-Key-Here", // TODO: Make this as an environment variable
};

const PlayBooks = () => {
    const [composeSelectionModalOpen, setComposeSelectionModalOpen] = useState(false);
    const [selectServerModalOpen, setSelectServerModalOpen] = useState(false);
    const [selectedComposePath, setSelectedComposePath] = useState("");
    const [selectedServers, setSelectedServers] = useState({});
    const [streamingDone, setStreamingDone] = useState(false);
    const [expandedTile, setExpandedTile] = useState(null);
    const [currentTile, setCurrentTile] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [modalData, setModalData] = useState(null);
    const [logModal, setLogModal] = useState(false);
    const [tileData, setTileData] = useState({});
    const [logLines, setLogLines] = useState([]);
    
    const logBottomRef = React.useRef(null);

    useEffect(() => {
        if (logBottomRef.current) {
            logBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logLines]);

    useEffect(() => {
        const fetchDataInt = async () => {
            try {
                const data = await getPlayBooksData();
                return data;
            } catch (error) {
                console.error("Error fetching playbooks data:", error);
                return {};
            }
        };

        let playbookData = fetchDataInt();
        playbookData.then((data) => {
            setTileData(data);
        });
        // setTileData(SampleData);
    }, []);

    const handleTileClick = (task) => {
        setCurrentTile(task);
        setSelectServerModalOpen(true);
    };

    const handleParameterChange = (e, param) => {
        const { value } = e.target;
        setModalData(prev => ({
            ...prev,
            parameters: {
                ...prev.parameters,
                [param]: {
                    ...prev.parameters[param],
                    default: value
                }
            }
        }));
    };

    const handleGoClick = async () => {
        if (!modalData) return;
        if (!modalData.servers || modalData.servers.length === 0) {
            alert("Please select at least one server.");
            return;
        }

        const allServersFlattened = Object.entries(tileData.servers).flatMap(([env, servers]) =>
            Object.entries(servers).map(([serverID, serverData]) => ({
                ...serverData,
                env,
                serverID
            }))
        );
        const selectedServersFlattened = allServersFlattened.filter(server => selectedServers[server.serverID]);
        if (selectedServersFlattened.length === 0) {
            alert("Please select at least one server.");
            return;
        }

        let finalParams = {
            "target_host": selectedServersFlattened.map(server => server.target_host_name).join(","),
        }

        // Go through all the params and set the default values as the values and keys as the keys
        for (let [paramKey, param] of Object.entries(modalData.parameters)) {
            finalParams[paramKey] = param.default;
        }

        setExpandedTile(null);
        setLogLines([]);
        setStreamingDone(false);
        setLogModal(true);
        setElapsedTime(0);
        setSelectServerModalOpen(false);
        setComposeSelectionModalOpen(false);
        setSelectedComposePath("");
        setCurrentTile(null);
    
        let timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        try {
            const response = await fetch(`${API_BASE_URL}/commander/run-playbook`, {
                method: "POST",
                headers: HEADERS,
                body: JSON.stringify({
                    "playbook": modalData.id,
                    "params": finalParams
                }),
                credentials: "include",
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setLogLines(prev => [...prev, ...chunk.split("\n")]);
            }
        
            setStreamingDone(true);
        } catch (err) {
            setLogLines(prev => [...prev, `\n⚠️ Error: ${err.message}`]);
            setStreamingDone(true);
        } finally {
            clearInterval(timer);
        }
    };

    const handleClose = () => {
        setComposeSelectionModalOpen(false);
        setSelectServerModalOpen(false);
        setSelectedComposePath("");
        setStreamingDone(false);
        setSelectedServers({});
        setExpandedTile(null);
        setCurrentTile(null);
        setModalData(null);
        setLogModal(false);
        setElapsedTime(0);
        setLogLines([]);
    };

    const playBookDisplay = (playbook) => {
        const { name, description, eta, parameters } = playbook;

        return (
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    width: "100%",         // take full width of the flex item wrapper
                    height: "160px",       // fixed height for uniformity
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // spread content evenly
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>
                    {name}
                </h3>
                <p
                    style={{
                        fontSize: "0.95rem",
                        marginBottom: "0.8rem",
                    }}
                >
                    {description}
                </p>
                <p style={{ fontSize: "0.85rem", color: "#dee2e6", marginBottom: "0.5rem" }}>
                    ETA: {eta}
                </p>
            </div>
        );
    }

    const editParameterDisplay = (params) => {
        if (!params) return null;

        const readFileAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
        
                reader.onload = () => {
                    const base64Content = reader.result.split(",")[1]; // Remove data URL prefix
                    resolve(base64Content);
                };
        
                reader.onerror = (error) => {
                    reject(error);
                };
        
                reader.readAsDataURL(file);
            });
        };        

        return (
            <div>
                {Object.entries(params).map(([key, data]) => (
                    <div key={key} style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "1rem"
                    }}>
                        <label style={{ fontSize: "0.9rem", color: "#aaa" }}>
                            {data.name} - {data.description}
                        </label>

                        {/* If its a docker_compose_path type */}
                        {data.type === "docker_compose_path" && (
                            <input
                                type="text"
                                value={modalData.parameters[key].default || ""}
                                disabled={true}
                                style={{
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    backgroundColor: "#222",
                                    color: "#fff",
                                    fontSize: "0.9rem",
                                }}
                            />
                        )}

                        {/* If its a docker_compose_path_key type */}
                        {data.type === "docker_compose_path_key" && (
                            <input
                                type="text"
                                value={modalData.parameters[key].default || ""}
                                disabled={true}
                                style={{
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    backgroundColor: "#222",
                                    color: "#fff",
                                    fontSize: "0.9rem",
                                }}
                            />
                        )}

                        {/* If its a base64_file type */}
                        {data.type === "base64_file" && (
                            <input
                                type="file"
                                accept="*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            const base64Content = await readFileAsBase64(file);
                                            handleParameterChange({
                                                target: {
                                                    value: base64Content
                                                }
                                            }, key);
                                        } catch (error) {
                                            console.error("Failed to read file as base64:", error);
                                        }
                                    }
                                }}
                                style={{
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    backgroundColor: "#222",
                                    color: "#fff",
                                    fontSize: "0.9rem",
                                }}
                            />
                        )}


                        {/* If its a text type */}
                        {data.type === "string" && (
                            <input
                                type="text"
                                value={modalData.parameters[key].default || ""}
                                onChange={(e) => handleParameterChange(e, key)}
                                style={{
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    backgroundColor: "#222",
                                    color: "#fff",
                                    fontSize: "0.9rem",
                                }}
                            />
                        )}

                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem" }}>

            <h1 style={{ textAlign: "center", color: "#e8e8f5" }}>
                Command Center
            </h1>


            {/* List of Playbooks */}
            { tileData.playbooks && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "left",
                        gap: "1rem"
                    }}
                >
                    {Object.entries(tileData.playbooks).map(([playBookKey, playBookValue]) => (
                        <div
                            key={playBookKey}
                            onClick={() => handleTileClick({ ...playBookValue, id: playBookKey })}
                            style={{
                                flex: "0 1 calc(30% - 1rem)",
                                maxWidth: "500px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "0.5rem",
                            }}
                        >
                            {playBookDisplay(playBookValue)}
                        </div>
                    ))}
                </div>
            )}


            {/* Select Servers from the list */}
            { selectServerModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#1e1e2f",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "600px",
                        color: "#fff",
                        maxHeight: "80vh",
                        overflowY: "auto"
                    }}>
                        <h2>Select Servers for {currentTile.name}</h2>

                        {Object.entries(tileData.servers).map(([env, servers]) => (
                            <div key={env} style={{ marginBottom: "1rem" }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={Object.keys(servers).every(serverID => selectedServers[serverID])}
                                        onChange={(e) => {
                                            const updated = { ...selectedServers };
                                            Object.keys(servers).forEach(serverID => {
                                                updated[serverID] = e.target.checked;
                                            });
                                            setSelectedServers(updated);
                                        }}
                                    />{" "}
                                    <strong>{env.toUpperCase()}</strong>
                                </label>

                                <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                                    {Object.entries(servers).map(([serverID, serverData]) => (
                                        <div key={serverID}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={!!selectedServers[serverID]}
                                                    onChange={() => {
                                                        setSelectedServers(prev => ({
                                                            ...prev,
                                                            [serverID]: !prev[serverID]
                                                        }));
                                                    }}
                                                />{" "}
                                                {serverID}: {serverData.name} - [{serverData.ip}]
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button
                                onClick={() => handleClose()}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "6px" }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    let selectedServersList = Object.keys(selectedServers).filter(serverID => selectedServers[serverID]);
                                    if (selectedServersList.length === 0) {
                                        alert("Please select at least one server.");
                                        return;
                                    }
                                
                                    const requiresComposePath = Object.values(currentTile.parameters || {}).some(
                                        (param) => param.type === "docker_compose_path"
                                    );
                                
                                    setSelectServerModalOpen(false);
                                    setModalData({ ...currentTile, servers: selectedServersList });
                                
                                    if (requiresComposePath) {
                                        setComposeSelectionModalOpen(true);
                                    } else {
                                        setExpandedTile(currentTile.id);
                                    }
                                }}                                
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#00b894", color: "#fff", border: "none", borderRadius: "6px" }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for selecting docker compose path */}
            { composeSelectionModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#1e1e2f",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "600px",
                        color: "#fff",
                        maxHeight: "70vh",
                        overflowY: "auto"
                    }}>
                        <h2>Select Docker Compose Path</h2>
                        
                        {/* Scrollable list container */}
                        <div className="log-stream" style={{
                            maxHeight: "45vh",
                            overflowY: "auto",
                            marginTop: "1rem",
                            marginBottom: "1.5rem",
                            paddingRight: "0.5rem"
                        }}>

                            {Object.entries(tileData.docker_compose_paths).map(([key, data]) => (
                                <label key={key} style={{
                                    display: "block",
                                    padding: "0.75rem",
                                    marginBottom: "0.5rem",
                                    border: "1px solid #444",
                                    borderRadius: "8px",
                                    background: selectedComposePath === key ? "#2c3e50" : "#1e1e2f",
                                    cursor: "pointer"
                                }}>
                                    <div
                                        name="composePath"
                                        value={key}
                                        onClick={() => setSelectedComposePath(key)}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "flex-start",
                                            cursor: "pointer",
                                            color: selectedComposePath === key ? "#fff" : "#aaa",
                                            fontSize: "1rem",
                                            fontWeight: "500"
                                        }}
                                    >
                                        <strong>{data.description}</strong>
                                        <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Docker Image: {key}</div>
                                        <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Compose Path: {data.path}</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button
                                onClick={() => handleClose()}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "6px" }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (!selectedComposePath) {
                                        alert("Please select a Docker Compose path.");
                                        return;
                                    }

                                    let updatedParams = { ...currentTile.parameters };
                                    for (let [paramKey, param] of Object.entries(updatedParams)) {
                                        if (param.type === "docker_compose_path") {
                                            updatedParams[paramKey].default = tileData.docker_compose_paths[selectedComposePath].path;
                                        }
                                        if (param.type === "docker_compose_path_key") {
                                            updatedParams[paramKey].default = selectedComposePath;
                                        }
                                    }

                                    setModalData(prev => ({
                                        ...prev,
                                        parameters: updatedParams
                                    }));
                                    setComposeSelectionModalOpen(false);
                                    setExpandedTile(currentTile.id);
                                }}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#00b894", color: "#fff", border: "none", borderRadius: "6px" }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for editing parameters */}
            { expandedTile && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#1e1e2f",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "600px",
                        color: "#fff",
                        maxHeight: "70vh",
                        overflowY: "auto"
                    }}>
                        <h2>Edit Parameters</h2>
                        
                        {/* Scrollable list for parameters */}
                        <div className="log-stream" style={{
                            maxHeight: "45vh",
                            overflowY: "auto",
                            marginTop: "1rem",
                            marginBottom: "1.5rem",
                            paddingRight: "0.5rem"
                        }}>
                            {editParameterDisplay(modalData.parameters)}
                        </div>

                        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                            <button
                                onClick={() => handleClose()}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "6px" }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {handleGoClick()}}
                                style={{ padding: "0.5rem 1rem", backgroundColor: "#00b894", color: "#fff", border: "none", borderRadius: "6px" }}
                            >
                                Run
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Log stream modal */}
            { logModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#000",
                        zIndex: 2000,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Top bar */}
                    <div
                        style={{
                            padding: "1rem",
                            backgroundColor: "#111827",
                            color: "#fff",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderBottom: "1px solid #333",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ fontSize: "0.95rem", color: "#a5b4fc" }}>
                            ⏱ Elapsed: {elapsedTime}s
                        </div>

                        {streamingDone && (
                            <button
                                onClick={() => setLogModal(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#f87171",
                                    fontSize: "1.1rem",
                                    cursor: "pointer",
                                    lineHeight: "1",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "6px",
                                    transition: "background 0.2s ease",
                                }}
                                title="Close"
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "rgba(248, 113, 113, 0.1)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "transparent")
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                        {/* Log stream output */}
                        <pre
                            className="log-stream"
                            style={{
                                flex: 1,
                                margin: 0,
                                padding: "1rem",
                                backgroundColor: "#0f172a",
                                color: "#00ff90",
                                fontFamily: "monospace",
                                fontSize: "0.95rem",
                                overflowY: "auto",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {logLines.map((line, index) => (
                                <div key={index}>{formatLogLine(line)}</div>
                            ))}
                            <div ref={logBottomRef} />
                        </pre>

                </div>
            )}


        </div>
    );
};

export default PlayBooks;

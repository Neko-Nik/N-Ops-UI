import React, { useState } from 'react';
import { client } from '@passwordless-id/webauthn';
import { createNewAuthDevice, fetchLoginOptions, fetchRegistrationOptions, loginWithAuthDevice, validateSessionID } from '../utils/auth';


// TODO: Make this as a config file or environment variables
const USER = {
    "id": "YOUR_USER_ID", // Replace with your user ID
    "name": "YOUR_USER_NAME", // Replace with your user name
    "displayName": "YOUR_DISPLAY_NAME", // Replace with your display name
    "rp_name": "YOUR_RP_NAME", // Replace with your RP name
    "rp_id": "YOUR_RP_ID" // Replace with your RP ID
};


const Login = () => {
    const [status, setStatus] = useState('Not authenticated');

    // Neko Nik: Uncomment this function to enable PassKey registration
    // and also uncomment the button in the return statement for registration

    // async function registerPassKey() {
    //     setStatus('🔐 Registering PassKey...');

    //     let challenge = await fetchRegistrationOptions();
    //     if (!challenge) {
    //         setStatus('Failed to fetch challenge');
    //         return;
    //     }

    //     try {
    //         const result = await client.register({
    //             challenge: challenge.data.challenge,
    //             user: {
    //                 id: USER.id,
    //                 name: USER.name,
    //                 displayName: USER.displayName,
    //             },
    //             timeout: challenge.data.timeout
    //         });

    //         await createNewAuthDevice(result);
    //         setStatus('PassKey registration complete');

    //     } catch (err) {
    //         console.error('Registration failed:', err);
    //         setStatus('Registration failed');
    //     }
    // }

    async function loginWithPassKey() {
        setStatus('🔐 Starting login...');

        let challenge = await fetchLoginOptions();
        if (!challenge) {
            setStatus('Failed to fetch challenge');
            return;
        }

        try {
            const result = await client.authenticate({
                challenge: challenge.data.challenge,
                user: {
                    id: USER.id,
                    name: USER.name,
                    displayName: USER.displayName,
                },
                timeout: challenge.data.timeout,
                userVerification: challenge.data.userVerification
            });

            await loginWithAuthDevice(result);
            setStatus('PassKey authentication complete');

        } catch (err) {
            console.error('Authentication failed:', err);
            setStatus('Authentication failed');
        }
    }


    async function validateCurrentSession() {
        setStatus('🔐 Validating session...');

        // Check if the user is still authenticated
        if (!document.cookie.includes("LOGGED_IN=true")) {
            setStatus('User not authenticated');
            return;
        }

        // Validate the session ID
        let is_valid = await validateSessionID();
        if (!is_valid) {
            setStatus('Failed to validate session');
            return;
        }
        setStatus('Session validated successfully');
    }

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
                padding: '3rem',
                background: 'rgba(0, 0, 0, 0.6)', // Dark overlay for contrast
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                maxWidth: '400px',
                // width: '100%',
            }}
        >
            <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#fff' }}>
                🔐 Login with PassKey
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#ddd', margin: '1rem 0' }}>
                Status: {status}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* <button
                    onClick={registerPassKey}
                    style={{
                        backgroundColor: '#6366f1',
                        color: '#fff',
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        transition: '0.3s ease',
                        marginBottom: '15px',
                    }}
                >
                    Register PassKey
                </button>
                <p
                    style={{
                        fontSize: '0.9rem',
                        color: '#bbb',
                        marginBottom: '1rem',
                        textAlign: 'center',
                    }}
                >
                    Or, if you've already registered your PassKey, trigger authentication:
                </p> */}
                <button
                    onClick={loginWithPassKey}
                    style={{
                        backgroundColor: '#8b5cf6',
                        color: '#fff',
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        transition: '0.3s ease',
                    }}
                >
                    Trigger PassKey Authentication
                </button>

                <p
                    style={{
                        fontSize: '0.9rem',
                        color: '#bbb',
                        marginTop: '1rem',
                        textAlign: 'center',
                    }}
                >
                    Validate the session by clicking the button below
                </p>

                <button
                    onClick={validateCurrentSession}
                    style={{
                        backgroundColor: '#4ade80',
                        color: '#fff',
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        transition: '0.3s ease',
                        marginTop: '15px',
                    }}
                >
                    Validate Session
                </button>

            </div>
        </div>
        </div>
    );
};

export default Login;

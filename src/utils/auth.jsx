import axios from 'axios';


const API_BASE_URL = "https://NekoNik.com"; // TODO: Make this as an environment variable
const HEADERS = {
    "accept": "application/json",
    "API-Key": "API-Key-Here", // TODO: Make this as an environment variable
};


//       -*-*-*-*-*-*-*-*-       API Calls       -*-*-*-*-*-*-*-*-       //


// Fetch a new challenge for registration
async function fetchRegistrationOptions() {
    try {
        const response = await axios.get(`${API_BASE_URL}/fido/register/request-challenge`, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;

    } catch (err) {
        console.error('Failed to fetch registration options:', err);
        throw err;
    }
}


// Fetch a new challenge for Login
async function fetchLoginOptions() {
    try {
        const response = await axios.get(`${API_BASE_URL}/fido/login/request-challenge`, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;

    } catch (err) {
        console.error('Failed to fetch Logon options:', err);
        throw err;
    }
}


// Validate and register the new device
async function createNewAuthDevice(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/fido/register`, data, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;

    } catch (err) {
        console.error('Failed to register device:', err);
        throw err;
    }

}


// Validate and login with the FIDO device
async function loginWithAuthDevice(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/fido/login`, data, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;

    } catch (err) {
        console.error('Failed to register device:', err);
        throw err;
    }

}


// Validate the current session
async function validateSessionID() {
    try {
        const response = await axios.get(`${API_BASE_URL}/fido/validate-session`, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;

    } catch (err) {
        console.error('Failed to validate session:', err);
        throw err;
    }
}


export { fetchRegistrationOptions, fetchLoginOptions, createNewAuthDevice, loginWithAuthDevice, validateSessionID };

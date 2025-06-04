import axios from 'axios';


const API_BASE_URL = "https://NekoNik.com"; // TODO: Make this as an environment variable
const HEADERS = {
    "accept": "application/json",
    "API-Key": "API-Key-Here", // TODO: Make this as an environment variable
};



const formatLogLine = (line) => {
    const lineWithBreaks = line.split("\n").map((l, i) => <div key={i}>{l}</div>);

    if (/PLAY RECAP/.test(line)) {
        return <span style={{ color: "#f8fafc" }}><br />{lineWithBreaks}</span>; // Green + top break
    } else if (/^TASK \[/.test(line)) {
        return <span style={{ color: "#f8fafc" }}><br />{lineWithBreaks}</span>; // White + top break
    } else if (/changed:/.test(line)) {
        return <span style={{ color: "#fde68a" }}>{lineWithBreaks}</span>; // Yellow
    } else if (/skipping:/.test(line)) {
        return <span style={{ color: "#7dd3fc" }}>{lineWithBreaks}</span>; // Light Blue
    } else if (/Ansible exited with/.test(line)) {
        return <span style={{ color: "#86efac" }}><br />{lineWithBreaks}</span>; // Green + top break
    } else if (/failed:/.test(line)) {
        return <span style={{ color: "#f87171" }}>{lineWithBreaks}</span>; // Red
    } else if (/fatal:/.test(line)) {
        return <span style={{ color: "#f87171" }}>{lineWithBreaks}</span>; // Red
    } else if (/PLAY/.test(line)) {
        return <span style={{ color: "#f8fafc" }}>{lineWithBreaks}</span>; // Generic PLAY
    }

    return <span>{lineWithBreaks}</span>;
};


//       -*-*-*-*-*-*-*-*-       API Calls       -*-*-*-*-*-*-*-*-       //


// Fetch All secure notes
async function fetchAllSecureNotes() {
    try {
        const response = await axios.get(`${API_BASE_URL}/commander/secure-notes`, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }
    catch (err) {
        console.error('Failed to fetch secure notes:', err);
        throw err;
    }
}


// Add a new secure note
async function addSecureNote(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/commander/secure-notes`, data, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 201) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }
    catch (err) {
        console.error('Failed to add secure note:', err);
        throw err;
    }
}


// Delete a secure note by id
async function deleteSecureNote(noteId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/commander/secure-notes?note_id=${noteId}`, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }
    catch (err) {
        console.error('Failed to delete secure note:', err);
        throw err;
    }
}


// Update a secure note
async function updateSecureNote(data) {
    try {
        const response = await axios.put(`${API_BASE_URL}/commander/secure-notes`, data, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }
    catch (err) {
        console.error('Failed to update secure note:', err);
        throw err;
    }
}


// Get PlayBooks Information
async function getPlayBooksData() {
    try {
        const response = await axios.get(`${API_BASE_URL}/commander/run-playbook`, {
            headers: HEADERS,
            withCredentials: true
        });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }
    catch (err) {
        console.error('Failed to get playbooks data:', err);
        throw err;
    }
}


export { fetchAllSecureNotes, addSecureNote, deleteSecureNote, updateSecureNote, formatLogLine, getPlayBooksData };

"use client";
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import axios from 'axios';
import { useState } from 'react';

export default function FingerprintAuth() {
  const [userID, setUserID] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // 🟢 1. Register Fingerprint
  const registerFingerprint = async () => {
    try {
      if (!userID) {
        setMessage('Please enter a User ID');
        return;
      }

      // Step 1: Get Registration Options from Backend
      const { data } = await axios.post('http://localhost:5000/api/admin/user/webauthn/options', {
        userID,
        type: 'registration',
      });

      // Step 2: Start Browser Registration
      const regResponse = await startRegistration(data.options);

      // Step 3: Verify Registration with Backend
      const verifyRes = await axios.post('http://localhost:5000/api/admin/user/webauthn/verify', {
        userID,
        type: 'registration',
        response: regResponse,
      });

      if (verifyRes.data.verified) {
        setIsRegistered(true);
        setMessage('Fingerprint registered successfully! 🎉');
        localStorage.setItem('userID', userID);
      } else {
        setMessage('Fingerprint registration failed. ❌');
      }
    } catch (error) {
      setMessage(`Error during registration: ${error.response?.data?.error || error.message}`);
    }
  };

  // 🔵 2. Login with Fingerprint
  const loginWithFingerprint = async () => {
    try {
      const storedUserID = localStorage.getItem('userID') || userID;
      if (!storedUserID) {
        setMessage('No user found. Please register first.');
        return;
      }

      // Step 1: Get Authentication Options from Backend
      const { data } = await axios.post('http://localhost:5000/api/admin/user/webauthn/options', {
        userID: storedUserID,
        type: 'authentication',
      });

      const authResponse = await startAuthentication(data.options);

      const verifyRes = await axios.post('http://localhost:5000/api/admin/user/webauthn/verify', {
        userID: storedUserID,
        type: 'authentication',
        response: authResponse,
      });

      if (verifyRes.data.verified) {
        setMessage('Fingerprint login successful! ✅');
      } else {
        setMessage('Fingerprint login failed. ❌');
      }
    } catch (error) {
      setMessage(`Error during login: ${error.response?.data?.error || error.message}`);
    }
  };

  // 🚫 3. Logout Function
  const logout = () => {
    localStorage.removeItem('userID');
    setUserID('');
    setIsRegistered(false);
    setMessage('Logged out.');
  };
  
  return (
    <div style={styles.container}>
      <h1>🔐 WebAuthn Fingerprint Auth</h1>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        style={styles.input}
        disabled={isRegistered}
      />
      <button onClick={registerFingerprint} style={styles.button} disabled={isRegistered}>
        ✨ Register Fingerprint
      </button>
      <button onClick={loginWithFingerprint} style={styles.button}>
        ✅ Login with Fingerprint
      </button>
      <button onClick={logout} style={{ ...styles.button, backgroundColor: '#f44336' }}>
        🚫 Logout
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// 💅 Simple Inline CSS Styles
const styles = {
  container: { padding: '20px', fontFamily: 'Arial', textAlign: 'center' },
  input: { padding: '10px', margin: '10px', width: '250px' },
  button: {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  message: { fontSize: '16px', fontWeight: 'bold', marginTop: '20px' },
};

import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

/**
 * LoginButton Component
 * 
 * Provides Azure AD login functionality
 * Can be used as a popup or redirect
 */
export default function LoginButton({ variant = 'popup', className = '' }) {
  const { instance } = useMsal();
  
  const handleLogin = async () => {
    try {
      if (variant === 'popup') {
        // Popup login
        await instance.loginPopup(loginRequest);
      } else {
        // Redirect login
        await instance.loginRedirect(loginRequest);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <button
      onClick={handleLogin}
      className={`flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="11" height="11" fill="#F25022"/>
        <rect x="12" width="11" height="11" fill="#7FBA00"/>
        <rect y="12" width="11" height="11" fill="#00A4EF"/>
        <rect x="12" y="12" width="11" height="11" fill="#FFB900"/>
      </svg>
      <span>Sign in with Microsoft</span>
    </button>
  );
}
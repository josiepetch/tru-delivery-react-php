// src/common/authUtils.ts

import { jwtDecode } from 'jwt-decode';

// Function to get the JWT token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};
export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

export const setAccessToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

// Function to decode JWT token
export const decodeToken = (token: string | null): object | null => {
    try {
        if (token) {
            return jwtDecode(token);
        }
        return null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
export const decodeAccessToken = (accesstoken: string | null): object | null => {
    try {
        if (accesstoken) {
            return jwtDecode(accesstoken);
        }
        return null;
    } catch (error) {
        console.error('Error decoding access token:', error);
        return null;
    }
};

// Function to get token and its decoded value
export const getAndDecodeToken = (): object | null => {
    const token = getToken();
    return decodeToken(token);
};
export const getAndDecodeAccessToken = (): object | null => {
    const accesstoken = getAccessToken();
    return decodeAccessToken(accesstoken);
};

export const tokenSupplierId = (): number | null => {
    const token = decodeToken(getToken());
    if (token && typeof token === 'object' && 'id' in token) {
        return (token as { id: number }).id; // Type assertion here
    } else {
        return null;
    }
};
export const tokenSupplierExpired = (): Date | null => {
    const token = decodeToken(getToken());
    if (token && typeof token === 'object' && 'expired' in token) {
        return (token as { expired: Date }).expired; // Type assertion here
    } else {
        return null;
    }
};
export const tokenAdminId = (): number | null => {
    const token = decodeAccessToken(getAccessToken());
    if (token && typeof token === 'object' && 'id' in token) {
        return (token as { id: number }).id; // Type assertion here
    } else {
        return null;
    }
};
export const tokenAdminExpired = (): Date | null => {
    const token = decodeAccessToken(getAccessToken());
    if (token && typeof token === 'object' && 'expired' in token) {
        return (token as { expired: Date }).expired; // Type assertion here
    } else {
        return null;
    }
};

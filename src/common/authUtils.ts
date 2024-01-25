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
            // console.log(jwtDecode(token));
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
            // console.log(jwtDecode(accesstoken));
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

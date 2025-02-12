// src/services/authService.ts
import axios from 'axios';

import {LOCAL_API_URL} from '../enviroment.ts';

// const API_URL = 'http://localhost:8000/';

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${LOCAL_API_URL}auth/jwt/create/`, { username, password });
    console.log(response);
    const {access, refresh} = response.data;
    console.log(access);
    console.log(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const test_token = localStorage.getItem("accessToken");
    console.log("test:", test_token);
    return response.data;
};
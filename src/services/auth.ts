import { UserCreate, UserLogin } from "@/types/auth";
import axios from "@/lib/api";
import { Token } from "@/types/auth";
import { User } from "@/types/contracts";
import { appendFile } from "fs";

type LoginSuccess = {
    success: true;
    user: User;
}

type LoginError = {
    success: false;
    message: string;
}

type RegisterSuccess = {
    success: true;
    user: User;
}

type RegisterError = {
    success: false;
    message: string;
}

type RegisterResponse = RegisterSuccess | RegisterError

function setTokens(access_token: string, api_key: string) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("api_key", api_key);
}

export function removeTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("api_key");
}

export async function loginUser(credentials: UserLogin): Promise<LoginSuccess | LoginError> {

    try {
        const loginResponse: Token = await axios.post("/auth/login", credentials);

        const {access_token, token_type, api_key} = loginResponse;

        const user: User = await axios.post("/auth/me");


        setTokens(access_token, api_key);

        return {
            success: true,
            user: user,
        };
    } catch(error) {
        const message = error.message;
        return {
            success: false,
            message: message,
        }
    }
}


export async function getUser(): Promise<User | null> {
    try {
        const user: User = await axios.get("/auth/me");
        return user;
    } catch(error) {
        return null;
    }
}


// Add error handling for specific errors
export async function createUser(user_fields: UserCreate): Promise<RegisterResponse> {

    try {
        const user: User = await axios.post("/auth/register", user_fields);
        return {success: true,
        user: user}
    } catch(error) {
        return {
            success: false,
            message: error.message,
        }
    }
}
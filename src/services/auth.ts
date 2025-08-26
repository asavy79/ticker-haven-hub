import { UserCreate, UserLogin } from "@/types/auth";
import axios from "@/lib/api";
import { Token } from "@/types/auth";
import { User } from "@/types/contracts";

type LoginSuccess = {
    success: true;
    user: User;
}

type LoginError = {
    success: false;
    message: string;
}

type RegisterResponse = {
    success: boolean;
    message: string;
}

export async function loginUser(credentials: UserLogin): Promise<LoginSuccess | LoginError> {

    try {
        const loginResponse: Token = await axios.post("/auth/login", credentials);

        const {access_token, token_type,api_key} = loginResponse;

        const user: User = await axios.post("/auth/me", access_token);


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

export async function createUser(user: UserCreate): Promise<RegisterResponse> {

    try {
        await axios.post("/auth/register", user);
        return {success: true,
        message: "User successfully created! You may log into your account now."}
    } catch(error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

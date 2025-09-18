import api from '@/lib/api';
import { AppUser, AuthError } from '@/types/auth';


type AccountCreateResponse = {
    success: true;
    user: AppUser;
} | {
    success: false;
    error: AuthError;
};

type AccountRoleUpdateResponse = {
    success: true;
    user: AppUser;
} | {
    success: false;
    error: AuthError;
};

type AccountDeleteResponse = {
    success: true;
} | {
    success: false;
    error: AuthError;
};

type AccountGetResponse = {
    success: true;
    user: AppUser;
} | {
    success: false;
    error: AuthError;
};

type AccountGetAllResponse = {
    success: true;
    users: AppUser[];
} | {
    success: false;
    error: AuthError;
};




type AccountRole = 'admin' | 'moderator' | 'user';


export async function createAccount(user: AppUser): Promise<AccountCreateResponse> {
    try {
        const result = await api.post('/auth/sign-up', {
            user,
        });

        return {
            success: true,
            user: result.data,
        };
    } catch (error: any) {

        return {
            success: false,
            error: error,
        };
    }
}


export async function setAccountRole(userId: string, role: AccountRole): Promise<AccountRoleUpdateResponse> {
    try {
        const result = await api.put(`/auth/set-role/${userId}`, {
            role,
        });
        return {
            success: true,
            user: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error,
        };
    }
}

export async function deleteAccount(userId: string): Promise<AccountDeleteResponse> {
    try {
        await api.delete(`/auth/profiles/${userId}`);
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error,
        };
    }
}

export async function getAccount(userId: string): Promise<AccountGetResponse> {
    try {
        const result = await api.get(`/auth/profiles/${userId}`);
        return {
            success: true,
            user: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error,
        };
    }
}

export async function getAccounts(): Promise<AccountGetAllResponse> {
    try {
        const result = await api.get(`/auth/profiles`);
        return {
            success: true,
            users: result.data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error,
        };
    }
}
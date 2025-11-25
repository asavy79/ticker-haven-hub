import api from '@/lib/api';
import { AppUser, AuthError } from '@/types/auth';
import { auth } from '@/lib/firebase';


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




export async function refreshUserToken() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user logged in');
    }
    
    await user.getIdToken(true);
    
}



type AccountRole = 'admin' | 'moderator' | 'user';

export async function getAccount(token: string) {
    try {
        // An account will either be fetched or created. If the account is created, default user role of USER will be set
        const result = await api.get('/api/v1/accounts/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        });

        await refreshUserToken();

        
        return {
            success: true,
            user: result.data,
        }
    } catch(error: any) {
        return {
            success: false,
            error: error,
        }
    }
}


export async function createAccountIfNotExists(user: AppUser): Promise<AccountCreateResponse> {
    try {
        const result = await api.post('/accounts', {
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
        const result = await api.patch(`/accounts/${userId}/role`, {
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

export async function getACcountById(userId: string): Promise<AccountGetResponse> {
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
import api from '@/lib/api';
import { AppUser, AuthError } from '@/types/auth';


export async function getUserOrders(userId: string) {
    try {
    const res = await api.get(`/accounts/${userId}/orders/`)
    return {success: true, orders: res.data}
    } catch(error) {
        return {success: false, error: error}
    }
}

export async function getUserTrades(userId: string) {
    try {
        const res = await api.get(`/accounts/${userId}/trades`)
        return {success: true, trades: res.data}
    } catch(error) {
        return {success: false, error: error}
    }
}

export async function getUserPositions(userId: string) {
    try {
        const res = await api.get(`/accounts/${userId}/positions`)
        return {success: true, positions: res.data}
    } catch(error) {
        return {success: false, error: error}
    }
}

export async function updateAccountBalance(userId: string, amount: number) {
    try {
        await api.put(`/accounts/${userId}/balance`, {amount});
        return {success: true, amount: amount};
    } catch(error) {
        return {success: false, error: error};
    }
}
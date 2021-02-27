import { API_URI } from "../config";
import { Transaction, User } from "../types";

export class API {
    public static whoami = async (): Promise<User | null> => {
        const res = await fetch(`${API_URI}/whoami`, {
            credentials: "include",
            method: "GET",
        });
        if (res.status === 200) {
            return res.json();
        }
        return null;
    };

    public static transactions = async (): Promise<Transaction[]> => {
        const res = await fetch(`${API_URI}/wallet/transactions`, {
            credentials: "include",
            method: "GET",
        });
        if (res.status === 200) {
            return res.json();
        }
        throw new Error(await res.text());
    };

    public static balance = async (): Promise<{
        unlocked: number;
        locked: number;
    }> => {
        const res = await fetch(`${API_URI}/wallet/balance`, {
            credentials: "include",
            method: "GET",
        });

        if (res.status === 200) {
            return res.json();
        }
        throw new Error(await res.text());
    };

    public static prices = async (): Promise<{
        ethereum: number;
        bitcoin: number;
        turtlecoin: number;
    }> => {
        const res = await fetch(`${API_URI}/price`, {
            credentials: "include",
            method: "GET",
        });

        if (res.status === 200) {
            return await res.json();
        }
        throw new Error(await res.text());
    };
}

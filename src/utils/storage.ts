export async function customLocalStorage(key: string, action: "set", value: string): Promise<void>;
export async function customLocalStorage<T>(key: string, action: "get"): Promise<T | null>;
export async function customLocalStorage<T>(key: string, action: "set" | "get", value?: string): Promise<T | null | void> {
    try {
        if (action === "set") {
            if (typeof value !== 'string') {
                throw new Error('Value must be provided for set action');
            }
            localStorage.setItem(key, value);
            return;
        }

        return localStorage.getItem(key) as T;
    } catch (error) {
        console.error(`Error in useStorage with key = ${key.toUpperCase()} and action ${action.toUpperCase()}`, error);
        return null;
    }
}
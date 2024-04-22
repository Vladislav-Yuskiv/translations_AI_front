import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {IAxiosFetchWithTokenRefresh, ITokens} from "../types/interfaces";
import {customLocalStorage} from "../utils/storage";

axios.defaults.baseURL= 'http://13.50.51.70:3001'
// axios.defaults.baseURL= 'http://localhost:3001'
export const token = {
    set(token: string) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    reset() {
        axios.defaults.headers.common.Authorization = ``;
    },
};

export async function axiosFetchWithTokenRefresh<T>({
                                                      method,
                                                      url,
                                                      data,
                                                      options
}: IAxiosFetchWithTokenRefresh): Promise<T> {
    try {
        console.log("Try to get data with url",url)
        const response = await axios.request<T>({
            method,
            url,
            data,
            ...options
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
                console.log("Access denied, try to refresh token")
                try {
                    const refreshToken = await customLocalStorage("refreshToken","get")
                    const refreshedTokenResponse = await axios.post<ITokens>('auth/refresh',{refreshToken});

                    const newAccessToken = refreshedTokenResponse.data.accessToken;
                    const newRefreshToken = refreshedTokenResponse.data.refreshToken;

                    token.set(newAccessToken)

                    await  Promise.all([
                        await customLocalStorage("accessToken","set",newAccessToken),
                        await customLocalStorage("refreshToken","set",newRefreshToken)
                    ])

                    const retryConfig: AxiosRequestConfig = {
                        method,
                        url,
                        data,
                        ...options
                    };

                    console.log("Try to get data with url after refreshing token",url)
                    const retryResponse = await axios.request<T>(retryConfig);
                    return retryResponse.data;
                } catch (refreshError) {
                    console.error("Error refreshing token:", refreshError);
                    throw refreshError;
                }
            }
        }
        throw error;
    }
}
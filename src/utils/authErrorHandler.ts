import { error } from '@pnotify/core';

enum ERROR_STATUS {
    BAD_REQUEST= 400,
    UNAUTHORIZED= 401,
    NOT_FOUND= 404,
    CONFLICT= 409,
    SERVER_ERROR= 500
};

const config = {
    animation: 'fade',
    delay: 4000
};

function errorNotification(errorMessage:string) {
    return error({
        ...config,
        title: 'Error',
        text: errorMessage
    });
}

export default function authErrorHandler(error:any, rejectWithValue:any) {
    const errorStatus = error?.response?.status || "Unknown";

    let errorMessage = '';

    switch (errorStatus) {
        case ERROR_STATUS.SERVER_ERROR:
            errorMessage = 'Oops, something went wrong. Please try again later.';
            break;
        case ERROR_STATUS.CONFLICT:
            errorMessage = 'This email is already in use. Please enter another email.';
            break;
        case ERROR_STATUS.NOT_FOUND:
            errorMessage = 'Nothing was found for your request.';
            break;
        case ERROR_STATUS.UNAUTHORIZED:
            errorMessage = 'Your email or password is incorrect. Please check your inputs and try again, or log in again.';
            break;
        case ERROR_STATUS.BAD_REQUEST:
            errorMessage = 'Your input values are incorrect. Please check them and try again.';
            break;
        default:
            errorMessage = 'An unknown error occurred. Please try again later.';
            break;
    }

    errorNotification(errorMessage);
    return rejectWithValue(error.message);
}

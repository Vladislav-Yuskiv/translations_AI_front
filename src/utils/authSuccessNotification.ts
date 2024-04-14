import { success } from '@pnotify/core';

export default function authSuccessNotification(message:string, userName?:string) {
    console.log("1")
    return success({
        title: userName && `Greetings, ${userName}`,
        text: `${message}`,
        animation: 'fade',
        delay: 3000
    });
}
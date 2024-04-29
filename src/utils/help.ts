export function truncate (str:string, max:number, showTo:number) {
    return str.length > max ? str.substring(0,showTo) + "..." : str;
}
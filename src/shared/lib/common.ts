export function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function emailCheck(str: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export function passwordCheck(str: string): boolean {
    return str.length >= 8 && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).+$/.test(str);
}

export function cookieParsor(cookie: string): { [k: string]: string } {
    try {
        return Object.fromEntries(
            cookie.split(';').map((item) => {
                const [key, value] = item.trim().split('=');
                return [key, value];
            }),
        );
    } catch (e) {
        console.log(e);
        return {};
    }
}

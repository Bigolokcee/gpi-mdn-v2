export const _CURRENT_USER__ = '_gpi_current_user_';

export function getCurrentSessionUser() {
    return JSON.parse(sessionStorage.getItem(_CURRENT_USER__));
}

export function setCurrentSessionUser(value) {
    sessionStorage.setItem(_CURRENT_USER__, JSON.stringify(value));
}

export function isAuth() {
    const currentUser = getCurrentSessionUser();
    return currentUser ? true : false;
}

export function sessionLogout() {
    sessionStorage.removeItem(_CURRENT_USER__);
}
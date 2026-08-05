const storageKey = `bewertungsraster-tel`;

export function getAll() {
    const data = window.localStorage.getItem(storageKey);
    if (data === null) return [];
    return JSON.parse(data);
}

export function set(data) {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
}
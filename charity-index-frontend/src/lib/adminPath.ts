const _prefix = ((import.meta.env.VITE_ADMIN_PREFIX as string) || '/admin').replace(/\/$/, '');

export const ADMIN = _prefix;
export const ap = (sub: string = '') => `${_prefix}${sub}`;

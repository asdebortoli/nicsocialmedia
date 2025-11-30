import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const FILE_CONFIG = {
  ALLOWED_TYPES: ['image/jpeg', 'image/png'],
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  UPLOAD_DIR: 'uploads/'
};

export const TOKEN_CONFIG = {
  EXPIRES_IN: 60 * 60, // 1h
  COOKIE_MAX_AGE: 86400000
};

export const USER_ROLES = {
    ADMIN: "admin",
    SUPERVISOR: "supervisor"
};
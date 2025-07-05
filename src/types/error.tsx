// types/errors.ts
export interface ApiError {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    details?: any;
    timestamp: string;
    field?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    errors?: ApiError[];
}
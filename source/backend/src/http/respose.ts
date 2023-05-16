
export interface ErrorResponse extends Error {
    code: number;
    message: string;
}

export interface SuccessResponse {
    code: number;
    message: string;
    data: any;
}

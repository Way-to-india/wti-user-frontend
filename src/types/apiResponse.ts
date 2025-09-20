export interface ApiResponse<T = any> {
    data: T | null;
    message: string;
    statusCode?: number;
    success: boolean;
    error?: any;
  }

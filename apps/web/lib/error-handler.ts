import { toast } from 'react-hot-toast';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Centralized error handling utility
 */
export class ErrorHandler {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Handle and display errors to users
   */
  static handle(error: unknown, context?: string): void {
    const errorInfo = this.normalizeError(error);
    
    // Log error for debugging
    this.logError(errorInfo, context);
    
    // Show user-friendly message
    this.showUserMessage(errorInfo);
  }

  /**
   * Handle errors silently (no user notification)
   */
  static handleSilent(error: unknown, context?: string): void {
    const errorInfo = this.normalizeError(error);
    this.logError(errorInfo, context);
  }

  /**
   * Normalize different error types into a consistent format
   */
  private static normalizeError(error: unknown): AppError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: (error as any).code,
        details: this.isDevelopment ? error.stack : undefined,
      };
    }

    if (typeof error === 'string') {
      return { message: error };
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: String((error as any).message),
        code: (error as any).code,
        details: this.isDevelopment ? error : undefined,
      };
    }

    return {
      message: 'An unexpected error occurred',
      details: this.isDevelopment ? error : undefined,
    };
  }

  /**
   * Log error to console and potentially external services
   */
  private static logError(error: AppError, context?: string): void {
    const logMessage = context 
      ? `[${context}] ${error.message}`
      : error.message;

    console.error(logMessage, {
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    });

    // In production, you might want to send to external logging service
    // Example: Sentry.captureException(error);
  }

  /**
   * Show user-friendly error message
   */
  private static showUserMessage(error: AppError): void {
    // Map common error codes to user-friendly messages
    const userMessage = this.getUserFriendlyMessage(error);
    toast.error(userMessage);
  }

  /**
   * Get user-friendly error message
   */
  private static getUserFriendlyMessage(error: AppError): string {
    // Handle common API error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'Please log in to continue';
      case 'FORBIDDEN':
        return 'You don\'t have permission to perform this action';
      case 'NOT_FOUND':
        return 'The requested resource was not found';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection and try again';
      case 'TIMEOUT':
        return 'Request timed out. Please try again';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }

  /**
   * Create a user-friendly error message for form validation
   */
  static createValidationError(field: string, message: string): AppError {
    return {
      message: `${field}: ${message}`,
      code: 'VALIDATION_ERROR',
    };
  }

  /**
   * Create a user-friendly error message for API errors
   */
  static createApiError(message: string, code?: string): AppError {
    return {
      message,
      code: code || 'API_ERROR',
    };
  }
}

/**
 * Convenience function for handling errors
 */
export const handleError = (error: unknown, context?: string) => {
  ErrorHandler.handle(error, context);
};

/**
 * Convenience function for handling errors silently
 */
export const handleErrorSilent = (error: unknown, context?: string) => {
  ErrorHandler.handleSilent(error, context);
}; 
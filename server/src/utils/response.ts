import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp?: string;
  statusCode?: number;
}

/**
 * Send a standardized API response
 * @param res Express Response object
 * @param statusCode HTTP status code
 * @param success Whether the operation was successful
 * @param message Response message
 * @param data Response data (optional)
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null
): Response => {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
    statusCode
  };

  return res.status(statusCode).json(response);
};

/**
 * Send a successful response (200)
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T | null = null
): Response => {
  return sendResponse(res, 200, true, message, data);
};

/**
 * Send a created response (201)
 */
export const sendCreated = <T>(
  res: Response,
  message: string,
  data: T | null = null
): Response => {
  return sendResponse(res, 201, true, message, data);
};

/**
 * Send a bad request response (400)
 */
export const sendBadRequest = (
  res: Response,
  message: string = 'Bad Request'
): Response => {
  return sendResponse(res, 400, false, message, null);
};

/**
 * Send an unauthorized response (401)
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): Response => {
  return sendResponse(res, 401, false, message, null);
};

/**
 * Send a forbidden response (403)
 */
export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
): Response => {
  return sendResponse(res, 403, false, message, null);
};

/**
 * Send a not found response (404)
 */
export const sendNotFound = (
  res: Response,
  message: string = 'Not Found'
): Response => {
  return sendResponse(res, 404, false, message, null);
};

/**
 * Send a conflict response (409)
 */
export const sendConflict = (
  res: Response,
  message: string = 'Conflict'
): Response => {
  return sendResponse(res, 409, false, message, null);
};

/**
 * Send a validation error response (422)
 */
export const sendValidationError = (
  res: Response,
  message: string = 'Validation Error',
  errors?: any
): Response => {
  return sendResponse(res, 422, false, message, errors);
};

/**
 * Send an internal server error response (500)
 */
export const sendInternalError = (
  res: Response,
  message: string = 'Internal Server Error'
): Response => {
  return sendResponse(res, 500, false, message, null);
};

/**
 * Send a service unavailable response (503)
 */
export const sendServiceUnavailable = (
  res: Response,
  message: string = 'Service Unavailable'
): Response => {
  return sendResponse(res, 503, false, message, null);
};

/**
 * Send a paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  message: string,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
): Response => {
  const response = {
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
    statusCode: 200
  };

  return res.status(200).json(response);
};

/**
 * Handle async errors in controllers
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validate required fields in request body
 */
export const validateRequiredFields = (
  body: any,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Send validation error for missing fields
 */
export const sendMissingFieldsError = (
  res: Response,
  missingFields: string[]
): Response => {
  const message = `Missing required fields: ${missingFields.join(', ')}`;
  return sendValidationError(res, message, { missingFields });
};

/*
███████████████████████████████████████████████████████████████████████████████
██******************** PRESENTED BY t33n Software ***************************██
██                                                                           ██
██                  ████████╗██████╗ ██████╗ ███╗   ██╗                      ██
██                  ╚══██╔══╝╚════██╗╚════██╗████╗  ██║                      ██
██                     ██║    █████╔╝ █████╔╝██╔██╗ ██║                      ██
██                     ██║    ╚═══██╗ ╚═══██╗██║╚██╗██║                      ██
██                     ██║   ██████╔╝██████╔╝██║ ╚████║                      ██
██                     ╚═╝   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝                      ██
██                                                                           ██
███████████████████████████████████████████████████████████████████████████████
███████████████████████████████████████████████████████████████████████████████
*/

/**
 * @fileoverview Axios Request Wrapper Utility
 * Provides a standardized way to make HTTP requests with error handling
 * 
 * @author t33n Software
 * @copyright 2025 t33n Software
 * @license MIT
 */

// 
import { HttpClientError } from 'error-manager-helper'

import axios,
{ 
    type Method, type AxiosError, type RawAxiosRequestHeaders
} from 'axios'

/**
 * Interface for request parameters
 * Defines the structure of parameters needed for making HTTP requests
 * 
 * @interface RequestParams
 * @property {string} url - The target URL for the request
 * @property {Method} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @property {any} [payload] - Optional request body data
 * @property {RawAxiosRequestHeaders} [headers] - Optional request headers
 * @property {number} [timeout=30000] - Request timeout in milliseconds
 * @property {('arraybuffer'|'blob'|'document'|'json'|'text'|'stream')} [responseType] - Expected response data type
 * @property {string} [errorMessage] - Custom error message for failed requests
 */
interface RequestParams {
    url: string;
    method: Method
    payload?: any
    headers?: RawAxiosRequestHeaders
    timeout?: number
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
    errorMessage?: string
}

/**
 * Wraps axios HTTP requests with standardized error handling
 * 
 * @async
 * @function axiosRequestWrapper
 * @param {RequestParams} params - Request configuration parameters
 * @param {string} params.url - Target URL for the request
 * @param {Method} params.method - HTTP method to use
 * @param {any} [params.payload] - Request body data
 * @param {RawAxiosRequestHeaders} [params.headers] - Request headers
 * @param {number} [params.timeout=30000] - Request timeout (ms)
 * @param {string} [params.responseType] - Expected response type
 * @param {string} [params.errorMessage='axiosRequestWrapper() - Request failed'] - Custom error message
 * 
 * @returns {Promise<any>} Response from the server
 * @throws {HttpClientError} When request fails or timeout occurs
 * 
 * @example
 * ```typescript
 * const response = await axiosRequestWrapper({
 *   url: 'https://api.example.com/data',
 *   method: 'GET',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * ```
 */
async function axiosRequestWrapper({
    url, method, payload, headers,
    timeout = 30000,
    responseType,
    errorMessage = 'axiosRequestWrapper() - Request failed'
}: RequestParams): Promise<any> {
    try {
        // 
        const response = await axios({
            url,
            method,
            data: payload,
            headers,
            timeout,
            responseType
        })
        
        return response
    } catch (e: unknown) {
        // 
        throw new HttpClientError(errorMessage, e as AxiosError)
    }
}

export default axiosRequestWrapper
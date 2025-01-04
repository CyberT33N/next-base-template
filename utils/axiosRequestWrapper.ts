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

// ==== DEPENDENCIES ====
import { HttpClientError } from 'error-manager-helper'

import axios,
{ 
    type AxiosRequestConfig, type Method, type AxiosError
} from 'axios'

interface RequestParams {
    url: string;
    method: Method
    payload?: any
    headers?: {
          [key: string]: string
    }
    timeout?: number
    errorMessage?: string
}

async function axiosRequestWrapper({
    url, method, payload, headers,
    timeout,
    errorMessage = 'axiosRequestWrapper() - Request failed'
}: RequestParams): Promise<any> {
    const config: AxiosRequestConfig = {
        url,
        method,
        ...(headers && { headers }),
        ...(payload && { data: payload })
    }

    if (timeout) {
        await new Promise(resolve => setTimeout(resolve, timeout))
    }

    try {
        const response = await axios.request(config)
        return response
    } catch (e: unknown) {
        throw new HttpClientError(errorMessage, e as AxiosError)
    }
}

export default axiosRequestWrapper
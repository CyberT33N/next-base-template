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

// ==== VITEST ====
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// ==== DEPENDENCIES ====
import axios, { AxiosRequestConfig, Method } from 'axios'
import sinon from 'sinon'
import _ from 'lodash'
import axiosRequestWrapper from '@/utils/axiosRequestWrapper'

import {
    type IHttpClientError,
    HttpClientError,
    StatusCodes, ErrorType
} from 'error-manager-helper'

interface RequestParams {
     url: string;
     method: Method
     data?: any
     payload?: any
     headers?: {
           [key: string]: string
     }
     errorMessage?: string
}

describe('[UNIT] - @/utils/axiosRequestWrapper.ts', () => {
    describe('[ERROR]', () => {
        let axiosRequestStub: sinon.SinonStub

        const errorMessage = 'Request failed'
        const error = new Error(errorMessage)

        beforeEach(() => {
            axiosRequestStub = sinon.stub(axios, 'request').rejects(error)
        })

        afterEach(() => {
            axiosRequestStub.restore()
        })
          
        it('should throw an HttpClientError when the request fails and custom Error title', async() => {
            axiosRequestStub.rejects(error)

            const config = {
                url: 'https://example.com',
                method: 'GET',
                errorMessage: 'Any crazy error..'
            } as RequestParams

            try {
                await axiosRequestWrapper(config)
                expect('Should not reach this line').toBe(false)
            } catch (err: unknown) {
                const typedErr = err as IHttpClientError
                expect(typedErr).toBeInstanceOf(HttpClientError)
                expect(typedErr.message).toBe(config.errorMessage)
                expect(typedErr.name).toBe(ErrorType.HTTP_CLIENT)
                expect(typedErr.error?.message).toBe(errorMessage)
                expect(typedErr.httpStatus).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            }

            expect(axiosRequestStub.calledOnceWithExactly(_.omit(config, 'errorMessage'))).toBe(true)

            // Must be used for coverage
            await expect(axiosRequestWrapper(config)).rejects.toThrow('Any crazy error..')
        })
    })

    describe('[SUCCESS]', () => {
        let axiosRequestStub: sinon.SinonStub

        const responseBody = { data: 'Success' }

        beforeEach(() => {
            axiosRequestStub = sinon.stub(axios, 'request').resolves(responseBody)
        })

        afterEach(() => {
            axiosRequestStub.restore()
        })

        describe('[DEFAULT]', () => {
            it('should make a successful request with url + method and return the response', async() => {
                const config = {
                    url: 'https://example.com',
                    method: 'GET'
                } as RequestParams

                const result = await axiosRequestWrapper(config)

                expect(result).toEqual(responseBody)
                expect(axiosRequestStub.calledOnceWithExactly(config)).toBe(true)
            })
        })

        describe('[TIMEOUT]', () => {
            let setTimeoutSpy: sinon.SinonSpy

            beforeEach(() => {
                setTimeoutSpy = sinon.spy(global, 'setTimeout')
            })
    
            afterEach(() => {
                setTimeoutSpy.restore()
            })

            it('should make a successful request and use timeout', async() => {
                const config = {
                    url: 'https://example.com',
                    method: 'GET',
                    timeout: 1000
                } as RequestParams

                const result = await axiosRequestWrapper(config)

                expect(result).toEqual(responseBody)
                expect(axiosRequestStub.calledOnceWithExactly(_.omit(config, 'timeout'))).toBe(true)

                expect(setTimeoutSpy.called).toBe(true)
            })
        })

        describe('[HEADERS]', () => {
            it('should make a successful request with header and return the response', async() => {
                const config = {
                    url: 'https://example.com',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                } as RequestParams

                const result = await axiosRequestWrapper(config)

                expect(result).toEqual(responseBody)
                expect(axiosRequestStub.calledOnceWithExactly(config)).toBe(true)
            })
        })

        describe('[PAYLOAD]', () => {
            it('should make a successful request with payload and return the response', async() => {
                const config = {
                    url: 'https://example.com',
                    method: 'POST',
                    payload: {
                        test: true
                    }
                } as RequestParams

                const result = await axiosRequestWrapper(config)

                expect(result).toEqual(responseBody)

                // Payload will be passed as { data: payload }
                const expectedConfig = _.cloneDeep(config)
                expectedConfig.data = config.payload 
                delete expectedConfig.payload

                expect(axiosRequestStub.calledOnceWithExactly(expectedConfig)).toBe(true)
            })
        })

        describe('[ERROR MESSAGE]', () => {
            it('should make a successful request with error message and return the response', async() => {
                const config = {
                    url: 'https://example.com',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    errorMessage: 'Request failed'
                } as RequestParams

                const result = await axiosRequestWrapper(config)

                expect(result).toEqual(responseBody)
                expect(axiosRequestStub.calledOnceWithExactly(_.omit(config, 'errorMessage'))).toBe(true)
            })
        })
    })
})
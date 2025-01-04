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
import { describe, beforeEach, afterEach, it, expect } from 'vitest'

// ==== CODE ====
import { createMock } from '@/utils/test/sinon/mockUtils'

describe('[UNIT] - mockUtils.ts', () => {
    describe('createMock', () => {
        describe('npm_lifecycle_event = test:production', () => {
            beforeEach(() => {
                process.env.npm_lifecycle_event = 'test:production'
            })

            afterEach(() => {
                delete process.env.npm_lifecycle_event
            })
      
            it('should create a spy when in production mode', () => {
                const method = 'someMethod'
                const obj = {
                    [method]: () => { 
                        return { test: true }
                    }
                }

                const spy = createMock(obj, method)

                expect(spy.called).toBe(false)

                const res = obj[method]()

                expect(spy.called).toBe(true)
                expect(res).toEqual({ test: true })

                spy.restore()
            })
        })

        it('should create a stub when not in test:production mode', async() => {
            const method = 'someMethod'
            const obj = {
                [method]: () => { 
                    return { test: true }
                }
            }

            const mockImplementation = { test: false }

            const stub = createMock(obj, method, mockImplementation)

            const res = await obj[method]()

            expect(stub.called).toBe(true)
            expect(res).toEqual(mockImplementation)

            stub.restore()
        })
    })
})
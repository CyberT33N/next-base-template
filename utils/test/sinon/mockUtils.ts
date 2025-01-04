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
import sinon from 'sinon'

/**
 * Creates a mock for a method on an object.
 * 
 * @param obj - The object on which the method exists.
 * @param method - The name of the method to mock.
 * @param mockImplementation - The implementation to use for the mock.
 * @returns The created mock.
 */
export const createMock = (obj: any, method: string, mockImplementation?: any) => {
    if (process.env.npm_lifecycle_event === 'test:production') {
        return sinon.spy(obj, method) as sinon.SinonSpy
    } 
     
    return sinon.stub(obj, method).resolves(mockImplementation) as sinon.SinonStub
}
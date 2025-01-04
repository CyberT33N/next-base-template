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

// ==== BOOTSTRAP ====
import { bootstrap } from '@/src/bootstrap'

// // ==== UTILS ====
// import MongoUtils from '@/utils/db/mongodb/MongoUtils'

// // ==== CLASSES ====
// import MongooseUtils from '@/utils/db/mongodb/MongooseUtils'

export async function setup() {
    console.log('[PRETEST] - INIT..')

    await bootstrap()

    // const mongoUtils = await MongoUtils.getInstance(process.env.MONGODB_ETH_DB_NAME)
    // await mongoUtils.dropDatabase()

    console.log('[PRETEST] - Done!')
}
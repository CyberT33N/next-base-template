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

// // ==== NEXT.JS ====
// import { NextRequest, NextResponse } from 'next/server'

// // ==== SERVICES ====
// import EthCoinManager from '@/utils/crypto/eth/EthCoinManager/index'
// const ethCoinManager = new EthCoinManager()

// export async function GET(req: NextRequest) {
//     const { searchParams } = req.nextUrl
//     const address = searchParams.get('address')

//     if (!address) {
//         return NextResponse.json({ error: 'Missing parameter "address"' }, { status: 400 })
//     }

//     const balance = await ethCoinManager.balance.getBalanceInUSD(address)
//     return NextResponse.json({ balance }, { status: 200 })
// }
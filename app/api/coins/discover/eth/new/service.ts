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
import axios from '@/utils/axiosRequestWrapper'
import _ from 'lodash'

// ==== CONSTANTS ====
const baseUrl = `${process.env.GMGN_API_BASE_URL}/pairs/eth/new_pairs`

const columns = [
    { name: 'NAME', uid: 'name'},
    { name: 'CREATED', uid: 'created', sortable: true },
    { name: 'LIQUIDITY', uid: 'liquidity', sortable: true },
    { name: 'OPEN SOURCE', uid: 'openSource' },
    { name: 'LOCKED', uid: 'locked' },
    { name: 'RENOUNCED', uid: 'renounced' },
    { name: 'SOCIALS', uid: 'socials' }
]

const statusOptions = [
    { name: 'Legit', uid: 'legit' },
    { name: 'Scam', uid: 'scam' },
    { name: 'Unknown', uid: 'unknown' },
    { name: 'Pending', uid: 'pending' }
]


/**
 "data": {
        "pairs": [
            {
                "id": 1324599,
                "chain": "eth",
                "address": "0x28edc494f675fda6a20d752e08386c46df2e1987",
                "exchange": "univ2",
                "base_address": "0xf3c64e0f5f977af8fc1e90ae964a57ecd75aaa8d",
                "quote_address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "quote_symbol": "WETH",
                "liquidity": 12026.992686094083,
                "base_reserve": "44158251518.17009895500000000000",
                "quote_reserve": "1.60049805557993936300",
                "initial_liquidity": 7574.46123994536,
                "initial_base_reserve": "69000000000.00000000000000000000",
                "initial_quote_reserve": "1.00000000000000000000",
                "creation_timestamp": 1716505799,
                "quote_reserve_usd": "6025.26698999735132473706",
                "quote_token_info": {
                    "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    "symbol": "WETH",
                    "name": "Wrapped Ether",
                    "decimals": 18,
                    "logo": "https://gmgn.ai/defi/images/icon/WETH.png",
                    "total_supply": 3982784,
                    "max_supply": 3983869,
                    "price": 3764.62
                },
                "burn_ratio": "",
                "burn_status": "unknown",
                "base_token_info": {
                    "address": "0xf3c64e0f5f977af8fc1e90ae964a57ecd75aaa8d",
                    "symbol": "GENSLOR",
                    "name": "gey genslor",
                    "decimals": 9,
                    "logo": null,
                    "total_supply": 69000000000,
                    "max_supply": null,
                    "swaps_1h": 64,
                    "volume_1h": 21415.04341822558,
                    "price": 1.3673357095689e-7,
                    "price_1m": 1.3673357095689e-7,
                    "price_5m": 1.3742228071513e-7,
                    "price_1h": 0.00000255916363937541,
                    "biggest_pool_address": "0x28edc494f675fda6a20d752e08386c46df2e1987",
                    "buys_1h": 15,
                    "sells_1h": 49,
                    "price_change_percent1m": "0.00000000",
                    "price_change_percent5m": "-0.50116310",
                    "price_change_percent1h": "-94.65709934",
                    "is_show_alert": false,
                    "hot_level": 0,
                    "buy_tax": 0,
                    "sell_tax": 0,
                    "is_honeypot": 0,
                    "is_open_source": 1,
                    "renounced": 1,
                    "lockInfo": {
                        "isLock": true,
                        "lockDetail": [
                            {
                                "percent": "0.9999999999999998796141469142307992294417",
                                "pool": "burnt🔥",
                                "isBlackHole": true
                            }
                        ],
                        "lockTag": [
                            "blackhole"
                        ],
                        "lockPercent": 0.95,
                        "leftLockPercent": 0.05
                    },
                    "liquidity": 12026.992686094083,
                    "social_links": {
                        "telegram": "https://t.me/geygenslortoken",
                        "website": "https://www.geygenslor.com/"
                    },
                    "market_cap": 9434.61639602541
                },
                "open_timestamp": 1716505799,
                "base_reserve_value": 6037.91541729,
                "quote_reserve_value": 6025.26699,
                "launchpad": null
            }
        ]
    }
*/

const fetchNewPairsFromGMGN = async(query: {
     limit: number,
     orderby: string,
     direction: string,
     filters: string[],
     created: string,
     min_quote_usd: string
} = {
    limit: 50,
    orderby: 'open_timestamp',
    direction: 'desc',
    // 'not_honeypot', 'has_socials', 'has_logo', 'has_lock', 'has_liquidity'
    filters: [],
    created: '60m',
    min_quote_usd: '0'
}) => {
    const queryParams = Object.entries(query)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => `${key}[]=${v}`).join('&')
            } else {
                return `${key}=${value}`
            }
        })
        .join('&')

    const url = `${baseUrl}?${queryParams}`
    // console.log('New Pairs - Fetch(): url', url)

    const res = await axios({
        url,
        method: 'GET',
        errorMessage: 'Fetch() - Can not get coin data'
    })
    // console.log('New Pairs - Fetch(): raw:', JSON.stringify(res.data, null, 4))

    const newCoins = res.data.data.pairs

    if (_.isEmpty(newCoins)) {
        return { columns, coins: [], statusOptions }
    }

    const coins = res.data.data.pairs.map((coin: {
          liquidity: number,
          id: number,
          creation_timestamp: number,
          base_token_info: {
               is_open_source: boolean,
               name: string,
               renounced: boolean,
               logo: string,
               lockInfo: {
                  isLock: boolean,
               }
          },
          base_address: string,
          socials: string[],
     
     }) => { 
        return {
            id: coin.id,
            created: coin.creation_timestamp,
            liquidity: coin.liquidity,
            openSource: coin.base_token_info.is_open_source,
            locked: coin.base_token_info.lockInfo?.isLock,
            name: coin.base_token_info.name,
            renounced: coin.base_token_info.renounced,
            socials: coin.socials,
            logo: coin.base_token_info.logo,
            address: coin.base_address,
            status: 'pending'
        }
    })

    const stats = { columns, coins, statusOptions }
    return stats
}

export default fetchNewPairsFromGMGN

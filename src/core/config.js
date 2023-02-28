var presale_abi = require("./ABI/PresaleFactory.json");
var Fizi_abi = require("./ABI/Fizi.json");
var usdt_abi = require("./ABI/USDT-Testnet.json");
var busd_abi = require("./ABI/BUSD-Testnet.json");
var wbnb_abi = require("./ABI/WBNB-Testnet.json");

export const config = {
    chainId: 97, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    // mainNetUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    // mainNetUrl: 'https://rinkeby.infura.io/v3/',
    PresaleFactoryAddress : "0x9eB559DDF7546917b8D218B565dc66E403b48ECa",
    PresaleFactoryAbi : presale_abi,
    FiziAddress: '0x44aed0cf93582ae9aa13e1c04dd9fb1a06388d13',
    FiziAbi: Fizi_abi,
    USDTAddress: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd', 
    USDTAbi: usdt_abi,    
    BUSDAddress: '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7',
    BUSDAbi: busd_abi,
    WBNBAddress: '0xae13d989dac2f0debff460ac112a837c89baa7cd', 
    WBNBAbi: wbnb_abi,    
    INFURA_ID: 'e6943dcb5b0f495eb96a1c34e0d1493e'
}

export const def_config = {
    REBASE_RATE: 0.0003944,
    DPR: 0.0191,
    APY: 1000.0337,
    SWAP_FEE: 0.053,
    AUTO_SLIPPAGE: 1,
    DAILY_CLAIM: 1,
    BUY_FEE: 0.15,
    SELL_FEE: 0.3,
    DEF_PRICE: 0.01,
    ASTRO_DIGIT: 2,
    MAX_PRESALE_AMOUNT: 200000
}
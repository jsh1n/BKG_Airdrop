export async function switchEthereumChainOrNothing(ethereum) {
    if (ethereum.networkVersion !== 81) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x51' }],
          });
        } catch (e) {
          if (e.code === 4001) {
            console.error("Please connect to Shibuya testnet")
          }
          if (e.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x51',
                    chainName: 'Shibuya Network - Astar Testnet',
                    nativeCurrency: {
                      name: 'Shibuya',
                      symbol: 'SBY',
                      decimals: 18
                    },
                    blockExplorerUrls: ['https://shibuya.subscan.io'],
                    rpcUrls: ['https://rpc.shibuya.astar.network:8545'],
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
            }
          }
          console.error('hoge', e)
        }
    }
  }
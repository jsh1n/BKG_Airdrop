<script>
  import { ethers } from 'ethers';
  import { toast } from '@zerodevx/svelte-toast'
  import GiveawayABI from "./Giveaway.json"

  let account;
  let provider;
  let signer;
  let remainTokens;
  let connectWalletError;
  let walletConnected = false;
  let giveawayContract;
  
  async function connectWallet() {
    walletConnected = false;
    const { ethereum } = window;
    
    provider = new ethers.providers.Web3Provider(ethereum);
    giveawayContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      GiveawayABI.abi,
      provider
    )
    remainTokens = await giveawayContract.deposited();

    await ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accountList) => {
        const [firstAccount] = accountList;
        account = firstAccount;
        signer = provider.getSigner();
        giveawayContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          GiveawayABI.abi,
          signer
        )
        walletConnected = true;
      })

      .catch((error) => {
        walletConnected = false;
        connectWalletError = error;
        console.log('error connecting wallet');
      });

  }

  const claim = async () => {
    tx = await giveawayContract.claim().then(tx => {
      console.log(tx)
      return tx.wait().then(() => toast.push('BKG Claimed'))
    }).catch((e) => {
      toast.push(e.data.message)
    });
  }
</script>

<div class="walletButtonGroup justifyCenter">
  
  {#if walletConnected}
    <div class="box">
      Remain BKG: {remainTokens}
    </div>
    <div>
      <span class="dotConnected" />
      Connected Account: {account}
    </div>
    <div>
    <button class="button buttonClaim box" on:click={claim}>
      Claim BKG
    </button>
    </div>
    {:else} 
    <button class="button buttonMetaMask" on:click={connectWallet}>
      Connect MetaMask
    </button>
  {/if}

  <div class="network">
    After connecting MetaMask, please switch to Astar Network.
  </div>
</div>

<style>
  .box {
    margin: 10px;
  }

  .walletButtonGroup {
    margin: 10px 0;
    min-height: 46px;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
  }
  .justifyCenter {
    justify-content: center;
    text-align: center;
  }
  .network {
    margin: 2.5vh 0;
  }
  .buttonMetaMask {
    --button-bg-color: #f6851b;
  }
  .buttonClaim {
    --button-bg-color: white;
  }
  .dotConnected {
    display: inline-block;
    margin: 1px 10px;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: #34d399;
  }
  @media screen and (min-width: 768px) {
    .walletButtonGroup {
      flex-direction: row;
    }
  }
</style>
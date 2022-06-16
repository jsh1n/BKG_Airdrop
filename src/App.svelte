<script>
  import Header from './components/Header.svelte';
  import Bio from './components/Bio.svelte';
  import Wallet from './components/Wallet.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<main>
  <Header />
  <Bio />
  <Wallet />
  <SvelteToast />
</main>

<style>
</style>
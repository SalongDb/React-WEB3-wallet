import './Dashboard.css';

import { createConfig, http, useConnection, useDisconnect, WagmiProvider, useChains, useChainId, useConnect, useConnectors, useBalance } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

// Wagmi setup: chains, wallet connector and RPCs
const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        injected(), // MetaMask / browser wallets
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    }
})

// React Query client (required for wagmi v2)
const queryClient = new QueryClient();

function WalletOptions() {
    // Destructuring only the required methods/state from wagmi hooks
    const { connect } = useConnect();
    const connectors = useConnectors();
    const { address, isConnected } = useConnection();
    const { disconnect } = useDisconnect();

    // Chain-related hooks to identify current network
    const chains = useChains();
    const chainId = useChainId();
    const chain = chains.find((c) => c.id === chainId)

    // Balance hook: enabled only when wallet is connected
    const { data, isLoading, error, refetch } = useBalance({
        address,
        enabled: isConnected,
    })

    // Show wallet options before connection
    if (!isConnected) return <div className="walletOptions">
        <div className="heading">
            <p>Wallet not Connected</p>
        </div>
        <div className="options">
            {connectors.map((connector) => (
                <button key={connector.id} onClick={() => {
                    connect({ connector })
                }}>
                    {connector.name}
                </button>
            ))}
        </div>
    </div>

    // UI after wallet connection
    return <div className="afterConnection">
        <div className="paragraphs">
            <p>ADDRESS : {address}</p>
            <p>NETWORK : {chain?.name || 'Not Connected'}</p>
            <p>BALANCE : {isLoading ? "Loading..." : `${data?.formatted ?? "0"} ${data?.symbol ?? "ETH"}`}</p>
        </div>

        <div className="buttons">
            <button onClick={() => { refetch() }} disabled={isLoading}>{isLoading ? "Refreshing..." : "Refresh Balance"}</button>
            <button onClick={() => { disconnect() }}>Disconnect</button>
        </div>
    </div>
}

function Dashboard() {
    // Providers must wrap all wagmi hooks
    return <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
            <WalletOptions></WalletOptions>
        </WagmiProvider >
    </QueryClientProvider>
}

export default Dashboard;
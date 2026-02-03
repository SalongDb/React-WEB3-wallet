import './Dashboard.css';

import { createConfig, http, useConnection, useDisconnect, WagmiProvider, useChains, useChainId, useConnect, useConnectors, useBalance } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    }
})

const queryClient = new QueryClient();

function WalletOptions() {
    const { connect } = useConnect();
    const connectors = useConnectors();
    const { address, isConnected } = useConnection();
    const chains = useChains();
    const chainId = useChainId();
    const { disconnect } = useDisconnect();

    const chain = chains.find((c) => c.id === chainId)

    const { data, isLoading, error, refetch } = useBalance({
        address,
        enabled: isConnected,
    })

    console.log(data)

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

    return <div className="afterConnection">
        <div className="paragraphs">
        <p>ADDRESS : {address}</p>
        <p>NETWORK : {chain?.name || 'Not Connected'}</p>
        <p>CHAIN : {isLoading ? "Loading..." : `${data?.formatted ?? "0"} ${data?.symbol ?? "ETH"}`}</p>
        </div>

        <div className="buttons">
        <button onClick={() => { refetch() }} disabled={isLoading}>{isLoading ? "Refreshing..." : "Refresh Balance"}</button>
        <button onClick={() => { disconnect() }}>Disconnect</button>
        </div>
    </div>
}

function Dashboard() {

    return <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
            <WalletOptions></WalletOptions>
        </WagmiProvider >
    </QueryClientProvider>
}

export default Dashboard;
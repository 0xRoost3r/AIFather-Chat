'use client';

import {  useState, useMemo } from 'react'
import { Loader2, Copy, Check, Settings2 } from 'lucide-react';
import { useWriteContract, useTransactionReceipt, useAccount, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner'
import { FACTORY_CONTRACT_ABI, FACTORY_CONTRACT_ADDRESS } from '@/constant/thirdweb/TWCloneFactory';
import { ERC20_CONTRACT_ADDRESS } from '@/constant/thirdweb/ERC20Token';
import { ethers } from 'ethers';

interface TokenProps {
  name: string;
  symbol: string;
}

export function TokenThirdWebCard({ name, symbol }: TokenProps) {
  const { address, chain } = useAccount()
  const explorer = chain?.blockExplorers?.default
  const chainId = chain?.id
  console.log(`chainId`, chainId)

  
  const [isDeploying, setIsDeploying] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const deployFee = '0.000'
  const {data: receipt} = useTransactionReceipt({hash: transactionHash as `0x${string}`})
  const {data: balance} = useBalance({address: address})
  const formattedBalance = balance?.formatted
  
  const { writeContract, isSuccess, isPending } = useWriteContract({
      mutation: {
        onSuccess: (data: string) => {
          setTransactionHash(data);
          setIsDeploying(false);
          
          toast.success('Deploy token successfully!', {
            description: `Transaction hash: ${shortenAddress(data)}`,
            action: {
              label: 'View on Explorer',
              onClick: () => window.open(`https://base-sepolia.blockscout.com/tx/${data}`)
            }
          });
        },
        onError: (error: Error) => {
          console.error('Deploy error:', error);
          setIsDeploying(false);
          toast.error('Deploy token failed', {
            description: error.message
          });
        }
      }
  })

  const generateSalt = (userAddress: string) => {
    const timestamp = Date.now(); // Use a timestamp for uniqueness
    const salt = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256"], // Define the types (address, timestamp)
        [userAddress, timestamp] // Pass the user address and timestamp
      )
    );
    return salt;
  };

  const handleDeploy = async () => {
    if (!address) return;
    
    setIsDeploying(true);

    try {
      // Encode the initialize function call
      const initializeInterface = new ethers.Interface([
        "function initialize(address _defaultAdmin, string _name, string _symbol, string _contractURI, address[] _trustedForwarders, address _primarySaleRecipient, address _platformFeeRecipient, uint256 _platformFeeBps)"
      ]);

      const _data = initializeInterface.encodeFunctionData("initialize", [
        address,                // _defaultAdmin
        name,                   // _name
        symbol,                 // _symbol
        "",                     // _contractURI (empty string)
        [],                     // _trustedForwarders (empty array)
        address,                // _primarySaleRecipient
        address,                // _platformFeeRecipient
        0                       // _platformFeeBps
      ]);

      const _salt = generateSalt(address as string);

      await writeContract({
        address: FACTORY_CONTRACT_ADDRESS,
        abi: FACTORY_CONTRACT_ABI,
        functionName: 'deployProxyByImplementation',
        args: [ERC20_CONTRACT_ADDRESS, _data, _salt]
      });

    } catch (error) {
      setIsDeploying(false);
      console.error('Deploy preparation error:', error);
      toast.error('Failed to prepare deployment');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
    
  const insufficientBalance = useMemo(() => {
    if (!formattedBalance) return true
    return Number(formattedBalance) < Number(deployFee)
  }, [formattedBalance, deployFee])

  const handleSuggestion = (text: string) => {
    window.open(text, '_blank', 'noopener,noreferrer');
  }

  const contractAddress = receipt?.logs[1].address || null
  console.log(`isDeploying`, isDeploying)

  return (
    <div className="min-w-full mx-auto rounded-xl shadow-lg overflow-hidden bg-black/40 backdrop-blur-xl border border-pink-500/20">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between gap-8 pb-2">
          <div className="flex items-center gap-3">
            <div className='text-xs sm:text-sm font-semibold text-white/90'>
              <h2>Name: {name}</h2>
              <p>Symbol: {symbol}</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white/90">
            <h2>Total Supply: Mintable</h2>
            <h2>Decimals: 18</h2>
          </div>
        </div>
        {!isSuccess && <div className="space-y-2">
          <div className="flex items-center gap-3">
            {!address ? (
              <ConnectButton label='Connect wallet for deploy' />
            ) : (
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || insufficientBalance || isPending}
                className={`
                  bg-gradient-to-r from-pink-600 to-purple-500
                  text-white px-4 py-2 rounded-xl
                  flex items-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 ease-in-out
                  hover:scale-[1.02] active:scale-[0.98]
                  border border-pink-500/20
                `}
              >
                {isDeploying ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                    Deploying...
                  </>
                ) : (
                  <>
                    Deploy Token
                  </>
                )}
              </button>
            )}
          </div>  
          
          {address && (
            <p className="text-xs text-white/60">
              Estimated cost: {deployFee} {chain?.nativeCurrency.symbol} 
              <span className="ml-1 text-white/40">
                (Gas fee not included)
              </span>
            </p>
          )}
        </div>
        }

        {transactionHash && (
          <div className="mt-4 pt-4 border-t border-pink-500/20">
            <h3 className="font-semibold text-white/90 mb-2 text-base sm:text-base">Smart Contract Details</h3>
            <div className="space-y-2 text-xs sm:text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Transaction Hash:</span>
                <a 
                  href={`${explorer?.url}/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 truncate max-w-[200px]"
                >
                  {shortenAddress(transactionHash)}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Contract Address:</span>
                <div className="flex items-center gap-2">
                  <a 
                    href={`${explorer?.url}/address/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300 truncate max-w-[140px] sm:max-w-[160px]"
                  >
                    {transactionHash && !contractAddress ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs sm:text-sm">Fetching CA</span>
                      </span>
                    ) : (
                      shortenAddress(contractAddress || '')
                    )}
                  </a>
                  {contractAddress && (
                    <button
                      onClick={() => handleCopy(contractAddress || '')}
                      className="p-1 hover:bg-white/5 rounded-md"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-white/60" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Network:</span>
                <span>{chain?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Token Standard:</span>
                <span>ERC-20</span>
              </div>
              <div className="space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <span className="text-white/70">Suggestion:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <button 
                    onClick={() => handleSuggestion(`https://thirdweb.com/${chainId}/${contractAddress}`)} 
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 
                    text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 justify-center transition-all
                    border border-pink-500/20"
                  >
                    <Settings2 className="h-4 w-4" />
                    Manage token via ThirdWeb
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TokenLoadingProps {
  name: string;
}

export function TokenLoading({ name }: TokenLoadingProps) {
  return (
    <div className="min-w-full mx-auto bg-gradient-to-r from-pink-600 to-purple-500 rounded-xl shadow-lg overflow-hidden p-8 border border-pink-500/20 backdrop-blur-xl">
      <h2 className="text-4xl font-bold text-white text-center">{name}</h2>
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    </div>
  );
} 

// Thêm hàm rút gọn địa chỉ
const shortenAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
 
import React, { useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import WalletIcon from '../../img/icons/wallet2.png';
import { connectWallet, disconnect } from '../../core/web3';
import * as selectors from '../../store/selectors';
import { config } from "../../core/config";

const Header = function ({ navSelected, setIsOpen }) {
  const isMobile = useMediaQuery({ maxWidth: '1024px' });
  const userWalletState = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const pending = useSelector(selectors.loadingState);
  const chainId = useSelector(selectors.authChainID);

  const onConnect = async () => {
    await connectWallet();
  }

  const onDisconnect = async () => {
    await disconnect();
  }

  const addTokenCallback = useCallback(async () => {
    const tokenAddress = config.AstroAddress;
    const tokenSymbol = 'FXT';
    const tokenDecimals = 18;

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      if (wasAdded) {
        console.log('Adding FXT token');
      } else {
        console.log('GTF token has been added to you wallet!')
      }
    } catch (error) {
      console.log(error);
    }
  }, [])

  useEffect(() => {
    if (web3 !== null && chainId !== '' && web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId)) {
      console.log("Beast", web3, chainId)
      toast.error('Please change the network to BSC.');
    }
  }, [web3, chainId]);

  return (
    <div className='text-gray-100 flex justify-between' style={{ height: '100px', backgroundColor: '#011226', width: '100%', position: 'fixed', zIndex: '100' }}>
      <div className='flex justify-between z-index-9 p-3'>
        <a href="https://fidarzi.com/" style={{ paddingTop: '20px' }}>
          <img src="/img/logo.png" style={{height: '30px'}} />
        </a>
      </div>
      {navSelected !== 'Home' && (
        <div className='flex justify-between z-index-9'>
          <div className='flex'>
          </div>
          <div className='flex p-3 space-x-4 wallet_connect'>
            {web3 !== null && chainId !== '' && web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId) ? (
              <div className='connect-wal'>
                <img alt='' className='w-6 text-white mr-2' src={WalletIcon}  />
                <button className="flex text-error" onClick={onConnect}>Switch Network</button>
              </div>
            ) : (chainId === '' || userWalletState === '' || userWalletState === 0 ? (
              <div className='connect-wal'>
                <img alt='' className='w-6 text-white mr-2' src={WalletIcon}  />
                <button className='flex' onClick={onConnect}>CONNECT WALLET</button>
              </div>
            ) : (
              <>
                {
                  pending ? (
                    <div className='connect-wal'>
                      <div className="flex gap-1 align-items-center" >
                        <ReactLoading type={'spin'} width="25px" height="25px" color="#fff" />
                        <span className="text-gray">Pending...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex">
                        <div className="connect-wal flex-column">
                          <div className="flex">
                            <img alt='' className='w-6 text-white mr-2' src={WalletIcon}   />
                            <span>{userWalletState && (userWalletState.slice(0, 4) + "..." + userWalletState.slice(38))}</span>
                          </div>
                          <button className="btn-disconnect fs-12" onClick={onDisconnect} style={{ paddingLeft: "68px", marginTop: "-21px" }}>Disconnect</button>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            ))}
          </div>
        </div>
      )
      }
    </div >
  )
}
export default Header;
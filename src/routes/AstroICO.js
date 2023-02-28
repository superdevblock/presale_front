import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import Reveal from 'react-awesome-reveal';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconButton from '@mui/material/IconButton';
import ReactLoading from "react-loading";
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import Clock from '../components/Presale/Clock';
import SelectCoin from '../components/Presale/SelectCoin';
import * as selectors from '../store/selectors';
import { fadeIn, fadeInUp, getUTCNow, getUTCDate, numberWithCommas, LoadingSkeleton, isEmpty } from '../components/utils';
import {
  getTotalPresaleAmount,
  getpTokenPriceForUSDT,
  getBUSDForBNB,
  getUserPaidUSDT,
  getStartPresaleTime,
  getEndPresaleTime,
  buy_pToken
} from '../core/web3';
import { config, def_config } from '../core/config';
import Swal from 'sweetalert2';

const GlobalStyles = createGlobalStyle`
  .ico-container {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: column;
    background-size: 100% !important;
    background-position-x: center !important;
    .ico-header {
      max-width: 900px;
      padding: 20px;
      .ico-title {
        font-size: 36px;
        font-family: "Montserrat", Sans-serif;
      }
      .ico-desc {
        font-size: 20px;
      }
    }
    @media only screen and (max-width: 1400px) {
      flex-direction: column;
    }
    @media only screen and (max-width: 768px) {
      padding: 10px;
      .ico-header {
        padding: 20px;
        .ico-title {
          font-size: 28px;
        }
        .ico-desc {
          font-size: 18px;
        }
      }
    }
  }

  .input-token-panel {
    display: flex;
    background-color: transparent;
    flex-direction: column;
    text-align: left;
    gap: 10px;
    width: 45%;
    .input-box {
      border: solid 1px white;
      border-radius: 8px;
      @media only screen and (max-width: 576px) {
        span {
          font-size: 15px !important;
        }
      }
    }
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .input-token {
    width: 50%;
    background: transparent;
    outline: none;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      font-weight: normal;
    }
  }

  .email_input {
    max-width: 300px;
  }

  .presale-content {
    max-width: 900px;
    padding: 0;
    background: rgba(103, 58, 58, 0.15);
    border-radius: 20px;
    @media only screen and (max-width: 768px) {
      max-width: 100%;
    }
  }

  .presale-inner {
    border-radius: 12px;
    padding: 10px 60px 40px;
    position: relative;
    background: transparent;
    min-height: 200px;
    h3 {
      line-height: 2;
      margin-bottom: 0;
    }
    @media only screen and (max-width: 1024px) {
      padding: 60px 40px 40px;
    }
    @media only screen and (max-width: 768px) {
      padding: 0px 10px 40px;
    }
  }

  .presale-bg {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 76px;
  }

  .end-content {
    background: #2d81e2;
    padding: 16px;
    border-radius: 40px;
    width: 80%;
    margin: auto;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .buy_content {
    padding: 22px;
    border: solid 1.5px #5a5196;
    border-radius: 20px;
  }

  .progress-bg {
    @media only screen and (max-width: 576px) {
      width: 60%;
    }
  }

  .inverstors {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
  }

  .amount_bar_text {
    display: flex;
    justify-content: space-between;
  }

  .progress {
    height: 1.5rem;
    background-color: #a9a9a9;
  }

  .progress-bar {
    background-color: #7621ff;
  }

  .MuiLoadingButton-root {
    transition: all 0.5s ease;
  }

  .MuiLoadingButton-loading {
    padding-right: 40px;
    background: linear-gradient(90deg, #aa2d78 -3.88%, #a657ae 100%);
    color: rgb(255 255 255 / 50%) !important;
    transition: all 0.5s ease;
  }
  .swal2-popup {
    border-radius: 20px;
    background: #2f2179;
    color: white;
  }
  .swal2-styled.swal2-confirm {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .backdrop-loading {
  }
  
  .btn-change {
    width: 40px;
    height: 40px;
    background-color: #8b86a4 !important;
    border-radius: 50%;
    margin-bottom: 8px !important;
    color: white !important;
    &:hover {
      background-color: #8b86a4 !important;
    }
  }

  .presale-input {
    align-items: end;
    @media only screen and (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
    }
  }
`;

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

function CapBackGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"capBack"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="rgba(236, 0, 140, 0.5)" />
          <stop offset="90%" stopColor="rgba(252, 103, 103, 0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CapGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"cap"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="#EC008C" />
          <stop offset="100%" stopColor="#FC6767" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AmountBackGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"amountBack"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="rgba(5, 117, 230, 0)" />
          <stop offset="90%" stopColor="rgba(2, 242, 149, 0.61)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AmountGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"amount"} gradientTransform={gradientTransform}>
          <stop offset="0" stopColor="#00F260" />
          <stop offset="23.1%" stopColor="#01D97B" />
          <stop offset="73.02%" stopColor="#0581a0" />
          <stop offset="99.02" stopColor="#0575E6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const AstroICO = (props) => {
  const max_token_amount = def_config.MAX_PRESALE_AMOUNT;
  const balance = useSelector(selectors.userBalance);
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const isMobile = useMediaQuery({ maxWidth: '768px' });
  const [amountPercent, setAmountPercent] = useState(0);
  const [curPresale, setCurPresale] = useState('');
  const [capPercent, setCapPercent] = useState('');
  const [usdtPrice, setusdTPrice] = useState('');
  const [maxCap, setMaxCap] = useState(0); // USD
  const [minCap, setMinCap] = useState(0); // USDT
  const [maxTotalCap, setMaxTotalCap] = useState(''); // USDT
  const [leftCap, setLeftCap] = useState('');
  const [paidUSDT, setPaidUSDT] = useState(0); // USDT
  const [pFiziAmount, setPFiziAmount] = useState(0);
  const [toBNBPrice, settoBNBPrice] = useState(0);
  const [maxBNBCap, setmaxBNBCap] = useState('');
  const [coinType, setCoinType] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const [tokenAmountA, setTokenAmountA] = useState('');
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  const [ended, setEnded] = useState(false);

  const getInitAmount = useCallback(async () => {
    console.log('[Wallet] = ', wallet);
    if (!web3) {
      return;
    }
    setLoading(true);
    let tempusdtPrice = 0;
    let totalMaxCap = 0;
    let tempPaidUSDT = 0;
    let tempCurPresale = 0;
    let tempLeftCap = 0;

    let result = await getStartPresaleTime();
    if (result.success) {
      setStartTime(Number(result.start_time));
    } else {
      return;
    }

    result = await getEndPresaleTime();
    if (result.success) {
      setEndTime(Number(result.end_time));
    } 

    result = await getpTokenPriceForUSDT();
    if (result.success) {
      setusdTPrice(result.usdtPrice);
      tempusdtPrice = Number(result.usdtPrice);
    } 

    result = await getTotalPresaleAmount();
    if (result.success) {
      const percent = ((max_token_amount - Number(50000)) * 100) / max_token_amount;
      setAmountPercent(percent);
      tempCurPresale = (max_token_amount - Number(50000)) * tempusdtPrice;
      setCurPresale(tempCurPresale);
      tempLeftCap = max_token_amount * tempusdtPrice - tempCurPresale;
      setLeftCap(tempLeftCap);
    }

    result = await getUserPaidUSDT();
    if (result.success) {
      tempPaidUSDT = Number(result.paidUSDT);
      setPaidUSDT(tempPaidUSDT);
    }
   
    if (totalMaxCap <= tempPaidUSDT || tempLeftCap <= 0) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [web3, max_token_amount, wallet]);

  // arsinoe
  const handleSelectCoin = async (value) => {
    setCoinType(value);

    const fromToken = Number(tokenAmountA);

    if (fromToken === 0) {
      return;
    }

    if (value === 0) { // BNB
      const result = await getBUSDForBNB(fromToken);
      if (result.success) {
        settoBNBPrice(result.value);

        console.log("result.value :", result.value);

        setPFiziAmount(Number(result.value) / usdtPrice);
      }
    } else { // BUSD, USDT
      setPFiziAmount(fromToken / usdtPrice );        
    }
  }

  const handleChange = async (event) => {
    const value = Number(event.target.value);

    setTokenAmountA(event.target.value);

    if (value === 0) {
      setPFiziAmount(0);
      settoBNBPrice(0);
      return;
    }

    if (coinType === 0) {
      const result = await getBUSDForBNB(value);

      if (result.success) {
        settoBNBPrice(result.value);
        setPFiziAmount(Number(result.value) / usdtPrice);
      }
    } else {
      setPFiziAmount(value / usdtPrice);
    }
  }

  const validate = () => {
    if (isEmpty(tokenAmountA) || Number(tokenAmountA) === 0) {
      toast.error("Please enter a valid amount for purchase.");
      return;
    }

    // if ((coinType === 0 && Number(toBNBPrice) < Number(minCap)) || (coinType === 1 && Number(tokenAmountA) < Number(minCap))) {
    //   toast.error('Please enter a valid amount for purchase. The minimum amount you can buy is $100 and the maximum is $4,000 during Presale.');
    //   return;
    // }

    // if ((coinType === 0 && Number(toBNBPrice) > Number(maxCap)) || (coinType === 1 && Number(tokenAmountA) > Number(maxCap))) {
    //   toast.error('Please enter a valid amount for purchase. The minimum amount you can buy is $100 and the maximum is $4,000 during Presale.');
    //   return;
    // }

    if ((coinType === 0 && Number(balance.bnbBalance) < Number(tokenAmountA)) || (coinType === 1 && Number(balance.busdBalance) < Number(tokenAmountA)) || (coinType === 2 && Number(balance.usdtBalance) < Number(tokenAmountA))) {
      toast.error("You have insufficient amount to buy FIZI.");
      return false;
    }
    if (Number(startTime) * 1000 > getUTCNow()) {
      toast.error("Presale has not started yet.");
      return false;
    } else if (Number(endTime) * 1000 < getUTCNow()) {
      toast.error("Presale has ended.");
      return false;
    }
    return true;
  }

  const handleMax = async () => {
    const value = coinType === 0 ? Number(balance.BNBBalance) : Number(balance.USDTBalance);
    setTokenAmountA(value);
    if (value === 0) {
      setPFiziAmount(0);
      settoBNBPrice(0);
      return;
    }
    if (coinType === 0) {
      const result = await getBUSDForBNB(value);
      if (result.success) {
        settoBNBPrice(result.value);
        setPFiziAmount(Number(result.value) / usdtPrice);
      }
    } else {
      setPFiziAmount(value / usdtPrice);
    }
  }

  const handleBuy = async () => {
    if (!validate()) return;
    setPending(true);
    try {
      const coinAmount = tokenAmountA;
      const result = await buy_pToken(coinAmount, coinType);
      if (result.success) {
        getInitAmount();
        Swal.fire({
          icon: 'success',
          title: ' Success',
          text: 'You have bought FIZI for presale successfully.'
        });
      } else {
        toast.error("Transaction has been failed. " + result.error);
      }
    } catch (error) {
      toast.error("Transaction has been failed. " + error);
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    getInitAmount();
  }, [getInitAmount]);

  useEffect(() => {
    const checkCoinType = async () => {
      if (coinType === 0) {
        setFromBalance(balance.bnbBalance);
      } else if (coinType === 1){
        setFromBalance(balance.busdBalance);
      } else {
        setFromBalance(balance.usdtBalance);
      }
      setToBalance(balance.astroBalance);
    }
    checkCoinType();
  }, [balance, coinType]);

  // useEffect(() => {
  //   const myBalance = coinType === 0 ? Number(balance.BNBBalance) : Number(balance.USDTBalance);
  //   if (isEmpty(tokenAmountA) || Number(tokenAmountA) <= 0 || Number(tokenAmountA) > Number(myBalance)) {
  //     setDisabled(true);
  //   } else {
  //     setDisabled(false);
  //   }
  // }, [coinType, tokenAmountA]);

  useEffect(() => {
    const checkEndPresale = async () => {
      const result = await getEndPresaleTime();
      if (result.success) {
        setEndTime(result.end_time);
      }
    }
    if (ended) {
      checkEndPresale();
    }
  }, [ended]);

  const addTokenCallback = useCallback(async () => {
    const tokenAddress = config.FiziAddress;
    const tokenSymbol = 'FIZI';
    const tokenDecimals = 18;
    const tokenImage = `https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/${config.AstroAddress}/logo.png`;

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Adding FIZI token');
      } else {
        console.log('FIZI token has been added to you wallet!')
      }
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <div className='page-container text-center ico-container'>
      <GlobalStyles />
      <div className='ico-header'>
        <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
          <p className='ico-title'>Welcome to the FIZI Presale</p>
        </Reveal>
        <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
          <p className="ico-desc">
            Presale term - { getUTCDate(startTime) } - { getUTCDate(endTime) } <br /> You can participate using BNB, BUSD and USDT.
          </p>
        </Reveal>
        <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
          <p className="ico-desc">
            This is our FIZI token address
          </p>
          <p style={{ color: '#00ffd9', fontFamily: "Lato, Sans-serif", fontSize: "18px", fontWeight: "400" }}>
            0x3cD60B512fAAeDDa07548c898e80fe818e076EeC
          </p>
        </Reveal>
      </div>
      {loading ? (
        <div className='backdrop-loading'>
          <Loading className='loading'>
            <ReactLoading type={'spinningBubbles'} color="#fff" />
          </Loading>
        </div>
      ) : (
        <>
          <Reveal className='onStep' keyframes={fadeIn} delay={800} duration={800} triggerOnce>
            <section className='presale-content'>
              <div className='presale-inner pt-3 pb-4'>
                <div className="row">
                  <div className="flex justify-content-between mb-3">
                    <div className='flex flex-column flex-md-row gap-2 '>
                      <span>Start Time: </span>
                      <span>{startTime === 0 ? <LoadingSkeleton /> : getUTCDate(startTime)}</span>
                    </div>
                    <div className='flex flex-column flex-md-row gap-2'>
                      <span>End Time: </span>
                      <span>{endTime === 0 ? <LoadingSkeleton /> : getUTCDate(endTime)}</span>
                    </div>
                  </div>
                  {leftCap !== '' && (
                    <>
                      {getUTCNow() / 1000 >= endTime || leftCap <= 0 ? (
                        <>
                          <div className='end-content'>
                            <span className='fs-20 fw-bold'>PRESALE HAS ENDED</span>
                          </div>
                          <p className='fs-20 fw-bold mt-3 mb-1 text-gray'>Your Holdings (FIZI): <span className='text-white'>{paidUSDT === '' ? <LoadingSkeleton /> : numberWithCommas(paidUSDT / Number(usdtPrice))}</span></p>
                        </>
                      ) : (
                        <>
                          <div className='col-md-4 align-self-center'>
                            <h3>TIME REMAINING TO PARTICIPATE IN PRESALE</h3>
                          </div>
                          <div className="col-md-8 align-self-center">
                            <Clock deadline={endTime * 1000} setEnded={(value) => setEnded(value)} />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
          </Reveal>
          {getUTCNow() / 1000 <= endTime && (
            <Reveal className='presale-content main mt-3 onStep' keyframes={fadeIn} delay={800} duration={800} triggerOnce>
              <div className='presale-inner'>
                <div className="row justify-center">
                  {/* <div className="col-md-6 col-sm-6 mt-5">
                    <div className="amount_bar px-3">
                      <h3>Presale Amount received</h3>
                      <div className='progress-bg m-auto'>
                        <AmountBackGradientSVG />
                        <AmountGradientSVG />
                        <CircularProgressbar
                          value={amountPercent}
                          text={`${numberWithCommas(amountPercent, 2)}%`}
                          styles={buildStyles({
                            pathColor: `url(#amount)`,
                            textColor: '#00DB8B',
                            strokeLinecap: "butt",
                            trailColor: `url(#amountBack)`
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 mt-5">
                    <div className="amount_bar px-3">
                      <h3>Your Hard Cap Amount</h3>
                      <div className='progress-bg m-auto'>
                        <CapBackGradientSVG />
                        <CapGradientSVG />
                        <CircularProgressbar
                          value={capPercent}
                          text={`${numberWithCommas(capPercent, 2)}%`}
                          styles={buildStyles({
                            pathColor: `url(#cap)`,
                            textColor: '#EF1485',
                            strokeLinecap: "butt",
                            trailColor: `url(#capBack)`
                          })}
                        />
                      </div>
                    </div>
                  </div> */}
                  <div className='col-md-12 mt-3'>
                    {isMobile ? (
                      <>
                        {/* <p className='fs-20 mb-1'>Presale Amount received <br /><strong>{curPresale === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(curPresale) + ' USDT'}</strong></p>
                        <p className='fs-20 mb-1'>Maximum Presale Amount Allocated <br /><strong>{usdtPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(max_token_amount * Number(usdtPrice)) + ' USDT'}</strong></p> */}
                        <p className='fs-20 mb-1'>FIZI Price <br /><strong>{usdtPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(Number(usdtPrice)) + ' USDT'}</strong></p>
                      </>
                    ) : (
                      <>
                        {/* <p className='fs-20 mb-1'>Presale Amount received : <strong>{curPresale === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(curPresale) + ' USDT'}</strong></p>
                        <p className='fs-20 mb-1'>Maximum Presale Amount Allocated : <strong>{usdtPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(max_token_amount * Number(usdtPrice)) + ' USDT'}</strong></p> */}
                        <p className='fs-20 mb-1'>FIZI Price : <strong>{usdtPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(Number(usdtPrice)) + ' USDT'}</strong></p>
                      </>
                    )}
                  </div>
                  {(/*startPresale && */leftCap > 0) && (
                    <>
                      {maxTotalCap <= paidUSDT && false ? (
                        <div className='buy_content'>
                          <p className='fs-20 mb-1'>You have got the maximum FIZI on presale.</p>
                          <p className='fs-20 mb-1'>Your Holdings (FIZI): {paidUSDT === '' ? <LoadingSkeleton /> : numberWithCommas(paidUSDT / Number(usdtPrice))}</p>
                        </div>
                      ) : (
                        <div className='col-md-12 mt-3'>
                          <div className='buy_content'>
                            <div className='row'>
                              <div className='col-md-12'>
                                <p className='fs-20'>Please enter the FIZI amount you'd like to purchase</p>
                                <div className='presale-input flex'>
                                  <div className="input-token-panel">
                                    <div className='flex justify-between'>
                                      <label className="fs-20">From</label>
                                      <span className='fs-20'>Balance: {numberWithCommas(Number(fromBalance))}</span>
                                    </div>
                                    <div className="d-flex justify-content-between input-box">
                                      <input type="number" className="input-token" name="input_from" placeholder='0.0' value={tokenAmountA} onChange={handleChange}></input>
                                      <button className='btn-max swap-color' onClick={handleMax}>MAX</button>
                                      <SelectCoin className='select-coin' value={coinType} onChange={handleSelectCoin} />
                                    </div>
                                  </div>
                                  <IconButton component="span" className="btn-change mx-auto">
                                    {isMobile ? (
                                      <i className="fa-solid fa-arrow-down"></i>
                                    ) : (
                                      <i className="fa-solid fa-arrow-right"></i>
                                    )}
                                  </IconButton>
                                  <div className="input-token-panel">
                                    <div className='flex justify-between'>
                                      <label className="fs-20">To</label>
                                      <span className='fs-20'>Balance: {numberWithCommas(Number(0))}</span>
                                    </div>
                                    <div className="d-flex justify-content-between input-box">
                                      <p className="input-token mb-0">{numberWithCommas(pFiziAmount, 1)}&nbsp;
                                        {coinType === 0 && (
                                          <span>{toBNBPrice === 0 ? '' : ' ($' + numberWithCommas(Number(toBNBPrice), 2) + ')'}</span>
                                        )}
                                      </p>
                                      <div className='flex align-items-center gap-2' style={{ padding: '10px' }}>
                                        <img
                                          loading="lazy"
                                          width="35" 
                                          height="35"
                                          src={`/img/icons/token_icon.png`}
                                          alt={`Coin of FIZI`}
                                        />
                                        <span className='fs-20'>{'FIZI'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-12 mt-3'>
                                <LoadingButton
                                  onClick={handleBuy}
                                  endIcon={<></>}
                                  loading={pending}
                                  loadingPosition="end"
                                  variant="contained"
                                  className="btn-buy btn-main btn3 m-auto fs-20"
                                >
                                  BUY FIZI
                                </LoadingButton>
                              </div>
                              <div className='flex justify-center align-items-center gap-3 mt-3 cursor-pointer' onClick={addTokenCallback}>
                                <img src="/img/icons/metamask.png" alt="" width="30"></img>
                                <span style={{ whiteSpace: 'nowrap' }}> Add FIZI to MetaMask</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </>
      )}
    </div >
  );
};

export default AstroICO;    
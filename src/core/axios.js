import axios from 'axios';
import { config } from './config';
import api from './api';

export const Axios = axios.create();
export const Canceler = axios.CancelToken.source();

export const getAstroPrice = async () => {
  try {
    const { data } = await Axios.get(`https://deep-index.moralis.io/api/v2/erc20/${config.AstroAddress}/price?chain=avalanche`, {
      headers: {
        'X-API-Key': 'jgbmIBfvp1EWtYWoCLmbzkvUXozuzYRailhd420Wo9xSCHk1dKRqwIMpvFGYMWXm'
      }
    });
    return {
      success: true,
      astroPrice: data.usdPrice
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    }
  }
}

export const getTokenHolders = async () => {
  try {
    const { data } = await Axios.get(`https://api.covalenthq.com/v1/43114/tokens/${config.AstroAddress}/token_holders/?format=JSON&page-number=0&page-size=999999999&key=${api.cova_api_key}`);
    if (data.error === false) {
      return {
        success: true,
        count: data.data.pagination.total_count
      }
    } else {
      return {
        success: false
      }
    }
    
  } catch (error) {
    console.log(error);
    return {
      success: false,
    }
  }
}

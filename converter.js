// const axios = require('axios');
import axios from 'axios';
import {keys} from './config.js';
const getExchange = async (fromCurrency, toCurrency) => {
    const response = await axios.get(keys.CURRENCY_API_TOKEN);
    const rate = response.data.rates;
    const currency = 1 / rate[fromCurrency];
    const exchangeRate = currency * rate[toCurrency];

    if(isNaN(exchangeRate)) 
        throw new Error(`Exchange rate is invalid for ${fromCurrency} and ${toCurrency}`);
    
    return exchangeRate;
} 

const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`${keys.COUNTRY_API_TOKEN}${toCurrency}`);
        return response.data.map(country => country.name.common);
    } catch(error) {
        throw new Error(`Unable to get countries for ${toCurrency}`);
    }

}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchange(fromCurrency, toCurrency);
    const country = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${country}`
}

convertCurrency('USD', 'KZT', 100)
    .then(message => {
        console.log(message);
    })
    .catch(error => {
        console.log(error.message)
    });
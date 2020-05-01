const connection = require('../database/connection')
const yahooFinance = require('yahoo-finance')
const stocksDetails = require('../services/stocksDetails')
const fs = require('fs')

const getTickerDetails = async (ticker) => {

    try {
        const quotes = await yahooFinance.quote({
            symbol: ticker,
            modules: ['price'],
        }, (error, quotes) => {
            return quotes
        })

        const price = quotes.price.regularMarketPrice

        const details = stocksDetails.getDetails(ticker)
        const type = details['SETOR'] === 'Fundos Imobiliários' ?
                    'FII' :
                    (details['SETOR'] === 'ETF' ? 'ETF' : 'Ação')
        const sector = details['SETOR']
        const subSector = details['SUBSETOR']

        return { price, type, sector, subSector }
    } catch(error) {
        console.log(error)
        return { error }
    }
}


module.exports = {
    async create(request, response) {
        const { ticker, amount, grade } = request.body
        const user_id = request.headers.authorization

        if (!fs.existsSync(__dirname + `/../database/${user_id}.sqlite`)) {
            return response.json({ error: 'Usuário não existe!'})
        }

        const { type, sector, price, subSector, error } = await getTickerDetails(ticker + '.sa')

        if (error) {
            return response.json({ error: 'Não foi possível localizar esta ação.' })
        }

        const db_connection = connection.connect(user_id)
        const [id] = await db_connection('stocks')
                .insert({
                    ticker,
                    type,
                    sector,
                    amount,
                    grade,
                    subSector
                })

        return response.json({ id, type, sector, price })
    },

    async list(request, response) {
        const user_id = request.headers.authorization

        if (!fs.existsSync(__dirname + `/../database/${user_id}.sqlite`)) {
            return response.json({ error: 'Usuário não existe!'})
        }

        const db_connection = connection.connect(user_id)
        const stocks = await db_connection('stocks')
                                .select('*')

        if (stocks) {
            for (let i in stocks) {
                const { price } = await getTickerDetails(stocks[i].ticker + '.sa')
                stocks[i].price = price
            }
        }

        return response.json(stocks)
    },

    async edit(request, response) {
        const { amount, grade } = request.body
        const { id } = request.params
        const user_id = request.headers.authorization

        if (!fs.existsSync(__dirname + `/../database/${user_id}.sqlite`)) {
            return response.json({ error: 'Usuário não existe!'})
        }

        const db_connection = connection.connect(user_id)
        const status = await db_connection('stocks')
                                .where('id', id)
                                .update('amount', amount)
                                .update('grade', grade)

        response.json({ status })
    },

    async delete(request, response) {
        const { id } = request.params
        const user_id = request.headers.authorization

        if (!fs.existsSync(__dirname + `/../database/${user_id}.sqlite`)) {
            return response.json({ error: 'Usuário não existe!'})
        }

        const db_connection = connection.connect(user_id)
        const status = await db_connection('stocks')
                                .where('id', id)
                                .delete()

        response.json({ status })
    }
}

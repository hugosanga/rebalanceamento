const connection = require('../database/connection')
const yahooFinance = require('yahoo-finance')
const stocksDetails = require('../services/stocksDetails')

const getTickerDetails = async (ticker) => {

    try {
        const quotes = await yahooFinance.quote({
            symbol: ticker,
            modules: ['price'],
        }, (error, quotes) => {
            return quotes
        })

        const price = quotes.price.regularMarketPrice

        const details = await stocksDetails.getDetails(ticker)
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

        const { type, sector, price, subSector, error } = await getTickerDetails(ticker + '.sa')

        if (error) {
            return response.json({ error: 'Não foi possível localizar esta ação.' })
        }

        try {

            const [id] = await connection('stocks')
                                    .insert({
                                        ticker,
                                        type,
                                        sector,
                                        amount,
                                        grade,
                                        subSector,
                                        user_id
                                    })

            return response.json({ id, type, sector, price })

        } catch (err) {

            return response.json({ err })
        }
    },

    async list(request, response) {
        const user_id = request.headers.authorization

        const stocks = await connection('stocks')
                                .where('user_id', user_id)
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


        const status = await connection('stocks')
                                .where('user_id', user_id)
                                .where('id', id)
                                .update('amount', amount)
                                .update('grade', grade)

        response.json({ status })
    },

    async delete(request, response) {
        const { id } = request.params
        const user_id = request.headers.authorization

        const status = await connection('stocks')
                                .where('user_id', user_id)
                                .where('id', id)
                                .delete()

        response.json({ status })
    }
}

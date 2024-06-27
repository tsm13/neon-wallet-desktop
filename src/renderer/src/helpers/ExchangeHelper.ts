import { TBlockchainServiceKey } from '@shared/@types/blockchain'
import { TMultiExchange } from '@shared/@types/query'

export class ExchangeHelper {
  static getExchangeRatio(hash: string, blockchain: TBlockchainServiceKey, multiExchange?: TMultiExchange): number {
    if (!multiExchange) return 0

    const blockchainExchange = multiExchange[blockchain]
    if (!blockchainExchange) return 0

    const exchange = blockchainExchange.find(exchange => exchange.hash === hash)

    return exchange?.price ?? 0
  }
}

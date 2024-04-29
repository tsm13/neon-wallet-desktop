import {
  TBalance,
  TBaseOptions,
  TMultiExchange,
  TTokenBalance,
  TUseBalancesParams,
  TUseBalancesResult,
} from '@renderer/@types/query'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { bsAggregator } from '@renderer/libs/blockchainService'
import { useQueries } from '@tanstack/react-query'

import { useExchange } from './useExchange'
import { useNetworkTypeSelector } from './useSettingsSelector'

const fetchBalance = async (param: TUseBalancesParams, multiExchange: TMultiExchange): Promise<TBalance> => {
  const service = bsAggregator.blockchainServicesByName[param.blockchain]
  const balance = await service.blockchainDataService.getBalance(param.address)

  const tokensBalances: TTokenBalance[] = []
  let exchangeTotal = 0

  await Promise.allSettled(
    balance.map(async balance => {
      const exchangeRatio = ExchangeHelper.getExchangeRatio(balance.token.hash, param.blockchain, multiExchange)
      const amountNumber = NumberHelper.number(balance.amount)
      const exchangeAmount = amountNumber * exchangeRatio

      exchangeTotal += exchangeAmount
      tokensBalances.push({
        ...balance,
        blockchain: param.blockchain,
        amount: balance.amount,
        amountNumber,
        exchangeAmount,
        exchangeRatio,
      })
    })
  )

  return {
    address: param.address,
    tokensBalances,
    exchangeTotal,
  }
}

export function useBalances(params: TUseBalancesParams[], queryOptions?: TBaseOptions<TBalance>): TUseBalancesResult {
  const { networkType } = useNetworkTypeSelector()

  const exchange = useExchange()

  const queries = useQueries({
    queries: exchange.data
      ? params.map(param => ({
          queryKey: ['balance', param.address ?? '', param.blockchain, networkType],
          queryFn: fetchBalance.bind(null, param, exchange.data),
          ...queryOptions,
        }))
      : [],
    combine: results => ({
      data: results.map(result => result.data).filter((balance): balance is TBalance => !!balance),
      isLoading: exchange.isLoading || results.some(result => result.isLoading),
      exchangeTotal: results.reduce((acc, result) => acc + (result.data?.exchangeTotal ?? 0), 0),
    }),
  })

  return queries
}

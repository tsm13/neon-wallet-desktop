import { useTranslation } from 'react-i18next'
import { BalanceChart } from '@renderer/components/BalanceChart'
import { Separator } from '@renderer/components/Separator'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useBalances } from '@renderer/hooks/useBalances'
import { useFilteredBalance } from '@renderer/hooks/useFilteredBalance'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { ChartCardList } from './ChartCardList'

export const PortfolioOverviewPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'portfolio.portfolioOverview' })
  const { accounts } = useAccountsSelector()
  const { wallets } = useWalletsSelector()
  const { currency } = useCurrencySelector()
  const balances = useBalances(accounts)

  const filteredTokenBalances = useFilteredBalance(balances)

  return (
    <section className="w-full flex flex-col bg-gray-800 rounded shadow-lg py-3 h-full px-4 min-w-0">
      <div className="flex justify-between text-sm mb-3">
        <h1 className="text-white">{t('overview')}</h1>

        {wallets && accounts && (
          <span className="text-gray-300">
            {t('walletsAndAccounts', { wallets: wallets.length, accounts: accounts.length })}
          </span>
        )}
      </div>

      <Separator />

      <div className="w-full flex justify-end">
        <div className="flex gap-2 pt-7 text-xl ml-2">
          <span className="text-gray-300">{t('balance')}</span>
          <span className=" text-white">
            {NumberHelper.currency(balances.exchangeTotal, currency.label, 2, 2, false)}
          </span>
        </div>
      </div>

      <ul className="flex h-[50%] items-center px-12">
        <BalanceChart balances={balances} tokenBalance={filteredTokenBalances} />
      </ul>

      {filteredTokenBalances.length > 0 && (
        <div className="flex flex-col gap-y-4 items-center">
          <Separator />
          <ChartCardList tokenBalance={filteredTokenBalances.slice(0, 4)} />
        </div>
      )}
    </section>
  )
}

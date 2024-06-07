import { useCallback } from 'react'
import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { TBlockchainServiceKey, TNetwork } from '@renderer/@types/blockchain'
import { settingsReducerActions } from '@renderer/store/reducers/SettingsReducer'

import { useAppDispatch, useAppSelector } from './useRedux'

export const useEncryptedPasswordSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.encryptedPassword)
  return {
    encryptedPassword: value,
    encryptedPasswordRef: ref,
  }
}

export const useSelectedNetworkByBlockchainSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.selectedNetworkByBlockchain)
  return {
    networkByBlockchain: value,
    networkByBlockchainRef: ref,
  }
}

export const useSelectedNetworkSelector = (blockchain: TBlockchainServiceKey) => {
  const { ref, value } = useAppSelector(state => state.settings.selectedNetworkByBlockchain[blockchain])
  return {
    network: value,
    networkRef: ref,
  }
}

export const useCurrencySelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.currency)
  return {
    currency: value,
    currencyRef: ref,
  }
}

export const useNetworkActions = () => {
  const dispatch = useAppDispatch()
  const { sessions, disconnect } = useWalletConnectWallet()

  const setNetwork = useCallback(
    async (blockchain: TBlockchainServiceKey, network: TNetwork) => {
      console.log({ network, blockchain })
      await Promise.allSettled(sessions.map(session => disconnect(session)))
      dispatch(settingsReducerActions.setSelectNetwork({ blockchain, network }))
    },
    [disconnect, dispatch, sessions]
  )

  const setNetworkNode = useCallback(
    (blockchain: TBlockchainServiceKey, url: string) => {
      dispatch(settingsReducerActions.setSelectedNetworkUrl({ blockchain, url }))
    },
    [dispatch]
  )

  return {
    setNetwork,
    setNetworkNode,
  }
}

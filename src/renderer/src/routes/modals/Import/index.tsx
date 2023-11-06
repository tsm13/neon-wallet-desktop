import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MdChevronRight } from 'react-icons/md'
import { TbFileImport } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { TBlockchainServiceKey } from '@renderer/@types/blockchain'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { TAccountToImport, useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useAppSelectorRef } from '@renderer/hooks/useRedux'
import { ModalLayout } from '@renderer/layouts/Modal'
import { selectAccounts } from '@renderer/store/account/SelectorAccount'
import { selectBsAggregator } from '@renderer/store/blockchain/SelectorBlockchain'

type TFormData = {
  text: string
}

type TFunctionsByInputTypes = Record<
  'key',
  {
    validate(value: string): boolean
    persist(value: string): void | Promise<void>
  }
>

export const ImportModal = () => {
  const form = useForm<TFormData>()
  const bsAggregator = useSelector(selectBsAggregator)
  const blockchainActions = useBlockchainActions()
  const accountsRef = useAppSelectorRef(selectAccounts)
  const { modalNavigate } = useModalNavigate()
  const { t } = useTranslation('modals', { keyPrefix: 'import' })

  const [isLoading, setIsLoading] = useState(false)

  const accountAlreadyExists = (address: string, blockchain: TBlockchainServiceKey) => {
    return accountsRef.current.some(account => account.address === address && account.blockchain === blockchain)
  }

  const persistWhenKey = async (key: string) => {
    const addresses = await UtilsHelper.promiseAll(bsAggregator.blockchainServices, async service => {
      if (!service.validateKey(key)) throw new Error()

      const blockchain = service.blockchainName
      const { address } = service.generateAccountFromKey(key)

      if (accountAlreadyExists(address, blockchain)) throw new Error()

      return {
        address,
        blockchain,
      }
    })

    if (!addresses.length) throw new Error(t('errors.allAddressesAlreadyImported'))

    const wallet = await blockchainActions.createWallet({
      name: 'test',
      walletType: 'legacy',
      mnemonic: undefined,
    })

    const accountsToImport = addresses.map<TAccountToImport>(({ address, blockchain }) => ({
      address,
      blockchain,
      key,
      type: 'legacy',
      wallet,
    }))

    await blockchainActions.importAccounts(accountsToImport)
  }

  const functionByInputTypes: TFunctionsByInputTypes = {
    key: {
      validate: bsAggregator.validateKeyAllBlockchains.bind(bsAggregator),
      persist: persistWhenKey,
    },
  }

  const handleSubmit: SubmitHandler<TFormData> = async data => {
    try {
      setIsLoading(true)
      if (!data.text.length) {
        throw new Error(t('errors.empty'))
      }

      const functionsByInputType = Object.entries(functionByInputTypes).find(([, values]) => {
        const isValid = values.validate(data.text)
        return isValid
      })

      if (!functionsByInputType) {
        throw new Error(t('errors.invalid'))
      }

      const [_key, functions] = functionsByInputType
      await functions.persist(data.text)
      modalNavigate(-1)
    } catch (error: any) {
      form.setError('text', { message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalLayout heading={t('title')} headingIcon={<TbFileImport />} headingIconFilled={false}>
      <p className="text-gray-200 uppercase font-bold">{t('subtitle')}</p>
      <p className="text-sm mr-">{t('description')}</p>

      <form className="mt-10" onSubmit={form.handleSubmit(handleSubmit)}>
        <Input
          placeholder={t('inputPlaceholder')}
          {...form.register('text')}
          errorMessage={form.formState.errors.text?.message}
        />

        <div className="flex justify-end min-w-1/2">
          <Button
            className="mt-8"
            type="submit"
            label={t('buttonContinueLabel')}
            rightIcon={<MdChevronRight />}
            loading={isLoading}
          />
        </div>
      </form>
    </ModalLayout>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbStepOut } from 'react-icons/tb'
import { TTokenBalance } from '@renderer/@types/query'
import { TContactAddress } from '@renderer/@types/store'
import { Button } from '@renderer/components/Button'
import { ContactList } from '@renderer/components/Contact/ContactList'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { SideModalLayout } from '@renderer/layouts/SideModal'

type TLocationState = {
  selectedToken?: TTokenBalance
  handleSelectContact: (address: TContactAddress) => void
}

export const SelectContact = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'selectContact' })
  const [selectedAddress, setSelectedAddress] = useState<TContactAddress | null>(null)
  const { modalNavigate } = useModalNavigate()
  const { selectedToken, handleSelectContact } = useModalState<TLocationState>()

  const selectRecipient = () => {
    if (!selectedAddress) {
      return
    }
    handleSelectContact(selectedAddress)
    modalNavigate(-1)
  }

  return (
    <SideModalLayout heading={t('title')} headingIcon={<TbStepOut />}>
      <ContactList
        onAddressSelected={setSelectedAddress}
        selectFirst={false}
        showSelectedIcon={true}
        blockchainFilter={selectedToken?.blockchain}
      >
        <Button
          className="mt-10 w-[16rem]"
          type="submit"
          label={t('selectRecipient')}
          disabled={selectedAddress ? false : true}
          onClick={selectRecipient}
        />
      </ContactList>
    </SideModalLayout>
  )
}

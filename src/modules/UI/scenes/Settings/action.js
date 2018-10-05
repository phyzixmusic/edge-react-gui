// @flow

import type { EdgeAccount } from 'edge-core-js'
import { disableTouchId, enableTouchId } from 'edge-login-ui-rn'
import { Actions } from 'react-native-router-flux'

import type { Dispatch, GetState } from '../../../../../src/modules/ReduxTypes.js'
import s from '../../../../locales/strings.js'
import { restoreWalletsRequest } from '../../../Core/Account/api.js'
import * as ACCOUNT_SETTINGS from '../../../Core/Account/settings.js'
import * as CORE_SELECTORS from '../../../Core/selectors'
import { updateExchangeRates } from '../../../ExchangeRates/action.js'
import { convertCurrency } from '../../../UI/selectors.js'
import { displayErrorAlert } from '../../components/ErrorAlert/actions.js'
import * as SETTINGS_ACTIONS from '../../Settings/action.js'
import { showModal } from '../../../ModalManager.js'
import { newSpendingLimits } from '../../Settings/spendingLimits/SpendingLimitsReducer.js'
import { OtpModal } from '../../../../components/modals/OtpModal.js';

const setPINModeStart = (pinMode: boolean) => ({
  type: 'UI/SCENES/SETTINGS/SET_PIN_MODE_START',
  data: { pinMode }
})

const setPINStart = (pin: string) => ({
  type: 'UI/SCENES/SETTINGS/SET_PIN_START',
  data: { pin }
})

const setDefaultFiatStart = (defaultFiat: string) => ({
  type: 'UI/SCENES/SETTINGS/SET_DEFAULT_FIAT_START',
  data: { defaultFiat }
})

const setMerchantModeStart = (merchantMode: boolean) => ({
  type: 'UI/SCENES/SETTINGS/SET_MERCHANT_MODE_START',
  data: { merchantMode }
})

const setBluetoothModeStart = (bluetoothMode: boolean) => ({
  type: 'UI/SCENES/SETTINGS/SET_BLUETOOTH_MODE_START',
  data: { bluetoothMode }
})

const setBitcoinOverrideServerStart = (overrideServer: string) => ({
  type: 'UI/SCENES/SETTINGS/SET_BITCOIN_OVERRIDE_SERVER_START',
  data: { overrideServer }
})

export const setPINModeRequest = (pinMode: boolean) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(setPINModeStart(pinMode))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  ACCOUNT_SETTINGS.setPINModeRequest(account, pinMode)
    .then(() => dispatch(SETTINGS_ACTIONS.setPINMode(pinMode)))
    .catch(error => {
      console.error(error)
    })
}

export const setPINRequest = (pin: string) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(setPINStart(pin))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  ACCOUNT_SETTINGS.setPINRequest(account, pin)
    .then(() => dispatch(SETTINGS_ACTIONS.setPIN(pin)))
    .catch(error => {
      console.error(error)
    })
}

export const setAutoLogoutTimeInMinutesRequest = (autoLogoutTimeInMinutes: number) => {
  const autoLogoutTimeInSeconds = autoLogoutTimeInMinutes * 60
  return setAutoLogoutTimeInSecondsRequest(autoLogoutTimeInSeconds)
}

export const setAutoLogoutTimeInSecondsRequest = (autoLogoutTimeInSeconds: number) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  ACCOUNT_SETTINGS.setAutoLogoutTimeInSecondsRequest(account, autoLogoutTimeInSeconds)
    .then(() => dispatch(SETTINGS_ACTIONS.setAutoLogoutTimeInSeconds(autoLogoutTimeInSeconds)))
    .catch(error => {
      console.error(error)
    })
}

export const setDefaultFiatRequest = (defaultFiat: string) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(setDefaultFiatStart(defaultFiat))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)

  // PSEUDO_CODE
  // get spendingLimits
  const spendingLimits = state.ui.settings.spendingLimits
  const { transaction } = spendingLimits
  const previousDefaultIsoFiat = state.ui.settings.defaultIsoFiat

  Promise.resolve()
    .then(() => {
      // update default fiat in account settings
      ACCOUNT_SETTINGS.setDefaultFiatRequest(account, defaultFiat)
    })
    .then(() => {
      // update default fiat in settings
      dispatch(SETTINGS_ACTIONS.setDefaultFiat(defaultFiat))
      const nextDefaultIsoFiat = getState().ui.settings.defaultIsoFiat
      // convert from previous fiat to next fiat
      return convertCurrency(state, previousDefaultIsoFiat, nextDefaultIsoFiat, transaction.amount)
    })
    .then(transactionAmount => {
      const nextSpendingLimits = {
        transaction: {
          ...transaction,
          amount: parseFloat(transactionAmount.toFixed(2))
        }
      }

      // update spending limits in account settings
      ACCOUNT_SETTINGS.setSpendingLimits(account, nextSpendingLimits)
      // update spending limits in settings
      dispatch(newSpendingLimits(nextSpendingLimits))
      dispatch(updateExchangeRates())
    })
    .catch(e => console.log(e))
}

export const setMerchantModeRequest = (merchantMode: boolean) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(setMerchantModeStart(merchantMode))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  ACCOUNT_SETTINGS.setMerchantModeRequest(account, merchantMode)
    .then(() => dispatch(SETTINGS_ACTIONS.setMerchantMode(merchantMode)))
    .catch(error => {
      console.error(error)
    })
}

export const setBluetoothModeRequest = (bluetoothMode: boolean) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(setBluetoothModeStart(bluetoothMode))

  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  ACCOUNT_SETTINGS.setBluetoothModeRequest(account, bluetoothMode)
    .then(() => dispatch(SETTINGS_ACTIONS.setBluetoothMode(bluetoothMode)))
    .catch(error => {
      console.error(error)
    })
}

export const checkCurrentPassword = (arg: string) => async (dispatch: Dispatch, getState: GetState) => {
  const clearPasswordError = { confirmPasswordError: '' }
  dispatch({ type: 'SET_CONFIRM_PASSWORD_ERROR', data: clearPasswordError })
  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  const isPassword = await account.checkPassword(arg)
  dispatch(SETTINGS_ACTIONS.setSettingsLock(!isPassword))
  if (!isPassword) {
    dispatch({ type: 'SET_CONFIRM_PASSWORD_ERROR', data: { confirmPasswordError: s.strings.fragmet_invalid_password } })
  }
}

export const lockSettings = () => async (dispatch: Dispatch) => {
  dispatch(SETTINGS_ACTIONS.setSettingsLock(true))
}

// Denominations
export const setDenominationKeyRequest = (currencyCode: string, denominationKey: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const account = CORE_SELECTORS.getAccount(state)
  const onSuccess = () => dispatch(SETTINGS_ACTIONS.setDenominationKey(currencyCode, denominationKey))
  const onError = e => console.log(e)

  return ACCOUNT_SETTINGS.setDenominationKeyRequest(account, currencyCode, denominationKey)
    .then(onSuccess)
    .catch(onError)
}

export const setBitcoinOverrideServerRequest = (overrideServer: string) => (dispatch: Dispatch) => {
  dispatch(setBitcoinOverrideServerStart(overrideServer))

  dispatch(SETTINGS_ACTIONS.setBitcoinOverrideServer(overrideServer))
}

// touch id interaction
export const updateTouchIdEnabled = (arg: boolean, account: EdgeAccount) => async (dispatch: Dispatch, getState: GetState) => {
  const folder = CORE_SELECTORS.getFolder(getState())
  // dispatch the update for the new state for
  dispatch(SETTINGS_ACTIONS.updateTouchIdEnabled(arg))
  if (arg) {
    enableTouchId(folder, account)
  } else {
    disableTouchId(folder, account)
  }
}

export const restoreWallets = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const account = state.core.account
  restoreWalletsRequest(account).then(Actions.walletList)
}

export function togglePinLoginEnabled (pinLoginEnabled: boolean) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const context = CORE_SELECTORS.getContext(state)
    const account = CORE_SELECTORS.getAccount(state)

    dispatch(SETTINGS_ACTIONS.togglePinLoginEnabled(pinLoginEnabled))
    return account.changePin({ enableLogin: pinLoginEnabled }).catch(async error => {
      const pinLoginEnabled = await context.pinLoginEnabled(account.username)

      // TODO: Make a proper error action so we can avoid the double dispatch:
      dispatch(SETTINGS_ACTIONS.togglePinLoginEnabled(pinLoginEnabled))
      console.log(error)
      dispatch(displayErrorAlert(error.message))
    })
  }
}

export const showReEnableOtpModal = () => async (dispatch: Dispatch) => {
  // Use `showModal` to put the modal component on screen:
  const resolveValue = await showModal(OtpModal)
  if (!resolveValue) return

  return {
    type: 'EAT_PIE'
  }
}
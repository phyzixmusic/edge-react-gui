import React, { Component } from 'react'
import { Modal, Dimensions, Text, View, TouchableHighlight,  LayoutAnimation, ScrollView, TouchableOpacity } from 'react-native'
import strings from '../../../../locales/default'
import {sprintf} from 'sprintf-js'
import PropTypes from 'prop-types'
import T from '../../components/FormattedText'
import { connect } from 'react-redux'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import Ionicon from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { Actions } from 'react-native-router-flux'
import styles from './style'
import {
  toggleWalletListModalVisibility,
  toggleSelectedWalletListModal,
  toggleScanToWalletListModal,
  disableWalletListModalVisibility
} from './action'
import {  findDenominationSymbol } from '../../scenes/WalletList/WalletListRow.ui'
import * as UI_ACTIONS from '../../Wallets/action.js'
import {getTransactionsRequest} from '../../../UI/scenes/TransactionList/action.js'
import * as Animatable from 'react-native-animatable'
import {border as b, cutOffText} from '../../../utils'
import * as UI_SELECTORS from '../../selectors.js'

class WalletListModal extends Component {
  constructor(props){
    super(props)
      if(!this.props.topDisplacement){
      this.props.topDisplacement = 68
    }
  }

  render () {
    return (
      <Animatable.View style={[b('green'), styles.topLevel, {position:'absolute', top: 38, height: (this.props.dimensions.deviceDimensions.height - this.props.dimensions.headerHeight - this.props.dimensions.tabBarHeight)}]}
        animation='fadeInDown'
        duration={100} >
        <ScrollView>
          <WalletListModalHeaderConnect type={this.props.type} />
          <WalletListModalBodyConnect onPress={this.props.onPress}
            selectionFunction={this.props.selectionFunction} style={{flex: 1}} />
        </ScrollView>
      </Animatable.View>
    )
  }
}

WalletListModal.propTypes = {
  dropdownWalletListVisible: PropTypes.bool,
  currentScene: PropTypes.string,
  dimensions: PropTypes.object
}
export const WalletListModalConnect = connect( state => ({
  walletList: state.ui.wallets.byId,
  dropdownWalletListVisible: state.ui.scenes.walletListModal.walletListModalVisible,
  walletTransferModalVisible: state.ui.scenes.walletTransferList.walletListModalVisible,
  scanToWalletListModalVisibility: state.ui.scenes.scan.scanToWalletListModalVisibility,
  dimensions: state.ui.scenes.dimensions
}))(WalletListModal)


class WalletListModalBody extends Component {
  selectFromWallet = (id, currencyCode = null) => {
    LayoutAnimation.easeInEaseOut()
    this.props.disableWalletListModalVisibility()
  }

  selectToWallet = (idx, currencyCode = null) => {
    LayoutAnimation.easeInEaseOut()
    this.props.disableWalletListModalVisibility()
  }

  renderTokens = (walletId, metaTokenBalances, code) => {
    var tokens = []
    for (var property in metaTokenBalances) {
      if(property != code){
        tokens.push( this.renderTokenRowContent(walletId, property, metaTokenBalances[property]) )
      }
    }
    return tokens
  }

  renderTokenRowContent = (parentId, currencyCode, balance ) => {

    let multiplier = this.props.walletList[parentId].allDenominations[currencyCode][this.props.settings[currencyCode].denomination].multiplier

    return(
      <TouchableOpacity style={[styles.tokenRowContainer]}
        key={currencyCode} onPress={() => {
          this.props.getTransactions(parentId, currencyCode)
          this.props.disableWalletListModalVisibility()
          this.props.selectWallet(parentId, currencyCode)
        }}>
        <View style={[styles.currencyRowContent]}>
          <View style={[styles.currencyRowNameTextWrap]}>
            <T style={[styles.currencyRowText]}>{currencyCode}</T>
          </View>
          <View style={[styles.currencyRowBalanceTextWrap]}>
            <T style={[styles.currencyRowText]}>{balance / multiplier}</T>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderWalletRow = (wallet, i) => {

    let multiplier = wallet.allDenominations[wallet.currencyCode][this.props.settings[wallet.currencyCode].denomination].multiplier
    let symbol = wallet.allDenominations[wallet.currencyCode][multiplier].symbol

    return (
      <View key={i}>
        <TouchableOpacity style={[styles.rowContainer]}
          onPress={() => {
            this.props.getTransactions(wallet.id, wallet.currencyCode)
            this.props.disableWalletListModalVisibility()
            this.props.selectWallet(wallet.id, wallet.currencyCode)
          }}>
          <View style={[styles.currencyRowContent]}>
            <View style={[styles.currencyRowNameTextWrap]}>
              <T style={[styles.currencyRowText]}>{cutOffText(wallet.name, 34)}</T>
            </View>
            <View style={[styles.rowBalanceTextWrap]}>
              <T style={[styles.currencyRowText]}>{symbol || ''} { wallet.balance / multiplier }</T>
            </View>
          </View>
        </TouchableOpacity>

        {this.renderTokens(wallet.id, wallet.balances, wallet.currencyCode)}
      </View>
    )
  }

  render () {
    console.log('rendering dropdown', this.props.selectedWalletId)
    return (
      <View>
        {
          Object.values(this.props.walletList).map((wallet, i) => {
            if(this.props.activeWalletIds.includes(wallet.id)){
              return this.renderWalletRow(wallet, i)
            }
          })
        }
      </View>
    )
  }
}

WalletListModalBody.propTypes = {
  selectionFunction: PropTypes.string,
}

export const WalletListModalBodyConnect = connect(
  (state) => {
    return {
      walletList: state.ui.wallets.byId,
      activeWalletIds: state.ui.wallets.activeWalletIds,
      selectedWalletId: UI_SELECTORS.getSelectedWalletId(state),
      settings: state.ui.settings
    }
  },
  dispatch => ({
    selectWallet: (walletId, currencyCode) => dispatch(UI_ACTIONS.selectWallet(walletId, currencyCode)),
    getTransactions: (walletId, currencyCode) => dispatch(getTransactionsRequest(walletId, currencyCode)),
    disableWalletListModalVisibility: () => dispatch(disableWalletListModalVisibility()),
    toggleSelectedWalletListModal: () => dispatch(toggleScanToWalletListModal()),
    toggleScanToWalletListModal: () => dispatch(toggleScanToWalletListModal())
  }))
(WalletListModalBody)

class WalletListModalHeader extends Component {
  constructor(props){
    super(props)
    this.props.type = 'from'
  }

  _onSearchExit = () => {
    this.props.dispatch(disableWalletListModalVisibility())
  }

  render () {
    let headerSyntax = (this.props.type === 'from') ? 'fragment_select_wallet_header_title' : 'fragment_send_other_wallet_header_title'
    return (
      <View style={[styles.rowContainer, styles.headerContainer ]}>
        <View style={[styles.headerContent, b()]}>
          <View style={[styles.headerTextWrap, b()]}>
            <T style={[styles.headerText, {color:'white'}, b()]}>
              {sprintf(strings.enUS[headerSyntax])}
            </T>
          </View>
          <TouchableHighlight style={[styles.modalCloseWrap, b()]}
            onPress={this._onSearchExit}>
            <Ionicon style={[styles.donebutton, b()]}
              name="ios-close"
              size={26}
              color='white'
            />
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

WalletListModalHeader.propTypes = {
  type: PropTypes.string
}

export const WalletListModalHeaderConnect = connect()(WalletListModalHeader)
// @flow

import React, { Component } from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import s from '../../../../../locales/strings.js'
import { FormattedDexOrderInfo } from '../../../../../types.js'
import styles, { styles as stylesRaw } from '../style.js'

export class OrderBookResultComponent extends Component<OrderBookResultOwnProps, State> {

  showConfirmFillDexOrderModal = (formattedOrder: FormattedDEXOrderInfo) => {
    this.props.showConfirmFillDexOrderModal(formattedOrder)
  }

  render () {
    const { makerNativeTokenAmount, takerNativeTokenAmount, exchangeRate, expiration, currencyCode } = this.props

    // warning, the formattedOrder variable CANNOT be submitted as the signed data to fill an order, this will NOT work
    const formattedOrder = {
      makerNativeTokenAmount,
      currencyCode,
      takerNativeTokenAmount,
      exchangeRate,
      expiration
    }
    return (
      <View style={[styles.singleTokenTypeWrap /*, data.item.symbol === this.state.selectedTokenType && styles.selectedItem*/]}>
        <TouchableHighlight onPress={() => this.showConfirmFillDexOrderModal(formattedOrder)} style={[styles.singleTokenType]} underlayColor={stylesRaw.underlayColor.color}>
          <View style={styles.orderBookResultInfo}>
            <View style={styles.orderBookResultAmountsArea}>
              <Text style={styles.orderBookResultAmountsText}>{`${makerNativeTokenAmount} ${currencyCode} / ${takerNativeTokenAmount} WETH = ${exchangeRate}`} </Text>
            </View>
            <View style={styles.orderBookResultExpirationArea}>
              <Text style={styles.orderBookResultExpirationText}>{s.strings.dex_order_book_result_expiration} {expiration}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>      
    )
  }
}
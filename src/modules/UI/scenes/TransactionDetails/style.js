import React, {StyleSheet} from 'react-native'


module.exports = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    paddingLeft: 15,
    paddingRight: 15
  },
  expandedHeader: {
    height: 32,
    flexDirection: 'row',
    justifyContent: 'center'

  },
  modalHeaderIconWrapBottom: {
    borderRadius: 25,
    backgroundColor: 'white', 
    height: 50, 
    width: 50,
    position: 'relative',
    top: 10    
  },
  modalHeaderIconWrapTop: {
    position: 'relative', 
    top: 1, 
    left: 1, 
    borderRadius: 25, 
    backgroundColor: 'white', 
    zIndex: 100, 
    elevation: 100,
    height: 48, 
    width: 48
  },
  payeeIcon: {
    position: 'relative', 
    top: 2, 
    left: 16, 
    backgroundColor: 'transparent'    
  },
  dataArea: {
    position: 'relative',
    top: 34,
    flexDirection: 'column'
  },
  payeeNameArea: {
    alignItems: 'center',
    flexDirection: 'column'

  },
  payeeNameWrap: {
    width: '38%',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    padding: 6,
    alignItems: 'center'
  },
  payeeNameText: {
    color: '#58595C',
    fontSize: 17
  },
  dateWrap: {
    padding: 4
  },
  date: {
    color: '#909091',
    fontSize: 14
  },
  amountAreaContainer: {
    flexDirection: 'column'
  },
  amountAreaCryptoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20
  },
  amountAreaLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  amountAreaLeftText: {
    fontSize: 14
  },
  amountAreaMiddle: {
    flex: 3, 
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountAreaMiddleTop: {
    paddingBottom: 4
  },
  amountAreaMiddleTopText: {
    fontSize: 26,
    color: '#58595C'
  },
  amountAreaMiddleBottom: {

  },
  amountAreaMiddleBottomText: {
    fontSize: 14,
    color: '#909091'
  },
  amountAreaRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  amountAreaRightText: {
    color: '#909091',
    fontSize: 14,   
  },
  editableFiatRow: {
    flexDirection: 'row', 
  },
  editableFiatLeft: {
    flex: 1
  },
  editableFiatArea: {
    width: '38%',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editableFiat: {
    color: '#58595C',
    fontSize: 17,
    textAlign: 'center',
    height: 36
  },
  editableFiatRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  editableFiatRightText: {
    color: '#909091',
    fontSize: 14    
  },
  categoryRow: {
    marginTop: 10,
    flexDirection: 'row', 
  },
  categoryLeft: {
    borderRadius: 3,
    borderWidth: 1,
    padding: 6
  },
  categoryInputArea: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginLeft: 11,
    height: 27,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  categoryInput: {
    height: 16,
    fontSize: 13
  },
  footerArea: {

  },
  buttonArea: {

  },



});


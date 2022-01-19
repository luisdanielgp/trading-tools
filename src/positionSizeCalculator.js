// // Input account balance in USD
// const accountBalance = 723
// // Input Entry Price
// const entryPrice = 1.48378
// // Input Stop Loss
// const stopLoss = 1.47047
// // Input risk %
// const risk = 0.1

const calculatePosition = (accountBalance, entryPrice, stopLoss, risk) => {
  try {
    if (entryPrice === stopLoss) throw "Entry price and Stop Loss can't be the same."
    const positionType = entryPrice < stopLoss ? 'SHORT' : 'LONG'
    const potentialLoss = calculatePotentialLoss(stopLoss, entryPrice, positionType)
    const positionSize = calculatePositionSize(accountBalance, risk, potentialLoss)
    const { priceGoal1, priceGoal2 } = getGoalPrices(entryPrice, stopLoss)
  
    return {
      InitialData: {
        accountBalance,
        entryPrice,
        stopLoss,
        risk: `${(risk * 100).toFixed()}%`
      },
      positionType: positionType,
      positionSize, 
      potentialLoss: {
        percentage: `${(potentialLoss * 100).toFixed(2)}%`,
        amount: round(potentialLoss * positionSize.amount, 2)
      }, 
      priceGoal1: round(priceGoal1, setDecimalCount(entryPrice)), 
      priceGoal2: round(priceGoal2, setDecimalCount(entryPrice)),
      potentialPositionRoe: calculatePotentialPositionROE(entryPrice, priceGoal1, priceGoal2, positionSize.amount)
    }
  } catch(error) {
    throw new Error(error)
  }
}

const calculateLeverage = (accountBalance, positionSize) => {
  const leverage = Math.ceil(positionSize / accountBalance)
  return leverage
}

const calculatePositionSize = (accountBalance, risk, potentialLoss) => {
  const positionSize = round(((accountBalance * risk) / potentialLoss), 2)
  // if (positionSize > accountBalance) {
  //   const leverage = calculateLeverage()
  //   return {
  //     amount: round(positionSize, 2),
  //     leverage: leverage
  //   }
  // }
  return {
    amount: round(positionSize, 2),
    leverage: calculateLeverage(accountBalance, positionSize)
  }
}

const getGoalPrices = (entryPrice, stopLoss) => {
  const priceGoal1 = entryPrice + (entryPrice - stopLoss)
  const priceGoal2 = priceGoal1 + ((entryPrice - stopLoss) / 2)
  return { priceGoal1, priceGoal2 }
}

const calculatePotentialLoss = (stopLoss, entryPrice, positionType) => {
  if (positionType === 'SHORT') return (stopLoss / entryPrice) - 1
  return 1 - (stopLoss / entryPrice)
}

const calculatePotentialPositionROE = (entryPrice, priceGoal1, priceGoal2, positionSize) => {
  const priceGoal1ReturnPercentage = ((priceGoal1 - entryPrice) / entryPrice) / 2
  const priceGoal1Return = (positionSize) * priceGoal1ReturnPercentage
  const priceGoal2ReturnPercentage = ((priceGoal2 - entryPrice) / entryPrice) / 2
  const priceGoal2Return = (positionSize) * priceGoal2ReturnPercentage
  return {
    percentage: `${Math.abs(((priceGoal1ReturnPercentage + priceGoal2ReturnPercentage) * 100)).toFixed(2)}%`,
    amount: Math.abs(round(priceGoal1Return + priceGoal2Return, 2))
  }
}

// sets decimal count according to entry price input
const setDecimalCount = ( entryPrice ) => {
  const numAsString = String(entryPrice)
  if (numAsString.includes('.')) {
    return numAsString.split('.')[1].length
  }
  return 0
}

const round = (num, decimalCount) => {
  return +(Math.round(num + `e+${decimalCount}`)  + `e-${decimalCount}`);
}

module.exports = {calculatePosition}

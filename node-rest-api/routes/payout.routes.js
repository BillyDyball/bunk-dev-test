const express = require("express");
const payoutRoute = express.Router();

// Add Payout
payoutRoute.route("/payout").post((req, res, next) => {
    if (!req.body || req.body < 1) {
        return res.status(400).json({ error: 'invalid input' });
    }

    const roundPrice = (price, decimalPlaces = 4) => {
        const place = 10**decimalPlaces;
        return Math.round(price * place) / place;
    }

    // Consolidate expenses
    const expenses = req.body;
    const hashTable = {};
    let total = 0, numberOfPeople = 0;
    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        total += expense.price;

        if (hashTable[expense.name]) {
            hashTable[expense.name] += expense.price;
        } else {
            hashTable[expense.name] = expense.price;
            numberOfPeople++;
        }
    }
    const equalShare = roundPrice(total / numberOfPeople);
    Object.keys(hashTable).map(
        key => hashTable[key] = roundPrice(hashTable[key] - equalShare)
    );

    const payouts = [];
    const paymentArray = Object.keys(hashTable)
        .map(key => [key, hashTable[key]])
        .sort((a, b) => a[1] - b[1]);
    let l = 0, r = paymentArray.length - 1;
    while (l < r) {
        let negativePayment = paymentArray[l];
        let positivePayment = paymentArray[r];
        let amount = 0;

        if (positivePayment[1] > Math.abs(negativePayment[1])) {
            positivePayment[1] = roundPrice(positivePayment[1] + negativePayment[1]);
            amount = -negativePayment[1];
            l++;
            if (positivePayment[1] < 0.01) {
                r--;
            }
        } else {
            negativePayment[1] = roundPrice(positivePayment[1] + negativePayment[1]);
            amount = positivePayment[1];
            r--;
            if (negativePayment[1] > -0.01) {
                l++;
            }
        }

        payouts.push({
            owes: negativePayment[0],
            owed: positivePayment[0],
            amount: roundPrice(amount, 2)
        });
    }

    return res.json({
        total,
        equalShare: roundPrice(equalShare, 2),
        payouts
    });
});

module.exports = payoutRoute;

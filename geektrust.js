const fs = require("fs")
const filename = process.argv[2]
const moment = require("moment")



const plansDetails = {
    music: {
        free: {
            amountPaid: 0,
            subscriptionTime: 1
        },
        personal: {
            amountPaid: 100,
            subscriptionTime: 1
        },
        premium: {
            amountPaid: 250,
            subscriptionTime: 3
        }
    },
    video: {
        free: {
            amountPaid: 0,
            subscriptionTime: 1
        },
        personal: {
            amountPaid: 200,
            subscriptionTime: 1
        },
        premium: {
            amountPaid: 500,
            subscriptionTime: 3
        }
    },

    podcast: {
        free: {
            amountPaid: 0,
            subscriptionTime: 1
        },
        personal: {
            amountPaid: 100,
            subscriptionTime: 1
        },
        premium: {
            amountPaid: 300,
            subscriptionTime: 3
        }
    },


}

const topUpDetails = {
    FOUR_DEVICE: {
        amountPaid: 50,
        deviceAccess: 4
    },
    TEN_DEVICE: {
        amountPaid: 100,
        deviceAccess: 10
    },

}


let userPlanDetails = []
let userTopupPlan = {}



function validateDate(date) {
    let dateFormat = "DD-MM-YYYY"
    return moment(date, dateFormat).isValid()
}







fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err
    let inputLines = data.toString().trim().split("\n")

    if (!inputLines) {
        console.log("No input recieved")
        return
    }

    for (let i = 0; i < inputLines.length; i++) {
        let inputDetails = inputLines[i].split(" ")
        if (inputDetails[0] === "START_SUBSCRIPTION") {
            subscriptionDate(inputDetails.slice(1))
        }

        if (inputDetails[0] === "ADD_SUBSCRIPTION") {
            subcriptionDetails(inputDetails.slice(1))

        }

        if (inputDetails[0] === "ADD_TOPUP") {
            addTopUp(inputDetails.slice(1))

        }



        if (inputDetails[0] == "PRINT_RENEWAL_DETAILS") {

            renewalDetails()


        }
    }


    // Add your code here to process input commands

})

function subscriptionDate(subsDate) {
    let inputDate = subsDate[0].trim()
    if (!validateDate(inputDate)) {
        console.log("INVALID_DATE")
        return
    }

    userPlanDetails.push({ startDate: inputDate })


}

function subcriptionDetails(subcriptionInfo) {
    let planName = subcriptionInfo[0].trim().toLowerCase()
    let planType = subcriptionInfo[1].trim().toLowerCase()

    if (userPlanDetails.length == 0) {
        console.log("ADD_SUBSCRIPTION_FAILED INVALID_DATE")
        return
    }

    let startDate = userPlanDetails[0].startDate
    let month = plansDetails[planName][planType].subscriptionTime

    let newDate = moment(startDate, "DD-MM-YYYY").add(month, 'M').subtract(10, 'd').format('DD-MM-YYYY')

    for (let i = 1; i < userPlanDetails.length; i++) {
        if (userPlanDetails[i].planName === planName) {
            console.log("ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY")
            return

        }
    }

    let info = {
        planName,
        planType,
        startDate: userPlanDetails[0].startDate,
        endDate: newDate,
        planPrice: plansDetails[planName][planType].amountPaid

    }

    userPlanDetails.push(info)

}


function addTopUp(topup) {
    let topupPlan = topup[0].trim()
    let month = topup[1].trim()

   


    if (userPlanDetails.length == 0) {
        console.log("ADD_TOPUP_FAILED INVALID_DATE")
        return
    }

    if (userPlanDetails.length <= 1) {
        console.log("ADD_TOPUP_FAILED SUBSCRIPTIONS_NOT_FOUND")
        return
    }

    if (userTopupPlan.topupPlan) {
        console.log("ADD_TOPUP_FAILED DUPLICATE_TOPUP")
        return
    }


    let topUpPrice = (topUpDetails[topupPlan].amountPaid) * month

    userTopupPlan.topupPlan = topupPlan
    userTopupPlan.month = month
    userTopupPlan.topUpPrice = topUpPrice



}

function renewalDetails() {
    if (userPlanDetails.length === 0) {
        console.log("SUBSCRIPTIONS_NOT_FOUND")
        return
    }

    
    for (let i = 1; i < userPlanDetails.length; i++) {
        console.log('RENEWAL_REMINDER ' + userPlanDetails[i].planName.toUpperCase() + ' ' + userPlanDetails[i].endDate);
    }

    let totalPrice = 0

    for (let i = 1; i < userPlanDetails.length; i++) {
        totalPrice = totalPrice + userPlanDetails[i].planPrice
    }
    
    if(userTopupPlan.topUpPrice != undefined){
        totalPrice = totalPrice + userTopupPlan.topUpPrice
    }


    

    console.log('RENEWAL_AMOUNT ' + totalPrice);
}



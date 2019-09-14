//simulate a running of MIDAS over a certain time period 
//with certain bounds for buy/sell (buyThreshold, sellThreshold)
//should give you a percent increase in the principle
//for now, the buy/sell threshold just buys/sells everything (as opposed to only some)

//making some bullshit arrays to pretend to be the bitcoin history
var time = 200;                         //total time interval of the "history"
var tradeArray = new Array(time);
//initialize prices to some vague model of real prices, starting at 200 & with no inflation
//initialize decisionArray to random numbers between 0 and 1
for (var i=0; i<time; i++) {
    tradeArray[i] = new Array(3);
    tradeArray[i][0] = i;               //the time = the index, but it doesn't have to.
    if (i==0) {
        tradeArray[i][1] = 200;
    } else {
        tradeArray[i][1] = tradeArray[i-1][1] + Math.random() * 2 - 1;
    }
    tradeArray[i][2] = Math.random();
}

var buyThreshold = 0.8;
var sellThreshold = 0.2;

function profitEarnedOverInterval(startTime, endTime, tArray) {
    var returns = 1;
    var buyPrice = -1;
    var index = 0;
    
    //if startTime is less than the first index's time, then set the starting index to the first index
    //if startTime is greater than the last index's time, then set the starting index to the last index
    //if the startTime is in between two indices, use the lower one to start.
    //if the startTime equals the time at one index, use that index to start.
    for (var i=1; i<tArray.length - 1; i++) {
        if (tArray[i][0] <= startTime && tArray[i+1][0] > startTime) {
            index = i;             //init. index to the index where the time equals startTime
        }
    }
    if (index==0 && startTime > tArray[1][0]) index = tArray.length - 1;
    while (tArray[index][0] < endTime) {
        var price = tArray[index][1];
        var decision = tArray[index][2];
        
        if (decision > buyThreshold) {
            buyPrice = price;
        }
        if (buyPrice != -1 && (decision < sellThreshold)) returns *= price/buyPrice;
        
        index++;
        if(index >= tArray.length) break;
    }
    
    return returns;
}
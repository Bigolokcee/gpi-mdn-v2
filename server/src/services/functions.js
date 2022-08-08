export function realDate() {
    var dateUTCPlus1 = new Date().toISOString();
    var correctDateTime = dateUTCPlus1.substr(0, dateUTCPlus1.length - 1)
    console.log("je suis fatigue",)
    return correctDateTime;
}
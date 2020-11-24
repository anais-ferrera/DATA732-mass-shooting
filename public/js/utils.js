// For the map
/**
 * 
 * @param {*} value number of killed
 */
// Return a value to color the map according to the number of victims
function reducevalue(value) {

    if (value <= 50) {
        value = 0;
    } else if (value <= 100) {
        value = 1;
    } else if (value <= 150) {
        value = 2;
    } else {
        value = 3;
    }
    return value
}


/**
 * Get all data refering to a State
 * @param {*} state 
 * @param {*} data 
 */
function getStateData(state, data) {

    let ret = [];
    let local = JSON.parse(JSON.stringify(data));  
    local.forEach(function (d) {
        if (d.State == state) {
            ret.push(d);
        }
    });
    return ret;
}

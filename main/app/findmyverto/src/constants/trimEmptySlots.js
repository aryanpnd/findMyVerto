
export default function filterObject(obj) {
    let keys = Object.keys(obj);
    let newObject = {};
    let newObject2 = {};
    let isNullCheck = false
    let isNullCheck2 = false
    for (let i = 0; i < keys.length; i++) {
        if (isNullCheck || obj[keys[i]].length >= 2) {
            newObject[keys[i]] = obj[keys[i]];
            isNullCheck=true
        }
    }
    let keys2 = Object.keys(newObject);
    for (let i = keys2.length-1; i >= 0; i--) {
        // console.log(newObject[keys2[i]].length);
        if (isNullCheck2 || newObject[keys2[i]].length >= 2) {
            newObject2[keys2[i]] = newObject[keys2[i]];
            isNullCheck2=true
        }
    }
    return newObject2;
}
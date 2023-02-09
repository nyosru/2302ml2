export const priceNormalizator = (price) => {
    // return parseInt(price.replace( , ''))
    // return parseInt(price.replace(/\D.+/g, ''))
    return parseFloat(price.replace(' ', ''))
}

export const onlyNumber = (price) => {
    // return parseInt(price.replace( , ''))
    // return parseInt(price.replace(/\D.+/g, ''))
    // return parseInt(price.replace(' ', ''))
    return parseInt(price.replace(/[^0-9]/g, ""))
}
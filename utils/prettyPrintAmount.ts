export function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// thanks to Z for this function: https://github.com/turtlecoin/turtlecoin-wallet-backend-js/blob/master/lib/Utilities.ts
export function prettyPrintAmount(amount: number, ticker = true): string {
    /* Get the amount we need to divide atomic units by. 2 decimal places = 100 */
    const divisor: number = Math.pow(10, 2);
    const dollars: number =
        amount >= 0
            ? Math.floor(amount / divisor)
            : Math.ceil(amount / divisor);

    /* Make sure 1 is displaced as 01 */
    const cents: string = Math.abs(amount % divisor)
        .toString()
        .padStart(2, "0");

    /* Makes our numbers thousand separated. https://stackoverflow.com/a/2901298/8737306 */
    const formatted: string = numberWithCommas(dollars);
    return `${formatted}.${cents}${ticker ? " TRTL" : ""}`;
}

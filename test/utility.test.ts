import { URL } from "url";
import CommonUtility from "../src/util/commonUtility";

const origin = "https://hmseries.com/home";
const parsedOrigin = new URL(origin ?? "");
console.log(parsedOrigin);

console.log(CommonUtility.roundOfToNearestNumber(42.2, 50));
console.log(CommonUtility.roundOfToNearestNumber(42.8));
console.log(CommonUtility.roundOfToNearestNumber(50));
console.log(CommonUtility.roundOfToNearestNumber(52.8));
console.log(CommonUtility.roundOfToNearestNumber(52.8));
console.log(CommonUtility.roundOfToNearestNumber(100));

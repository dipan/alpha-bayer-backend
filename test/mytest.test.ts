import moment from "moment";
import SecurityUtility from "../src/util/security/securityUtility";

console.log(SecurityUtility.createHashedPassword("SuperAdmin@202402"));

const nowDateMillis = moment().millisecond();
console.log(nowDateMillis);
const date = new Date(nowDateMillis);
console.log(date.toLocaleDateString());
console.log(date.toLocaleTimeString());

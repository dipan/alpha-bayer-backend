import SecurityUtility from "../src/util/security/securityUtility";

console.log(SecurityUtility.createHashedPassword("SuperAdmin@202411"));

const nowDateMillis = new Date().getMilliseconds();
console.log(nowDateMillis);
const date = new Date(nowDateMillis);
console.log(date.toLocaleDateString());
console.log(date.toLocaleTimeString());

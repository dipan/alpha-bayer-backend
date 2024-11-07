"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var securityUtility_1 = require("../src/util/security/securityUtility");
console.log(securityUtility_1.default.createHashedPassword("SuperAdmin@202411"));
var nowDateMillis = new Date().getMilliseconds();
console.log(nowDateMillis);
var date = new Date(nowDateMillis);
console.log(date.toLocaleDateString());
console.log(date.toLocaleTimeString());

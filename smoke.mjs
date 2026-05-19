// Tiny smoke check: can the PayPay SDK module be loaded from this project?
// Run with:  node smoke.mjs
import pp from "@paypay/mini-app-js-sdk";

const has = (name) => typeof pp[name] === "function";

console.log("SDK loaded:     ", !!pp);
console.log("init() present: ", has("init"));
console.log("makePayment():  ", has("makePayment"));
console.log("scanCode():     ", has("scanCode"));
console.log("getUAID():      ", has("getUAID"));

if (has("init") && has("makePayment")) {
  console.log("\nResult: ✅ SDK module loads and exposes the expected surface.");
} else {
  console.log("\nResult: ❌ SDK loaded but is missing expected methods.");
  process.exit(1);
}

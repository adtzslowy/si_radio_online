const crypto = require("crypto")

const order_id = "INV-TEST-123"
const status_code = "200"
const gross_amount = "10000.00"
const serverKey = "ISI_SERVER_KEY_MIDTRANS_KAMU"

const signature = crypto
  .createHash("sha512")
  .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
  .digest("hex")

console.log(signature)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PAYPAY = require("@paypayopa/paypayopa-sdk-node");
const crypto = require("crypto");

PAYPAY.Configure({
  clientId: process.env.PAYPAY_API_KEY,
  clientSecret: process.env.PAYPAY_API_SECRET,
  merchantId: process.env.PAYPAY_MERCHANT_ID,
  productionMode: process.env.PAYPAY_PRODUCTION_MODE === "true",
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    sandbox: process.env.PAYPAY_PRODUCTION_MODE !== "true",
    merchantId: process.env.PAYPAY_MERCHANT_ID ? "set" : "missing",
  });
});

app.post("/api/payment/create", async (req, res) => {
  const { items, pickupLocation } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items required" });
  }
  const amount = items.reduce((s, i) => s + Number(i.price || 0), 0);
  const merchantPaymentId = `bentopay-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const payload = {
    merchantPaymentId,
    amount: { amount, currency: "JPY" },
    codeType: "ORDER_QR",
    orderDescription: pickupLocation
      ? `BentoPay order · pickup at ${pickupLocation}`
      : "BentoPay order",
    orderItems: items.map(i => ({
      name: i.name,
      category: "bento",
      quantity: 1,
      productId: i.id,
      unitPrice: { amount: Number(i.price), currency: "JPY" },
    })),
    isAuthorization: false,
    redirectUrl: process.env.REDIRECT_URL,
    redirectType: "WEB_LINK",
  };

  try {
    const result = await PAYPAY.QRCodeCreate(payload);
    if (result.STATUS !== 201) {
      return res.status(502).json({ error: "paypay_create_failed", detail: result.BODY });
    }
    res.json({ merchantPaymentId, ...result.BODY.data });
  } catch (err) {
    res.status(500).json({ error: "paypay_create_threw", message: err.message });
  }
});

app.get("/api/payment/:merchantPaymentId", async (req, res) => {
  try {
    const result = await PAYPAY.GetCodePaymentDetails([req.params.merchantPaymentId]);
    if (result.STATUS !== 200) {
      return res.status(502).json({ error: "paypay_lookup_failed", detail: result.BODY });
    }
    res.json(result.BODY.data);
  } catch (err) {
    res.status(500).json({ error: "paypay_lookup_threw", message: err.message });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`BentoPay server listening on http://localhost:${port}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PAYPAY = require("@paypayopa/paypayopa-sdk-node");
const crypto = require("crypto");
const path = require("path");
const QRCode = require("qrcode");

const MENU = [
  { id: "salmon",   name: "Salmon Teriyaki", price: 980  },
  { id: "karaage",  name: "Chicken Karaage", price: 880  },
  { id: "tonkatsu", name: "Tonkatsu",        price: 1080 },
  { id: "sukiyaki", name: "Beef Sukiyaki",   price: 1280 },
  { id: "unagi",    name: "Unagi",           price: 1480 },
  { id: "tempura",  name: "Veggie Tempura",  price: 880  },
];

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

app.get("/kiosk", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "docs", "kiosk.html"));
});

app.get("/qr", async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).send("text query param required");
  try {
    const png = await QRCode.toBuffer(text, { width: 400, margin: 1, color: { dark: "#1A1A1A", light: "#FFFFFF" } });
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(png);
  } catch (err) {
    res.status(500).send("QR error: " + err.message);
  }
});

// Scanning a kiosk QR lands here. We mint a PayPay sandbox payment for the
// single item, then redirect the phone to the PayPay payment URL so the
// sandbox PayPay app opens for approval.
app.get("/buy", async (req, res) => {
  const item = MENU.find(i => i.id === req.query.item);
  if (!item) return res.status(404).send("Unknown item: " + req.query.item);

  const merchantPaymentId = `bentopay-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const payload = {
    merchantPaymentId,
    amount: { amount: item.price, currency: "JPY" },
    codeType: "ORDER_QR",
    orderDescription: `BentoPay — ${item.name}`,
    orderItems: [{
      name: item.name,
      category: "bento",
      quantity: 1,
      productId: item.id,
      unitPrice: { amount: item.price, currency: "JPY" },
    }],
    isAuthorization: false,
    redirectUrl: process.env.REDIRECT_URL,
    redirectType: "WEB_LINK",
  };

  try {
    const result = await PAYPAY.QRCodeCreate(payload);
    if (result.STATUS !== 201) {
      return res.status(502).send(`PayPay error: ${JSON.stringify(result.BODY)}`);
    }
    res.redirect(302, result.BODY.data.url);
  } catch (err) {
    res.status(500).send(`Server error: ${err.message}`);
  }
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

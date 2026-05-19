<script setup>
import { ref, onMounted } from 'vue';
import pp from '@paypay/mini-app-js-sdk';
import { CLIENT_ID, ENV } from './config';

const initState = ref('pending');
const initMessage = ref('Initializing PayPay SDK…');

const featured = [
  { id: 'salmon',  name: 'Salmon Teriyaki', price: 980,  emoji: '🐟' },
  { id: 'karaage', name: 'Chicken Karaage', price: 880,  emoji: '🍗' },
  { id: 'unagi',   name: 'Unagi',           price: 1480, emoji: '🍣' },
];

const PLACEHOLDERS = new Set([
  'your-sandbox-mini-app-client-id',
  'PASTE_YOUR_SANDBOX_CLIENT_ID_HERE',
  '',
]);

onMounted(() => {
  if (!CLIENT_ID || PLACEHOLDERS.has(CLIENT_ID)) {
    initState.value = 'error';
    initMessage.value = 'No clientId set — paste it into src/config.js';
    return;
  }
  try {
    pp.init({
      clientId: CLIENT_ID,
      env: ENV,
      success: (res) => {
        const code = (res && res.statusCode) || 'OK';
        const ok = code === 'INITIALIZED' || code === 'TOKEN_VALID';
        initState.value = ok ? 'ok' : 'warn';
        initMessage.value = `pp.init → ${code}`;
      },
      fail: (err) => {
        const code = (err && (err.errorCode || err.statusCode)) || 'unknown';
        initState.value = 'error';
        initMessage.value = `pp.init failed — ${code}`;
      },
    });
  } catch (e) {
    initState.value = 'error';
    initMessage.value = `SDK threw — ${e?.message || e}`;
  }
});
</script>

<template>
  <main class="page">
    <header class="banner" :class="`banner--${initState}`">
      <span>{{ initMessage }}</span>
    </header>

    <section class="hero">
      <p class="badge">PayPay Mini App</p>
      <h1 class="title">BentoPay</h1>
      <p class="subtitle">Fresh bento, paid in seconds.</p>
      <div class="cone">🍱</div>
    </section>

    <section class="featured">
      <h2 class="section-title">Today's Bentos</h2>
      <div class="cards">
        <div v-for="item in featured" :key="item.id" class="card">
          <span class="emoji">{{ item.emoji }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="price">¥{{ item.price }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #fff;
}
</style>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF6E0 0%, #FFFFFF 60%);
  box-sizing: border-box;
}

.banner {
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
}
.banner--pending { background: #EEEEEE; color: #555; }
.banner--ok      { background: #E6F7EC; color: #137E2D; }
.banner--warn    { background: #FFF4D6; color: #8A5A00; }
.banner--error   { background: #FDE2E2; color: #B00020; }

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 24px;
}

.badge {
  margin: 0;
  font-size: 11px;
  letter-spacing: 1px;
  color: #FF0033;
  background: #FFEEDB;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}

.title {
  margin: 12px 0 0;
  font-size: 30px;
  font-weight: 800;
  color: #1A1A1A;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  color: #666;
}

.cone {
  margin-top: 16px;
  font-size: 64px;
}

.featured { margin-top: 24px; }

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.cards {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.card {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(255, 0, 51, 0.08);
}

.emoji { font-size: 36px; }
.name  { margin-top: 8px; font-size: 14px; font-weight: 600; color: #1A1A1A; }
.price { margin-top: 4px; font-size: 13px; color: #FF0033; font-weight: 700; }
</style>

export default defineNuxtConfig({
  compatibilityDate: "2025-03-17",
  devtools: { enabled: true },
  modules: ["@nuxtjs/seo", "@nuxtjs/tailwindcss"],

  nitro: {
    preset: 'vercel'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'BPBD Portal - LaporCepat Darurat',
      meta: [
        { name: 'theme-color', content: '#0f172a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'dicoding:email', content: 'ilhamdzaky2007@gmail.com' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },
  runtimeConfig: {
    bpbdPin: process.env.BPBD_PIN || "",
    groqApiKey: process.env.GROQ_API_KEY || "",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT || "",
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "",
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "",
    },
  },
})

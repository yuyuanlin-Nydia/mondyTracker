// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs'],
    }],
    'nuxt-icon',
    'nuxt-headlessui',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@formkit/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  imports: {
    // 自動import 不用import {useUser} from '~/stores/User'
    dirs: ['stores', 'const', 'helper', 'types'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },
  runtimeConfig: {
    mongoUrl: process.env.MONGO_URL,
  },
  nitro: {
    plugins: ['~/server/index.ts'],
  },
  routeRules: {
    '/': { prerender: true },
    '/productPlan': { ssr: true },
    '/user/**': { ssr: false },
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },
})

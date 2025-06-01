// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.BE_URL,
      domainUrl: process.env.DOMAIN_URL
    }
  },

  modules: ['usebootstrap'],

  css: ['bootstrap/dist/css/bootstrap.min.css', 'bootstrap-icons/font/bootstrap-icons.css'],
    app: {
      head: {
        script: [
          {
            src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
            integrity: 'sha384-mQ93f6cQFEb2cK8Ewjv+NggmROwEW3ZKZK7bRGeFZ0S45Bncc8fgsEVZp4dW2flX',
            crossorigin: 'anonymous'
          }
        ]
      }
    },

  vite: {
    server: {
      allowedHosts: true
    }
  },

  devServer: {
    port: 3001
  },

  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'redirect',
        path: '/',
        redirect: `/diary`,
      });
    }
  }
})
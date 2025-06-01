// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: 'https://project-tempest-hiring.up.railway.app',
      domainUrl: 'https://d4839b57-6c3a-4818-9f12-fe121e6bf0be-00-1bny6v0j1mbdx.sisko.replit.dev:3002'
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
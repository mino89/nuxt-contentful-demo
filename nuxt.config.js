require("dotenv").config();
const contentful = require("contentful");
module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "nuxt-contentful-test",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: "empty"
      };
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  target: 'static',
  modules: ["@nuxtjs/dotenv", "@nuxtjs/markdownit"],
  markdownit: {
    injected: true
  },
  generate: {
    fallback: true,
    routes: () => {
      const client = contentful.createClient({
        space: process.env.CTF_SPACE_ID,
        accessToken: process.env.CTF_CD_ACCESS_TOKEN
      });
      return client
        .getEntries({
          content_type: "blogPost"
        })
        .then(response => {
          return response.items.map(entry => {
            return {
              route: entry.fields.slug,
              payload: entry
            };
          });
        });
    }
  }
};

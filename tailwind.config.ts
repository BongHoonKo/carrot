import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend : {
      borderRadius : {
        "sexy-name" : "11.11px"
      }
    }
  },
  plugins: [
    // require('daisyui'),
    require('@tailwindcss/forms')
  ],
};
export default config;

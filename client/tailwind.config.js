const tailgrids = require("tailgrids/plugin");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailgrids/plugin")],
};


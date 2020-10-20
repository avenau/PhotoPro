module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "no-use-before-define": "off",
    "import/extensions": "off",
    "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
    "react/destructuring-assignment": "off",
    "react/jsx-props-no-spreading": "off",
    "react/prefer-stateless-function": "off",
    "no-use-before-define": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/static-property-placement": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "class-methods-use-this": "off",
  },
  settings: {
    "import/resolver": "typescript", // this loads <rootdir>/tsconfig.json to eslint
  },
};

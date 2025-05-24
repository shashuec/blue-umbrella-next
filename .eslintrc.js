module.exports = {
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Allow unescaped entities in JSX (for apostrophes, quotes, etc.)
    "react/no-unescaped-entities": "off",
    // Allow unused vars (for rapid prototyping, can be set to 'warn' or 'off')
    "@typescript-eslint/no-unused-vars": "off",
    // Allow empty object types (for generic component props)
    "@typescript-eslint/no-empty-object-type": "off",
    // Allow <a> tags for navigation (Next.js Link rule)
    "@next/next/no-html-link-for-pages": "off",
  },
};

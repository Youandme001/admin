module.exports = {
  extends: ['react-app', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}

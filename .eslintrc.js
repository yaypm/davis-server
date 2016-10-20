module.exports = {
  "extends": "airbnb",
  "plugins": [],
  "rules": {
    "no-param-reassign": [2, { "props": false }],
    "new-cap": "off",
    "func-names": "off",
    "strict": "off",
    "prefer-rest-params": "off",
    "react/require-extension" : "off",
    "import/no-extraneous-dependencies" : "off"
  },
  "env": {
       "mocha": true
   }
};

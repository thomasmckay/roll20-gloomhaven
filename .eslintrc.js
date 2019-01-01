module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 5
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "CallExpression": {
                    "arguments": "first"
                }
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "globals": {
        "GloomhavenMonsterStats": false,
        "GloomhavenModule": false,
        "on": false,
        "sendChat": false,
        "Shell": false,
        "getObj": false,
        "findObjs": false,
        "createObj": false,
    }
};

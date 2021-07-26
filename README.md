# eslint-plugin-prefer-smart-quotes

Enforce the preferred use of curly quote/apostrophe characters.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Installation

You'll first need to install ESLint:

```bash
npm install eslint --save-dev
```

Then, you can install `eslint-plugin-prefer-smart-quotes`

```bash
npm install eslint-plugin-prefer-smart-quotes --save-dev
```

## Usage

Add the plugin to your eslint configuration file (`.eslintrc.*`):

```json
{
    "plugins": [
        "prefer-smart-quotes"
    ]
}
```

To configure the plugin rules:

```json
{
    "rules": {
        "prefer-smart-quotes/prefer": ["error", "all"]
    }
}
```

## Acknowledgements

Thanks to [eslint-plugin-no-smart-quotes](https://github.com/seleb/eslint-plugin-no-smart-quotes) for serving as the basis 
for this plugin. 
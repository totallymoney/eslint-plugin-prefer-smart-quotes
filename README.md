# eslint-plugin-prefer-smart-quotes

Enforce the preferred use of curly quote/apostrophe characters.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

> This plugin supports converting quotes and apostrophes that have been specified using their `numeric` or `named` equivalent into their curly `named` or `numeric` values.

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

### Convert all entities into their curly equivalent

```json
{
    "rules": {
        "prefer-smart-quotes/prefer": ["error", "all"]
    }
}
```

### Convert named values into their curly numeric equivalent

```json
{
    "rules": {
        "prefer-smart-quotes/prefer": ["error", { "inputFormat": "named", "outputFormat": "numeric" }]
    }
}
```

## Acknowledgements

Thanks to [eslint-plugin-no-smart-quotes](https://github.com/seleb/eslint-plugin-no-smart-quotes) for serving as the basis 
for this plugin. 

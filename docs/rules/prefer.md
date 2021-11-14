# Enforces the preferred use of curly quote/apostrophe characters (smart-quotes)

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule enforces the preferred use of curly quotes/apostrophe characters. To ensure consistency, the plugin can also convert quotes 
and apostrophes that have been specified using their `named` or `numeric` equivalent into curly `numeric` or `named` 
values.

## Options

This rule has two options, a string option and an object option.

**String option:**
- `"character"` (default) requires the use of curly characters over straight characters (`'`, `"`)
- `"named"` requires the use of curly named values over straight named values (`&apos;`, `&quot;`)
- `"numeric"` requires the use of curly numeric values over straight numeric values (`&#39;`, `&#34;`)
- `"all"` requires the use of all curly entities over straight entities

**Object option:**

- `"inputFormat": "character"` requires the use of curly characters over straight characters
   - "all", "character", "named", "numeric" 
- `"outputFormat": "all"` specify the output entity format
   - "all", "character", "named", "numeric"

## Examples

Examples of **incorrect** code for this rule:

```jsx
const greeting = "Wow, it's Bob";
const quote = 'Shrek said, "Get out of my swamp"';
const Component = () => <>That's a nice boulder!<>
```

Examples of **correct** code for this rule:

```jsx
const greeting = "Wow, it’s Bob";
const quote = 'Shrek said, “Get out of my swamp”';
const Component = () => <>That&rsquo;s a nice boulder!<>
```

Examples of **inline** usage for this rule:

```jsx
/*eslint smart-quotes: ["error", "named"]*/

/*eslint smart-quotes: ["error", { outputFormat: "numeric" }]*/
```
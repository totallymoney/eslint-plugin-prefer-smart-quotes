/**
 * @fileoverview Prefer the use of curly quote/apostrophe characters
 * @author totallymoney
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer");
var RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run("smart-quotes", rule, {
  valid: [
    `var string = 'They said “here are straight quotes!”';`,
    `var string = 'My name is “Barry” and your name is “Jane”';`,
    `var string = '“My name is Barry';`,
    `var string = '“”';`,
    `var string = \"This is Jane‘s friend\";`,
    `<>“Here’s some quotes!”</>`,
  ],
  invalid: [
    //----------------------------------------------------------------------
    // Double quotes
    //----------------------------------------------------------------------

    {
      code: "var string = 'They said \"here are smart quotes!\"';",
      output: "var string = 'They said “here are smart quotes!”';",
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },
    {
      code: 'var string = \'My name is "Barry" and your name is "Jane"\';',
      output: "var string = 'My name is “Barry” and your name is “Jane”';",
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },
    {
      code: "var string = '\"\"';",
      output: "var string = '“”';",
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    //----------------------------------------------------------------------
    // Single quotes
    //----------------------------------------------------------------------

    {
      code: 'var string = "This is Jane\'s friend";',
      output: 'var string = "This is Jane’s friend";',
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },
    {
      code: "var string = \"This is 'Jane's friend\";",
      output: "var string = \"This is 'Jane's friend\";",
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    //----------------------------------------------------------------------
    // JSX
    //----------------------------------------------------------------------

    {
      code: `<>Here's some quotes!</>`,
      output: `<>Here’s some quotes!</>`,
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "JSXText",
        },
      ],
    },
    {
      code: `<Component name="Barry's name" />`,
      output: `<Component name="Barry’s name" />`,
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    //----------------------------------------------------------------------
    // Options
    //----------------------------------------------------------------------

    {
      code: 'var string = "This is Jane&apos;s friend";',
      output: 'var string = "This is Jane&rsquo;s friend";',
      options: ["all"],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: 'var string = "This is Jane\'&apos;s friend";',
      output: 'var string = "This is Jane’&apos;s friend";',
      options: ["character"],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: 'var string = "This is Jane\'&#39;s friend";',
      output: 'var string = "This is Jane\'&#8217;s friend";',
      options: ["numeric"],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: 'var string = "This is Jane\'&apos;s friend";',
      output: 'var string = "This is Jane\'&rsquo;s friend";',
      options: ["named"],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: 'var string = "This is Jane\'&#39;s friend";',
      output: 'var string = "This is Jane\'&rsquo;s friend";',
      options: [{ inputFormat: "numeric", outputFormat: "named" }],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: "var string = 'My name is \"Barry\" and your name is &quot;Jane&#34;';",
      output:
        "var string = 'My name is &ldquo;Barry&rdquo; and your name is &ldquo;Jane&rdquo;';",
      options: [{ inputFormat: "all", outputFormat: "named" }],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: "var string = 'My name is \"Barry\" and your name is &quot;Jane&quot;';",
      output:
        "var string = 'My name is “Barry” and your name is &ldquo;Jane&rdquo;';",
      options: ["all"],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "Literal",
        },
      ],
    },

    {
      code: `
        <Text>
          Uh-uh. You know, with you it&apos;s always, &apos;Me, me, me!&apos; Wll, 
          guess that! Now it&apos;s my turn! So you just shut up and pay 
          attention! You&apos;re mean to me. You insult me and you don&apos;t 
          appreciate anything that I do! You&apos;re always pushing me around 
          or pushing me away.
        </Text>
      `,
      output: `
        <Text>
          Uh-uh. You know, with you it&apos;s always, &apos;Me, me, me!&apos; Wll, 
          guess that! Now it&apos;s my turn! So you just shut up and pay 
          attention! You&apos;re mean to me. You insult me and you don&apos;t 
          appreciate anything that I do! You&apos;re always pushing me around 
          or pushing me away.
        </Text>
      `,
      options: ["all"],
      errors: [
        {
          message: `Strings must use curly quotes.`,
          type: "JSXText",
        },
      ],
    }
  ],
});

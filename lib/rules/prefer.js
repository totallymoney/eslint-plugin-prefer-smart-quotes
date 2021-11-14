/**
 * @fileoverview A rule to prefer the use of curly quote/apostrophe characters
 * @author totallymoney
 */
"use strict";

const matchAll = require("string.prototype.matchall");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const MAPPINGS = {
  singleQuote: {
    character: "'",
    numeric: "&#39;",
    named: "&apos;",
    requires: ["curlyLeftQuote", "curlyRightQuote"],
  },
  doubleQuote: {
    character: '"',
    numeric: "&#34;",
    named: "&quot;",
    requires: ["curlyLeftDoubleQuote", "curlyRightDoubleQuote"],
  },
  curlyLeftQuote: {
    character: "‘",
    numeric: "&#8216;",
    named: "&lsquo;",
  },
  curlyRightQuote: {
    character: "’",
    numeric: "&#8217;",
    named: "&rsquo;",
  },
  curlyLeftDoubleQuote: {
    character: "“",
    numeric: "&#8220;",
    named: "&ldquo;",
  },
  curlyRightDoubleQuote: {
    character: "”",
    numeric: "&#8221;",
    named: "&rdquo;",
  },
};

const ENTITY_MAPPINGS = {
  character: [MAPPINGS.singleQuote.character, MAPPINGS.doubleQuote.character],
  named: [
    MAPPINGS.singleQuote.named,
    MAPPINGS.doubleQuote.named,
  ],
  numeric: [MAPPINGS.singleQuote.numeric, MAPPINGS.doubleQuote.numeric],
};

const DEFAULT_OPTIONS = {
  inputFormat: "character",
  outputFormat: "all",
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Prefer the use of curly quote/apostrophe characters",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    schema: [
      {
        anyOf: [
          {
            enum: ["all", "character", "named", "numeric"],
          },
          {
            type: "object",
            properties: {
              inputFormat: {
                enum: ["all", "character", "named", "numeric"],
              },
              outputFormat: {
                enum: ["all", "character", "named", "numeric"],
              },
            },
          },
        ],
      },
    ],
  },

  create: function (context) {
    //----------------------------------------------------------------------
    // Options
    //----------------------------------------------------------------------
    const options = context.options[0];

    const userOptions =
      typeof options === "object"
        ? options
        : typeof options === "string"
        ? { inputFormat: options, outputFormat: options }
        : {};

    const pluginOptions = Object.assign({}, DEFAULT_OPTIONS, userOptions);

    const inputValues = [
      pluginOptions.inputFormat === "all"
        ? Object.values(ENTITY_MAPPINGS).reduce(
            (all, val) => all.concat(val),
            []
          )
        : null,
      pluginOptions.inputFormat === "character"
        ? ENTITY_MAPPINGS.character
        : null,
      pluginOptions.inputFormat === "named"
        ? ENTITY_MAPPINGS.named
        : null,
      pluginOptions.inputFormat === "numeric" ? ENTITY_MAPPINGS.numeric : null,
    ]
      .filter(Boolean)
      .reduce((all, val) => all.concat(val), [])
      .map((val) => `(${val})`)
      .join("|");

    const generatedRegex = new RegExp(inputValues, "g");

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Checks whether the value provided is a form of single quote.
     *
     * @param {string} value - The value to check
     * @returns {boolean} True if the value is a single quote
     */
    function isSingleQuote(value) {
      return (
        [
          MAPPINGS.singleQuote.character,
          MAPPINGS.singleQuote.numeric,
          MAPPINGS.singleQuote.named,
        ].indexOf(value) !== -1
      );
    }

    /**
     * Checks whether the value provided is a form of double quote.
     *
     * @param {string} value - The value to check
     * @returns {boolean} True if the value is a double quote
     */
    function isDoubleQuote(value) {
      return (
        [
          MAPPINGS.doubleQuote.character,
          MAPPINGS.doubleQuote.numeric,
          MAPPINGS.doubleQuote.named,
        ].indexOf(value) !== -1
      );
    }

    /**
     * Get the mapping data for the value depending on whether
     * it is a single or double quote.
     *
     * @param {string} value - The value to get the mapping for
     * @returns {{ type: string, mapping: object }} The mapping
     * data with the mapping's quote type
     */
    function getMapping(value) {
      if (isSingleQuote(value)) {
        return { type: "singleQuote", mapping: MAPPINGS["singleQuote"] };
      }

      if (isDoubleQuote(value)) {
        return { type: "doubleQuote", mapping: MAPPINGS["doubleQuote"] };
      }

      return null;
    }

    /**
     * Get the entity type for the value, or default to
     * the character.
     *
     * @param {string} value - The value to check
     * @param {string} char - The character to use for
     * fallback
     * @returns {{ value: string, type: string }} The
     * valid value with the entity type
     */
    function getValueEntity(value, char) {
      if (value.charAt(0) === "&") {
        const isNumeric = ENTITY_MAPPINGS.numeric.indexOf(value) !== -1;
        const isNamed =
          ENTITY_MAPPINGS.named.indexOf(value) !== -1;

        if (isNumeric || isNamed) {
          return {
            value: value,
            type: isNumeric
              ? "numeric"
              : isNamed
              ? "named"
              : null,
          };
        }
      }
      return {
        value: char,
        type: "character",
      };
    }

    /**
     * Retrieve the entity values that should
     * be used to replace the passed value.
     *
     * @param {string} value - The value to check
     * for replacements
     * @param {string} type - The entity type to
     * get replacements for
     * @returns {{ left: string, right: string, quoteType: string }}
     * The entity values used for replacement as well as the
     * quote type
     */
    function getReplacementsForType(value, type) {
      const mappingItem = getMapping(value);
      const requirements = mappingItem.mapping.requires;

      const leftReplacement = MAPPINGS[requirements[0]];
      const rightRequirement = MAPPINGS[requirements[1]];

      if (pluginOptions.outputFormat === "all") {
        return {
          left: leftReplacement[type],
          right: rightRequirement[type],
          quoteType: mappingItem.type,
        };
      }

      return {
        left: leftReplacement[pluginOptions.outputFormat],
        right: rightRequirement[pluginOptions.outputFormat],
        quoteType: mappingItem.type,
      };
    }

    function handle(node, type) {
      if (typeof node.value !== "string") {
        return;
      }

      const value = type === "literal" ? node.value : node.raw;

      const matches = Array.from(matchAll(value, generatedRegex));

      if (matches.length === 0) {
        return;
      }

      /**
       * It's not possible to determine whether single
       * quotes are part of a quote or used as punctuation.
       * So we allow one single quote but won't fix if there
       * are multiple single quotes.
       */
      const ignoreSingleQuotes =
        matches.reduce((all, match) => {
          const value = match[0];
          let isQuote = false;

          if (pluginOptions.inputFormat === "all" && isSingleQuote(value)) {
            isQuote = true;
          }
          if (
            pluginOptions.inputFormat === "character" &&
            value === MAPPINGS.singleQuote.character
          ) {
            isQuote = true;
          }
          if (
            pluginOptions.inputFormat === "numeric" &&
            value === MAPPINGS.singleQuote.numeric
          ) {
            isQuote = true;
          }
          if (
            pluginOptions.inputFormat === "named" &&
            value === MAPPINGS.singleQuote.named
          ) {
            isQuote = true;
          }

          return all + (isQuote ? 1 : 0);
        }, 0) > 1;

      context.report({
        node,
        message: "Strings must use curly quotes.",
        fix(fixer) {
          let fixed = "";
          let matchIndex = 0;
          let pos = 0;

          function seek(num) {
            pos += num;
          }

          while (pos < value.length) {
            let char = value.charAt(pos);
            const match = matches[matchIndex];

            if (match && pos === match.index) {
              matchIndex++;

              const characterData = getValueEntity(match[0], char);
              let replacement = null;

              if (characterData != null) {
                const replaceCharacter = getReplacementsForType(
                  characterData.value,
                  characterData.type
                );
                const isSingleQuote =
                  replaceCharacter.quoteType === "singleQuote";

                replacement = isSingleQuote
                  ? replaceCharacter.right
                  : replaceCharacter.left;

                const nearestLeftQuote = fixed.lastIndexOf(
                  replaceCharacter.left
                );
                const nearestRightQuote = fixed.lastIndexOf(
                  replaceCharacter.right
                );

                if (nearestLeftQuote > nearestRightQuote) {
                  replacement = replaceCharacter.right;
                }

                if (isSingleQuote && ignoreSingleQuotes) {
                  replacement = null;
                } else {
                  seek(characterData.value.length - 1);
                }
              }

              if (replacement) {
                char = replacement;
              }
            }

            fixed += char;
            seek(1);
          }

          const text =
            type === "literal"
              ? `${node.raw.charAt(0)}${fixed}${node.raw.charAt(
                  node.raw.length - 1
                )}`
              : fixed;

          return [fixer.replaceText(node, text)];
        },
      });
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      JSXText: (node) => handle(node, "jsx"),
      Literal: (node) => handle(node, "literal"),
    };
  },
};

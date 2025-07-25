import type { AdContent, ValidationResult } from './types';

export class PunctuationAndSymbolsRule {
  private static readonly INVALID_EXCLAMATION_IN_HEADLINE_REGEX = /!/;
  private static readonly MULTIPLE_PUNCTUATION_REGEX = /[!?]{2,}/;
  private static readonly REPEATED_PUNCTUATION_REGEX = /(.)\1{2,}/;
  private static readonly NON_STANDARD_SYMBOL_USAGE_REGEX = /@ home|4 sale/;
  private static readonly NON_STANDARD_SUPERSCRIPT_REGEX = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ]|\^[a-zA-Z0-9+\-=()n]/;
  private static readonly INVALID_OR_UNSUPPORTED_CHARS_REGEX = /[\uD800-\uDFFF\uFF61-\uFF9F\u2000-\u206F]/;
  private static readonly OVERUSE_OF_SYMBOLS_REGEX = /(?:[0-9]{2,}|[!?*]{2,}|[。．・]{2,}|[^\w\s]{2,})\S*|\S*(?:[0-9]{2,}|[!?*]{2,}|[。．・]{2,}|[^\w\s]{2,})/g;

  public validate(adContent: AdContent): ValidationResult {
    const { headline, body } = adContent;

    if (PunctuationAndSymbolsRule.INVALID_EXCLAMATION_IN_HEADLINE_REGEX.test(headline)) {
      return { isValid: false, reason: "Exclamation marks are not allowed in the ad headline." };
    }

    if (PunctuationAndSymbolsRule.MULTIPLE_PUNCTUATION_REGEX.test(body)) {
      return { isValid: false, reason: "Multiple exclamation or question marks are not allowed in the ad copy." };
    }

    if (PunctuationAndSymbolsRule.REPEATED_PUNCTUATION_REGEX.test(headline) || PunctuationAndSymbolsRule.REPEATED_PUNCTUATION_REGEX.test(body)) {
      return { isValid: false, reason: "Repeated punctuation or symbols are not allowed." };
    }

    if (PunctuationAndSymbolsRule.NON_STANDARD_SYMBOL_USAGE_REGEX.test(headline) || PunctuationAndSymbolsRule.NON_STANDARD_SYMBOL_USAGE_REGEX.test(body)) {
      return { isValid: false, reason: "Symbols, numbers, or characters are used incorrectly or with altered meaning." };
    }

    if (PunctuationAndSymbolsRule.NON_STANDARD_SUPERSCRIPT_REGEX.test(headline) || PunctuationAndSymbolsRule.NON_STANDARD_SUPERSCRIPT_REGEX.test(body)) {
      return { isValid: false, reason: "Non-standard superscript usage is not allowed." };
    }

    if (PunctuationAndSymbolsRule.OVERUSE_OF_SYMBOLS_REGEX.test(headline) || PunctuationAndSymbolsRule.OVERUSE_OF_SYMBOLS_REGEX.test(body)) {
      return { isValid: false, reason: "Overuse of numbers, symbols, or punctuation for emphasis is not allowed." };
    }

    if (PunctuationAndSymbolsRule.INVALID_OR_UNSUPPORTED_CHARS_REGEX.test(headline) || PunctuationAndSymbolsRule.INVALID_OR_UNSUPPORTED_CHARS_REGEX.test(body)) {
        return { isValid: false, reason: "Invalid or unsupported characters (e.g., emojis, half-width katakana) are not allowed." };
    }

    return { isValid: true };
  }

  public getResolutionActions(): string[] {
    return [
      "Edit the ad to resolve punctuation and symbol issues.",
      "If the symbol usage is generally considered acceptable (e.g., '5* hotel' for '5-star hotel' in English), you may resubmit the ad for review."
    ];
  }
}
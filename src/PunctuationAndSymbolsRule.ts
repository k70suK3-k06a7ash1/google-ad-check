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
      return { isValid: false, reason: "広告見出しで感嘆符は使用できません。" };
    }

    if (PunctuationAndSymbolsRule.MULTIPLE_PUNCTUATION_REGEX.test(body)) {
      return { isValid: false, reason: "広告コピーで複数の感嘆符や疑問符は使用できません。" };
    }

    if (PunctuationAndSymbolsRule.REPEATED_PUNCTUATION_REGEX.test(headline) || PunctuationAndSymbolsRule.REPEATED_PUNCTUATION_REGEX.test(body)) {
      return { isValid: false, reason: "句読点や記号の繰り返しは使用できません。" };
    }

    if (PunctuationAndSymbolsRule.NON_STANDARD_SYMBOL_USAGE_REGEX.test(headline) || PunctuationAndSymbolsRule.NON_STANDARD_SYMBOL_USAGE_REGEX.test(body)) {
      return { isValid: false, reason: "記号、数字、文字が本来の意味と異なる方法で使用されています。" };
    }

    if (PunctuationAndSymbolsRule.NON_STANDARD_SUPERSCRIPT_REGEX.test(headline) || PunctuationAndSymbolsRule.NON_STANDARD_SUPERSCRIPT_REGEX.test(body)) {
      return { isValid: false, reason: "非標準の上付き文字の使用は許可されていません。" };
    }

    if (PunctuationAndSymbolsRule.OVERUSE_OF_SYMBOLS_REGEX.test(headline) || PunctuationAndSymbolsRule.OVERUSE_OF_SYMBOLS_REGEX.test(body)) {
      return { isValid: false, reason: "強調のための数字、記号、句読点の過度な使用は許可されていません。" };
    }

    if (PunctuationAndSymbolsRule.INVALID_OR_UNSUPPORTED_CHARS_REGEX.test(headline) || PunctuationAndSymbolsRule.INVALID_OR_UNSUPPORTED_CHARS_REGEX.test(body)) {
        return { isValid: false, reason: "無効またはサポートされていない文字（絵文字、半角カタカナなど）は使用できません。" };
    }

    return { isValid: true };
  }

  public getResolutionActions(): string[] {
    return [
      "句読点と記号の問題を解決するために広告を編集してください。",
      "記号の使用が一般的に許容される場合（例：英語での「5-star hotel」に対する「5* hotel」）、広告を再審査のために再提出できます。"
    ];
  }
}
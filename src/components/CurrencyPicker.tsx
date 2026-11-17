import cc from 'currency-codes';
import getSymbol from 'currency-symbol-map';

export type CurrenyEntry = { code: string; name: string; symbol: string };

export const ALL_CURRENCIES: CurrenyEntry[] = cc
  .codes()
  .map((code) => ({
    code,
    name: cc.code(code)?.currency ?? code,
    symbol: getSymbol(code) ?? code,
  }))
  .filter((c) => c.symbol !== c.code);

export function CurrenyPicker() {}

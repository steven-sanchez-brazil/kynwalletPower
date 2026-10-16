/** Snapshot ilustrativo: sus importes no representan una contabilidad real. */
export type WalletOverview = {
  readonly balance: string;
  readonly currency: 'MXN';
  readonly indicators: readonly {
    readonly label: string;
    readonly value: string;
    readonly detail: string;
  }[];
  readonly movements: readonly {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly date: string;
    readonly amount: string;
    readonly direction: 'in' | 'out';
  }[];
  readonly card: { readonly maskedNumber: string; readonly expiry: string };
  readonly categories: readonly {
    readonly label: string;
    readonly amount: string;
    readonly indicator: number;
    readonly tone: 'expense' | 'income' | 'neutral';
  }[];
};

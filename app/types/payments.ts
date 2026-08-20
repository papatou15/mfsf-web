export type StripeProductSummary = {
  _id: string;
  nom?: string;
  description?: string;
  actif?: boolean;
};

export type ActivityDateSummary = {
  date?: string;
  inscriptionOuverte?: boolean;
  isVisible?: boolean;
  openDate?: string;
};

export type ActivityPaymentContext = {
  _id: string;
  nom?: string;
  dates?: ActivityDateSummary[];
  produitStripe?: StripeProductSummary;
};

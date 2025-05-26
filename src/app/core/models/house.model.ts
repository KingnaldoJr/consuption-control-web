export interface House {
  id: string;
  number: string;
  condominiumId: string; // Foreign key to Condominium
  ownerName: string;
}

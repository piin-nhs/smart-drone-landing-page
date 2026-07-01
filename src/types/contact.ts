export interface Contact {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  status: "new" | "contacted" | "ignored";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default interface ICreateAddressDTO {
  country: string;
  state: string;
  postal_code: string;
  neighborhood: string;
  street: string;
  sub_neighborhood?: string;
  number?: string;
  complement?: string;
  description?: string;
}

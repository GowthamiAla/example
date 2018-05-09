

/**
 * This is Driver interface to give data type for drivers object
 */

export interface IDriver {


  id: string;
  user: any;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  latitude: number;
  longitude: number;
  licenseNumber: string,
  licenseExpiryDate: Date,
  vendor: any
}

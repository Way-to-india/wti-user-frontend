export interface User {
    firstName: string;
    lastName: string;
    email: string;
    profileImagePath: string;  // Path to the profile image
    phone?: string;
    address?: string;
    bio?: string;
    verified: boolean;
  }
import { Profile } from "./profile";

export type User = {
  id?: string;
  currentProfileId: string;
  accessToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  hasOnlyOneProfile: boolean;
  hasMoreThanOneProfile: boolean;
  isAuthenticated: boolean;
  profiles: Profile[];
  structure?: {
    firmName: string;
    picture: string;
  };
};

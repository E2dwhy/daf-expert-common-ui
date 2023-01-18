export type Profile = {
    id: string;
    accessToken: string;
    idToken?: string;
    connected?: boolean;
    structure: {
      firmName: string;
      picture: string;
    };
  };
  
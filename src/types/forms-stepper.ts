export type FormsStepper = {
    socialReason: string,
    code: string,
    referenceCode: string,
    identificationNumber: string,
    email: string,
    phoneNumber: string,
    logoUrl: string,
    countryId: string,
    commonAcronym: string,
    tradeName: string,
    address: string,
    city: string,
    municipality: string,
    district: string,
    postalCode: string,
    socialCapital: number,
    accountantSystemId: string,
    taxCategoryId: string,
    companyTypeId: string,
    activityId: string,
    activityDetails: string,
    activityStartDate: string,
    activitySectorId: string,
    enterpriseId: string,
    managers: [
      {
        firstName: string,
        lastName: string,
        civility: string,
        phoneNumber: string,
        position: string,
        email: string,
        isManagingDirector: boolean,
      }
    ],
  
    TVAStartDate: string,
    TVANumber: string,
    TVAFrequency: string,
    TVAROF: string,
    taxSystemId: string,
    taxServiceId: string,
    taxDirectionId: string;
  
    socialIdentificationNumber: string,
    accidentRate: number,
    familyBenefitRate: number,
    categoricalMinimumWageSectorId: string,
    
    packageId: string;
  }
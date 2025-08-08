export type Car = {
    brand: string;
    model: string;
    plate: string;
  };  
  
  export type PackageData = {
    plate: string;
    model: string;
    washes: number | "infinity";
    period: number;
    startDate: Date;
    autoRenewal: boolean;
  };
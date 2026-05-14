export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  socials: {
    icon: string;
    link: string;
  }[];
}

export interface ContactHero {
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  courseId: string;   // course ID selected from dropdown ("" = none selected)
  message: string;
}
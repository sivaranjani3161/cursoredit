export interface DropdownItem {
  label: string;
  href: string;
  hasArrow?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

export interface NavbarData {
  links: NavLink[];
  cta: {
    label: string;
    href: string;
  };
}
export interface BlogPost {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
}

export interface ProTip {
  text: string;
}

export interface ContentSection {
  type:
    | "paragraph"
    | "heading2"
    | "heading3"
    | "proTip"
    | "bulletList"
    | "subSection";
  text?: string;
  items?: string[];
  tip?: string;
  label?: string;
}

export interface BlogDetail extends BlogPost {
  tags: string[];
  intro: string;
  sections: ContentSection[];
}

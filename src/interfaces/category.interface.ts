export interface CategoryInterface {
  category_name: string;
  category_description: string;
  isFather: boolean;
  isChildren: boolean;
  isHighlighted: boolean;
  img?: string;
  children?: CategoryChildren[];
}

export type CategoryChildren = CategoryInterface[];

export interface TrashBookRow {
  collection_center: boolean;
  delivery: boolean;
  hide: boolean;
  id: number;
  name: string;
  notes: string;
  pap: boolean;
  translations: any;
  trashBookType?: TrashBookType;
  trash_type_id: number;
  where: string;
}

export interface TrashBookType {
  allowed: {[lang: string]: string}[];
  color: string;
  description?: {[lang: string]: string};
  howto?: {[lang: string]: string};
  id: number;
  name: {[lang: string]: string};
  notallowed: string[];
  showed_in: {
    abandonment: boolean;
    info: boolean;
    report: boolean;
    reservation: boolean;
  };
  slug: string;
  translations: any;
  where: string;
}

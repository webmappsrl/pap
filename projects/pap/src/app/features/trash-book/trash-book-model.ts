export interface TrashBookRow {
  id: number;
  name: string;
  notes: string;
  pap: boolean;
  delivery: boolean;
  collection_center: boolean;
  translations: any;
  trash_type_id: number;
  trashBookType?: TrashBookType;
  hide: boolean;
}

export interface TrashBookType {
  id: number;
  slug: string;
  name: string;
  description: string;
  howto: string;
  where: string;
  color: string;
  allowed: string[];
  notallowed: string[];
  translations: any;
}

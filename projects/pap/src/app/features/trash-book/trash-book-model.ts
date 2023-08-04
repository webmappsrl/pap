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
  allowed: string[];
  color: string;
  description?: string;
  howto?: string;
  id: number;
  name: string;
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

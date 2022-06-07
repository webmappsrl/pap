import {TrashBookType} from '../trash-book/trash-book-model';

export interface CalendarRow {
  trash_types: number[];
  trash_objects?: TrashBookType[];
  start_time: string;
  stop_time: string;
}

export interface Calendar {
  [dateOfTrip: string]: CalendarRow[];
}

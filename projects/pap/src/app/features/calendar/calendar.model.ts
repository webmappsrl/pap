import {TrashBookType} from '../trash-book/trash-book-model';

export interface CalendarRow {
  trash_types: TrashBookType[];
  start_time: string;
  stop_time: string;
}

export interface Calendar {
  address: any;
  calendar: {
    [dateOfTrip: string]: CalendarRow[];
  };
}

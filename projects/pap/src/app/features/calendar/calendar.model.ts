import {TrashBookType} from '../trash-book/trash-book-model';

export interface CalendarRow {
  start_time: string;
  stop_time: string;
  trash_types: TrashBookType[];
}

export interface Calendar {
  address: any;
  calendar: {
    [dateOfTrip: string]: CalendarRow[];
  };
}

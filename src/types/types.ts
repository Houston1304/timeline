export interface Event {
  year: number;
  content: string;
}

export interface Period {
  form: string;
  startYear: number;
  endYear: number;
  events: Event[];
}

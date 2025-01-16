export interface TimeTable {
  time_table: Record<string, Record<string, string>>;
  section: string;
  last_updated: string;
  registration_number: string;
  courses: Record<string, any>;
}

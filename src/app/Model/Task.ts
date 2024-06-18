export interface Task {
  id?: string;
  name: string;
  author?: string; //user email
  status?: string;
  priority: string;
  description: string;
  comments?: Comment[];
  date: string;
}

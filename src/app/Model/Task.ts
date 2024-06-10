export interface Task {
  id?: string;
  toDo: string;
  author?: string; //user fullname
  status?: string;
  comments?: Comment[];
}

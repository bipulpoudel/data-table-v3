import { STATUS } from "@/enum";

export type ProjectManager = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  project_manager: ProjectManager;
  status: STATUS;
  last_updated: string;
  resources: string;
  start_date: string;
  end_date: string;
  estimated_cost: number;
  last_updated_note: string;
};

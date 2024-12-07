import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import api from "./api";

const getProjects = async ({
  searchQuery,
  sorting,
  pagination,
  filters,
}: {
  searchQuery: string;
  sorting: SortingState;
  pagination: PaginationState;
  filters: ColumnFiltersState;
}) => {
  const { data } = await api.post("/projects/list", {
    searchQuery,
    sorting,
    pagination,
    filters,
  });
  return data?.data || [];
};

export default {
  getProjects,
};

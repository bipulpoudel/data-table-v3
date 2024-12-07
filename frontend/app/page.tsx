"use client";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { DataTable } from "@/components/data-table";
import TopHeader from "@/components/data-table/Header";
import { columns } from "./columns";
import { ProjectsService } from "@/services";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

const IndexPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, _] = useQueryState("searchQuery", {
    defaultValue: "",
    throttleMs: 500,
  });
  const { data, isFetching, isError } = useQuery({
    queryKey: ["projects", searchQuery, sorting, pagination, filters],
    queryFn: () =>
      ProjectsService.getProjects({
        searchQuery,
        sorting,
        pagination,
        filters,
      }),
  });

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-10">
      <TopHeader />
      <DataTable
        data={data?.projects || []}
        columns={columns}
        isLoading={isFetching}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.totalCount || 0}
        filters={filters}
        setFilters={setFilters}
        counts={data?.counts}
      />
    </div>
  );
};

export default IndexPage;

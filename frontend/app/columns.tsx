"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/data-table/SortableHeader";
import { Project } from "./data";
import ProjectName from "@/components/data-table/ProjectName";
import ProjectManager from "@/components/data-table/ProjectManager";
import ProjectStatus from "@/components/data-table/ProjectStatus";
import ProjectLastUpdate from "@/components/data-table/ProjectLastUpdate";
import ProjectResources from "@/components/data-table/ProjectResources";
import ProjectTimeLine from "@/components/data-table/ProjectTimeLine";
import { ProjectActions } from "@/components/data-table/ProjectActions";

function formatCurrency(amount: number) {
  if (amount >= 1000) {
    return `US$ ${(amount / 1000).toFixed(1)}k`;
  }
  return `US$ ${amount}`;
}

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-border bg-white shadow-lg border data-[state=checked]:border-0"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-border bg-white shadow-lg border data-[state=checked]:border-0"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column} title="#" className="w-[50px]" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column} title="Project name" />
    ),
    cell: ({ row }) => <ProjectName name={row.getValue("name")} />,
    enableSorting: true,
    enableMultiSort: true,
  },
  {
    accessorKey: "project_manager",
    header: "PM",
    cell: ({ row }) => (
      <ProjectManager projectManager={row.original.project_manager} />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => <ProjectStatus status={row.getValue("status")} />,
    enableSorting: true,
    enableMultiSort: true,
  },
  {
    accessorKey: "last_updated",
    header: ({ column }) => (
      <SortableHeader column={column} title="Last updated" />
    ),
    cell: ({ row }) => (
      <ProjectLastUpdate
        date={row.getValue("last_updated")}
        last_updated_note={row.original.last_updated_note}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "resources",
    header: "Resources",
    cell: ({ row }) => (
      <ProjectResources resources={row.getValue("resources")} />
    ),
  },
  {
    accessorKey: "start_date",
    header: "Project timeline",
    cell: ({ row }) => (
      <ProjectTimeLine
        startDate={row.original.start_date}
        endDate={row.original.end_date}
      />
    ),
  },
  {
    accessorKey: "estimated_cost",
    header: ({ column }) => (
      <SortableHeader column={column} title="Estimated cost" />
    ),
    cell: ({ row }) => (
      <p className="text-base">
        {formatCurrency(row.getValue("estimated_cost"))}
      </p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ProjectActions row={row} />,
  },
];

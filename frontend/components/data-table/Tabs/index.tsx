"use client";
import { useEffect, useState } from "react";
import TabItem from "./TabItem";
import { ColumnFiltersState, OnChangeFn } from "@tanstack/react-table";

export interface IItem {
  index: number;
  label: string;
  value: "all" | "risk" | "onHold" | "potentialRisk" | "onTrack" | "archived";
}

const items: IItem[] = [
  {
    index: 0,
    label: "All",
    value: "all",
  },
  {
    index: 1,
    label: "Risk",
    value: "risk",
  },
  {
    index: 2,
    label: "On Hold",
    value: "onHold",
  },
  {
    index: 3,
    label: "Potential Risk",
    value: "potentialRisk",
  },
  {
    index: 4,
    label: "On Track",
    value: "onTrack",
  },
  {
    index: 5,
    label: "Archived",
    value: "archived",
  },
];

const TableTabs = ({
  filters,
  setFilters,
  counts = {
    archived: 0,
    onTrack: 0,
    onHold: 0,
    potentialRisk: 0,
    risk: 0,
  },
}: {
  filters: ColumnFiltersState;
  setFilters: OnChangeFn<ColumnFiltersState>;
  counts: {
    archived: number;
    onTrack: number;
    onHold: number;
    potentialRisk: number;
    risk: number;
  };
}) => {
  const [activeTab, setActiveTab] = useState<IItem["value"]>("all");

  useEffect(() => {
    const otherFilters = filters.filter((filter) => filter.id !== "status");

    if (otherFilters.length === 0) {
      setFilters([{ id: "status", value: activeTab }]);
    } else {
      setFilters([...otherFilters, { id: "status", value: activeTab }]);
    }
  }, [activeTab]);

  return (
    <div className="flex flex-row items-center gap-5 px-5">
      {items.map((item) => (
        <TabItem
          key={item.index}
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
        />
      ))}
    </div>
  );
};

export default TableTabs;

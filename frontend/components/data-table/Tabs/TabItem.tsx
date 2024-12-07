"use client";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";

import { IItem } from ".";
import { cn } from "@/lib/utils";

const TabItem = ({
  item,
  activeTab,
  setActiveTab,
  counts = {
    risk: 0,
    onHold: 0,
    potentialRisk: 0,
    onTrack: 0,
    archived: 0,
  },
}: {
  item: IItem;
  activeTab: IItem["value"];
  setActiveTab: (value: IItem["value"]) => void;
  counts: {
    risk: number;
    onHold: number;
    potentialRisk: number;
    onTrack: number;
    archived: number;
  };
}) => {
  const { label, value } = item;

  const handleClick = () => {
    setActiveTab(value);
  };

  const isActive = useMemo(() => activeTab === value, [activeTab, value]);

  return (
    <>
      {value === "archived" && (
        <Separator className="mr-2 h-4 mx-2" orientation="vertical" />
      )}
      <div
        className={cn(
          "flex flex-row gap-2 items-center border-b-2 border-transparent hover:border-black pb-1 cursor-pointer ",
          {
            "border-primary": isActive,
            "hover:border-primary": isActive,
          }
        )}
        onClick={handleClick}
      >
        <h3
          className={cn("font-normal", {
            "text-primary": isActive,
            "font-semibold": isActive,
          })}
        >
          {label}
        </h3>
        <span
          className={cn("bg-gray-200 rounded-xl text-xs px-[6px] font-light", {
            "bg-primary text-white": isActive,
          })}
        >
          {value === "all"
            ? counts.risk +
              counts.onHold +
              counts.potentialRisk +
              counts.onTrack +
              counts.archived
            : counts[value]}
        </span>
      </div>
    </>
  );
};

export default TabItem;

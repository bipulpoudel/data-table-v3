"use client";
import { useQueryState } from "nuqs";

import {
  ChevronDown,
  Cross,
  FilterIcon,
  SearchIcon,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useQueryState("searchQuery", {
    defaultValue: "",
    throttleMs: 500,
  });

  return (
    <div className="flex flex-row items-center h-9 rounded-lg shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center h-full px-5 rounded-l-lg border gap-2 text-sm">
          <FilterIcon className="w-4 h-4" fill="currentColor" />
          All
          <ChevronDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-row items-center rounded-r-lg border border-l-0 h-full relative">
        <SearchIcon className="w-4 h-4 ml-2 absolute text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="h-full py-0 px-3 border-none text-sm w-72 rounded-r-lg pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;

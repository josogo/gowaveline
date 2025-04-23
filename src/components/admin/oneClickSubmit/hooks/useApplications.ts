
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateProgress, generateMockApplications, formatApplicationData } from "../utils/applicationUtils";

export type ApplicationListItem = {
  id: string;
  businessName: string;
  status: "complete" | "incomplete" | "submitted" | "declined" | "removed";
  lastEdited: string;
  progress: number;
  rawData?: any;
};

export type ApplicationsFilter = {
  searchTerm: string;
  status: string;
  sortBy: string;
};

/**
 * Custom hook for fetching and filtering applications.
 */
export function useApplications() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("merchant_applications")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const formattedData: ApplicationListItem[] = data.map(formatApplicationData);

      setApplications(formattedData);
      setFilteredApplications(formattedData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
      // Show mock data in case of error
      const mockApps = generateMockApplications();
      setApplications(mockApps);
      setFilteredApplications(mockApps);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(filters: ApplicationsFilter) {
    let filtered = [...applications];

    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(app =>
        app.businessName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Sort
    filtered = sortApplications(filtered, filters.sortBy);
    setFilteredApplications(filtered);
  }

  function sortApplications(apps: ApplicationListItem[], sortBy: string) {
    const sorted = [...apps];
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
      case "oldest":
        return sorted.sort((a, b) => new Date(a.lastEdited).getTime() - new Date(b.lastEdited).getTime());
      case "name-asc":
        return sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
      case "name-desc":
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      case "progress-high":
        return sorted.sort((a, b) => b.progress - a.progress);
      case "progress-low":
        return sorted.sort((a, b) => a.progress - b.progress);
      default:
        return sorted;
    }
  }

  return {
    loading,
    applications,
    filteredApplications,
    setFilteredApplications,
    handleFilterChange,
    fetchApplications,
  };
}

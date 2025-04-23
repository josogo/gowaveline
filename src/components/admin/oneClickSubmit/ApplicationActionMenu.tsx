
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ApplicationActionMenuProps {
  merchantApplication: any;
  showActionMenu: boolean;
  setShowActionMenu: (show: boolean) => void;
  handleDeclineRemove: (action: "declined" | "removed", appData?: any) => void;
}

export const ApplicationActionMenu: React.FC<ApplicationActionMenuProps> = ({
  merchantApplication,
  showActionMenu,
  setShowActionMenu,
  handleDeclineRemove,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActionMenu(false);
      }
    };

    if (showActionMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showActionMenu, setShowActionMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="icon"
        aria-label="More actions"
        className="rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setShowActionMenu(!showActionMenu);
        }}
      >
        <MoreHorizontal />
      </Button>
      {showActionMenu && (
        <div className="absolute right-0 mt-2 w-40 z-10 bg-white shadow-lg rounded border">
          <button
            className="block w-full px-4 py-2 text-left hover:bg-amber-50 text-amber-800"
            onClick={(e) => {
              e.stopPropagation();
              handleDeclineRemove("declined", merchantApplication);
              setShowActionMenu(false);
            }}
          >
            Decline Application
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-red-50 text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDeclineRemove("removed", merchantApplication);
              setShowActionMenu(false);
            }}
          >
            Remove Application
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

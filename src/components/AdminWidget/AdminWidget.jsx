import { TooltipProvider } from "@/components/ui/tooltip";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";

import "./AdminWidget.css";

export function AdminWidget() {
  return (
    <TooltipProvider>
      <AssistantModal />
    </TooltipProvider>
  );
}

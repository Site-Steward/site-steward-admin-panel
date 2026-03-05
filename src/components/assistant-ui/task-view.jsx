import { Thread } from "@/components/assistant-ui/thread";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const TaskView = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 bg-background overflow-hidden">
      <div className="flex flex-col gap-3 border rounded-lg p-4 bg-muted/30 flex-shrink-0">
        <div className="space-y-2">
          <label htmlFor="task-title" className="text-sm font-medium">
            New Task
          </label>
          <Input
            id="task-title"
            placeholder="Enter task title..."
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="task-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="task-description"
            placeholder="Add task details..."
            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button variant="default" size="sm" className="w-fit">
          Create Task
        </Button>
      </div>

      <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
        <Thread />
      </div>
    </div>
  );
};

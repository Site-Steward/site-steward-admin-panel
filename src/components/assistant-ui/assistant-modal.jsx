"use client";

import { forwardRef, useState } from "react";
import {
  AssistantModalPrimitive,
  AssistantRuntimeProvider,
  useLocalRuntime,
} from "@assistant-ui/react";
import {
  BotIcon,
  ChevronDownIcon,
  MinusIcon,
  Maximize2Icon,
  Minimize2Icon,
  XIcon,
  WrenchIcon,
  ListTodoIcon,
  SettingsIcon,
} from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import { TaskView } from "@/components/assistant-ui/task-view";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const stubbedAdapter = {
  async run({ messages, abortSignal }) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (abortSignal.aborted) {
      return { content: [{ type: "text", text: "Request canceled." }] };
    }

    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    const latestTextPart = latestUserMessage?.content?.find(
      (part) => part.type === "text",
    );

    const attachmentParts = latestUserMessage?.content?.filter(
      (part) => part.type === "file" || part.type === "image",
    );

    const userText = latestTextPart?.text?.trim();
    const attachmentCount = attachmentParts?.length ?? 0;

    const attachmentStub =
      attachmentCount > 0
        ? `Attachment UI is active (${attachmentCount} selected), but upload processing is currently stubbed.`
        : "Attachment support is available in the UI and currently stubbed for processing.";

    return {
      content: [
        {
          type: "text",
          text: userText
            ? `Stub response: I received \"${userText}\". ${attachmentStub}`
            : `Stub response: no backend or external provider is configured yet. ${attachmentStub}`,
        },
      ],
    };
  },
};

function AssistantStubRuntimeProvider({ children }) {
  const runtime = useLocalRuntime(stubbedAdapter);
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeView, setActiveView] = useState("tasks");

  return (
    <AssistantStubRuntimeProvider>
      <AssistantModalPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor fixed right-4 bottom-4 z-50 size-11">
          <AssistantModalPrimitive.Trigger asChild>
            <AssistantModalButton />
          </AssistantModalPrimitive.Trigger>
        </AssistantModalPrimitive.Anchor>

        <AssistantModalPrimitive.Content
          sideOffset={16}
          className={cn(
            "aui-root aui-modal-content data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:zoom-out data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=open]:zoom-in z-50 overflow-hidden overscroll-contain rounded-xl border bg-background p-0 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
            isExpanded
              ? "h-[82vh] w-[82vw] max-w-[1200px]"
              : "h-[70vh] w-[900px] max-w-[calc(100vw-2rem)]",
            isMinimized && "h-auto w-[420px]",
          )}
        >
          <div className="flex h-full w-full flex-col bg-background">
            <div className="flex h-12 items-center justify-between border-b px-3">
              <div className="flex items-center gap-2">
                <BotIcon className="size-4" />
                <span className="text-sm font-semibold">
                  Site Steward Admin
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TooltipIconButton
                  tooltip="Minimize"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsMinimized((current) => !current)}
                >
                  <MinusIcon className="size-4" />
                </TooltipIconButton>
                <TooltipIconButton
                  tooltip={isExpanded ? "Contract" : "Expand"}
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsExpanded((current) => !current)}
                >
                  {isExpanded ? (
                    <Minimize2Icon className="size-4" />
                  ) : (
                    <Maximize2Icon className="size-4" />
                  )}
                </TooltipIconButton>
                <TooltipIconButton
                  tooltip="Close"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="size-4" />
                </TooltipIconButton>
              </div>
            </div>

            {!isMinimized && (
              <div className="flex min-h-0 flex-1">
                <SidebarProvider>
                  <Sidebar collapsible="none" className="w-64 border-r">
                    <SidebarContent>
                      <SidebarGroup>
                        <SidebarGroupLabel>Tools</SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => setActiveView("thread")}
                                isActive={activeView === "thread"}
                              >
                                <WrenchIcon />
                                <span>Link Scanner</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => setActiveView("thread")}
                                isActive={activeView === "thread"}
                              >
                                <WrenchIcon />
                                <span>Content Audit</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>

                      <SidebarGroup>
                        <SidebarGroupLabel>Tasks</SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => setActiveView("tasks")}
                                isActive={activeView === "tasks"}
                              >
                                <ListTodoIcon />
                                <span>Review Sitemap</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => setActiveView("tasks")}
                                isActive={activeView === "tasks"}
                              >
                                <ListTodoIcon />
                                <span>Fix Broken Links</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>

                      <SidebarGroup>
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => setActiveView("thread")}
                                isActive={activeView === "thread"}
                              >
                                <SettingsIcon />
                                <span>Workspace Profile</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => setActiveView("thread")}
                                isActive={activeView === "thread"}
                              >
                                <SettingsIcon />
                                <span>Notification Rules</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                    </SidebarContent>
                  </Sidebar>
                </SidebarProvider>

                <div className="min-w-0 flex-1 bg-background overflow-hidden">
                  {activeView === "thread" && <Thread />}
                  {activeView === "tasks" && <TaskView />}
                </div>
              </div>
            )}
          </div>
        </AssistantModalPrimitive.Content>
      </AssistantModalPrimitive.Root>
    </AssistantStubRuntimeProvider>
  );
};

const AssistantModalButton = forwardRef(
  ({ "data-state": state, ...rest }, ref) => {
    const tooltip = state === "open" ? "Close Assistant" : "Open Assistant";

    return (
      <TooltipIconButton
        variant="default"
        tooltip={tooltip}
        side="left"
        {...rest}
        className="aui-modal-button size-full rounded-full shadow transition-transform hover:scale-110 active:scale-90"
        ref={ref}
      >
        <BotIcon
          data-state={state}
          className="aui-modal-button-closed-icon absolute size-6 transition-all data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
        />
        <ChevronDownIcon
          data-state={state}
          className="aui-modal-button-open-icon absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
        />
        <span className="aui-sr-only sr-only">{tooltip}</span>
      </TooltipIconButton>
    );
  },
);

AssistantModalButton.displayName = "AssistantModalButton";

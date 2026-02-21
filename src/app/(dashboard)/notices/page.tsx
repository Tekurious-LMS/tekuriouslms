"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNoticesQuery, useInvalidateQueries } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api-client";
import { useTenant } from "@/contexts/TenantContext";

const CATEGORY_LABELS = {
  GENERAL: "Admin",
  ACADEMIC: "Academic",
  ADMINISTRATIVE: "Admin",
  URGENT: "Event",
} as const;

export default function NoticesPage() {
  const { data: notices, isLoading } = useNoticesQuery();
  const { currentRole } = useTenant();
  const { invalidateNotices } = useInvalidateQueries();
  const isPublisher = (currentRole ?? "").toLowerCase() === "admin" || (currentRole ?? "").toLowerCase() === "teacher";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const categorized = useMemo(() => {
    const list = notices ?? [];
    return {
      all: list,
      academic: list.filter((n) => n.category === "ACADEMIC"),
      events: list.filter((n) => n.category === "URGENT"),
      admin: list.filter((n) => n.category === "GENERAL" || n.category === "ADMINISTRATIVE"),
    };
  }, [notices]);

  const publishNotice = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await apiFetch("/api/notices", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: "GENERAL",
          targetRoles: ["All"],
          publishNow: true,
        }),
      });
      await invalidateNotices();
      setTitle("");
      setContent("");
      toast.success("Notice published");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to publish notice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground">
            Updates, announcements, and events.
          </p>
        </div>
      </div>

      {isPublisher && (
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold">Publish Notice</h2>
          <Input
            placeholder="Notice title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Notice content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={publishNotice} disabled={saving || !title.trim() || !content.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              {saving ? "Publishing..." : "Post Notice"}
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Notices</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        {(["all", "academic", "events", "admin"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground">Loading notices...</p>
            ) : categorized[tab].length === 0 ? (
              <p className="text-muted-foreground">No notices available.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorized[tab].map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    title={notice.title}
                    date={new Date(
                      notice.publishedAt ?? notice.createdAt,
                    ).toLocaleDateString()}
                    category={CATEGORY_LABELS[notice.category]}
                    content={notice.content}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}


"use client";

import { NoticeCard } from "@/components/notices/NoticeCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const notices = [
    { id: 1, title: "School Closed for Holi", date: "March 24, 2024", category: "Admin", content: "The school will remain closed on March 25th on account of Holi. Classes resume on Tuesday." },
    { id: 2, title: "Science Fair Registration", date: "March 20, 2024", category: "Event", content: "Students from grades 8-10 can register for the annual Science Fair. Theme: Sustainable Energy." },
    { id: 3, title: "Term 3 Exam Schedule", date: "March 15, 2024", category: "Academic", content: "The final term examinations will commence from April 10th. Detailed schedule has been mailed." },
    { id: 4, title: "Guest Lecture: AI in Future", date: "March 12, 2024", category: "Academic", content: "Dr. Rao from IIT Bombay will be delivering a lecture on Artificial Intelligence for Grade 11 & 12." },
    { id: 5, title: "Annual Sports Day", date: "Feb 28, 2024", category: "Event", content: "Join us for a day of fun and athletics at the main stadium. Parents are welcome." },
];

export default function NoticesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
                    <p className="text-muted-foreground">Updates, announcements, and events.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Notice
                </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all">All Notices</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {notices.map((notice) => (
                            <NoticeCard key={notice.id} title={notice.title} date={notice.date} category={notice.category as any} content={notice.content} />
                        ))}
                    </div>
                </TabsContent>
                {["academic", "events", "admin"].map((cat) => (
                    <TabsContent key={cat} value={cat} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {notices.filter(n => n.category.toLowerCase().includes(cat === 'events' ? 'event' : cat)).map((notice) => (
                                <NoticeCard key={notice.id} title={notice.title} date={notice.date} category={notice.category as any} content={notice.content} />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

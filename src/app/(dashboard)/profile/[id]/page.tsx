"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";
import { StudentAttemptView } from "@/components/courses/StudentAttemptView";
import { PaymentHistory } from "@/components/profile/PaymentHistory";
import { useUsersQuery } from "@/hooks/use-api";

function flattenUsers(
  data:
    | {
        admins: Array<{ id: string; name: string; email: string; role: string }>;
        teachers: Array<{ id: string; name: string; email: string; role: string }>;
        students: Array<{ id: string; name: string; email: string; role: string }>;
        parents: Array<{ id: string; name: string; email: string; role: string }>;
      }
    | undefined,
) {
  if (!data) return [];
  return [
    ...data.admins,
    ...data.teachers,
    ...data.students,
    ...data.parents,
  ];
}

export default function StudentProfilePage() {
  const params = useParams();
  const userId = params?.id as string | undefined;
  const { data: usersData, isLoading } = useUsersQuery(!!userId);

  const allUsers = React.useMemo(
    () => flattenUsers(usersData),
    [usersData],
  );
  const user = React.useMemo(
    () => allUsers.find((u) => u.id === userId),
    [allUsers, userId],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
          <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
          <AvatarFallback className="text-2xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge>{user.role}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> {user.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Bangalore, India
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Joined Jan 2024
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Academic History</TabsTrigger>
          <TabsTrigger value="payments">Fee Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">A-</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fee Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₹15,000</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Reuse */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <StudentAttemptView />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Performance History</h3>
              <Button variant="outline" size="sm">
                Download Report Card
              </Button>
            </div>
            <StudentAttemptView />
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

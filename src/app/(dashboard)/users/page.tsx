"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStats } from "@/components/users/UserStats";
import { UserList } from "@/components/users/UserList";
import { RBACMatrix } from "@/components/users/RBACMatrix";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage system users, roles, and access permissions.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-6">
          <UserStats />
          <UserList />
        </TabsContent>
        <TabsContent value="roles" className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Role Based Access Control
            </h2>
            <p className="text-sm text-muted-foreground">
              Overview of permissions assigned to each role.
            </p>
          </div>
          <RBACMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}

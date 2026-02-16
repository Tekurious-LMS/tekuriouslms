import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

const topStudents = [
  { rank: 1, name: "Alice Smith", score: 98, class: "10 A", image: "01" },
  { rank: 2, name: "Bob Johnson", score: 96, class: "10 A", image: "02" },
  { rank: 3, name: "Charlie Davis", score: 95, class: "10 B", image: "03" },
  { rank: 4, name: "Diana Evans", score: 94, class: "10 A", image: "04" },
  { rank: 5, name: "Ethan Hunt", score: 92, class: "10 C", image: "05" },
];

export function RankingTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-medium">Top Performers</h3>
      </div>
      <Tabs defaultValue="class">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="class">Class Level</TabsTrigger>
          <TabsTrigger value="school">School Level</TabsTrigger>
        </TabsList>
        <TabsContent value="class" className="border rounded-md mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topStudents.map((student) => (
                <TableRow key={student.rank}>
                  <TableCell className="font-bold text-center">
                    {student.rank <= 3 ? (
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${student.rank === 1 ? "bg-yellow-500" : student.rank === 2 ? "bg-slate-400" : "bg-orange-400"}`}
                      >
                        {student.rank}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        #{student.rank}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {student.score}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="school">
          <div className="p-8 text-center text-muted-foreground border rounded-md mt-4">
            School-wide rankings would be displayed here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

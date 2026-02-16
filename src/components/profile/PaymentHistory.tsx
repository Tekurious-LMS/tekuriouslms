import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const payments = [
  {
    id: "INV-001",
    date: "2024-01-05",
    amount: "₹15,000",
    status: "Paid",
    description: "Term 1 Fee",
  },
  {
    id: "INV-002",
    date: "2024-04-05",
    amount: "₹15,000",
    status: "Paid",
    description: "Term 2 Fee",
  },
  {
    id: "INV-003",
    date: "2024-07-05",
    amount: "₹15,000",
    status: "Pending",
    description: "Term 3 Fee",
  },
];

export function PaymentHistory() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={payment.status === "Paid" ? "default" : "secondary"}
                  className={
                    payment.status === "Paid"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-600 hover:bg-yellow-700 text-white"
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={payment.status !== "Paid"}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

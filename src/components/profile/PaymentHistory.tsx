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
import type { PaymentItem } from "@/hooks/use-api";

interface PaymentHistoryProps {
  payments: PaymentItem[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (!payments.length) {
    return (
      <div className="rounded-md border p-6 text-center text-muted-foreground">
        No payment records available for this account.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Plan</TableHead>
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
              <TableCell>{payment.subscription.planName}</TableCell>
              <TableCell>
                {new Date(payment.paidAt).toLocaleDateString()}
              </TableCell>
              <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={payment.status.toLowerCase() === "paid" ? "default" : "secondary"}
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={payment.status.toLowerCase() !== "paid"}
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


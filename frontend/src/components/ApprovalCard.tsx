import type { Approval, ResumeDecision } from "../types/agent";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";


type Props = {
  approval: Approval;
  busy: boolean;
  onDecide: (decision: ResumeDecision) => void;
};

function formatDate(date?: string) {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
export default function ApprovalCard({ approval, busy, onDecide }: Props) {
  return (
    <Card className="border-line bg-white/5">
      {approval.type === "order_approval" ? (
        <>
          <CardHeader>
            <CardDescription>New order: needs approval</CardDescription>
            <CardTitle>{approval.draft.customerName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1">
              {approval.draft.items.map((item, i) => (
                <li key={i}>
                  {item.name} X {item.quantity} {item.unit ?? ""}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              Due:{formatDate(approval.draft.dueDate)}
              {approval.draft.amount !== undefined &&
                `. ₹${approval.draft.amount}`}
              {approval.draft.advancePaid
                ? `.Advance ₹${approval.draft.advancePaid}`
                : ""}
            </p>
            {approval.draft.notes && (
              <p className="text-sm text-muted">{approval.draft.notes}</p>
            )}
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardDescription>Status change: need approval</CardDescription>
            <CardTitle>
              Order #{approval.orderId} · {approval.customerName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge variant={"outline"}>{approval.from}</Badge>
            <span className="text-muted">→</span>
            <Badge>{approval.to}</Badge>
          </CardContent>
        </>
      )}
      <CardFooter>
        <Button disabled={busy} onClick={() => onDecide({ action: "approve" })}>
          Approve
        </Button>
        <Button
          variant="ghost"
          disabled={busy}
          onClick={() => onDecide({ action: "cancel" })}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}

import type { Order,OrderStatus, PriorityLevel} from "../types/agent";
import { Badge } from "../components/ui/badge";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";


const levelStyles:Record<PriorityLevel,{bar:string; badge:string; label:string}>={
    HIGH: { bar: "bg-red-400", badge: "bg-red-400/15 text-red-300", label: "HIGH" },
     MEDIUM: { bar: "bg-amber-400", badge: "bg-amber-400/15 text-amber-300", label: "MED" },
  LOW: { bar: "bg-emerald-400", badge: "bg-emerald-400/15 text-emerald-300", label: "LOW" },
}
const statusStyles:Record<OrderStatus, {dot:string; label:string}> = {
    new:{ dot:"bg-blue-400", label:"New"},
     in_progress: { dot: "bg-amber-400", label: "In progress" },
  ready: { dot: "bg-emerald-400", label: "Ready" },
  delivered: { dot: "bg-slate-500", label: "Delivered" },
  cancelled: { dot: "bg-slate-500", label: "Cancelled" },
}

function formatDue(dueDate:string | null){
    if(!dueDate) return { text:"No due Date", overdue:false};

    const today = new Date().toLocaleDateString("en-CA");
    const days = Math.round((Date.parse(dueDate) - Date.parse(today)) / 86_400_000);
    const pretty = new Date(dueDate).toLocaleDateString("en-IN", { day:"numeric", month:"short"});

    if(days < 0) return { text:`Overdue . was due ${pretty}`, overdue:true};
    if(days === 0) return {text:"Due today", overdue:false};
    if(days === 1) return {text:"Due tomorrow", overdue:false};

    return {text:`Due ${pretty}`, overdue:false}
}

export default function OrderCard({order}:{order:Order}){
const level = order.priority ? levelStyles[order.priority.level] : levelStyles.LOW;
const status = statusStyles[order.status];
const due = formatDue(order.dueDate);
const items = order.items.map((i) => `${i.name} X ${i.quantity}`).join(", ");

    return (
        <Card className="relative gap-3 overflow-hidden border border-line bg-white/5 py-4 ring-0">
            <span className={`absolute inset-y-0 left-0 w-1 ${level.bar}`}  />
            <CardHeader className="px-5">
                <div className="flex items-center gap-2">
                    <Badge className={` font-bold tracking-wider${level.badge}`}>{level.label}</Badge>
                    <span className="text-sm text-muted">#{order.id}</span>
                   <Badge variant="outline" className="ml-auto gap-1.5 border-line">
                    <span className={`size-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                   </Badge>
                </div>
                <CardTitle className="mt-2">{order.customer.name}</CardTitle>
                <p className="text-sm text-fg/80">{items}</p>
            </CardHeader>
            <CardContent className="flex justify-between px-5 text-xm">
                <span className={due.overdue ? "text-red-300":"text-muted"}>{due.text}</span>
                {order.amount !== null && (
                    <span className="text-muted">
                        <span className="font-semibold text-fg">₹{order.amount.toLocaleString("en-In")}</span>
                        {order.advancePaid > 0 && `. ₹${order.advancePaid.toLocaleString("en-IN")} paid`}
                    </span>
                )}
            </CardContent>
            {order.priority && order.priority.reasons.length > 0 && (
                <CardFooter className="border-t border-dashed border-line bg-transparent px-3 pt-3 text-xs text-muted">
                    Why {level.label}:&nbsp;<span>{order.priority.reasons.join(" . ")}</span></CardFooter>
            )}
        </Card>

    )
}
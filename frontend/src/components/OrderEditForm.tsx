import { useState, type FormEvent} from "react";
import type { OrderDraft } from "../types/agent";
import {Button} from "../components/ui/button";
import {Input} from "../components/ui/input";
import {Label}from "../components/ui/label";

type Props = {
    initial: OrderDraft;
    busy:boolean;
    onSave:(draft:OrderDraft) => void;
    onBack:() => void;
}


function toNumber(value:string){
    return value === "" ? undefined : Number(value);
}

export default function OrderEditForm({ initial, busy, onSave, onBack}:Props){
    const [draft, setDraft] = useState<OrderDraft>(initial);

    function update<k extends keyof OrderDraft>(key: k, value: OrderDraft[k]){
        setDraft((d) => ({...d,[key]:value}));
    }

    function handleSubmit(e:FormEvent){
        e.preventDefault();
        onSave(draft);
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="customerName">Customer</Label>
                    <Input id="customerName" required value={draft.customerName} onChange={(e)=>update("customerName", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label  htmlFor="customerPhone">Phone</Label>
                    <Input id="customerPhone"   value={draft.customerPhone ?? ""} onChange={(e) => update("customerPhone", e.target.value || undefined)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due date</Label>
                    < Input id="dueDate" value={draft.dueDate ?? ""} onChange={(e) => update("dueDate", e.target.value)}/>
                </div>
                <div className="space-h-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    < Input id="amount" type="text" min={0} value={draft.amount ?? ""} onChange={(e) => update("amount",toNumber(e.target.value))}/>
                </div>
                <div className="space-y-2">
          <Label htmlFor="text">Advance (₹)</Label>
          <Input
            id="advancePaid"
            type="number"
            min={0}
            value={draft.advancePaid ?? ""}
            onChange={(e) => update("advancePaid", toNumber(e.target.value))}
          />
        </div>

        <label className="flex items-center gap-2 self-end pb-2">
          <input
            type="checkbox"
            checked={draft.isUrgent ?? false}
            onChange={(e) => update("isUrgent", e.target.checked)}
          />
          Urgent
        </label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={draft.notes ?? ""}
          onChange={(e) => update("notes", e.target.value || undefined)}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy} className="bg-white text-black hover:bg-white/90">Save & Approve</Button>
        <Button type="button" variant="ghost" onClick={onBack} >Back

        </Button>
      </div>
        </form>
    )
}
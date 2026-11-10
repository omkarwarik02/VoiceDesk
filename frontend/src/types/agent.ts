export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type AgentResponse =
  | {
      status: "answered";
      answer: string;
      toolsUsed: string[];
      threadId: string;
    }
  | {
      status: "needs_approval";
      approval: Approval;
      threadId: string;
    };

export type OrderItem = {
  name: string;
  quantity: number;
  unit?: string;
};

export type OrderDraft = {
  customerName: string;
  customerPhone?: string;
  dueDate?: string;      
  amount?: number;
  advancePaid?: number;
  isUrgent?: boolean;
  notes?: string;
  items: OrderItem[];
};

export type ResumeDecision =
  | { action: "approve" }
  | { action: "cancel" }
  | { action: "edit"; draft: OrderDraft };


  export type OrderStatus ="new" | "in_progress"| "ready" | "delivered" | "cancelled";

  export type OrderApproval = {
    type:"order_approval";
    draft:OrderDraft;
  }

  export type StatusApproval = {
    type:"status_approval";
    orderId:number;
    customerName:string;
    from: OrderStatus;
    to:OrderStatus;
  }

  export type Approval = OrderApproval | StatusApproval;

  export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

  export type Priority = {
    level:PriorityLevel;
    score:number;
    reasons:string[]
  }

  export type Order = {
    id:number;
    status:OrderStatus;
    dueDate:string | null;
    amount: number | null;
    advancePaid: number;
    isUrgent: boolean;
    notes: string | null;
    createdAt:string;
    customer:{id:number; name:string, phone:string | null; isVip: boolean};
    items:{id:number; name:string; quantity:number; unit:string | null}[];
    priority:Priority | null;
  }

  export type OrderResponse = {
    ok:true;
    count:number;
    orders:Order[]
  }
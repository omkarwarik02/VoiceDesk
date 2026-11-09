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
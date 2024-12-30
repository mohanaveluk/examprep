export interface Group {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Permission {
    id: string;
    resource: string;  // e.g., 'page_1', 'page_2'
    action: string;    // e.g., 'view', 'edit'
    description: string;    // e.g., 'view', 'edit'
  }
  
  export interface UserGroup {
    userId: string;
    groupId: string;
    assignedAt: Date;
  }
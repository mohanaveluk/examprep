export interface Permission1 {
    id: string;
    resource: string;
    action: string;
    description: string;
  }
  
  export interface PermissionAction {
    name: string;
    description: string;
    selected: boolean;
  }
export interface ISidebarItem {
    title: string;
    icon?: string;
    path?: string;
    category?: string;
    children?: ISidebarItem[];
    collapsed?: boolean
}

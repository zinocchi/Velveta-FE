import { User } from "../../../../types/user";

export interface DashboardNavbarProps {
  onEditProfile?: () => void;
  onViewOrders?: () => void;
  cartCount: number;
  onViewFavorites?: () => void;
  onLogout?: () => void;
  className?: string;
}

export interface DashboardUserMenuProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOrderHistory: () => void;
  onViewOrders: () => void;
  onEditProfile?: () => void;
  onViewFavorites?: () => void;
}
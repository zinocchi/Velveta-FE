import { User } from "../../../types/user";

export interface NavbarProps {
  className?: string;
}

export interface UserMenuProps {
  user: User | null;
  onLogout: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export interface LogoutConfirmProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CartIconProps {
  totalItems: number;
  onClick: () => void;
}

export interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isLoggedIn: boolean;
  onLogout: () => void;
  onCartClick: () => void;
}

export interface NavbarMobileProps {
  onCartClick: () => void;
  onMenuToggle: () => void;
}
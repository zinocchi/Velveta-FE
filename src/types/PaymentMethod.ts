import {
  FaWallet,
  FaCreditCard,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTruck,
  FaStore,
} from "react-icons/fa";

import {
//   SiGopay,
//   SiOvo,
//   SiDana,
  SiMastercard,
  SiVisa,
} from "react-icons/si";

export const PAYMENT_METHODS = [
  {
    id: "cash",
    label: "Cash",
    icon: FaMoneyBillWave,
    description: "Pay with cash at the counter",
  },
  {
    id: "debit",
    label: "Debit / Credit Card",
    icon: FaCreditCard,
    description: "Visa, Mastercard supported",
    brands: [SiVisa, SiMastercard],
  },
//   {
//     id: "gopay",
//     label: "GoPay",
//     icon: SiGopay,
//     description: "Fast & secure e-wallet",
//   },
//   {
//     id: "ovo",
//     label: "OVO",
//     icon: SiOvo,
//     description: "Pay easily with OVO",
//   },
//   {
//     id: "dana",
//     label: "DANA",
//     icon: SiDana,
//     description: "Popular digital wallet",
//   },
];

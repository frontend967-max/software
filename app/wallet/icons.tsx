import type { ReactNode } from "react";

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const wrap = (children: ReactNode, extra: Record<string, unknown> = {}) => (
  <svg viewBox="0 0 24 24" {...s} {...extra}>
    {children}
  </svg>
);

export const CalendarIcon = () =>
  wrap(
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
      <path d="M3.5 9h17M8 3v3M16 3v3" />
      <path d="M9 14l2 2 4-4" />
    </>
  );

export const BellIcon = () =>
  wrap(
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7" />
      <path d="M10.5 20a2 2 0 0 0 3 0" />
    </>
  );

export const EyeIcon = () =>
  wrap(
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  );

export const PlusIcon = () => wrap(<path d="M12 5v14M5 12h14" />, { strokeWidth: 2.4 });

export const GameIcon = () =>
  wrap(
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="5" />
      <path d="M7 11v2M6 12h2" />
      <circle cx="15.5" cy="11.5" r=".6" fill="currentColor" />
      <circle cx="17.5" cy="13.5" r=".6" fill="currentColor" />
    </>
  );

export const GameSolidIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="7" width="20" height="10" rx="5" />
    <circle cx="7" cy="12" r="1.1" fill="#fff" />
    <circle cx="16" cy="10.6" r=".9" fill="#fff" />
    <circle cx="18" cy="13.4" r=".9" fill="#fff" />
  </svg>
);

export const TagIcon = () =>
  wrap(
    <>
      <path d="M3.5 12.5 11 5a2 2 0 0 1 1.4-.6H19a1.5 1.5 0 0 1 1.5 1.5v6.6a2 2 0 0 1-.6 1.4l-7.5 7.5a1.5 1.5 0 0 1-2.1 0l-6.8-6.8a1.5 1.5 0 0 1 0-2.1z" />
      <circle cx="16" cy="8" r="1.1" fill="currentColor" stroke="none" />
    </>
  );

export const GiftIcon = () =>
  wrap(
    <>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5 12.5v8h14v-8M12 8.5v12" />
      <path d="M12 8.5S9.5 4 7.3 5.4 9 8.5 12 8.5zM12 8.5s2.5-4.5 4.7-3.1S15 8.5 12 8.5z" />
    </>
  );

export const ReceiptIcon = () =>
  wrap(
    <>
      <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z" />
      <path d="M9 8h6M9 12h6" />
    </>
  );

export const ChevronIcon = () => wrap(<path d="M9 6l6 6-6 6" />, { strokeWidth: 2.2 });

export const ChevronUpIcon = () => wrap(<path d="M6 15l6-6 6 6" />, { strokeWidth: 2.2 });

export const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3 3 10.2V21h6v-6h6v6h6V10.2z" />
  </svg>
);

export const CashOutIcon = () => wrap(<path d="M12 4v13M6 11l6 6 6-6" />, { strokeWidth: 2.2 });

export const AccountIcon = () =>
  wrap(
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  );

export const HeadsetIcon = () =>
  wrap(
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19a3 3 0 0 1-3 2.5h-2" />
    </>,
    { strokeWidth: 2 }
  );

export const SearchIcon = () =>
  wrap(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>,
    { strokeWidth: 2 }
  );

export const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinejoin="round"
  >
    <path d="M12 2.6l2.9 6 6.6.6-5 4.4 1.5 6.5L12 17.9 6 20.1l1.5-6.5-5-4.4 6.6-.6z" />
  </svg>
);

export const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l7 3v6c0 4.5-3 8-7 9.5C8 19 5 15.5 5 11V5l7-3z" />
    <path d="M8.5 12l2.2 2.2 4-4.4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BankIcon = () =>
  wrap(
    <>
      <path d="M12 3.5 3.5 8h17z" />
      <path d="M5 8v9M9 8v9M15 8v9M19 8v9M3.5 20.5h17" />
    </>
  );

export const CardIcon = () =>
  wrap(
    <>
      <rect x="2.5" y="6.5" width="19" height="12" rx="2.5" />
      <path d="M2.5 10.5h19" />
    </>
  );

export const CardStackIcon = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <rect x="3" y="8" width="15" height="10" rx="2" transform="rotate(-8 10 13)" />
    <rect x="6" y="7" width="15" height="10" rx="2" />
    <path d="M6 11h15" />
    <circle cx="17.5" cy="14" r="1.1" />
  </svg>
);

export const DownCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="none" />
    <path d="M12 7v8M8.5 11.5 12 15l3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CashAppIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#00d54b" />
    <path
      d="M14.6 9.2a4 4 0 0 0-2.6-1c-1 0-1.7.4-1.7 1.1 0 .8.9 1 2 1.4 1.7.5 3 1.2 3 2.9 0 1.6-1.2 2.6-3 2.8l-.2 1.1a.5.5 0 0 1-.5.4h-1a.4.4 0 0 1-.4-.5l.2-1.1a4.7 4.7 0 0 1-2.4-1.2.5.5 0 0 1 0-.7l.7-.7a.5.5 0 0 1 .6 0 3.6 3.6 0 0 0 2.4 1c.8 0 1.6-.3 1.6-1.1 0-.7-.8-1-2-1.4-1.5-.5-2.9-1.1-2.9-2.9 0-1.5 1.1-2.5 2.8-2.8l.2-1.1a.5.5 0 0 1 .5-.4h1a.4.4 0 0 1 .4.5l-.2 1.2c.7.2 1.4.5 1.9 1a.5.5 0 0 1 0 .7l-.6.6a.5.5 0 0 1-.5.1z"
      fill="#fff"
    />
  </svg>
);

export const LogoutIcon = () =>
  wrap(
    <>
      <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3" />
      <path d="M15 8l4 4-4 4M19 12H9" />
    </>,
    { strokeWidth: 2 }
  );

export const MailIcon = () =>
  wrap(
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </>
  );

export const LockIcon = () =>
  wrap(
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </>
  );

export const UserIcon = () =>
  wrap(
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  );

export const ArrowLeftIcon = () =>
  wrap(<path d="M15 5l-7 7 7 7M8 12h12" />, { strokeWidth: 2.1 });

export const PhoneIcon = () =>
  wrap(
    <path d="M6.5 4.5h3l1.5 4-2 1.4a11 11 0 0 0 5 5l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 6.7a2 2 0 0 1 2-2.2z" />
  );

export const MapPinIcon = () =>
  wrap(
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  );

export const CheckIcon = () =>
  wrap(<path d="M4 12.5l5 5L20 6" />, { strokeWidth: 2.4 });

export const ChevronDownIcon = () => wrap(<path d="M6 9l6 6 6-6" />, { strokeWidth: 2.2 });

export const CopyIcon = () =>
  wrap(
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </>
  );

export const KeyIcon = () =>
  wrap(
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l8 8M16 16l2-2M19 19l2-2" />
    </>
  );

export const DeviceIcon = () =>
  wrap(
    <>
      <rect x="6.5" y="3" width="11" height="18" rx="2.5" />
      <path d="M10.5 18h3" />
    </>
  );

export const ChatIcon = () =>
  wrap(
    <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V16.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5z" />
  );

export const ShareIcon = () =>
  wrap(
    <>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="6" r="2.6" />
      <circle cx="18" cy="18" r="2.6" />
      <path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6" />
    </>
  );

export const DownloadIcon = () =>
  wrap(
    <>
      <path d="M12 3v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </>,
    { strokeWidth: 2 }
  );

export const GlobeIcon = () =>
  wrap(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </>
  );

export const UsersIcon = () =>
  wrap(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
    </>
  );

export const ChartIcon = () =>
  wrap(
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <rect x="7.5" y="12" width="2.6" height="5" rx="0.6" />
      <rect x="12" y="8.5" width="2.6" height="8.5" rx="0.6" />
      <rect x="16.5" y="6" width="2.6" height="11" rx="0.6" />
    </>
  );

export const WalletIcon = () =>
  wrap(
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 9h18" />
      <circle cx="17" cy="13" r="1.3" fill="currentColor" stroke="none" />
    </>
  );

export const TrendUpIcon = () =>
  wrap(
    <>
      <path d="M4 15l5-5 4 4 7-7" />
      <path d="M15 4h6v6" />
    </>
  );

export const TrendDownIcon = () =>
  wrap(
    <>
      <path d="M4 9l5 5 4-4 7 7" />
      <path d="M15 20h6v-6" />
    </>
  );

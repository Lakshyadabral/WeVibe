"use client";

import { useRouter } from "next/navigation";

type Props = {
  stats: {
    totalUsers: number;
    premiumUsers: number;
    totalMatchRequests: number;
    totalMessages: number;
  };
};

export default function DashboardStats({ stats }: Props) {
  const router = useRouter();

  console.log("Dashboard stats:", stats); 

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      href: "/admin/users",
    },
    {
      label: "Premium Users",
      value: stats.premiumUsers,
      href: "/admin/users?filter=premium",
    },
    {
      label: "Match Requests",
      value: stats.totalMatchRequests,
      href: undefined, // safer than null
      tooltip: "Admins can see count only — match details are private.",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      href: undefined,
      tooltip: "Admins can see volume only — message content is private.",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 h-30">
      {cards.map((card) => {
        const isClickable = !!card.href;

        return (
          <div
            key={card.label}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={() => card.href && router.push(card.href)}
            className={`bg-white border rounded p-4 shadow transition ${
              isClickable ? "cursor-pointer hover:bg-gray-200" : "cursor-default"
            }`}
            title={card.tooltip || ""}
          >
            <p className="text-gray-600 text-sm">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

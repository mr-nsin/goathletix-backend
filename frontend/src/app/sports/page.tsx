import { CategoryGrid, CategoryItem } from "@/components/CategoryGrid";

const sports: CategoryItem[] = [
  {
    id: "running",
    name: "Running",
    href: "/sports/running",
    imageUrl: "https://images.unsplash.com/photo-1571008840902-2765377f80db?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "cycling",
    name: "Cycling",
    href: "/sports/cycling",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "trekking",
    name: "Trekking",
    href: "/sports/trekking",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "triathlon",
    name: "Triathlon",
    href: "/sports/triathlon",
    imageUrl: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function SportsIndex() {
  return <CategoryGrid title="All Sports" items={sports} />;
}

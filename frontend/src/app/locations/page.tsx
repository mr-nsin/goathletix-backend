import { CategoryGrid, CategoryItem } from "@/components/CategoryGrid";

const locations: CategoryItem[] = [
  {
    id: "bengaluru",
    name: "Bengaluru",
    href: "/locations/bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "mumbai",
    name: "Mumbai",
    href: "/locations/mumbai",
    imageUrl: "https://images.unsplash.com/photo-1529253355953-b09e8647008f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "pune",
    name: "Pune",
    href: "/locations/pune",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "goa",
    name: "Goa",
    href: "/locations/goa",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "new-delhi",
    name: "New Delhi",
    href: "/locations/new-delhi",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "ooty",
    name: "Ooty",
    href: "/locations/ooty",
    imageUrl: "https://images.unsplash.com/photo-1596766442654-2b7db5b3e23a?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function LocationsIndex() {
  return <CategoryGrid title="All Locations" items={locations} />;
}

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-background text-foreground font-sans p-4">
      <h1 className="text-primary">Welcome to My Theme!</h1>
      <p className="text-secondary font-serif">This is a custom Tailwind setup.</p>
      <Button className="mt-4">Click Me</Button>
    </div>
  );
}

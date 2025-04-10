import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white flex items-center justify-between px-6 h-20 w-full shadow-sm">
      <h1 className="text-[#6F0A59] text-2xl font-light">Autoescola</h1>
      <Button className="text-white px-4 py-2">
        Suporte
        <i className="material-icons">call</i>
      </Button>
    </header>
  );
}

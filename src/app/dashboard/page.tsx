import SignOutPage from "../(auth)/signout/page";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignOutPage />
    </div>
  );
}

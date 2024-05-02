import { LandingPageComponent } from "@/components/landing-page-component";

export default async function Page() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <LandingPageComponent />
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ProfileRootPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const profileId = session.user.lmsUserId;
  if (!profileId) {
    redirect("/onboarding");
  }

  redirect(`/profile/${profileId}`);
}


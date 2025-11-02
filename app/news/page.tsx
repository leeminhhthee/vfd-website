import UserLayout from "@/components/layouts/user-layout";
import NewsGrid from "@/components/pages/news-grid";
import { trans } from "../generated/AppLocalization";

export default function NewsPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase text-foreground mb-4">
            {trans.news}
          </h1>
          <p className="text-lg text-muted-foreground">
            {trans.contentNewsTab}
          </p>
        </div>

        <NewsGrid />
      </div>
    </UserLayout>
  );
}

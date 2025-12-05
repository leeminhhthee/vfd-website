import UserLayout from "@/components/layouts/user-layout"
import DocumentsList from "@/components/pages/documents-list"
import { trans } from "../generated/AppLocalization"

export default function DocumentsPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">{trans.resources}</h1>
          <p className="text-lg text-muted-foreground">{trans.resourceText}</p>
        </div>

        <DocumentsList />
      </div>
    </UserLayout>
  )
}

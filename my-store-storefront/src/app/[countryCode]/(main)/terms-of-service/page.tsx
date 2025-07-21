export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-2xl font-bold">Terms of Service / 利用規約</h1>

      <section>
        <h2 className="text-lg font-semibold">1. Acceptance / 規約の承諾</h2>
        <p>
          By using our services, you agree to these terms. /
          本サービスをご利用の際は、本規約に同意いただくものとします。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">2. Restrictions / 禁止事項</h2>
        <p>
          No unauthorized use, illegal actions, or resale. /
          不正使用、違法行為、再販売は禁止です。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">3. Liability / 免責事項</h2>
        <p>
          We are not liable for service interruptions or errors. /
          サービスの中断やエラーについて一切の責任を負いません。
        </p>
      </section>
    </div>
  )
}

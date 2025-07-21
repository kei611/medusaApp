export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-2xl font-bold">Shipping Policy / 配送ポリシー</h1>

      <section>
        <h2 className="text-lg font-semibold">International Shipping / 海外発送</h2>
        <p>
          We ship worldwide via DHL or EMS. / DHLまたはEMSで全世界に発送します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Delivery Time / 配送時間</h2>
        <p>
          Orders are shipped within 2–3 business days. / 通常、営業日2〜3日以内に発送します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Customs & Duties / 関税・税金</h2>
        <p>
          Buyers are responsible for import duties. / 関税・輸入税は購入者の負担となります。
        </p>
      </section>
    </div>
  )
}

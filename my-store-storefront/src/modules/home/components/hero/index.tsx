"use client"

import { useEffect, useState } from "react"
import { Heading } from "@medusajs/ui"
import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"

const sanityClient = createClient({
  projectId: "l4nk5i02",
  dataset: "newdata",
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)
const urlFor = (source: any) => builder.image(source)

export default function Hero() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [gifUrl, setGifUrl] = useState<string | null>(null) // ★GIF用のstateを追加★

  useEffect(() => {
    // ヒーロー画像とオーバーレイGIFの両方を一度にフェッチする
    const query = `*[_type == "siteSettings"][0]{
      heroImage,
      overlayGif { // overlayGif フィールドから asset の URL を取得
        asset->{url}
      }
    }`

    sanityClient
      .fetch(query)
      .then((data) => {
        if (data?.heroImage?.asset) {
          const url = urlFor(data.heroImage).width(1600).url()
          console.log("🖼️ Hero画像URL:", url)
          setImageUrl(url)
        } else {
          console.warn("⚠️ heroImage.asset が見つかりません")
        }

        // ★GIFのURLをセットするロジックを追加★
        if (data?.overlayGif?.asset?.url) {
          const gifAssetUrl = data.overlayGif.asset.url
          console.log("🌠 Overlay GIF URL:", gifAssetUrl)
          setGifUrl(gifAssetUrl)
        } else {
          console.warn("⚠️ overlayGif.asset.url が見つかりません")
        }
      })
      .catch((err) => {
        console.error("❌ Sanityデータ取得エラー:", err)
      })
  }, [])

  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Hero Background"
          className="absolute inset-0 object-cover w-full h-full z-0"
        />
      )}

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        {/* GIFの表示部分 */}
        {gifUrl ? (
          <img
            src={gifUrl}
            alt="Overlay GIF"
            // ★以下の className を変更します★
            className="w-1/2 h-auto object-contain" // 画面幅の半分 (w-1/2) に設定
          />
        ) : (
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Null
          </Heading>
        )}
      </div>
    </div>
  )
}

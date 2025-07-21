"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { PortableText } from "@portabletext/react"
import imageUrlBuilder from "@sanity/image-url"
import { createClient } from "next-sanity"

const ForceGraph3D = dynamic(
  () => import("react-force-graph-3d").then((mod) => mod.default),
  { ssr: false }
)

type Zettel = {
  _id: string
  title: string
  content?: any
  related?: { _id: string; title: string }[]
}

const sanityClient = createClient({
  projectId: "l4nk5i02", // ← Sanity Project ID
  dataset: "newdata",     // ← 使用する Dataset 名
  useCdn: true
})

const builder = imageUrlBuilder(sanityClient)
const urlFor = (source: any) => builder.image(source)

export default function ZettelGraph3D({ zettels }: { zettels: Zettel[] }) {
  const [selectedZettel, setSelectedZettel] = useState<Zettel | null>(null)

  const data = useMemo(() => {
    const nodeMap = new Map<string, { id: string; name: string }>()

    zettels.forEach((z) => {
      nodeMap.set(z._id, { id: z._id, name: z.title })
      z.related?.forEach((rel) => {
        if (!nodeMap.has(rel._id)) {
          nodeMap.set(rel._id, {
            id: rel._id,
            name: rel.title + " (related)"
          })
        }
      })
    })

    const nodes = Array.from(nodeMap.values())
    const links = zettels.flatMap((z) =>
      z.related?.map((rel) => ({
        source: z._id,
        target: rel._id
      })) || []
    )

    return { nodes, links }
  }, [zettels])

  const components = {
    types: {
      image: ({ value }: any) => {
        const imageUrl = urlFor(value.asset).width(600).url()
        return (
          <img
            src={imageUrl}
            alt={value.alt || "Zettel image"}
            style={{
              maxWidth: "100%",
              marginTop: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
          />
        )
      }
    }
  }

  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <ForceGraph3D
        graphData={data}
        nodeLabel="name"
        nodeAutoColorBy="id"
        linkOpacity={0.5}
        linkDirectionalParticles={2}
        backgroundColor="#ffffff"
        linkColor={() => "red"}
        onNodeClick={(node) => {
          const id = (node as any).id
          const target = zettels.find((z) => z._id === id)
          if (target) setSelectedZettel(target)
        }}
      />

      {selectedZettel && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(2px)",
              zIndex: 999
            }}
            onClick={() => setSelectedZettel(null)}
          />

          <div
            style={{
              position: "fixed",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              zIndex: 1000,
              maxWidth: "640px",
              width: "90vw",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >
            <h2 style={{ marginTop: 0 }}>{selectedZettel.title}</h2>

            {selectedZettel.content && Array.isArray(selectedZettel.content) && (
              <div style={{ marginTop: "16px" }}>
                <PortableText value={selectedZettel.content} components={components} />
              </div>
            )}

            {Array.isArray(selectedZettel.related) && selectedZettel.related.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <strong>関連ノート:</strong>
                <ul>
                  {selectedZettel.related.map((rel) => (
                    <li key={rel._id}>{rel.title}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              style={{
                marginTop: "24px",
                padding: "8px 16px",
                backgroundColor: "#444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={() => setSelectedZettel(null)}
            >
              閉じる
            </button>
          </div>
        </>
      )}
    </div>
  )
}

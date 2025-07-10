// src/modules/moodboard/components/ZettelGraph3D.tsx
"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"

const ForceGraph3D = dynamic(
  () => import("react-force-graph-3d").then((mod) => mod.default),
  { ssr: false }
)

type Zettel = {
  _id: string
  title: string
  related?: { _id: string; title: string }[]
}

export default function ZettelGraph3D({ zettels }: { zettels: Zettel[] }) {
  const data = useMemo(() => {
    const nodeMap = new Map<string, { id: string; name: string }>()

    // 1. 自分自身をノードに追加
    for (const z of zettels) {
      nodeMap.set(z._id, { id: z._id, name: z.title })
    }

    // 2. 関連先もノードに追加（存在してなければ）
    for (const z of zettels) {
      for (const rel of z.related || []) {
        if (!nodeMap.has(rel._id)) {
          nodeMap.set(rel._id, { id: rel._id, name: rel.title + " (related)" })
        }
      }
    }

    const nodes = Array.from(nodeMap.values())

    const links = zettels.flatMap((z) =>
      (z.related || []).map((rel) => ({
        source: z._id,
        target: rel._id,
      }))
    )

    return { nodes, links }
  }, [zettels])

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ForceGraph3D
        graphData={data}
        nodeLabel="name"
        nodeAutoColorBy="id"
        linkOpacity={0.5}
        linkDirectionalParticles={2}
        backgroundColor="#ffffff"
        linkColor={() => 'red'}
      />
    </div>
  )
}

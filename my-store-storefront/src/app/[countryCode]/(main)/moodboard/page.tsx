// import { getMoodboards } from "@lib/data/get-moodboards"
// import ZettelGraph3D from "@modules/moodboard/components/ZettelGraph3D"

// export default async function MoodboardPage() {
//   const moodboards = await getMoodboards()
//   console.log("moodboards:", moodboards)

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-6">Moodboards</h1>

//       {moodboards.map((mb: any) => (
//         <div key={mb._id} className="mb-12 border p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold">{mb.title}</h2>
//           <p className="text-gray-600 mb-4">{mb.description}</p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {mb.zettels?.map((z: any) => (
//               <div key={z._id} className="border p-4 rounded">
//                 <h3 className="font-bold text-lg">{z.title}</h3>
//                 {z.content?.map((block: any, i: number) => (
//                   <p key={i}>{block.children?.[0]?.text}</p>
//                 ))}
//                 {z.related?.length > 0 && (
//                   <div className="mt-2 text-sm text-gray-500">
//                     Related:{" "}
//                     {z.related.map((r: any) => (
//                       <span key={r._id} className="underline mr-2">{r.title}</span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// src/app/[countryCode]/(main)/moodboard/page.tsx
import { getMoodboards } from "@lib/data/get-moodboards"
import ZettelGraph3D from "@modules/moodboard/components/ZettelGraph3D"

export default async function MoodboardPage() {
  const moodboards = await getMoodboards()

  // ここでは最初のMoodboardだけを表示
  const moodboard = moodboards[0]

  if (!moodboard) {
    return <div className="p-4 text-red-500">Moodboard not found.</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">{moodboard.title}</h1>
      {moodboard.description && (
        <p className="mb-6 text-gray-700">{moodboard.description}</p>
      )}
      <ZettelGraph3D zettels={moodboard.zettels || []} />
    </div>
  )
}

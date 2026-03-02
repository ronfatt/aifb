import type { DraftPayload } from "@/types/workflow";

export async function generateDraftWithMock(): Promise<DraftPayload> {
  return {
    hook: [
      "Kalau hidup tekan kau hari ini, baca sampai habis.",
      "Ramai pura-pura kuat, tapi diam-diam penat.",
      "Mungkin ini benda yang kau memang perlu dengar malam ini."
    ],
    body: "Ada orang tiap hari nampak tenang. Kerja jalan. Senyum jalan. Balas mesej pun normal. Tapi dalam kepala, dia dah terlalu lama lawan benda yang orang lain tak nampak. Kadang-kadang bukan dia lemah. Dia cuma penat jadi kuat untuk semua orang serentak.",
    ctaQuestion: "Kalau kau pernah sampai tahap macam ni, kau pilih diam dulu atau cari seseorang untuk bercerita?",
    tags: ["#kisahhidup", "#realiti", "#fikirkan"],
    sensitivityFlags: [],
    variants: [
      {
        label: "B",
        hook: [
          "Kadang-kadang yang paling banyak ketawa tu paling banyak simpan luka.",
          "Orang nampak tenang, tapi hati dia dah lama sesak."
        ],
        body: "Bukan semua orang pandai minta tolong. Ada yang dah biasa telan sendiri sampai orang ingat dia memang tak pernah jatuh. Padahal setiap malam dia tengah susun semula diri dia yang hampir pecah.",
        ctaQuestion: "Bila kau susah, kau lebih rela pendam atau terus bercakap dengan orang yang kau percaya?",
        tags: ["#ceritahidup", "#malaysia", "#realtalk"]
      }
    ]
  };
}

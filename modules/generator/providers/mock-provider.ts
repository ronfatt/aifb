import type { DraftPayload } from "@/types/workflow";

export async function generateDraftWithMock(): Promise<DraftPayload> {
  return {
    seriesTitle: "Bila Hujan Turun Lagi",
    episodeNumber: 1,
    episodeLabel: "Episod 1",
    hook: [
      "Mira tak sangka lelaki yang hilang tujuh tahun lepas berdiri depan pintu rumah maknya malam tu.",
      "Lelaki itu cuma sebut satu ayat sebelum hujan turun makin lebat.",
      "\"Aku datang sebab ayah kau tinggalkan sesuatu untuk kau.\""
    ],
    body: "Sejak ayah Mira meninggal, rumah kayu di hujung kampung itu jadi terlalu sunyi. Mak Mira tak pernah sebut nama Arman lagi. Semua orang anggap lelaki itu dah lama lenyap bersama rahsia lama keluarga mereka.\n\nTapi malam itu, bila ketukan datang tiga kali, Mira sendiri yang buka pintu. Arman berdiri basah kuyup, muka lebih matang, mata tetap sama seperti malam dia pergi tanpa pesan. Dalam tangan dia ada sampul surat lama, tepi kertas itu dah hampir koyak.\n\n\"Aku janji aku takkan datang lagi lepas ni,\" kata Arman perlahan. \"Tapi sebelum aku pergi, kau kena tahu siapa ayah kau sebenarnya.\"\n\nJantung Mira terus jatuh. Dalam rumah, maknya yang nampak kelibat Arman terus pucat. Belum sempat Mira buka sampul itu, maknya menjerit, \"Jangan sentuh! Kalau kau baca, hidup kita takkan sama lagi.\"",
    ctaQuestion: "Kalau korang jadi Mira, korang buka surat tu malam ni juga atau tunggu sampai pagi?",
    tags: ["#DramaBersiri", "#MiraArman", "#RahsiaKeluarga"],
    sensitivityFlags: [],
    storySummary:
      "Mira bertemu semula dengan Arman yang muncul membawa surat peninggalan ayahnya, tetapi mak Mira cuba menghalang surat itu dibuka.",
    nextEpisodeHook:
      "Dalam episod seterusnya, Mira terpaksa memilih sama ada percaya pada maknya atau membuka surat yang mungkin bongkar asal-usul keluarganya.",
    characters: ["Mira", "Arman", "Mak Mira"],
    variants: [
      {
        label: "B",
        hook: [
          "Tujuh tahun Arman hilang tanpa khabar.",
          "Tapi dia muncul semula tepat pada malam rahsia ayah Mira hampir terbongkar."
        ],
        body: "Mira ingat luka lama itu dah selesai bila ayahnya dikebumikan. Tapi Arman datang semula dengan satu sampul surat, dan mak Mira terus berubah wajah. Dari ruang tamu yang gelap, satu nama lama disebut semula, nama yang selama ini dilarang berada dalam rumah itu.",
        ctaQuestion: "Siapa sebenarnya yang korang rasa paling banyak sembunyikan rahsia, Arman atau mak Mira?",
        tags: ["#NovelFacebook", "#MiraArman", "#RahsiaLama"]
      }
    ]
  };
}

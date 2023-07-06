import AmnatCharoen from "./AmnatCharoen";
import AngThong from "./AngThong";
import Bangkok from "./Bangkok";
import BuengKan from "./BuengKan";
import Buriram from "./Buriram";
import Chachoengsao from "./Chachoengsao";
import ChaiNat from "./ChaiNat";
import Chaiyaphum from "./Chaiyaphum";
import ChanthaBuri from "./ChanthaBuri";
import ChiangMai from "./ChiangMai";
import ChiangRai from "./ChiangRai";
import ChonBuri from "./ChonBuri";
import Chumphon from "./Chumphon";
import Kalasin from "./Kalasin";
import KamphaengPhet from "./KamphaengPhet";
import Kanchanaburi from "./Kanchanaburi";
import KhonKaen from "./KhonKaen";
import Krabi from "./Krabi";
import Lampang from "./Lampang";
import Lamphun from "./Lamphun";
import Loei from "./Loei";
import LopBuri from "./LopBuri";
import MaeHongSon from "./MaeHongSon";
import Mahasarakham from "./Mahasarakham";
import Mukdahan from "./Mukdahan";
import NakhonNayok from "./NakhonNayok";
import NakhonPathom from "./NakhonPathom";
import NakhonPhanom from "./NakhonPhanom";
import NakhonRatchasima from "./NakhonRatchasima";
import NakhonSawan from "./NakhonSawan";
import NakhonSiThammarat from "./NakhonSiThammarat";
import Nan from "./Nan";
import Narathiwat from "./Narathiwat";
import NongBuaLamphu from "./NongBuaLamphu";
import NongKhai from "./NongKhai";
import Nonthaburi from "./Nonthaburi";
import PathumThani from "./PathumThani";
import Pattani from "./Pattani";
import PhangNga from "./PhangNga";
import Phatthalung from "./Phatthalung";
import Phayao from "./Phayao";
import Phetchabun from "./Phetchabun";
import Phetchaburi from "./Phetchaburi";
import Phichit from "./Phichit";
import Phitsanulok from "./Phitsanulok";
import Phrae from "./Phrae";
import PhraNakhonSiAyutthaya from "./PhraNakhonSiAyutthaya";
import Phuket from "./Phuket";
import PrachinBuri from "./PrachinBuri";
import PrachuapKhiriKhan from "./PrachuapKhiriKhan";
import Ranong from "./Ranong";
import Ratchaburi from "./Ratchaburi";
import Rayong from "./Rayong";
import RoiEt from "./RoiEt";
import SaKaeo from "./SaKaeo";
import SakonNakhon from "./SakonNakhon";
import SamutPrakan from "./SamutPrakan";
import SamutSakhon from "./SamutSakhon";
import SamutSongkhram from "./SamutSongkhram";
import Saraburi from "./Saraburi";
import Satun from "./Satun";
import SingBuri from "./SingBuri";
import Sisaket from "./Sisaket";
import Songkhla from "./Songkhla";
import Sukhothai from "./Sukhothai";
import SuphanBuri from "./SuphanBuri";
import SuratThani from "./SuratThani";
import Surin from "./Surin";
import Tak from "./Tak";
import Trang from "./Trang";
import Trat from "./Trat";
import UbonRatchathani from "./UbonRatchathani";
import UdonThani from "./UdonThani";
import UthaiThani from "./UthaiThani";
import Uttaradit from "./Uttaradit";
import Yala from "./Yala";
import Yasothon from "./Yasothon";

const province = {
    [AmnatCharoen.code]: AmnatCharoen,
    [AngThong.code]: AngThong,
    [Bangkok.code]: Bangkok,
    [BuengKan.code]: BuengKan,
    [Buriram.code]: Buriram,
    [Chachoengsao.code]: Chachoengsao,
    [ChaiNat.code]: ChaiNat,
    [Chaiyaphum.code]: Chaiyaphum,
    [ChanthaBuri.code]: ChanthaBuri,
    [ChiangMai.code]: ChiangMai,
    [ChiangRai.code]: ChiangRai,
    [ChonBuri.code]: ChonBuri,
    [Chumphon.code]: Chumphon,
    [Kalasin.code]: Kalasin,
    [KamphaengPhet.code]: KamphaengPhet,
    [Kanchanaburi.code]: Kanchanaburi,
    [KhonKaen.code]: KhonKaen,
    [Krabi.code]: Krabi,
    [Lampang.code]: Lampang,
    [Lamphun.code]: Lamphun,
    [Loei.code]: Loei,
    [LopBuri.code]: LopBuri,
    [MaeHongSon.code]: MaeHongSon,
    [Mahasarakham.code]: Mahasarakham,
    [Mukdahan.code]: Mukdahan,
    [NakhonNayok.code]: NakhonNayok,
    [NakhonPathom.code]: NakhonPathom,
    [NakhonPhanom.code]: NakhonPhanom,
    [NakhonRatchasima.code]: NakhonRatchasima,
    [NakhonSawan.code]: NakhonSawan,
    [NakhonSiThammarat.code]: NakhonSiThammarat,
    [Nan.code]: Nan,
    [Narathiwat.code]: Narathiwat,
    [NongBuaLamphu.code]: NongBuaLamphu,
    [NongKhai.code]: NongKhai,
    [Nonthaburi.code]: Nonthaburi,
    [PathumThani.code]: PathumThani,
    [Pattani.code]: Pattani,
    [PhangNga.code]: PhangNga,
    [Phatthalung.code]: Phatthalung,
    [Phayao.code]: Phayao,
    [Phetchabun.code]: Phetchabun,
    [Phetchaburi.code]: Phetchaburi,
    [Phichit.code]: Phichit,
    [Phitsanulok.code]: Phitsanulok,
    [Phrae.code]: Phrae,
    [PhraNakhonSiAyutthaya.code]: PhraNakhonSiAyutthaya,
    [Phuket.code]: Phuket,
    [PrachinBuri.code]: PrachinBuri,
    [PrachuapKhiriKhan.code]: PrachuapKhiriKhan,
    [Ranong.code]: Ranong,
    [Ratchaburi.code]: Ratchaburi,
    [Rayong.code]: Rayong,
    [RoiEt.code]: RoiEt,
    [SaKaeo.code]: SaKaeo,
    [SakonNakhon.code]: SakonNakhon,
    [SamutPrakan.code]: SamutPrakan,
    [SamutSakhon.code]: SamutSakhon,
    [SamutSongkhram.code]: SamutSongkhram,
    [Saraburi.code]: Saraburi,
    [Satun.code]: Satun,
    [SingBuri.code]: SingBuri,
    [Sisaket.code]: Sisaket,
    [Songkhla.code]: Songkhla,
    [Sukhothai.code]: Sukhothai,
    [SuphanBuri.code]: SuphanBuri,
    [SuratThani.code]: SuratThani,
    [Surin.code]: Surin,
    [Tak.code]: Tak,
    [Trang.code]: Trang,
    [Trat.code]: Trat,
    [UbonRatchathani.code]: UbonRatchathani,
    [UdonThani.code]: UdonThani,
    [UthaiThani.code]: UthaiThani,
    [Uttaradit.code]: Uttaradit,
    [Yala.code]: Yala,
    [Yasothon.code]: Yasothon
}

export const getMap = (code) => {
    return province[code]
}

export { default } from "./Map";
// /* eslint-disable import/no-anonymous-default-export */
// export default {
//     label: "Map of Yasothon, Thailand",
//     viewBox: "0 0 873 695",
//     locations: [
//       {
//         name: "",
//         id: "",
//         transform: "",
//         path: "",
//       },
//     ],
//   };

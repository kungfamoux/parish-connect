/**
 * Seed script — 2026 Zonal Council Election Results
 * St. Mary Parish, Trans Ekulu, Enugu
 *
 * Run with:
 *   npx tsx scripts/seed-zonal-council.ts
 *
 * Safe to re-run: clears existing 2026 rows before inserting.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

// ─── Helper ───────────────────────────────────────────────────────────────────

function m(
  sNo: number,
  name: string | null,
  position: string,
  phone: string | null = null
) {
  const vacant = name === "Vacant";
  return {
    sNo,
    name: vacant ? null : name,
    isVacant: vacant,
    position,
    phone: phone === "—" || phone === null ? null : phone,
  };
}

// ─── Zonal Data (14 zones) ────────────────────────────────────────────────────

const ZONAL = [
  // ── ZONE 1 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 1", groupName: "Zonal Executives", members: [
    m(1, "Prince Adonis Onyejide",  "Zonal Leader",         "08064711195"),
    m(2, "Chief Theophilus Okeke",  "Secretary",            "08038590442"),
    m(3, "Mrs. Kate Anichebe",      "Assistant Secretary",  "08036900702"),
    m(4, "Mrs. Felicia Owoh",       "Financial Secretary",  "08066783597"),
    m(5, "Lady Joy Apiakason",      "Treasurer",            "08038861773"),
    m(6, "Mrs. Maureen Nwigwe",     "P.R.O.",               "07062235222"),
    m(7, "Vacant",                  "Vice Chairman"),
    m(8, "Vacant",                  "Provost"),
  ]},
  { zone: "Zone 1", groupName: "CMO", members: [
    m(1, "Sir Oliver Apiakason",    "Chairman",             "08035515890"),
    m(2, "Mr. Moses Omah",          "Vice Chairman",        "07035205079"),
    m(3, "Mr. Ibe Thaddeus",        "Secretary",            "08062533954"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Mr. Chinedu Onyia",       "Financial Secretary",  "08059282250"),
    m(6, "Mr. Luke Anichebe",       "Treasurer",            "09038393256"),
    m(7, "Vacant",                  "Provost"),
    m(8, "Mr. Raphael Nwajiobi",    "P.R.O.",               "08166618668"),
  ]},
  { zone: "Zone 1", groupName: "CWO", members: [
    m(1, "Mrs. Bridget Anichebe",   "Chairperson",          "08034179542"),
    m(2, "Vacant",                  "Vice Chairman"),
    m(3, "Mrs. Euginia Onwubunta",  "Secretary"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Mrs. Lovelin Okeke",      "Financial Secretary",  "08067534070"),
    m(6, "Mrs. Christiana Onyia",   "Treasurer",            "07039326465"),
    m(7, "Vacant",                  "Provost"),
    m(8, "Mrs. Ibe Virginia",       "P.R.O.",               "08062533957"),
  ]},

  // ── ZONE 2 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 2", groupName: "Zonal Executives", members: [
    m(1, "Mr. LouisMary Ibe",           "Chairman/Zonal Leader", "08065702925"),
    m(2, "Mrs. Duruokpara Amaka",        "Vice Chairman"),
    m(3, "Miss Chidinma Umezuruike",     "Secretary",             "09162864580"),
    m(4, "Vacant",                       "Assistant Secretary"),
    m(5, "Mr. Raphael Okeh",             "Financial Secretary",   "07039378723"),
    m(6, "Mr. Elias Oru",                "Treasurer",             "09054016932"),
    m(7, "Vacant",                       "Provost"),
    m(8, "Vacant",                       "P.R.O."),
  ]},
  { zone: "Zone 2", groupName: "CMO", members: [
    m(1, "Mr. Josephat Okoye",      "Chairman",             "07058490006"),
    m(2, "Vacant",                  "Vice Chairman"),
    m(3, "Mr. Thomas Eneh",         "Secretary",            "07036389493"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Mr. Nicodemus Okeh",      "Financial Secretary",  "07066896481"),
    m(6, "Mr. Francis Obodo",       "Treasurer",            "08169990872"),
    m(7, "Mr. Willy Umeh",          "Provost",              "08036124691"),
    m(8, "Vacant",                  "P.R.O."),
  ]},
  { zone: "Zone 2", groupName: "CWO", members: [
    m(1, "Mrs. Chinyere Onyia",     "Chairman",             "08037976881"),
    m(2, "Lolo Ngozi Nze",          "Vice Chairman",        "08038363948"),
    m(3, "Mrs. Florence Onyica",    "Secretary"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Mrs. Patience Okolo",     "Financial Secretary"),
    m(6, "Mrs. Justina Agu",        "Treasurer"),
    m(7, "Mrs. Jacinta Okeke",      "Provost"),
    m(8, "Vacant",                  "P.R.O."),
  ]},

  // ── ZONE 3 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 3", groupName: "Zonal Executives", members: [
    m(1, "Mr. Okwy Okoh",           "Chairman/Zonal Leader", "08135011010"),
    m(2, "Ichie Raphael Ozofor",    "Vice Chairman",         "09124534097"),
    m(3, "Mrs. Ugwu Ijeoma",        "Secretary",             "07030346424"),
    m(4, "Mrs. Eugenia Ugwu",       "Assistant Secretary",   "07069094473"),
    m(5, "Mrs. Christiana Ike",     "Financial Secretary",   "08162685413"),
    m(6, "Mrs. Monica Ude",         "Treasurer"),
    m(7, "Mrs. Chinasa Odo",        "Provost",               "07060707834"),
    m(8, "Mrs. Rosemary Aguocha",   "P.R.O.",                "08082402325"),
  ]},
  { zone: "Zone 3", groupName: "CMO", members: [
    m(1, "Mr. Nnamdi Ihedigbo",     "Chairman",             "08032614966"),
    m(2, "Mr. Felix Ude",           "Vice Chairman"),
    m(3, "Mr. Benedict Mgbuchi",    "Secretary",            "08068643999"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Mr. Paulinus Eze",        "Financial Secretary",  "09052745532"),
    m(6, "Mr. Joseph Ugwu",         "Treasurer",            "08068820459"),
    m(7, "Vacant",                  "Provost"),
    m(8, "Vacant",                  "P.R.O."),
  ]},
  { zone: "Zone 3", groupName: "CWO", members: [
    m(1, "Mrs. Jacinta Ogbu",       "Chairperson",          "07036533629"),
    m(2, "Mrs. Mary Anyaeche",      "Vice Chairman"),
    m(3, "Mrs. Maureen Mgbuchi",    "Secretary",            "07065402250"),
    m(4, "Mrs. Eugenia Amulu",      "Assistant Secretary"),
    m(5, "Mrs. Chinyere Okoh",      "Financial Secretary",  "09039515157"),
    m(6, "Mrs. Augustina Eze",      "Treasurer",            "08038501575"),
    m(7, "Mrs. Benedette Onyioha",  "Provost",              "08150760131"),
    m(8, "Mrs. Perpetual Ibedigbo", "P.R.O.",               "09117517303"),
  ]},

  // ── ZONE 4 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 4", groupName: "Zonal Executives", members: [
    m(1, "Sir Chinedu Eneh",            "Chairman/Zonal Leader", "08072129458"),
    m(2, "Vacant",                       "Vice Chairman"),
    m(3, "Mrs. Nkiruka Akuma J.",        "Secretary",             "09021211074"),
    m(4, "Lady Francisca Chuwkukelu",   "Assistant Secretary",   "07039492115"),
    m(5, "Vacant",                       "Financial Secretary"),
    m(6, "Mrs. Asigbunam Pauline",       "Treasurer",             "08030614309"),
    m(7, "Mrs. Ezekwonna Josephine",     "Provost",               "08020561444"),
    m(8, "Matthias Nwani",               "P.R.O.",                "07030662221"),
  ]},
  { zone: "Zone 4", groupName: "CMO", members: [
    m(1, "Sir Martin Okechukwu",         "Chairman",             "08030997726"),
    m(2, "Sir Boniface Chukwukelu",      "Vice Chairman",        "08037694508"),
    m(3, "Alex Chude",                   "Secretary",            "08033309527"),
    m(4, "Kennis Egbe",                  "Assistant Secretary"),
    m(5, "Chief Emeka Dike",             "Financial Secretary"),
    m(6, "Nze Sunday Okeke",             "Treasurer",            "08060957365"),
    m(7, "Mr. Pat Muo",                  "Provost",              "08032225376"),
    m(8, "Engr. Chidiebere Chukanmeme", "P.R.O."),
  ]},
  { zone: "Zone 4", groupName: "CWO", members: [
    m(1, "Mrs. Hilda Amu",          "Chairperson",          "08063385716"),
    m(2, "Mrs. Aririeri Martina",   "Vice Chairperson",     "08039287832"),
    m(3, "Mrs. Charity Okafor",     "Secretary",            "08054223788"),
    m(4, "Mrs. Chinyere Muo",       "Assistant Secretary"),
    m(5, "Uju Dike",                "Financial Secretary",  "08037825250"),
    m(6, "Theresa Onoh",            "Treasurer",            "07036512163"),
    m(7, "Chidiebere Chukwuneme",   "Provost"),
    m(8, "Mrs. Ali Victoria",       "P.R.O.",               "09015658552"),
  ]},

  // ── ZONE 5 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 5", groupName: "Zonal Executives", members: [
    m(1, "Dr. Iregbunam Sylvester", "Chairman/Zonal Leader", "08037062167"),
    m(2, "Mr. Linus Agunenye",      "Vice Chairman",         "08106438663"),
    m(3, "Mr. Jamesmary Nnamani",   "Secretary",             "08068409897"),
    m(4, "Mrs. Chinwe Nnaji",       "Assistant Secretary",   "07033666008"),
    m(5, "Mrs. Appolonia Ohagwu",   "Financial Secretary",   "08066741954"),
    m(6, "Mrs. Madu Fidelia",       "Treasurer",             "08036875066"),
    m(7, "Scholastica Okonkwo",     "Provost",               "08103785512"),
    m(8, "Odo Chidera",             "P.R.O.",                "07036680532"),
  ]},
  { zone: "Zone 5", groupName: "CMO", members: [
    m(1, "Mr. Casmire Ugwuona",     "Chairman",             "07039013536"),
    m(2, "Mr. Madu Vincent",        "Vice Chairman",        "07063672271"),
    m(3, "Mr. Anochili Vincent",    "Secretary",            "07063999466"),
    m(4, "Mr. Emmanuel Eze",        "Assistant Secretary",  "08037656363"),
    m(5, "Surv. Jude Akpudiogwu",  "Financial Secretary",  "07031316869"),
    m(6, "Chief Tony Oke Isu",      "Treasurer",            "08063297859"),
    m(7, "Mr. Okolo Anthony",       "Provost",              "08036875139"),
    m(8, "Engr. Jude Odo",          "P.R.O.",               "08037699892"),
  ]},
  { zone: "Zone 5", groupName: "CWO", members: [
    m(1, "Mrs. Okoisu Victoria",    "Chairman",             "08063297859"),
    m(2, "Mrs. Madu Elizabeth",     "Vice Chairman",        "08063391091"),
    m(3, "Mrs. Odume Cecilia",      "Secretary",            "08052551591"),
    m(4, "Mrs. Nnaji Chioma",       "Assistant Secretary",  "08064772735"),
    m(5, "Mrs. Ugwu Josephine",     "Financial Secretary",  "08032644778"),
    m(6, "Mrs. Veronica Onyeabor",  "Treasurer",            "08033710906"),
    m(7, "Mrs. Ogbodo Kate",        "Provost",              "08050293468"),
    m(8, "Mrs. Nwonyi Elizabeth",   "P.R.O.",               "08066590388"),
  ]},
  { zone: "Zone 5", groupName: "CYMO", members: [
    m(1, "Ekene Ezeji",             "Chairman",             "08061177240"),
    m(2, "Ebube Mba",               "Vice Chairman",        "09078781010"),
    m(3, "Nnamdi Franklin",         "Secretary",            "08065183396"),
    m(4, "Ole Chikamso",            "Assistant Secretary",  "08056102839"),
    m(5, "Somtochukwu Anozie",      "Financial Secretary",  "08054049603"),
    m(6, "Ogwobe Chibuike",         "Treasurer",            "08032862025"),
    m(7, "Okolo Collins",           "Provost",              "09135110184"),
    m(8, "Osuji Chinedu",           "P.R.O.",               "08144203453"),
  ]},
  { zone: "Zone 5", groupName: "CYWO", members: [
    m(1, "Ogbobe Queen",            "Chairman",             "08074605450"),
    m(2, "Okeke Munachi",           "Vice Chairman",        "07076714492"),
    m(3, "Ole Chidirum",            "Secretary",            "07081766006"),
    m(4, "Kamsi Ezeji",             "Assistant Secretary",  "09127991043"),
    m(5, "Ani Chikamso",            "Financial Secretary",  "07064397460"),
    m(6, "Anozie Ogechukwu",        "Treasurer",            "08102760422"),
    m(7, "Mba Joy",                 "Provost",              "09078781010"),
    m(8, "Ugwuona Immanuela",       "P.R.O.",               "08065183396"),
  ]},

  // ── ZONE 6 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 6", groupName: "Zonal Executives", members: [
    m(1, "Mr. Chuka Egbuji",         "Chairman",             "08033227278"),
    m(2, "Chief Mrs. Regina Okeke",  "Vice Chairman",        "08033303175"),
    m(3, "Mrs. Amaka Egwuonwu",      "Secretary",            "07064181059"),
    m(4, "Mrs. Caroline Agomuo",     "Assistant Secretary",  "07038705094"),
    m(5, "Mrs. Eunice Ezeilo",       "Financial Secretary",  "08162137245"),
    m(6, "Mrs. Ego J. Udenta",       "Treasurer",            "07037635431"),
    m(7, "Nz Ikechukwu Ejiofor",     "Provost",              "07032673298"),
    m(8, "Mrs. Christiana Nneto",    "P.R.O.",               "09030151724"),
  ]},
  { zone: "Zone 6", groupName: "CMO", members: [
    m(1, "Sir Matthias Omeh",        "Chairman",             "08036663931"),
    m(2, "Engr. Emmanuel Ijeh",      "Vice Chairman",        "08067677000"),
    m(3, "Joseph Chukwuka",          "Secretary",            "08023238652"),
    m(4, "Dr. Emeka Ozioko",         "Assistant Secretary",  "0814848758"),
    m(5, "Sir F. Okoye",             "Financial Secretary",  "08037751582"),
    m(6, "Sir Justin Onochie",       "Treasurer",            "08033230936"),
    m(7, "Mr. Emeka Nnebife",        "Provost",              "08066207474"),
    m(8, "Mr. Okey Ugwu",            "P.R.O.",               "08036856601"),
  ]},
  { zone: "Zone 6", groupName: "CWO", members: [
    m(1, "Mrs. Bridget Ijeh",        "Chairperson",          "08160598054"),
    m(2, "Mrs. Nnenna Ugwuozo",      "Vice Chairman",        "08038684465"),
    m(3, "Mrs. Ngozi Olotu",         "Secretary",            "08033165686"),
    m(4, "Mrs. Ruphina Mbaeze",      "Assistant Secretary",  "08032731927"),
    m(5, "Mrs. Regina Chukwuka",     "Financial Secretary",  "08033482561"),
    m(6, "Mrs. Jane Okoye",          "Treasurer",            "07047802244"),
    m(7, "Awodu Judith",             "Provost",              "07036603372"),
    m(8, "Chinyere Egbuji",          "P.R.O.",               "08034541360"),
  ]},

  // ── ZONE 7 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 7", groupName: "Zonal Executives", members: [
    m(1, "Dr. Chidi Ozochi",         "Chairman/Zonal Leader", "08037126379"),
    m(2, "Engr. Tony Ebuoonu",       "Vice Chairman",         "08033234738"),
    m(3, "Mrs. Ifeoma Onu",          "Secretary",             "0806654933"),
    m(4, "Mr. Charles Okwu",         "Assistant Secretary",   "08033370411"),
    m(5, "Dr. Mrs. Odo P.",          "Financial Secretary",   "08053887643"),
    m(6, "Mrs. Nkechi Eze",          "Treasurer",             "08033950579"),
    m(7, "Ikechukwu Ede",            "Provost",               "08036778020"),
    m(8, "Chief Nwachukwu",          "P.R.O.",                "08034756041"),
  ]},
  { zone: "Zone 7", groupName: "CMO", members: [
    m(1, "Dr. Cletus Odo",           "Chairman",             "07030527858"),
    m(2, "Mr. Charles Okwu",         "Vice Chairman",        "08038370411"),
    m(3, "Mr. Ikechukwu Ede",        "Secretary",            "08036778020"),
    m(4, "Sir Victor Ozoude",        "Assistant Secretary",  "08064646002"),
    m(5, "Sir Okey Okeagu",          "Financial Secretary",  "08100161859"),
    m(6, "Peter Okeke",              "Treasurer",            "08037332938"),
    m(7, "Prof. Emma Ejim",          "Provost",              "08033423871"),
    m(8, "Tony Onu",                 "P.R.O.",               "07066017760"),
  ]},
  { zone: "Zone 7", groupName: "CWO", members: [
    m(1, "Lady Ozoude Stella",       "Chairperson",          "08020622672"),
    m(2, "Lady Chika Mba",           "Vice Chairman",        "08037295845"),
    m(3, "Uju Okolo",                "Secretary",            "07061211246"),
    m(4, "Lady Gladys Onwusi",       "Assistant Secretary",  "08039368755"),
    m(5, "Dr. Chizoba Ozochi",       "Financial Secretary",  "08035059065"),
    m(6, "Lady Vero Obasi",          "Treasurer",            "07038401222"),
    m(7, "Lady Nkiru Chiwatalu",     "Provost",              "08036710834"),
    m(8, "Lady Onu Mary",            "P.R.O.",               "08033961862"),
  ]},
  { zone: "Zone 7", groupName: "CYMO", members: [
    m(1, "Prince Okeke",             "Chairman",             "07015669213"),
    m(2, "Vacant",                   "Vice Chairman"),
    m(3, "Great Godfrey Okagu",      "Secretary",            "09048801400"),
    m(4, "Vacant",                   "Assistant Secretary"),
    m(5, "Nebolisa Nwachukwu",       "Financial Secretary",  "09161722850"),
    m(6, "Arinze Odo Collins",       "Treasurer",            "08022734823"),
    m(7, "Vacant",                   "Provost"),
    m(8, "Kamsi Ndubuisi",           "P.R.O.",               "07040904237"),
  ]},
  { zone: "Zone 7", groupName: "CYWO", members: [
    m(1, "Chisom Ejim",              "Chairperson",          "08107696525"),
    m(2, "Vacant",                   "Vice Chairperson"),
  ]},

  // ── ZONE 8 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 8", groupName: "Zonal Executives", members: [
    m(1, "Sir Kenneth Onyeka",       "Chairman/Zonal Leader", "08033292084"),
    m(2, "Mr. Osita Onyeama",        "Vice Chairman",         "08033252333"),
    m(3, "Mrs. Ijeoma Nevo",         "Secretary",             "08030819881"),
    m(4, "Mrs. Ebele Ajibo",         "Assistant Secretary",   "08033479367"),
    m(5, "Mrs. Anthonia Onyigbo",    "Financial Secretary",   "08032741650"),
    m(6, "Mr. Chjindu Alakwenze",    "Treasurer",             "08063982292"),
    m(7, "Mrs. Blessing Oforka",     "Provost",               "08038917457"),
    m(8, "Vacant",                   "P.R.O."),
  ]},
  { zone: "Zone 8", groupName: "CMO", members: [
    m(1, "Mr. Christian Ani",        "Chairman",             "08037143751"),
    m(2, "Prince Ephraim Nnamani",   "Vice Chairman",        "08034749338"),
    m(3, "Dr. Obiora Nevo",          "Secretary",            "08030819881"),
    m(4, "Vacant",                   "Assistant Secretary"),
    m(5, "Mr. Chinedu Nnnanna",      "Financial Secretary",  "08066100001"),
    m(6, "Mr. Oliver Okafor",        "Treasurer",            "08036741972"),
    m(7, "Mr. Jerry Agbo",           "Provost",              "0817386955"),
    m(8, "Dr. Godwin Abonyi",        "P.R.O.",               "08033472246"),
  ]},
  { zone: "Zone 8", groupName: "CWO", members: [
    m(1, "Mrs. Gladys Ogakwu",           "Chairperson",          "08036721833"),
    m(2, "Dr. Mrs. Francisca Onyeka",    "Vice Chairman",        "08063315236"),
    m(3, "Mrs. N. R. Iwuala",            "Secretary",            "08033244852"),
    m(4, "Mrs. Juliana Ndubuisi",        "Assistant Secretary",  "08030884526"),
    m(5, "Dr. (Mrs) Uju Abonyi",         "Financial Secretary",  "08037576332"),
    m(6, "Mrs. Josephine Nnaebue",       "Treasurer",            "08032361448"),
    m(7, "Mrs. Rose Obi",                "Provost",              "08033256378"),
    m(8, "Mrs. Chinyere Eluke",          "P.R.O.",               "07064578982"),
  ]},
  { zone: "Zone 8", groupName: "CYMO", members: [
    m(1, "Iheagwaram Kosisochukwu",  "Chairman",             "09166071762 / 08136400404"),
    m(2, "Vacant",                   "Vice Chairman"),
    m(3, "Emmanuella Owona",         "Secretary",            "08113642847"),
    m(4, "Vacant",                   "Assistant Secretary"),
    m(5, "Kingsley Udefi",           "Financial Secretary",  "08108547884"),
    m(6, "Michael C. Onyeama",       "Treasurer",            "07036792214"),
    m(7, "Vacant",                   "Provost"),
    m(8, "Vacant",                   "P.R.O."),
  ]},

  // ── ZONE 9 ──────────────────────────────────────────────────────────────────
  { zone: "Zone 9", groupName: "Zonal Executives", members: [
    m(1, "Engr. Simeon Nwankwo",    "Chairman",             "08033415539"),
    m(2, "Benedict Mbagwu",         "Vice Chairman"),
    m(3, "Chidera Umeh",            "Secretary",            "07039455909"),
    m(4, "Stella Mmamelu",          "Assistant Secretary",  "08037260822"),
    m(5, "Asogwa Solomon",          "Financial Secretary"),
    m(6, "Uche Ogbodo",             "Treasurer",            "08033704457"),
    m(7, "Ernest Onwubariri",       "Provost",              "08104848644"),
    m(8, "Ngozi Ndubuisi",          "P.R.O.",               "08101615847"),
  ]},
  { zone: "Zone 9", groupName: "CMO", members: [
    m(1, "Prof. Nwagbara",          "Chairman",             "08037726212"),
    m(2, "Peter Opara",             "Vice Chairman",        "09151980692"),
    m(3, "Akunweze Akaduonye",      "Secretary"),
    m(4, "I O Ndubuisi",            "Assistant Secretary",  "08078580895"),
    m(5, "Mr. Ogbodo Chinedu",      "Financial Secretary"),
    m(6, "B. O. Onwuahu",           "Treasurer"),
    m(7, "Ugochukwu Okpoko",        "Provost"),
    m(8, "Tony Ogbodo",             "P.R.O."),
  ]},
  { zone: "Zone 9", groupName: "CWO", members: [
    m(1, "Mrs. Eucharia Udeh",          "Chairman",             "08063060118"),
    m(2, "Magistrate Ifeoma Nwagbara",  "Vice Chairman",        "08037263760"),
    m(3, "Uche Onwuzu",                 "Secretary",            "08033838181"),
    m(4, "Ngozi Okpoko",                "Assistant Secretary",  "09128622497"),
    m(5, "Rita Ozuno",                  "Financial Secretary",  "08083569683"),
    m(6, "Josephine Mba",               "Treasurer",            "08059508886"),
    m(7, "Onwubuariri Georginia",       "Provost"),
    m(8, "Nnodu Anthonia",              "P.R.O."),
  ]},

  // ── ZONE 10 ─────────────────────────────────────────────────────────────────
  { zone: "Zone 10", groupName: "Zonal Executives", members: [
    m(1, "Engr. Ezenwaka Osita",    "Chairman/Zonal Leader"),
    m(2, "Vacant",                  "Vice Chairman"),
    m(3, "Dr. Nweke Okay",          "Secretary"),
    m(4, "Mrs. Ada Ugo",            "Assistant Secretary"),
    m(5, "Vacant",                  "Financial Secretary"),
    m(6, "Lady Nwejike Theresa",    "Treasurer"),
    m(7, "Mrs. Onyia Uche",         "Provost"),
    m(8, "Lady Nzewi Josephine",    "P.R.O."),
  ]},
  { zone: "Zone 10", groupName: "CMO", members: [
    m(1, "Iche E. N. Chibueze",         "Chairman"),
    m(2, "Engr. Nwejike Macsteve",      "Vice Chairman"),
    m(3, "Chief Livy Otiji",            "Secretary"),
    m(4, "Vacant",                      "Assistant Secretary"),
    m(5, "Chief Onwuegbu Silvanus",     "Financial Secretary"),
    m(6, "Sir Joel Chinedu",            "Treasurer"),
    m(7, "Chief Agu Joseph",            "Provost"),
    m(8, "Mr. Esse Gabriel",            "P.R.O."),
  ]},
  { zone: "Zone 10", groupName: "CWO", members: [
    m(1, "Dr. Ezenwaka Ngozi",      "Chairman"),
    m(2, "Mrs. Otiji Ify",          "Vice Chairman"),
    m(3, "Dr. Becky Nnamani",       "Secretary"),
    m(4, "Mrs. Agbo Ngozi",         "Assistant Secretary"),
    m(5, "Mrs. Esse",               "Financial Secretary"),
    m(6, "Mrs. Ugwu Chinyere",      "Treasurer"),
    m(7, "Mrs. Dike Modesta",       "Provost"),
    m(8, "Mrs. OkaforAnulika",      "P.R.O."),
  ]},

  // ── ZONE 11 ─────────────────────────────────────────────────────────────────
  { zone: "Zone 11", groupName: "Zonal Executives", members: [
    m(1, "Mrs. Grace Ukah",             "Chairman/Zonal Leader", "08068090020"),
    m(2, "Engr. Nwanyelugo Nwoye",      "Vice Chairman",         "07037757772"),
    m(3, "Dr. Mrs. Chizoba Okolo",      "Secretary",             "08033405499"),
    m(4, "Ifeoma Obiora",               "Assistant Secretary",   "08063279731"),
    m(5, "Mrs. Adaobi Dieke",           "Financial Secretary",   "08064773402"),
    m(6, "Mrs. Julie Ogota",            "Treasurer",             "07032674691"),
    m(7, "Ike Collins",                 "Provost",               "070304489103"),
    m(8, "Emeka Aziude",                "P.R.O.",                "08060936021"),
  ]},
  { zone: "Zone 11", groupName: "CMO", members: [
    m(1, "Emeka Okolo",             "Chairman",             "09030772833"),
    m(2, "Mr. Hans Azubuike",       "Vice Chairman",        "08030753051"),
    m(3, "Mr. Pascal Amamilo",      "Secretary",            "08033314294"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Engr. Michael Okorie",    "Financial Secretary",  "08074729681"),
    m(6, "Barr. Chris Igbokwe",     "Treasurer",            "08033182107"),
    m(7, "Hon. Nweze Ernest",       "Provost",              "08033420885"),
    m(8, "Austin Madu",             "P.R.O.",               "08034493912"),
  ]},
  { zone: "Zone 11", groupName: "CWO", members: [
    m(1, "Mrs. Nneka Nwobu",        "Chairman",             "08033398249"),
    m(2, "Mrs. Ifeoma Aniagu",      "Vice Chairman",        "08035502558"),
    m(3, "Engr. Thecla Ndibuagu",   "Secretary",            "08033916071"),
    m(4, "Mrs. Ifeoma Ajawala",     "Assistant Secretary",  "08052401015"),
    m(5, "Mrs. Getrude Eze",        "Financial Secretary",  "08033226964"),
    m(6, "Mrs. Joy Madu",           "Treasurer",            "07032626802"),
    m(7, "Mrs. Gordelia Utobo",     "Provost",              "07068935822"),
    m(8, "Mrs. Amara Onuigbo",      "P.R.O.",               "07062913220"),
  ]},
  { zone: "Zone 11", groupName: "CYMO", members: [
    m(1, "Chidi Anya",              "Chairman",             "08139589024"),
    m(2, "Chimaobi Okorie",         "Vice Chairman",        "09037913357"),
    m(3, "Somtochukwu Anaje",       "Secretary",            "07047950538"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Vacant",                  "Financial Secretary"),
    m(6, "Vacant",                  "Treasurer"),
    m(7, "Vacant",                  "Provost"),
    m(8, "Vacant",                  "P.R.O."),
  ]},
  { zone: "Zone 11", groupName: "CYWO", members: [
    m(1, "Ene chidera .C.",         "Chairman",             "08166164949"),
    m(2, "Vacant",                  "Vice Chairman"),
    m(3, "Vacant",                  "Secretary"),
  ]},

  // ── ZONE 12 ─────────────────────────────────────────────────────────────────
  { zone: "Zone 12", groupName: "Zonal Executives", members: [
    m(1, "Engr. Chukwuemeka Agbo",  "Chairman/Zonal Leader", "08135503221"),
    m(2, "Chief Emmanuel Alozie",   "Vice Chairman",         "07085186285"),
    m(3, "Mrs. Nancy Nwokeji",      "Secretary",             "08068000224"),
    m(4, "Mrs. Nneka Peters",       "Assistant Secretary",   "08127499925"),
    m(5, "Mrs. Ifeyinwa Ugwuanyi",  "Financial Secretary",   "07060785796"),
    m(6, "Mrs. Chidera Agu",        "Treasurer",             "08130155292"),
    m(7, "Obinna Okoro",            "Provost",               "08035005437"),
    m(8, "Tochukwu Ebo",            "P.R.O.",                "08064090011"),
  ]},
  { zone: "Zone 12", groupName: "CMO", members: [
    m(1, "Remigius Odoh",               "Chairman",             "08037270595"),
    m(2, "Michael Ebede",               "Vice Chairman",        "08033772395"),
    m(3, "Shedrack Ezea",               "Secretary",            "08033171417"),
    m(4, "Engr. Okwudili Onyeyili",     "Assistant Secretary",  "08033997660"),
    m(5, "Chukwudi Ike",                "Financial Secretary",  "08033409934"),
    m(6, "Silas Chukwuneke",            "Treasurer",            "08035690333"),
    m(7, "Engr. Sunny Nwonye",          "Provost",              "09038444420"),
    m(8, "Vacant",                      "P.R.O."),
  ]},
  { zone: "Zone 12", groupName: "CWO", members: [
    m(1, "Elizabeth Onah",          "Chairman",             "07065123918"),
    m(2, "Chinyere Edozie",         "Vice Chairman",        "08169689797"),
    m(3, "Adaora Onyeyili",         "Secretary",            "08033085667"),
    m(4, "Obiageli Agbo",           "Assistant Secretary",  "08035301791"),
    m(5, "Ngozi Okeke",             "Financial Secretary",  "08119036442"),
    m(6, "Rosemary Onoh",           "Treasurer",            "08033769049"),
    m(7, "Esther Martina",          "Provost",              "08044678233"),
    m(8, "Ifeyinwa Ogbu",           "P.R.O.",               "08068311311"),
  ]},
  { zone: "Zone 12", groupName: "CYON", members: [
    m(1, "Anthony Agbo",            "Chairman",             "07054070314"),
    m(2, "Chibueze Onyejife",       "Vice Chairman",        "07016335270"),
    m(3, "Chidiebere Ogbu",         "Secretary"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Chidimma Uyanwa",         "Financial Secretary",  "08062833987"),
    m(6, "Vacant",                  "Treasurer"),
    m(7, "Vacant",                  "Provost"),
    m(8, "Michael Eze",             "P.R.O.",               "08083812215"),
  ]},

  // ── ZONE 13 ─────────────────────────────────────────────────────────────────
  { zone: "Zone 13", groupName: "Zonal Executives", members: [
    m(1, "Charles Achor",               "Chairman/Zonal Leader", "08057184156"),
    m(2, "Vicgenial Odumejemba",        "Vice Chairman",         "08064081474"),
    m(3, "Beatrice Adaeze Maduka",      "Secretary",             "08035495029"),
    m(4, "Sampson Oboke",               "Assistant Secretary",   "08138255435"),
    m(5, "Okechukwu Anukam",            "Financial Secretary",   "08025110020"),
    m(6, "Theresa Igweani",             "Treasurer",             "08100468663"),
    m(7, "Florence Obi",                "Provost",               "08036028461"),
    m(8, "Onyinye Ozougwu",             "P.R.O.",                "08061356108"),
  ]},
  { zone: "Zone 13", groupName: "CMO", members: [
    m(1, "Sir Emmanuel Ekwueme",        "Chairman",             "08067100905"),
    m(2, "Engr. Ikechukwu Igwenagu",    "Vice Chairman",        "08033404216"),
    m(3, "Vacant",                      "Secretary"),
    m(4, "Ifeanyi Ishiwu",              "Assistant Secretary",  "08084834222"),
    m(5, "Emmanuel Asogwa",             "Financial Secretary",  "08036332333"),
    m(6, "Chidiebere Ani",              "Treasurer",            "08132752567"),
    m(7, "Emmanuel Obi",                "Provost",              "07032672931"),
    m(8, "Stephen Anokwu",              "P.R.O.",               "0703008708"),
  ]},
  { zone: "Zone 13", groupName: "CWO", members: [
    m(1, "Roseline Ogbuene",        "Chairman",             "08067173250"),
    m(2, "Lady Helen Ekwueme",      "Vice Chairman",        "08034798445"),
    m(3, "Chinwe Chime",            "Secretary",            "0806486502"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Uche Agwagah",            "Financial Secretary",  "08035476704"),
    m(6, "Ngozi Ugwuoke",           "Treasurer",            "08037868370"),
    m(7, "Adaeze Anukam",           "Provost",              "08023541996"),
    m(8, "Ijeoma Egbogu.",          "P.R.O.",               "08035487768"),
  ]},

  // ── ZONE 14 ─────────────────────────────────────────────────────────────────
  { zone: "Zone 14", groupName: "Zonal Executives", members: [
    m(1, "Obinna Onyeador",         "Chairman/Zonal Leader", "07030760967"),
    m(2, "Chief Leonard Anuka",     "Vice Chairman",         "08035521408"),
    m(3, "Barr. Chuka Ezike",       "Secretary",             "08036743233"),
    m(4, "Lolo Victoria Ani",       "Assistant Secretary",   "08033154639"),
    m(5, "Mrs. Pauline Okafor",     "Financial Secretary",   "07033846770"),
    m(6, "Mrs. Josephine Obiagbara","Treasurer",             "08065392811"),
    m(7, "Iloha Onyeka",            "Provost",               "08037820654"),
    m(8, "Ogechukwu Chinelo",       "P.R.O.",                "07060872571"),
  ]},
  { zone: "Zone 14", groupName: "CMO", members: [
    m(1, "Engr. Ejike Agu",         "Chairman/Zonal Leader", "07035872207"),
    m(2, "Engr. Chuma Okani",       "Vice Chairman",         "0803660518"),
    m(3, "Sir Anthony Anih",        "Secretary",             "08033250578"),
    m(4, "Chinedu Ugbozor",         "Assistant Secretary",   "08032411000"),
    m(5, "Sir Patrick Anigbo",      "Financial Secretary",   "09078214527"),
    m(6, "Ozor Anthony Ani",        "Treasurer",             "08065727350"),
    m(7, "Joseph Steve",            "Provost",               "07063177104"),
    m(8, "Barr. Okechukwu Agu",     "P.R.O.",                "07035181845"),
  ]},
  { zone: "Zone 14", groupName: "CWO", members: [
    m(1, "Mrs. Clara Ani",          "Chairman",             "07067907403"),
    m(2, "Mrs. Franca Anigbo",      "Vice Chairman",        "08035416901"),
    m(3, "Lady Lorretta Amaenyi",   "Secretary",            "07062093195"),
    m(4, "Mrs. Faith Igwesi",       "Assistant Secretary",  "07035301240"),
    m(5, "Mr. Catherine Chiakwa",   "Financial Secretary",  "08130053043"),
    m(6, "Lolo Victoria Onyi",      "Treasurer",            "08107648480"),
    m(7, "Mrs. Edna Agu",           "Provost",              "08065763143"),
    m(8, "Mrs. Chioma Ozobu",       "P.R.O.",               "08037642779"),
  ]},
];

// ─── Societies (13 parish-wide groups) ───────────────────────────────────────

const SOCIETIES = [
  { groupName: "Divine Mercy Society", members: [
    m(1, "Chukwuobasi Munachimso",  "Leader",               "09037860814"),
    m(2, "Sis Nkechi Kelechi",      "Secretary",            "08137947368"),
    m(3, "Sis Ifeoma Orjianioke",   "Treasurer",            "07034987738"),
  ]},
  { groupName: "Association of Jesus in the Blessed Sacrament", members: [
    m(1, "Mrs. Stella Anele",       "President"),
    m(2, "Mrs. Theresa Nwejike",    "Vice President"),
    m(3, "Mrs. Chinelo Ndibe",      "Secretary"),
    m(4, "Mrs. Chinyere Ochu",      "Financial Secretary"),
    m(5, "Mrs. Cecilia Akam",       "Treasurer"),
    m(6, "Mrs. Ngozi Ene",          "Welfare Officer"),
    m(7, "Mrs. Edith Chime",        "Promoter"),
    m(8, "Mrs. Lovina Onwusi",      "Promoter"),
  ]},
  { groupName: "Ministry of Hospitality", members: [
    m(1, "Mrs. Loveth Ogbu",        "Chairman"),
    m(2, "Mrs. Ugochukwu Okpoko",   "Vice Chairman"),
    m(3, "Mrs. Ngozi Nwabugwu",     "Secretary"),
    m(4, "Vacant",                  "Assistant Secretary"),
    m(5, "Mrs. Cordelia Utobo",     "Treasurer"),
    m(6, "Mrs. Chinasa Enyiegbu",   "P.R.O."),
    m(7, "Mrs. Justina Nwali",      "Provost"),
  ]},
  { groupName: "Lay Readers Association", members: [
    m(1, "Sr. Ilechukwu Maureen",   "President"),
    m(2, "Sr. Udemadu Maria",       "Vice President"),
    m(3, "Sr. Agu Agatha",          "Secretary"),
    m(4, "Sr. Odo Mary-Rose",       "Assistant Secretary"),
    m(5, "Sr. Nwabugwu Ngozi",      "Financial Secretary"),
    m(6, "Sr. Ozioko Callister",    "Treasurer"),
    m(7, "Sr. Ezeugwu Blessing",    "P.R.O."),
    m(8, "Sr. Igbonekwu Blessing",  "Provost"),
  ]},
  { groupName: "St. Jude Society", members: [
    m(1, "Amu Joseph",              "Chief Servant"),
    m(2, "Udemadu Maria",           "Assistant Chief Servant"),
    m(3, "Alphonsus Akuwueze",      "Secretary"),
    m(4, "Anokwulu Ngozi",          "Assistant Secretary"),
    m(5, "Esther Ugwuoru",          "Financial Secretary"),
    m(6, "Mbanefo Justina",         "Treasurer"),
    m(7, "Sir Cletus Ugwuoru",      "P.R.O."),
    m(8, "Onukogu Evangeline",      "Provost"),
  ]},
  { groupName: "Sacred Heart of Jesus", members: [
    m(1,  "Prof. Ndukwe Kizito",    "President"),
    m(2,  "Mrs. Ilechukwu Maureen", "Vice President"),
    m(3,  "Mrs. Chizoba Ozochi",    "Secretary"),
    m(4,  "Mrs. Ngozi Chukwu",      "Assistant Secretary"),
    m(5,  "Mr. Philip Ozogwu",      "Financial Secretary"),
    m(6,  "Lady Franca Onyeka",     "Treasurer"),
    m(7,  "Mrs. Franca Anigbo",     "Promoter"),
    m(8,  "Mrs. Uzuegbunam",        "Registrar"),
    m(9,  "Josephine Udenta",       "Auditor"),
    m(10, "Lady Judith Awodu",      "Publicity Secretary"),
  ]},
  { groupName: "St. Mary Seraphic 10A.M. Choir", members: [
    m(1, "Dr. Martin Ugada",        "Music Director"),
    m(2, "Emmanuel Agu",            "Choir Master"),
    m(3, "Oluchi Okorodibia",       "President"),
    m(4, "Chinenye Udeagha",        "Secretary"),
    m(5, "Chika Opara",             "Financial Secretary"),
    m(6, "Egomaria Ogbuagu",        "Treasurer"),
    m(7, "Chidubem Odumejemba",     "P.R.O."),
  ]},
  { groupName: "Our Lady of Mount Carmel", members: [
    m(1, "Sister Nkechi O. Emenike",    "President"),
    m(2, "Sister Hilda Amuh",           "Vice President"),
    m(3, "Brother Everest Ibeg",        "Secretary"),
    m(4, "Sister Chinemerem Chidobe",   "Assistant Secretary"),
    m(5, "Sister Ruphina Mbaeze",       "Treasurer"),
    m(6, "Brother Chidi Arinze",        "Liturgy Director"),
  ]},
  { groupName: "Infant Jesus Society", members: [
    m(1, "Okosa Chioma",                "President"),
    m(2, "Odumejemab V. Mary",          "Secretary"),
    m(3, "Happiness Eke",               "Treasurer"),
    m(4, "Eucharia Ofoka",              "Financial Secretary"),
    m(5, "Chigozie Roseline Nworie",    "P.R.O."),
  ]},
  { groupName: "Our Mother of Perpetual Help", members: [
    m(1, "Sis Udeh Pauline",                "President"),
    m(2, "Bro. Agbo Chukwuemeka",           "Vice President"),
    m(3, "Sis Ozoagu Patricia",             "Secretary"),
    m(4, "Sis Chikwendu Chinyere Anita",    "Assistant Secretary"),
    m(5, "Sis Eze Nkechi",                  "Treasurer"),
    m(6, "Sis Okoro Njideka",               "Financial Secretary"),
    m(7, "Sis Akwolu Chidimma",             "Provost"),
  ]},
  { groupName: "Apostleship of Prayer, League of the Sacred Heart of Jesus", members: [
    m(1, "Bro. Sunday Nwafor",              "President",                "0806668443"),
    m(2, "Sir. Chinedu Eneh",               "Vice President",           "08072129458"),
    m(3, "Bro. Victor Ezeilo",              "Secretary",                "07063340896"),
    m(4, "Sis. Stella Nwakire",             "Assistant Secretary",      "08037207425"),
    m(5, "Sis. Bernadine Onuoha",           "Financial Secretary",      "08072027308"),
    m(6, "Sis. Josephine Obiagbawasim",     "Treasurer",                "08065392811"),
    m(7, "Sis. Beatrice Ozochi",            "P.R.O.",                   "08038712610"),
    m(8, "Sis. Regina Aneke",               "Provost 1",                "09162703997"),
    m(9, "Sis. Augusta Ugwuwanyi",          "Provost 2",                "09030524246"),
  ]},
  { groupName: "Tongues of Fire Prayer Group", members: [
    m(1,  "Bro. Dr. Christian Nnamani",     "Coordinator",                  "0817385888"),
    m(2,  "Sis. Prof. Cynthia Nwobodo",     "Assistant Coordinator",        "08039462574"),
    m(3,  "Sis. Barr. Dr. Ngozi Ezema",     "Secretary",                    "08063632402"),
    m(4,  "Sis. Lady Eunice Ezeilo",        "Assistant Secretary",          "08053276848"),
    m(5,  "Sis. Ezinne Josephine Aziude",   "Financial Secretary",          "08037151743"),
    m(6,  "Bro. Daniel Elom",               "Treasurer",                    "07026446083"),
    m(7,  "Sis. Ijeoma Egbogu",             "P.R.O.",                       "08035487768"),
    m(8,  "Sis. Chidiebere Okeke",          "Leader Steward Ministry",      "08148259938"),
    m(9,  "Sis. Ifeoma Okoye",              "Leader Intercessory Ministry", "07039359152"),
    m(10, "Sis. Jerry Udochukwu",           "Leader Teaching Ministry",     "08065499879"),
    m(11, "Bro. Valentine Chukwu",          "Evangelical Ministry",         "08067958561"),
    m(12, "Sis. Rita Amagwula",             "Leader Praise Worship",        "08069468496"),
    m(13, "Sis. Cordelia Ekwo",             "Women's Wing Leader",          "08136530333"),
    m(14, "Sis Chime Chizoba",              "Youth Wing Leader",            "07060900656"),
  ]},
  { groupName: "Block Rosary", members: [
    m(1,  "Bro. Ani Onyedikachie",      "President",            "08106960211"),
    m(2,  "Sis Umezulike Chidimma",     "Vice President",       "09162864580"),
    m(3,  "Sis Igbonekwu Nmasi",        "Secretary",            "09066878177"),
    m(4,  "Sis. Ego Blessing",          "Asst. Secretary",      "08038516183"),
    m(5,  "Sis. Igbonekwu Amarachi",    "Financial Secretary"),
    m(6,  "Bro. Mba David",             "Treasurer",            "08021290473"),
    m(7,  "Sis Aniamalu Favour",        "P.R.O. 1"),
    m(8,  "Sis Kelvin Stephanie",       "P.R.O. 2"),
    m(9,  "Bro. Mathias",               "Provost 1",            "08160535150"),
    m(10, "Sis Onyioha Oluebube",       "Provost 2"),
    m(11, "Bro. Uzuegbu Emmanuel",      "Promoter",             "09035433916"),
  ]},
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding zonal_council_members — 2026 election results...\n");

  // Safe to re-run: wipe existing 2026 rows first
  const deleted = await prisma.zonalCouncilMember.deleteMany({
    where: { electionYear: 2026 },
  });
  if (deleted.count > 0) {
    console.log(`🗑  Cleared ${deleted.count} existing 2026 rows`);
  }

  // Build flat array of all rows
  const rows: any[] = [];

  for (const group of ZONAL) {
    for (const row of group.members) {
      rows.push({ recordType: "ZONAL", zone: group.zone, groupName: group.groupName, electionYear: 2026, isActive: true, ...row });
    }
  }

  for (const society of SOCIETIES) {
    for (const row of society.members) {
      rows.push({ recordType: "SOCIETY", zone: null, groupName: society.groupName, electionYear: 2026, isActive: true, ...row });
    }
  }

  const result = await prisma.zonalCouncilMember.createMany({ data: rows });

  const zonalCount   = rows.filter(r => r.recordType === "ZONAL").length;
  const societyCount = rows.filter(r => r.recordType === "SOCIETY").length;
  const vacantCount  = rows.filter(r => r.isVacant).length;

  console.log(`\n✅ Inserted ${result.count} rows`);
  console.log(`   Zonal members   : ${zonalCount}`);
  console.log(`   Society members : ${societyCount}`);
  console.log(`   Vacant seats    : ${vacantCount}`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());

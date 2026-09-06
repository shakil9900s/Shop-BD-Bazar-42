export interface BangladeshLocationData {
  divisions: {
    name: string;
    districts: {
      name: string;
      upazilas: string[];
    }[];
  }[];
}

export const BANGLADESH_DATA: BangladeshLocationData = {
  divisions: [
    {
      name: "Dhaka",
      districts: [
        {
          name: "Dhaka",
          upazilas: [
            "Dhanmondi",
            "Gulshan",
            "Banani",
            "Uttara",
            "Mirpur",
            "Mohammadpur",
            "Motijheel",
            "Badda",
            "Khilgaon",
            "Tejgaon",
            "Rampura",
            "Malibagh",
            "Farmgate",
            "Pallabi",
            "Kafrul",
            "Cantonment",
            "Lalbagh",
            "Kotwali",
            "Hazaribagh",
            "Jatrabari",
            "Demra",
            "Shyampur",
            "Khilkhet",
            "Bhatara",
            "Savar",
            "Keraniganj",
            "Dhamrai",
            "Ashulia"
          ]
        },
        {
          name: "Gazipur",
          upazilas: [
            "Gazipur Sadar",
            "Tongi",
            "Kaliakair",
            "Sreepur",
            "Kapasia",
            "Kaliganj"
          ]
        },
        {
          name: "Narayanganj",
          upazilas: [
            "Narayanganj Sadar",
            "Bandar",
            "Rupganj",
            "Sonargaon",
            "Araihazar"
          ]
        },
        {
          name: "Tangail",
          upazilas: [
            "Tangail Sadar",
            "Mirzapur",
            "Ghatail",
            "Kalihati",
            "Madhupur",
            "Sakhipur",
            "Gopalpur",
            "Delduar",
            "Nagarpur",
            "Bhuapur"
          ]
        },
        {
          name: "Narsingdi",
          upazilas: [
            "Narsingdi Sadar",
            "Palash",
            "Shibpur",
            "Raipura",
            "Belabo",
            "Monohardi"
          ]
        },
        {
          name: "Munshiganj",
          upazilas: [
            "Munshiganj Sadar",
            "Sreenagar",
            "Sirajdikhan",
            "Tongibari",
            "Lohajang",
            "Gazaria"
          ]
        },
        {
          name: "Manikganj",
          upazilas: [
            "Manikganj Sadar",
            "Singair",
            "Saturia",
            "Shivalaya",
            "Ghior",
            "Harirampur",
            "Daulatpur"
          ]
        },
        {
          name: "Faridpur",
          upazilas: [
            "Faridpur Sadar",
            "Boalmari",
            "Bhanga",
            "Madhukhali",
            "Nagarkanda",
            "Charbhadrasan",
            "Sadarpur"
          ]
        },
        {
          name: "Kishoreganj",
          upazilas: [
            "Kishoreganj Sadar",
            "Bhairab",
            "Bajitpur",
            "Katiadi",
            "Karimganj",
            "Kuliarchar",
            "Pakundia"
          ]
        },
        {
          name: "Gopalganj",
          upazilas: [
            "Gopalganj Sadar",
            "Kashiani",
            "Kotalipara",
            "Muksudpur",
            "Tungipara"
          ]
        }
      ]
    },
    {
      name: "Chattogram",
      districts: [
        {
          name: "Chattogram",
          upazilas: [
            "Pahartali",
            "Panchlaish",
            "Kotwali",
            "Double Mooring",
            "Agrabad",
            "Halishahar",
            "Patenga",
            "Chandgaon",
            "Sitakunda",
            "Mirsharai",
            "Hathazari",
            "Raozan",
            "Patiya",
            "Anwara",
            "Boalkhali"
          ]
        },
        {
          name: "Cox's Bazar",
          upazilas: [
            "Cox's Bazar Sadar",
            "Chakaria",
            "Teknaf",
            "Ukhiya",
            "Ramu",
            "Maheshkhali",
            "Pekua"
          ]
        },
        {
          name: "Cumilla",
          upazilas: [
            "Cumilla Adarsha Sadar",
            "Cumilla Sadar Dakshin",
            "Daudkandi",
            "Chandina",
            "Laksam",
            "Debidwar",
            "Muradnagar",
            "Homna",
            "Burichang",
            "Brahmanpara"
          ]
        },
        {
          name: "Feni",
          upazilas: [
            "Feni Sadar",
            "Daganbhuiyan",
            "Chhagalnaiya",
            "Sonagazi",
            "Parshuram",
            "Fulgazi"
          ]
        },
        {
          name: "Brahmanbaria",
          upazilas: [
            "Brahmanbaria Sadar",
            "Ashuganj",
            "Kasba",
            "Nabinagar",
            "Sarail",
            "Akhaura",
            "Bancharampur"
          ]
        },
        {
          name: "Noakhali",
          upazilas: [
            "Noakhali Sadar",
            "Begumganj",
            "Chatkhil",
            "Senbagh",
            "Companiganj",
            "Hatiya",
            "Subarnachar"
          ]
        }
      ]
    },
    {
      name: "Rajshahi",
      districts: [
        {
          name: "Rajshahi",
          upazilas: [
            "Boalia",
            "Motihar",
            "Rajpara",
            "Shah Makhdum",
            "Paba",
            "Godagari",
            "Tanore",
            "Bagmara",
            "Durgapur",
            "Puthia",
            "Charghat"
          ]
        },
        {
          name: "Bogura",
          upazilas: [
            "Bogura Sadar",
            "Shajahanpur",
            "Sherpur",
            "Gabtali",
            "Shibganj",
            "Dhunat",
            "Kahaloo",
            "Nandigram",
            "Sariakandi"
          ]
        },
        {
          name: "Pabna",
          upazilas: [
            "Pabna Sadar",
            "Ishwardi",
            "Santhia",
            "Bera",
            "Sujanagar",
            "Chatmohar",
            "Atgharia",
            "Faridpur"
          ]
        },
        {
          name: "Sirajganj",
          upazilas: [
            "Sirajganj Sadar",
            "Ullapara",
            "Shahjadpur",
            "Belkuchi",
            "Kazipur",
            "Kamarkhanda",
            "Tarash",
            "Raiganj"
          ]
        }
      ]
    },
    {
      name: "Khulna",
      districts: [
        {
          name: "Khulna",
          upazilas: [
            "Khulna Sadar",
            "Sonadanga",
            "Khalishpur",
            "Daulatpur",
            "Khan Jahan Ali",
            "Dumuria",
            "Rupsha",
            "Phultala",
            "Batiaghata",
            "Dacope"
          ]
        },
        {
          name: "Jashore",
          upazilas: [
            "Jashore Sadar",
            "Jhikargachha",
            "Sharsha",
            "Manirampur",
            "Chaugachha",
            "Keshabpur",
            "Abhaynagar",
            "Bagherpara"
          ]
        },
        {
          name: "Kushtia",
          upazilas: [
            "Kushtia Sadar",
            "Kumarkhali",
            "Mirpur",
            "Bheramara",
            "Daulatpur",
            "Khoksa"
          ]
        }
      ]
    },
    {
      name: "Sylhet",
      districts: [
        {
          name: "Sylhet",
          upazilas: [
            "Sylhet Sadar",
            "Beanibazar",
            "Golapganj",
            "Zakiganj",
            "Kanaighat",
            "Jaintiapur",
            "Gowainghat",
            "Companiganj",
            "Balaganj",
            "Osmani Nagar",
            "Fenchuganj"
          ]
        },
        {
          name: "Moulvibazar",
          upazilas: [
            "Moulvibazar Sadar",
            "Sreemangal",
            "Kamalganj",
            "Kulaura",
            "Rajnagar",
            "Barlekha",
            "Juri"
          ]
        },
        {
          name: "Habiganj",
          upazilas: [
            "Habiganj Sadar",
            "Madhabpur",
            "Chunarughat",
            "Bahubal",
            "Nabiganj",
            "Baniachang",
            "Lakhai"
          ]
        },
        {
          name: "Sunamganj",
          upazilas: [
            "Sunamganj Sadar",
            "Chhatak",
            "Jagannathpur",
            "Derai",
            "Tahirpur",
            "Dharampasha"
          ]
        }
      ]
    },
    {
      name: "Barishal",
      districts: [
        {
          name: "Barishal",
          upazilas: [
            "Barishal Sadar",
            "Babuganj",
            "Bakerganj",
            "Banaripara",
            "Gournadi",
            "Agailjhara",
            "Mehendiganj",
            "Muladi",
            "Wazirpur"
          ]
        },
        {
          name: "Patuakhali",
          upazilas: [
            "Patuakhali Sadar",
            "Galachipa",
            "Kalapara",
            "Bauphal",
            "Mirzaganj",
            "Dumki"
          ]
        },
        {
          name: "Bhola",
          upazilas: [
            "Bhola Sadar",
            "Borhanuddin",
            "Char Fasson",
            "Daulatkhan",
            "Lalmohan",
            "Manpura",
            "Tazumuddin"
          ]
        }
      ]
    },
    {
      name: "Rangpur",
      districts: [
        {
          name: "Rangpur",
          upazilas: [
            "Rangpur Sadar",
            "Badarganj",
            "Gangachara",
            "Kaunia",
            "Mithapukur",
            "Pirgachha",
            "Pirganj",
            "Taraganj"
          ]
        },
        {
          name: "Dinajpur",
          upazilas: [
            "Dinajpur Sadar",
            "Birganj",
            "Biral",
            "Bochaganj",
            "Chirirbandar",
            "Phulbari",
            "Parbatipur",
            "Hakimpur"
          ]
        }
      ]
    },
    {
      name: "Mymensingh",
      districts: [
        {
          name: "Mymensingh",
          upazilas: [
            "Mymensingh Sadar",
            "Muktagachha",
            "Trishal",
            "Bhaluka",
            "Gaffargaon",
            "Ishwarganj",
            "Phulpur",
            "Haluaghat",
            "Gouripur"
          ]
        },
        {
          name: "Jamalpur",
          upazilas: [
            "Jamalpur Sadar",
            "Sarishabari",
            "Melandaha",
            "Islampur",
            "Dewanganj",
            "Madarganj",
            "Bakshiganj"
          ]
        }
      ]
    }
  ]
};

// Major core metropolitan Thanas/Areas considered "Inside Dhaka City"
const CORE_DHAKA_CITY_THANAS = new Set([
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Uttara",
  "Mirpur",
  "Mohammadpur",
  "Motijheel",
  "Badda",
  "Khilgaon",
  "Tejgaon",
  "Rampura",
  "Malibagh",
  "Farmgate",
  "Pallabi",
  "Kafrul",
  "Cantonment",
  "Lalbagh",
  "Kotwali",
  "Hazaribagh",
  "Jatrabari",
  "Demra",
  "Shyampur",
  "Khilkhet",
  "Bhatara"
]);

// Dhaka suburb areas considered "Other Dhaka City Areas / Greater Dhaka Suburbs"
const DHAKA_SUBURBS = new Set([
  "Savar",
  "Keraniganj",
  "Dhamrai",
  "Ashulia"
]);

/**
 * Determine delivery charge based on Division, District, and Upazila
 */
export function calculateDeliveryCharge(
  division: string,
  district: string,
  upazila: string,
  rates: {
    inside_dhaka: number;
    dhaka_suburbs: number;
    outside_dhaka: number;
  }
): { amount: number; zone: string } {
  if (division === "Dhaka" && district === "Dhaka") {
    if (CORE_DHAKA_CITY_THANAS.has(upazila)) {
      return { amount: rates.inside_dhaka, zone: "Inside Dhaka City" };
    }
    if (DHAKA_SUBURBS.has(upazila)) {
      return { amount: rates.dhaka_suburbs, zone: "Other Dhaka City Areas (Suburbs)" };
    }
    // Default Dhaka district
    return { amount: rates.inside_dhaka, zone: "Inside Dhaka City" };
  }

  // Adjacent metropolitan districts in Dhaka division (Gazipur, Narayanganj) count as Other Dhaka Areas
  if (division === "Dhaka" && (district === "Gazipur" || district === "Narayanganj")) {
    return { amount: rates.dhaka_suburbs, zone: "Other Dhaka City Areas" };
  }

  // All other districts / divisions
  return { amount: rates.outside_dhaka, zone: "Outside Dhaka" };
}

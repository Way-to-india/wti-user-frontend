'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const IndianEmbassies: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const embassies = [
    {
      country: 'ARGENTINA',
      address: 'Corboda 950, C 1054 AAV, Buenos Aires',
      phone: 'Tel: 54-11-43935291',
      fax: 'Fax: 54-11-43935295',
    },
    {
      country: 'AUSTRALIA',
      address: 'Embassy of India, 3-5 Moonah Place, Yarralumla, Canberra, ACT 2600',
      phone: 'Tel: 0061(2)62733999, 62733774',
      fax: 'Fax: 0061(2)62731308, 62733328',
    },
    {
      country: 'AUSTRIA',
      address: 'Embassy of the Republic of India, Kärntner Ring 2, Vienna-1010',
      phone: 'Tel: 43-1-5058666',
      fax: 'Fax: 43-1-5051919',
    },
    {
      country: 'BAHRAIN',
      address:
        'Embassy of India, Building No. 182, Road No. 2608, Area- 326, Adliya, P.O. Box 26106, Manama',
      phone: 'Tel: 00-973-17712730',
      fax: 'Fax: 00-973-17715527',
    },
    {
      country: 'BANGLADESH',
      address: 'Embassy of India, House: CWS (A) 1/2, Road:142, Gulshan, Dhaka-1212',
      phone: 'Tel: 00-880-2-9889339/40/41/42',
      fax: 'Fax: 00-880-2-9883939',
    },
    {
      country: 'BELGIUM',
      address: 'Embassy of India, 217 Chaussee de Vleurgat, B-1050, Brussels',
      phone: 'Tel: 0032-2-6409140',
      fax: 'Fax: 0032-2-6489638',
    },
    {
      country: 'BRAZIL',
      address: 'Embassy of India, SES, Av. das Nações, Lote 23, 70429-900, Brasilia D.F.',
      phone: 'Tel: 55-61-32481006/32481007',
      fax: 'Fax: 55-61-32481121',
    },
    {
      country: 'BRUNEI',
      address: 'High Commission of India, 8, Jalan Kubor Chetty, Gadong BE 3719, Brunei Darussalam',
      phone: 'Tel: 00-673-2-457471/457472',
      fax: 'Fax: 00-673-2-457474',
    },
    {
      country: 'BULGARIA',
      address: 'Embassy of India, Neofit Rilski Str. 23, 1000 Sofia',
      phone: 'Tel: +359 2 987 05 28',
      fax: 'Fax: +359 2 987 75 48',
    },
    {
      country: 'CANADA',
      address: 'Embassy of India, 10 Springfield Road, Ottawa, Ontario, K1M 1C9',
      phone: 'Tel: 1-613-7443751/52, 7443772, 7443804',
      fax: 'Fax: 1-613-7440913',
    },
    {
      country: 'CHILE',
      address: 'Embassy of India, Avenida Andres Bello 2687, Providencia, Santiago',
      phone: 'Tel: 56-2-2352005',
      fax: 'Fax: 56-2-2325120',
    },
    {
      country: 'CHINA',
      address: 'Embassy of India, 1 Ritan Dong Lu, Beijing - 100600',
      phone: 'Tel: 0086-10-65321908/09/10',
      fax: 'Fax: 0086-10-65324684',
    },
    {
      country: 'COLOMBIA',
      address: 'Embassy of India, Carrera 12, No. 97-82, Santa Fe de Bogota',
      phone: 'Tel: 57-1-6440899',
      fax: 'Fax: 57-1-6110485',
    },
    {
      country: 'COSTA RICA',
      address: 'Embassy of India, Carretera a Pavas, La Union, Tres Rios, Cartago',
      phone: 'Tel: 506-25501979',
      fax: 'Fax: 506-25501980',
    },
    {
      country: 'CROATIA',
      address: 'Embassy of India, Pantovčak 125b, 10000 Zagreb',
      phone: 'Tel: 385-1-4877577',
      fax: 'Fax: 385-1-4877580',
    },
    {
      country: 'CUBA',
      address:
        'Embassy of India, Calle 21, No. 202 esquina a K, Vedado, C.P. 10400, Ciudad de La Habana',
      phone: 'Tel: 53-7-8333777, 8333888',
      fax: 'Fax: 53-7-8333092',
    },
    {
      country: 'CYPRUS',
      address: 'High Commission of India, 3 Indira Gandhi Street, Engomi, Nicosia-2415',
      phone: 'Tel: 357-22-351741/42/43',
      fax: 'Fax: 357-22-351742/44',
    },
    {
      country: 'CZECH REPUBLIC',
      address: 'Embassy of India, Pod Kastany 14, 160 00, Praha 6',
      phone: 'Tel: 420-2-57531111',
      fax: 'Fax: 420-2-57531112',
    },
    {
      country: 'DENMARK',
      address: 'Embassy of India, Vangede Alle 15, DK-2820, Gentofte, Copenhagen',
      phone: 'Tel: 45-39-189022/23',
      fax: 'Fax: 45-39-273218',
    },
    {
      country: 'EGYPT',
      address: 'Embassy of India, 5, Aziz Abaza Street, Zamalek, Cairo',
      phone: 'Tel: 20-2-27363051/52',
      fax: 'Fax: 20-2-27361057',
    },
    {
      country: 'ETHIOPIA',
      address: 'Embassy of India, P.O. Box 528, Addis Ababa',
      phone: 'Tel: 251-11-1223-8044/45',
      fax: 'Fax: 251-11-1551-1119',
    },
    {
      country: 'FIJI',
      address:
        'High Commission of India, 9th Floor, Reserve Bank of Fiji Building, Pratt Street, Suva',
      phone: 'Tel: (679) 3301125',
      fax: 'Fax: (679) 3301032',
    },
    {
      country: 'FINLAND',
      address: 'Embassy of India, Satamakatu 3 B, 5th Floor, FIN-00160, Helsinki',
      phone: 'Tel: 358-9-22860250',
      fax: 'Fax: 358-9-22860265',
    },
    {
      country: 'FRANCE',
      address: 'Embassy of India, 15 Rue Alfred Dehodencq, 75016, Paris',
      phone: 'Tel: 33-1-40507070',
      fax: 'Fax: 33-1-40507096',
    },
    {
      country: 'GERMANY',
      address: 'Embassy of India, Tiergartenstrasse 17, 10785, Berlin',
      phone: 'Tel: 49-30-257950',
      fax: 'Fax: 49-30-25795102',
    },
    {
      country: 'GHANA',
      address: 'High Commission of India, 9, Ridge Road, Roman Ridge, Accra',
      phone: 'Tel: 233-21-775601/02/03',
      fax: 'Fax: 233-21-772176',
    },
    {
      country: 'GREECE',
      address: 'Embassy of India, 3-5 Kleanthous Street, GR-106 74, Athens',
      phone: 'Tel: 30-210-7216481/82/83/84',
      fax: 'Fax: 30-210-7293605',
    },
    {
      country: 'HUNGARY',
      address: 'Embassy of India, Búzavirág utca 14, H-1025, Budapest',
      phone: 'Tel: 36-1-3250490',
      fax: 'Fax: 36-1-3256214',
    },
    {
      country: 'INDONESIA',
      address: 'Embassy of India, Jalan H.R. Rasuna Said, Kav. S-1, Kuningan, Jakarta 12950',
      phone: 'Tel: 62-21-5204150/51',
      fax: 'Fax: 62-21-5204160',
    },
    {
      country: 'IRAN',
      address: 'Embassy of India, 71, Mir Emad Street, (off Mofattah Avenue), Tehran',
      phone: 'Tel: 98-21-66729300',
      fax: 'Fax: 98-21-66729308',
    },
    {
      country: 'IRAQ',
      address: 'Embassy of India, Al-Salihiya, Masbah Quarter, No. 92, Street - 13, Baghdad',
      phone: 'Tel: 964-1-5425653',
      fax: 'Fax: 964-1-5425654',
    },
    {
      country: 'IRELAND',
      address: 'Embassy of India, 6 Leeson Park, Dublin-6',
      phone: 'Tel: 353-1-4970843/4970763',
      fax: 'Fax: 353-1-4978074',
    },
    {
      country: 'ISRAEL',
      address: 'Embassy of India, 4 Kaufman Street, Sharbat House, 8th Floor, Tel Aviv - 68012',
      phone: 'Tel: 972-3-5102431/32/33/34',
      fax: 'Fax: 972-3-5105202',
    },
    {
      country: 'ITALY',
      address: 'Embassy of India, Via XX Settembre, 5, 00187, Rome',
      phone: 'Tel: 39-06-4884642/43/44/45',
      fax: 'Fax: 39-06-4819539',
    },
    {
      country: 'JAMAICA',
      address: 'High Commission of India, 1-1A Courtleigh Manor, 1a St. Lucia Avenue, Kingston - 5',
      phone: 'Tel: 1-876-9277990',
      fax: 'Fax: 1-876-9782295',
    },
    {
      country: 'JAPAN',
      address: 'Embassy of India, 2-2-11 Kudan-Minami, Chiyoda-Ku, Tokyo 102-0074',
      phone: 'Tel: 81-3-32620397/98',
      fax: 'Fax: 81-3-32343866',
    },
    {
      country: 'JORDAN',
      address: 'Embassy of India, First Circle, Jabal Amman, P.O. Box: 2168, Amman-11181',
      phone: 'Tel: 962-6-4623315/4624016',
      fax: 'Fax: 962-6-4649752',
    },
    {
      country: 'KAZAKHSTAN',
      address: 'Embassy of India, 311-A Furmanova Street, Almaty - 480091',
      phone: 'Tel: 7-3272-725050',
      fax: 'Fax: 7-3272-725068',
    },
    {
      country: 'KENYA',
      address: 'High Commission of India, Jeevan Bharati Building, P.O. Box 30074, Nairobi',
      phone: 'Tel: 254-20-2722566/67',
      fax: 'Fax: 254-20-2726707',
    },
    {
      country: 'Korea (Republic of)',
      address: 'Embassy of India, 37-3 Hannam-Dong, Yongsan-Gu, Seoul 140-210',
      phone: 'Tel: 82-2-7984257/58',
      fax: 'Fax: 82-2-7966373',
    },
    {
      country: 'KUWAIT',
      address:
        'Embassy of India, Istiqlal Street, Diplomatic Area, P.O. Box 1450, 13015 Safat, Kuwait City',
      phone: 'Tel: 965-22530600/22530661',
      fax: 'Fax: 965-22520416/22520242',
    },
    {
      country: 'LIBYA',
      address: 'Embassy of India, 17-A Ahmed Rafiq Al Mahdawi Street, Hay-el-Andalus, Tripoli',
      phone: 'Tel: 218-21-4440200/4440201',
      fax: 'Fax: 218-21-4440202',
    },
    {
      country: 'MALAYSIA',
      address:
        'High Commission of India, No. 2, Jalan Taman Duta, off Jalan Duta, 50480, Kuala Lumpur',
      phone: 'Tel: 603-20938000',
      fax: 'Fax: 603-20938090',
    },
    {
      country: 'MALDIVES',
      address: 'High Commission of India, Athireemaage, Ameer Ahmed Magu, Male - 20-05',
      phone: 'Tel: 960-3323015/3323016',
      fax: 'Fax: 960-3323918',
    },
    {
      country: 'MAURITIUS',
      address:
        'High Commission of India, Life Insurance Corporation of India Building, President John Kennedy Street, Port Louis',
      phone: 'Tel: 230-2083775/2083776',
      fax: 'Fax: 230-2088854',
    },
    {
      country: 'MEXICO',
      address:
        'Embassy of India, 5-1 Musashi Kosugi, 1 chome, Nakahara-ku, Kawasaki-shi, Kanagawa-ken, 211-0063, Mexico',
      phone: 'Tel: 52-55-52546923/24',
      fax: 'Fax: 52-55-52546422',
    },
    {
      country: 'MOROCCO',
      address: 'Embassy of India, Boulevard Moulay Youssef & Bd. Zerktouni Angle, Casablanca',
      phone: 'Tel: 212-522-397373',
      fax: 'Fax: 212-522-397376',
    },
    {
      country: 'MOZAMBIQUE',
      address: 'High Commission of India, Rua Mousinho Da Silveira No. 199, Maputo',
      phone: 'Tel: 258-21-492437/492437/492774',
      fax: 'Fax: 258-21-492876',
    },
    {
      country: 'MYANMAR',
      address: 'Embassy of India, 545-547, Merchant Street, Yangon',
      phone: 'Tel: 95-1-391219/391275',
      fax: 'Fax: 95-1-391405',
    },
    {
      country: 'NEPAL',
      address: 'Embassy of India, Lainchaur, Kathmandu, G.P.O. Box: 292',
      phone: 'Tel: 977-1-4410900/4411699/4412300',
      fax: 'Fax: 977-1-4413132',
    },
    {
      country: 'NETHERLANDS',
      address: 'Embassy of India, Buitenrustweg 2, 2517 KD, The Hague',
      phone: 'Tel: 31-70-3469771',
      fax: 'Fax: 31-70-3617072',
    },
    {
      country: 'NEW ZEALAND',
      address: 'High Commission of India, 180 Molesworth Street, P.O. Box 4045, Wellington',
      phone: 'Tel: 64-4-4736390',
      fax: 'Fax: 64-4-4996665',
    },
    {
      country: 'NIGERIA',
      address: 'High Commission of India, 39 King George V Road, Onikan, P.O. Box 2688, Lagos',
      phone: 'Tel: 234-1-2614758/2617776',
      fax: 'Fax: 234-1-2630391',
    },
    {
      country: 'NORWAY',
      address: 'Embassy of India, Gimle Terrasse 23, N-0244, Oslo-2',
      phone: 'Tel: 47-22-434907/08',
      fax: 'Fax: 47-22-567215',
    },
    {
      country: 'OMAN',
      address: 'Embassy of India, P.O. Box 1727, Ruwi, Postal Code 112, Sultanate of Oman',
      phone: 'Tel: 968-24696676/24696688',
      fax: 'Fax: 968-24696623',
    },
    {
      country: 'PERU',
      address: 'Embassy of India, Avenida Salaverry 3006, San Isidro, Lima-27',
      phone: 'Tel: 51-1-4406620/4406621',
      fax: 'Fax: 51-1-4406623',
    },
    {
      country: 'PHILIPPINES',
      address:
        'Embassy of India, 2-4th Floor, Corinthian Plaza Building, 121 Paseo de Roxas, Legaspi Village, Makati City 1229',
      phone: 'Tel: 63-2-8439080',
      fax: 'Fax: 63-2-8405120',
    },
    {
      country: 'POLAND',
      address: 'Embassy of India, ul. Rejtana 15, 02-516, Warsaw',
      phone: 'Tel: 48-22-8498990/8498000',
      fax: 'Fax: 48-22-8490280',
    },
    {
      country: 'PORTUGAL',
      address: 'Embassy of India, Rua Pero da Covilha 16, 1400-297, Lisbon',
      phone: 'Tel: 351-21-3012501/02/03',
      fax: 'Fax: 351-21-3012503',
    },
    {
      country: 'QATAR',
      address: 'Embassy of India, 58, Al Jazira Al Arabiya Street (West Bay), P.O. Box 2788, Doha',
      phone: 'Tel: 974-44676723',
      fax: 'Fax: 974-44676812',
    },
    {
      country: 'ROMANIA',
      address: 'Embassy of India, Strada Dimitrie Cantemir, No. 6-8, Sector 4, Bucharest, 040231',
      phone: 'Tel: 40-21-3360025/3360028',
      fax: 'Fax: 40-21-3360028',
    },
    {
      country: 'RUSSIA',
      address: 'Embassy of India, Ulitsa Obukha 6-8, Moscow - 109017',
      phone: 'Tel: 7-495-7832535',
      fax: 'Fax: 7-495-9165492',
    },
    {
      country: 'SAUDI ARABIA',
      address: 'Embassy of India, Diplomatic Quarters, P.O. Box 94387, Riyadh - 11693',
      phone: 'Tel: 966-1-4884144/4884884',
      fax: 'Fax: 966-1-4884850',
    },
    {
      country: 'SINGAPORE',
      address: 'High Commission of India, 31 Grange Road, Singapore - 239702',
      phone: 'Tel: 65-67376777',
      fax: 'Fax: 65-67326909',
    },
    {
      country: 'SOUTH AFRICA',
      address: 'High Commission of India, P.O. Box 40216, Arcadia, Pretoria - 0007',
      phone: 'Tel: 27-12-3420392/93',
      fax: 'Fax: 27-12-3420318',
    },
    {
      country: 'SPAIN',
      address: 'Embassy of India, Avenida Pio XII, 30-32, 28016, Madrid',
      phone: 'Tel: 34-91-3450406',
      fax: 'Fax: 34-91-3456065',
    },
    {
      country: 'SRI LANKA',
      address: 'High Commission of India, 36-38, Galle Road, Colombo - 3',
      phone: 'Tel: 94-11-2327587',
      fax: 'Fax: 94-11-2446403',
    },
    {
      country: 'SWEDEN',
      address: 'Embassy of India, Adolf Fredriks Kyrkogata 12, 3rd Floor, S-111 37, Stockholm',
      phone: 'Tel: 46-8-107008',
      fax: 'Fax: 46-8-247505',
    },
    {
      country: 'SWITZERLAND',
      address: 'Embassy of India, Kirchenfeldstrasse 28, 3005, Berne',
      phone: 'Tel: 41-31-3511110',
      fax: 'Fax: 41-31-3511906',
    },
    {
      country: 'SYRIA',
      address: 'Embassy of India, Malki, Abu Rumaneh, Al-Jalaa Street, P.O. Box 3413, Damascus',
      phone: 'Tel: 963-11-3739706/3739707',
      fax: 'Fax: 963-11-3735296',
    },
    {
      country: 'TANZANIA',
      address:
        'High Commission of India, Plot No. 1588, Lugalo Road, Upanga, P.O. Box 2684, Dar-es-Salaam',
      phone: 'Tel: 255-22-2119476/2116323',
      fax: 'Fax: 255-22-2116360',
    },
    {
      country: 'THAILAND',
      address: 'Embassy of India, 46 Soi Prasarnmit (Soi 23), Sukhumvit Road, Bangkok - 10110',
      phone: 'Tel: 66-2-2580300/2580306',
      fax: 'Fax: 66-2-2584627',
    },
    {
      country: 'TUNISIA',
      address: 'Embassy of India, 25, Rue du 1er Juin, Mutuelle Ville, 1002, Tunis',
      phone: 'Tel: 216-71-792775',
      fax: 'Fax: 216-71-791556',
    },
    {
      country: 'TURKEY',
      address: 'Embassy of India, Cinnah Caddesi No. 77A, 06690, Cankaya, Ankara',
      phone: 'Tel: 90-312-4382195/4382196',
      fax: 'Fax: 90-312-4382065',
    },
    {
      country: 'UGANDA',
      address: 'High Commission of India, 11 Kyadondo Road, P.O. Box 7040, Kampala',
      phone: 'Tel: 256-414-258928/258929',
      fax: 'Fax: 256-414-258930',
    },
    {
      country: 'UKRAINE',
      address: 'Embassy of India, Tereschenkivska Street 4, Kiev - 01004',
      phone: 'Tel: 380-44-4684670',
      fax: 'Fax: 380-44-4628168',
    },
    {
      country: 'UNITED ARAB EMIRATES',
      address: 'Embassy of India, P.O. Box 4090, Abu Dhabi',
      phone: 'Tel: 971-2-4492700',
      fax: 'Fax: 971-2-4445867',
    },
    {
      country: 'UNITED KINGDOM',
      address: 'High Commission of India, India House, Aldwych, London WC2B 4NA',
      phone: 'Tel: 44-20-78368484',
      fax: 'Fax: 44-20-78368331',
    },
    {
      country: 'USA',
      address: 'Embassy of India, 2107 Massachusetts Avenue, N.W., Washington D.C. 20008',
      phone: 'Tel: 1-202-9397000',
      fax: 'Fax: 1-202-2654351',
    },
    {
      country: 'UZBEKISTAN',
      address: 'Embassy of India, 15-A, Abdulla Kodiriy Street, Tashkent - 700000',
      phone: 'Tel: 998-71-2334300',
      fax: 'Fax: 998-71-2334277',
    },
    {
      country: 'VENEZUELA',
      address:
        'Embassy of India, Quinta Tara, Avenida Los Samanes, con 7a Transversal, Altamira, Caracas - 1062',
      phone: 'Tel: 58-212-2647668/2634569',
      fax: 'Fax: 58-212-2616069',
    },
    {
      country: 'VIETNAM',
      address: 'Embassy of India, 58-60 Tran Hung Dao Street, Hoan Kiem District, Hanoi',
      phone: 'Tel: 84-4-38244989/38244990',
      fax: 'Fax: 84-4-38244998',
    },
    {
      country: 'YEMEN',
      address: "Embassy of India, 36 Haddah Road, Sana'a",
      phone: 'Tel: 967-1-413873/414874',
      fax: 'Fax: 967-1-413872',
    },
    {
      country: 'ZAMBIA',
      address: 'High Commission of India, 1 Pandit Nehru Road, P.O. Box 32111, Lusaka',
      phone: 'Tel: 260-211-253463/253464',
      fax: 'Fax: 260-211-254398',
    },
    {
      country: 'ZIMBABWE',
      address: 'High Commission of India, 11 Natal Road, Belgravia, P.O. Box 4620, Harare',
      phone: 'Tel: 263-4-795955/795956',
      fax: 'Fax: 263-4-795956',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header Bar */}
      <div className="w-full h-2 bg-orange-500"></div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            <button
              onClick={() => router.push('/')}
              className="hover:text-orange-500 transition-colors"
            >
              Home
            </button>
            {' » '}
            <button
              onClick={() => router.push('/travel-guide/travel-toolkit')}
              className="hover:text-orange-500 transition-colors"
            >
              Travel Tool Kit
            </button>
            {' » '}
            <span className="text-gray-900">Indian Embassies (List)</span>
          </p>
        </div>

        {/* Page Title */}
        <h1
          className="text-3xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: theme.typography.fontFamily.bold }}
        >
          Indian Embassies
        </h1>

        {/* Embassies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {embassies.map((embassy, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h2
                className="text-base font-bold text-gray-900 mb-2"
                style={{ fontFamily: theme.typography.fontFamily.bold }}
              >
                {embassy.country}
              </h2>
              <p
                className="text-sm text-gray-700 mb-1"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {embassy.address}
              </p>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {embassy.phone}
              </p>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {embassy.fax}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndianEmbassies;

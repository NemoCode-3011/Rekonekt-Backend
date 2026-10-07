// Everything about the Benin exhibition lives in this one file.
// Edit the text freely. Fill in the image fields when you have images:
//   image: { url: "https://...", credit: "British Museum", license: "CC BY-NC-SA 4.0" }
// Empty urls are skipped, so you can run the seed now and add images later.

const noImage = { url: "", credit: "", license: "" };

export const benin = {
  exhibition: {
    title: "The Benin Empire",
    slug: "the-benin-empire",
    subtitle: "Power, art and the long road to restitution",
    description:
      "The Kingdom of Benin, in what is now Edo State, Nigeria, was one of West Africa's most powerful states. By tradition it dates from about 1180. Its court produced remarkable works in brass, ivory and coral until British forces captured Benin City in 1897 and took thousands of objects. This exhibition follows the kingdom's rise, its art, its fall, and the ongoing effort to bring its treasures home.",
    startDate: "1180-01-01",
    image: {
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzpXKTjhoIYpb9oqi0yuRQ0MXlTNNcRz490dWboIATok1k2A7gAzYUOVmvHgOm29mwBYwDcIJEwVsQOmAMGWua9kKSnIrb8ZaPJYKbUnO7Z259dBTNqWdX3dDTDczzf8VC9Xmk9q_RJU0/s1600/1603943159413089-1.png",
      credit: "British Museum",
      license: "CC BY-NC-SA 4.0",
    },
  },

  sections: [
    {
      key: "kingdom",
      title: "A Kingdom Takes Shape",
      slug: "a-kingdom-takes-shape",
      introduction:
        "By tradition the Benin kingdom dates from about 1180. Over the following centuries its rulers, above all Oba Ewuare in the fifteenth century, built a walled capital, a powerful court and a lasting tradition of royal art.",
      image: {
        url: "https://i.guim.co.uk/img/media/e0fd6147a67600c3bfa00ad8b0761b8b5c9a57d1/43_198_1101_660/master/1101.jpg?width=1300&dpr=2&s=none&crop=none",
        credit: "Trustees of the British Museum",
        license: "CC BY-NC-SA 4.0",
      }, // becomes the chapter's hero image
    },
    {
      key: "court",
      title: "Court, Craft and Contact",
      slug: "court-craft-and-contact",
      introduction:
        "Brass and ivory work was central to the court of the Oba. Guilds of casters made plaques, heads and figures that recorded rulers, ceremonies and, from the late fifteenth century, contact with Portuguese traders.",
      image: {
        url: "https://smarthistory.org/wp-content/uploads/2020/01/benin2.jpg",
        credit:
          "Steven Zucker / Smarthistory (Object courtesy of Museum of Fine Arts, Boston)",
        license: "CC BY-NC-SA 4.0",
      },
    },
    {
      key: "fall",
      title: "The Fall of Benin",
      slug: "the-fall-of-benin",
      introduction:
        "In January 1897 a British mission was attacked near Gwato. A month later British forces captured Benin City. Accounts of why it happened differ, so this chapter sets out what is documented.",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Looted_objects_from_the_Benin_Punative_Raid%2C_1897.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20170308201330",
        credit:
          "Unknown Author / British Museum Collection (via Wikimedia Commons)",
        license: "Public Domain",
      },
    },
    {
      key: "scattered",
      title: "Scattered Across the World",
      slug: "scattered-across-the-world",
      introduction:
        "After the city fell, thousands of objects were taken, sold in London and dispersed to museums and collectors in Europe and North America.",
      image: {
        url: "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/06/24/17/benin-bronzes-british-museum.jpg?quality=75&width=1250&crop=3%3A2%2Csmart&auto=webp",
        credit: " Leon Neal / Getty Images via The Independent.",
        license:
          "Used under non-commercial educational fair use. All rights reserved.",
      },
    },
    {
      key: "return",
      title: "The Long Return",
      slug: "the-long-return",
      introduction:
        "Since 2022, museums in Germany, the United Kingdom, the Netherlands and the United States have agreed to return or transfer ownership of Benin objects. Questions of ownership, custody and the largest collections remain unresolved.",
      image: {
        url: "https://media.npr.org/assets/img/2022/12/21/ap22354541824412-fcd0e2443b2e7b8aa209fdc22cf3ea9ebead4a4b.jpg?s=1200&c=85&f=webp",
        credit:
          "Restitution Ceremony of Benin Bronzes in Abuja (December 20, 2022). Credit: Olamikan Gbemiga / Associated Press.",
        license: "All Rights Reserved / Editorial Use Only.",
      },
    },
  ],

  people: [
    {
      key: "ewuare",
      name: "Oba Ewuare the Great",
      slug: "oba-ewuare-the-great",
      description:
        "Twelfth Oba of Benin, who reigned from about 1440 to 1473. Oral tradition credits him with many military victories, with rebuilding Benin City with walls, moats and wide streets, and with strengthening royal patronage of the bronze-casting guilds. He is remembered as one of the greatest rulers in Benin's history.",
      image: {
        url: "https://adf-magazine.com/wp-content/uploads/2023/12/Flashback_DP-25381-001_CMYK.jpg",
        credit:
          "The Metropolitan Museum of Art, New York (Bequest of Alice K. Bache, 1977)",
        license: "Public Domain (CC0 1.0)",
      },
    },
    {
      key: "ovonramwen",
      name: "Oba Ovonramwen",
      slug: "oba-ovonramwen",
      description:
        "The last independent Oba of Benin, who reigned from 1888 until British forces captured Benin City in 1897. He was captured, tried and exiled to Calabar, where he died in January 1914. He is remembered as a symbol of resistance to colonial conquest.",
      image: {
        url: "https://scontent.fiba2-1.fna.fbcdn.net/v/t39.30808-6/511261269_1118383016987395_2044706125737790835_n.jpg?stp=dst-jpg_tt6&cstp=mx1080x804&ctp=s720x720&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=AhlZxoPEwygQ7kNvwEniomE&_nc_oc=AdoJ3bw4jcuxfz6RSA48SEyTbo-JF-NAQcrJFZGVWCWKXxB6Dssqpwr5IYYjmSllsyg&_nc_zt=23&_nc_ht=scontent.fiba2-1.fna&_nc_gid=sV63wlWG0eGY1LIPuFH-Yw&_nc_ss=78289&oh=00_AQNlCn-MNz5_afEUUc8GRtpCyBig9UhUlaHIWcx_B7hdrw&oe=6ACC071D",
        credit:
          "Jonathan Adagogo Green / British Museum Collection (via ASIRI Magazine)",
        license: "Public Domain",
      },
    },
    {
      key: "rawson",
      name: "Rear-Admiral Sir Harry Rawson",
      slug: "rear-admiral-sir-harry-rawson",
      description:
        "British naval officer (1843 to 1910) who commanded the 1897 expedition that captured Benin City. After the city fell, objects seized by British forces were sold at auction in London and dispersed to museums around the world.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Portrait_of_Admiral_Sir_Harry_Rawson%2C_Sydney%2C_c._1902.jpg/500px-Portrait_of_Admiral_Sir_Harry_Rawson%2C_Sydney%2C_c._1902.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        credit:
          "Freeman Brothers Studio / State Library of New South Wales (via Wikimedia Commons)",
        license: "Public Domain",
      },
    },
    {
      key: "phillips",
      name: "James Robert Phillips",
      slug: "james-robert-phillips",
      description:
        "British Acting Consul-General of the Niger Coast Protectorate (1863 to 1897). In January 1897 he led a party toward Benin City that was attacked near Gwato. Phillips and six other Europeans were killed, and two survivors escaped. Britain used his death to justify the expedition that followed a month later.",
      deathDate: "1897-01-04",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/en/4/48/Consul_General_J._R._Phillips.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail_unscaled",
        credit: "Wikipedia / Wikimedia Commons",
        license: "Public Domain",
      },
    },
  ],

  // Palace and Igun Street use the city's coordinates for now.
  // Replace them with exact ones (right-click the spot in Google Maps).
  places: [
    {
      key: "benin-city",
      name: "Benin City",
      description:
        "Capital of the Benin Empire and today the capital of Edo State in southern Nigeria. The historic city was surrounded by walls and moats, with the Oba's palace at its centre and craft guilds organised in dedicated quarters.",
      latitude: 6.3381,
      longitude: 5.6258,
      image: {
        url: "https://i0.wp.com/panafrocore.com/wp-content/uploads/2024/03/GGzu6YDXoAAHyYz.jpeg?w=640&ssl=1",
        credit: "Francis Moore / Alamy",
        license: "Public Domain",
      },
    },
    {
      key: "palace",
      name: "Royal Palace of the Oba of Benin",
      description:
        "The administrative and religious centre of the Benin kingdom, in the heart of Benin City. By tradition the palace was established at its present site in the thirteenth century. It was damaged in 1897 and rebuilt, and remains the residence of the Oba of Benin, Ewuare II, who was crowned in 2016.",
      latitude: 6.3323,
      longitude: 5.6202,
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Royal_Palace_of_the_Oba_of_Benin_cropped.jpg/500px-Royal_Palace_of_the_Oba_of_Benin_cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        credit: "Kelechukwu Ajoku",
        license: "CC BY-SA 4.0",
      },
    },
    {
      key: "igun",
      name: "Igun Street",
      description:
        "The historic quarter of Benin City where hereditary guilds of brass casters have worked for centuries using the lost-wax technique. Casters on the street still produce traditional and contemporary work.",
      latitude: 6.34,
      longitude: 5.6335,
      image: {
        url: "https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/14D9B/production/_104730458_gettyimages-549406563.jpg.webp",
        credit: "Markus Matzel / ullstein bild via Getty Images",
        license: "Rights-managed / Getty Images Standard Editorial License ",
      },
    },
    {
      key: "british-museum",
      name: "The British Museum",
      description:
        "The London museum holds about 900 Benin objects, the largest single collection outside Nigeria. It says the British Museum Act 1963 restricts it from permanently transferring objects out of its collection, and it has not returned any of its Benin objects.",
      latitude: 51.5194,
      longitude: -0.127,
      image: {
        url: "https://smarthistory.org/wp-content/uploads/2023/04/wall-of-plaques-copy-1536x864.jpg",
        credit:
          "Steven Zucker / Smarthistory (Object courtesy of the British Museum)",
        license: "CC BY-NC-SA 4.0",
      },
    },
  ],

  events: [
    {
      key: "walls",
      section: "kingdom",
      title: "The Walls of Benin",
      slug: "the-walls-of-benin",
      dateDisplay: "c. 700 to 1400 AD",
      description:
        "Benin City was surrounded by a system of earthen walls and moats. Together with earthworks across the surrounding region they form one of the longest earthwork systems in the world. In the 1970s the archaeologist Patrick Darling estimated the whole network at about 16,000 km, a figure recorded by Guinness World Records. The inner city walls were a smaller part of this network, and estimates vary.",
      places: ["benin-city"],
      image: {
        url: "https://disappointedtourist.org/wp-content/uploads/2024/02/102CR-2048x1536.jpg",
        credit:
          "Ellen Harvey / Photograph by Etienne Frossard (via disappointedtourist.org)",
        license:
          "Copyright © Ellen Harvey. All rights reserved. The digital file is intended strictly for educational, research, and non-commercial documentation of the project. Any commercial reproduction requires explicit permission from the artist.",
      },
    },
    {
      key: "ewuare-reign",
      section: "kingdom",
      title: "The Reign of Oba Ewuare the Great",
      slug: "the-reign-of-oba-ewuare-the-great",
      eventDate: "1440-01-01",
      dateDisplay: "c. 1440 to 1473",
      description:
        "Ewuare's reign is remembered as Benin's golden age: military expansion, the rebuilding of Benin City and royal patronage of the bronze-casting guilds.",
      people: ["ewuare"],
      places: ["benin-city"],
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Oba_Ewuare_I%2C_Benin_Bronzes%2C_Horniman_Museum_4_%28cropped%29.jpg/500px-Oba_Ewuare_I%2C_Benin_Bronzes%2C_Horniman_Museum_4_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        credit: "Photograph by Mike Peel",
        license:
          "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
      },
    },
    {
      key: "portuguese",
      section: "court",
      title: "First Portuguese Contact",
      slug: "first-portuguese-contact",
      eventDate: "1485-01-01",
      dateDisplay: "c. 1485",
      description:
        "Portuguese traders reached Benin in the late fifteenth century. They brought brass manillas, which were used as currency and as raw material for casting, and Portuguese figures appear on Benin plaques.",
      places: ["benin-city"],
      image: {
        url: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/316490/2316086/main-image licence and credit",
        credit:
          " Gift of Mr. and Mrs. Klaus G. Perls, 1991 / Photograph courtesy of The Metropolitan Museum of Art",
        license:
          "Creative Commons Zero (CC0 1.0 Universal / Public Domain Dedication)",
      },
    },
    {
      key: "attack",
      section: "fall",
      title: "The Attack Near Gwato",
      slug: "the-attack-near-gwato",
      eventDate: "1897-01-04",
      dateDisplay: "4 January 1897",
      description:
        "A British mission led by James Phillips was attacked on its way to Benin City. Phillips and six other Europeans were killed, and two survivors escaped. British accounts call it the Benin Massacre. Britain used the incident to justify a military expedition.",
      people: ["phillips"],
      image: {
        url: "https://c7.alamy.com/comp/EDRX37/the-advance-on-benin-map-showing-the-route-of-the-expedition-1897-EDRX37.jpg",
        credit:
          "Penta Springs Limited / Artokoloro / Alamy Stock Photo (Image ID: EDRX37). Original work by British military cartographers, 1897.",
        license: "Public Domain historical work.",
      },
    },
    {
      key: "expedition",
      section: "fall",
      title: "British Forces Capture Benin City",
      slug: "british-forces-capture-benin-city",
      eventDate: "1897-02-09",
      dateDisplay: "9 to 18 February 1897",
      description:
        "A British force of about 1,400 soldiers and 2,500 carriers, commanded by Rear-Admiral Sir Harry Rawson, captured Benin City after nine days. The city was looted and much of it burned. Oba Ovonramwen was later captured, tried and exiled to Calabar.",
      people: ["rawson", "ovonramwen"],
      places: ["benin-city"],
      image: {
        url: "https://beninexpedition120yearson.weebly.com/uploads/1/5/0/7/15075616/final-assault_orig.png",
        credit:
          'Fidelia Nimmons / Benin Expedition 120 Years On (beninexpedition120yearson.weebly.com). Original drawing titled "The Final Assault on Benin City" by an unidentified 1897 British military officer or press illustrator.',
        license:
          "Public Domain for the underlying 1897 historical illustration. The digital hosting site hosts its curated educational content under a Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license.",
      },
    },
    {
      key: "dispersal",
      section: "scattered",
      title: "The Objects Are Sold and Dispersed",
      slug: "the-objects-are-sold-and-dispersed",
      dateDisplay: "1897 onwards",
      description:
        "Objects taken from Benin were sold at auction in London and passed to museums and private collectors in Europe and North America. Estimates of how many were taken vary, but they run to thousands.",
      places: ["british-museum"],
      image: {
        url: "https://www.britishmuseum.org/sites/default/files/styles/uncropped_small/public/2024-05/Ivory_armlet_pair_750_529.jpg?itok=ClY2vwXN",
        credit:
          "© The Trustees of the British Museum. Benin ivory armlet pair, acquired following the 1897 Benin Expedition.",
        license:
          "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) for non-commercial educational use.",
      },
    },
    {
      key: "germany",
      section: "return",
      title: "Germany Returns Benin Objects",
      slug: "germany-returns-benin-objects",
      eventDate: "2022-12-20",
      dateDisplay: "20 December 2022",
      description:
        "In July 2022 Germany agreed to transfer ownership of more than 1,100 Benin objects held in its public museums to Nigeria. On 20 December 2022, at a ceremony in Abuja, the first 22 were physically handed over.",
      image: {
        url: "https://i.guim.co.uk/img/media/a05d83d4d2a4ab14e33a393dd9853b6ce6c15da6/0_113_4872_2924/master/4872.jpg?width=1300&dpr=2&s=none&crop=none",
        credit:
          "Kola Sulaimon / AFP / Getty Images / The Guardian (Image ID: a05d83d4d2a4ab14e33a393dd9853b6ce6c15da6). Displays German Foreign Minister Annalena Baerbock and her Nigerian counterpart Geoffrey Onyeama during the official handover ceremony of 21 returned Benin Bronzes in Abuja, December 20, 2022.",
        license:
          "Rights-Managed editorial license required from Agence France-Presse (AFP) or Getty Images for public reproduction. The image belongs to the master news photographic catalog hosted by The Guardian.",
      },
    },
    {
      key: "horniman-smithsonian",
      section: "return",
      title: "UK and US Museums Transfer Ownership",
      slug: "uk-and-us-museums-transfer-ownership",
      dateDisplay: "October to November 2022",
      description:
        "In 2022 the Horniman Museum in London transferred ownership of 72 Benin objects and the Smithsonian Institution transferred ownership of 29. A transfer of ownership does not always mean the objects have physically returned.",
      image: {
        url: "https://cdn.sanity.io/images/cxgd3urn/production/f0892e6014a57fd1dd3a7436413c86a0b5e05257-4000x2668.jpg?rect=1,0,3999,2668&w=1920&h=1281&q=85&fit=crop&auto=format",
        credit:
          "Joshua Bratt / PA Images via Getty Images / Horniman Museum and Gardens. Displays a historic 16th-century Benin Bronze plaque on exhibition during the official ownership transfer ceremony in London, November 28, 2022.",
        license:
          "Copyrighted by PA Images/Getty Images. Used under promotional and editorial distribution parameters by the Horniman Museum via their Sanity content architecture platform.",
      },
    },
    {
      key: "decree",
      section: "return",
      title: "The 2023 Ownership Decree",
      slug: "the-2023-ownership-decree",
      dateDisplay: "March 2023",
      description:
        "In March 2023 President Muhammadu Buhari recognised the Oba of Benin as the owner of returned bronzes. The declaration caused confusion for institutions preparing returns. A later agreement between Nigeria's National Commission for Museums and Monuments and the Oba's Palace allows the commission to manage returned objects on the Oba's behalf.",
      image: {
        url: "https://tlivemedia.com/wp-content/uploads/2023/03/IMG-20230329-WA0039.jpg",
        credit:
          "Lauretta Ojiesele / Tlivemedia. Displays President Muhammadu Buhari receiving the Oba of Benin, Omo N'Oba N'Edo Uku Akpolokpolo Ewuare II, in audience at the State House, Abuja on March 23, 2023.",
        license: "Copyrighted by Tlivemedia.",
      },
    },
    {
      key: "netherlands",
      section: "return",
      title: "The Netherlands Returns 119 Objects",
      slug: "the-netherlands-returns-119-objects",
      dateDisplay: "June 2025",
      description:
        "The Netherlands returned 119 Benin objects to Nigeria, one of the largest single returns so far.",
      image: {
        url: "https://dims.apnews.com/dims4/default/4daee7e/2147483647/strip/true/crop/8640x5760+0+0/resize/2880x1920!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F6b%2F2f%2F21fa536fd7f66052e04f668babfb%2F3548d72da48e443ab0113311c1ed5e99",
        credit:
          "Freek van den Bergh / AFP via Getty Images / Associated Press. Displays a glass case containing Benin Bronzes during the formal ownership transfer signing ceremony between Dutch and Nigerian officials at the Wereldmuseum in Leiden, Netherlands, February 19, 2025.",
        license:
          "Rights-Managed editorial license required from Agence France-Presse (AFP) or Getty Images for public reproduction. The image is distributed under standard Associated Press (AP Photo) news syndication parameters.",
      },
    },
    {
      key: "cambridge",
      section: "return",
      title: "Cambridge Transfers Ownership of 116 Objects",
      slug: "cambridge-transfers-ownership-of-116-objects",
      eventDate: "2026-02-08",
      dateDisplay: "8 February 2026",
      description:
        "The University of Cambridge's Museum of Archaeology and Anthropology transferred legal ownership of 116 Benin objects to Nigeria's National Commission for Museums and Monuments. Physical transfer of most objects is to be arranged in due course, and a small number remain in Cambridge on loan.",
      image: {
        url: "https://thejournalnigeria.com/wp-content/uploads/2026/02/IMG_20260209_132143.jpg",
        credit: "The Guardian",
        license: "Copyrighted / Editorial Use Only",
      },
    },
  ],

  // Artifacts belong to the "court" chapter. Place = the Royal Palace.
  artifacts: [
    {
      key: "plaque",
      section: "court",
      place: "palace",
      title: "Benin Bronze Plaque",
      slug: "benin-bronze-plaque",
      artifactType: "Brass relief plaque",
      dateDisplay: "16th to 17th century",
      description:
        "Rectangular relief plaques once decorated the wooden pillars of the Oba's palace. Arranged in rows, they formed narrative friezes showing court ceremonies, warriors and Portuguese traders. They were made by lost-wax casting.",
      historicalContext:
        "Plaques of this type are held today in the British Museum, in Berlin and in other collections.",
      image: {
        url: "https://www.art-prints-on-demand.com/kunst/noartist/a/afinebeninbronzeplaqueinh_hi.jpg",
        credit: "Christie's / Art-Prints-On-Demand.com",
        license:
          "Public Domain (Historical artwork); website terms apply for the specific digital print file usage",
      },
    },
    {
      key: "head",
      section: "court",
      place: "palace",
      title: "Commemorative Head of an Oba",
      slug: "commemorative-head-of-an-oba",
      artifactType: "Brass head",
      dateDisplay: "16th to 18th century",
      description:
        "Cast brass heads honoured deceased Obas and were placed on royal ancestral altars. This naturalistic form, often with a coral-bead collar, is one of the best-known Benin art forms.",
      historicalContext:
        "Examples are held in the British Museum, in Berlin and at the Smithsonian.",
      image: {
        url: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/312290/674960/main-image",
        credit:
          "The Metropolitan Museum of Art, New York, The Michael C. Rockefeller Wing",
        license: "CC0 1.0 Universal (Public Domain Dedication) / Open Access",
      },
    },
    {
      key: "commander",
      section: "court",
      place: "palace",
      title: "Figure of a Military Commander",
      slug: "figure-of-a-military-commander",
      artifactType: "Brass figure",
      dateDisplay: "17th to 18th century",
      description:
        "A standing figure of a military commander holding a sword or ceremonial staff, shown with coral beads and a leopard-tooth necklace. Figures like this commemorated important court officials and were displayed in the palace or in shrines.",
      historicalContext:
        "Examples are held in the British Museum, in Berlin and at the Horniman Museum.",
      image: {
        url: "https://scontent.fiba2-3.fna.fbcdn.net/v/t39.30808-6/485799612_685268967355860_7580738059074421573_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s590x590&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=uHyL3w8nYBYQ7kNvwF6wjFw&_nc_oc=AdqHU80HsGCu6F_Oiv6WE8PEiJa0G-1oqq-epQjGUUW7k3UQSAPpk1fAXTrnLYOGQiY&_nc_zt=23&_nc_ht=scontent.fiba2-3.fna&_nc_gid=E-cGzNmCH4-ZCYuQW7MaRw&_nc_ss=78289&oh=00_AQODIwFvBmV4nZdkOLwMOUS4EKn11KTAAhHrp8y8a4JyVg&oe=6ACC4C86",
        credit:
          "Historical Royal Court Art of the Benin Empire / Photo distributed via social network hosting",
        license:
          "Public Domain (Historical artwork); educational / personal fair use applies to the specific digital image file",
      },
    },
    {
      key: "portuguese-plaque",
      section: "court",
      place: "palace",
      title: "Portuguese Trader Plaque",
      slug: "portuguese-trader-plaque",
      artifactType: "Brass relief plaque",
      dateDisplay: "16th century",
      description:
        "A relief plaque showing a Portuguese trader in European dress holding a manilla, the brass ring used as currency and as raw material for casting. It records the early European trade contact that began in the late fifteenth century.",
      historicalContext:
        "Examples are held in the British Museum and in Berlin.",
      image: {
        url: "https://scontent.fiba2-2.fna.fbcdn.net/v/t39.30808-6/650250675_963731239509630_73098909641207100_n.jpg?stp=dst-jpg_tt6&cstp=mx1286x2000&ctp=p526x296&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=LK1w21PwmJMQ7kNvwGhOpvS&_nc_oc=Adq7t5Ei34Fze8q9E49j1i70fSy8Q6lgvs1AdHmwyGhpG7C23IAjxBU2oZS8dD_nKHE&_nc_zt=23&_nc_ht=scontent.fiba2-2.fna&_nc_gid=qcWAIxsexlCGjMUVCWnEsw&_nc_ss=7b289&oh=00_AQMlcfgQ6LmFQ2oyLvOVo8a3z35emeUS_Z44GYUPiHjUvg&oe=6ACC402B",
        credit:
          "The Metropolitan Museum of Art, New York, The Michael C. Rockefeller Wing",
        license: "CC0 1.0 Universal (Public Domain Dedication) / Open Access",
      },
    },
  ],

  // Chapters (sections) link to the people and places shown in that chapter.
  sectionPeople: {
    kingdom: ["ewuare"],
    fall: ["phillips", "rawson", "ovonramwen"],
  },
  sectionPlaces: {
    kingdom: ["benin-city", "palace"],
    court: ["igun", "palace"],
    fall: ["benin-city"],
    scattered: ["british-museum"],
  },

  // type: where you found it. note: shown with the source to explain its limits.
  sources: [
    {
      key: "britannica-benin",
      title: "Benin - historical kingdom, West Africa",
      publication: "Encyclopaedia Britannica",
      sourceType: "encyclopedia",
      url: "https://www.britannica.com/place/Benin-historical-kingdom-West-Africa",
    },
    {
      key: "khan-bronzes",
      title: "The Benin 'Bronzes': a story of violence, theft, and artistry",
      publication: "Khan Academy",
      sourceType: "educational",
      url: "https://www.khanacademy.org/humanities/art-africa/west-africa/nigeria/a/the-benin-bronzes-a-story-of-violence-theft-and-artistry",
    },
    {
      key: "wiki-bronzes",
      title: "Benin Bronzes",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Benin_bronzes",
      note: "Wikipedia is a general reference. Check its own citations before relying on it.",
    },
    {
      key: "bbc-germany",
      title: "Benin Bronzes: Germany returns looted artefacts to Nigeria",
      publication: "BBC News",
      sourceType: "news",
      url: "https://www.bbc.com/news/world-africa-64038626",
      citation: "BBC News, December 2022.",
    },
    {
      key: "ancient-origins-walls",
      title:
        "The Walls of Benin: Four Times Longer Than The Great Wall of China!",
      publication: "Ancient Origins",
      sourceType: "magazine",
      url: "https://www.ancient-origins.net/ancient-places-africa/walls-benin-0016222",
      citation: "Ancient Origins, December 2021.",
      note: "Popular history magazine. Used for context only.",
    },
    {
      key: "archaeology-worlds",
      title: "Ancient Walls of Benin: Longer Than the Great Wall of China",
      publication: "Archaeology Worlds",
      sourceType: "magazine",
      url: "https://archaeologyworlds.com/ancient-walls-benin-longer-great-wall-china/",
      citation: "Archaeology Worlds, September 2024.",
      note: "Popular history site. Used for context only.",
    },
    {
      key: "dutum",
      title: "What makes the Oba of Benin Royal Palace unique",
      publication: "Dutum Group",
      sourceType: "web",
      url: "https://dutumgroup.com/what-makes-the-oba-of-benin-royal-palace-unique/",
      citation: "Dutum Group, 2025.",
      note: "Non-specialist source. Used for context only.",
    },
    {
      key: "ecoi",
      title: "The Oba of Benin: rituals and practices",
      publication: "Immigration and Refugee Board of Canada",
      sourceType: "government report",
      url: "https://www.ecoi.net/en/document/1146102.html",
      citation: "Immigration and Refugee Board of Canada, February 2002.",
    },
    {
      key: "edoworld",
      title: "Benin kingdom Historical Sites",
      publication: "Edoworld.net",
      sourceType: "web",
      url: "http://www.edoworld.net/Benin_kingdom_Historical_Sites.html",
      note: "Community website. Used for context only.",
    },
    {
      key: "blueprint-igun",
      title: "The untold story of Igun, Nigeria's centre of bronze casting",
      publication: "Blueprint",
      sourceType: "news",
      url: "https://blueprint.ng/the-untold-story-of-igun-nigerias-centre-of-bronze-casting/",
      citation: "Blueprint, September 2021.",
    },
    {
      key: "britannica-ewuare",
      title: "Ewuare the Great",
      publication: "Encyclopaedia Britannica",
      sourceType: "encyclopedia",
      url: "https://www.britannica.com/biography/Ewuare-the-Great",
    },
    {
      key: "wiki-ewuare",
      title: "Ewuare",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Ewuare",
      note: "Wikipedia is a general reference. Check its own citations before relying on it.",
    },
    {
      key: "barbados-ewuare",
      title: "#AfricanAwarenessMonth - Ewuare the Great - King of Benin",
      publication: "Barbados Today",
      sourceType: "news",
      url: "https://barbadostoday.bb/2023/02/18/ewuare-the-great-king-of-benin/",
      citation: "Barbados Today, February 2023.",
    },
    {
      key: "africarebirth",
      title:
        "What Are the Benin Bronzes? Inside the Royal Art of the Kingdom of Benin",
      publication: "Africa Rebirth",
      sourceType: "web",
      url: "https://www.africarebirth.com/what-are-the-benin-bronzes-inside-the-royal-art-of-the-kingdom-of-benin/",
      citation: "Africa Rebirth, April 2026.",
      note: "General-interest site. Used for context only.",
    },
    {
      key: "plos-brass",
      title:
        "German brass for Benin Bronzes: Geochemical analysis insights into the early Atlantic trade",
      publication: "PLOS ONE",
      sourceType: "academic",
      url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0283415",
      citation: "PLOS ONE, April 2023.",
    },
    {
      key: "british-museum",
      title: "Benin Bronzes",
      publication: "The British Museum",
      sourceType: "museum",
      url: "https://www.britishmuseum.org/about-us/british-museum-story/contested-objects-collection/benin-bronzes",
      note: "The museum is a party to the restitution debate.",
    },
    {
      key: "met-brilliance",
      title: "Recovering the Brilliance of a Benin Bronze",
      publication: "The Metropolitan Museum of Art",
      sourceType: "museum",
      url: "https://www.metmuseum.org/essays/recovering-benin-bronze",
      citation: "The Metropolitan Museum of Art, August 2022.",
    },
    {
      key: "artnet-casters",
      title:
        "The Benin Bronzes Aren't Just Ancient History. Meet the Contemporary Casters Who Are Still Making Them Today",
      publication: "Artnet News",
      sourceType: "news",
      url: "https://news.artnet.com/art-world/barnaby-philips-benin-1967703",
      citation: "Artnet News, May 2021.",
    },
    {
      key: "wiki-massacre",
      title: "Benin Massacre",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Benin_Massacre",
      note: "Wikipedia is a general reference. 'Massacre' is the British name for the event.",
    },
    {
      key: "wiki-phillips",
      title: "James Robert Phillips",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/James_Robert_Phillips",
      note: "Wikipedia is a general reference. Check its own citations before relying on it.",
    },
    {
      key: "dw-germany",
      title: "Germany returns Benin Bronzes to Nigeria",
      publication: "DW",
      sourceType: "news",
      url: "https://www.dw.com/en/germany-returns-benin-bronzes-to-nigeria/a-62323704",
      citation: "DW, July 2022.",
    },
    {
      key: "euronews-nl",
      title:
        "Netherlands returns more than 100 Benin Bronzes looted from Nigeria",
      publication: "Euronews",
      sourceType: "news",
      url: "https://www.euronews.com/2025/06/19/netherlands-returns-more-than-100-benin-bronzes-looted-from-nigeria",
      citation: "Euronews, June 2025.",
    },
    {
      key: "gov-nl",
      title: "Benin Bronzes from the Netherlands returning home to Nigeria",
      publication: "Government of the Netherlands",
      sourceType: "government",
      url: "https://www.government.nl/latest/news/2025/06/18/benin-bronzes-from-the-netherlands-returning-home-to-nigeria",
      citation: "Government of the Netherlands, June 2025.",
    },
    {
      key: "bbc-cambridge",
      title: "Looted African artefacts to be returned by Cambridge University",
      publication: "BBC News",
      sourceType: "news",
      url: "https://www.bbc.com/news/articles/c4g2l9j0ny1o",
      citation: "BBC News, February 2026.",
    },
    {
      key: "artnewspaper-cambridge",
      title: "Cambridge University to return 100 Benin Bronzes to Nigeria",
      publication: "The Art Newspaper",
      sourceType: "news",
      url: "https://www.theartnewspaper.com/2026/02/09/cambridge-university-return-100-benin-bronzes-nigeria",
      citation: "The Art Newspaper, 9 February 2026.",
    },
    {
      key: "horniman",
      title: "Horniman returns ownership of Benin Bronzes to Nigeria",
      publication: "Horniman Museum",
      sourceType: "museum",
      url: "https://www.horniman.ac.uk/news/horniman-returns-ownership-of-benin-bronzes-to-nigeria/",
      citation: "Horniman Museum, November 2022.",
    },
    {
      key: "smithsonian",
      title: "Smithsonian Transfers Ownership of Benin Bronzes to Nigeria",
      publication: "Smithsonian Institution",
      sourceType: "museum",
      url: "https://www.si.edu/newsdesk/releases/smithsonian-transfers-ownership-benin-bronzes-nigeria",
      citation: "Smithsonian Institution, October 2022.",
    },
    {
      key: "news-ab",
      title:
        "The Benin Bronzes after restitution: ownership, custody and what comes next",
      publication: "News-AB",
      sourceType: "web",
      url: "https://news-ab.com/en/topics/ngde-bronzes-2026/",
      citation: "News-AB, February 2026.",
      note: "Secondary source. Used for context only.",
    },

    // Added after checking the claims in the research:
    {
      key: "guinness-earthworks",
      title: "Longest earthworks of the pre-mechanical era",
      publication: "Guinness World Records",
      sourceType: "reference",
      url: "https://www.guinnessworldrecords.com/world-records/97959-longest-earthworks-of-the-pre-mechanical-era",
    },
    {
      key: "nasa-earthworks",
      title: "A Glimpse of History in Benin City",
      publication: "NASA Earth Observatory",
      sourceType: "government",
      url: "https://earthobservatory.nasa.gov/images/154894/a-glimpse-of-history-in-benin-city",
    },
    {
      key: "cambridge-release",
      title:
        "Cambridge University returns legal ownership of 116 Benin artefacts to Nigeria's National Commission for Museums and Monuments",
      publication: "University of Cambridge",
      sourceType: "press release",
      url: "https://www.cam.ac.uk/stories/benin-artefacts-return",
      citation: "University of Cambridge, 8 February 2026.",
    },
    {
      key: "npr-germany",
      title:
        "Germany returns looted artifacts to Nigeria to rectify a 'dark colonial history'",
      publication: "NPR",
      sourceType: "news",
      url: "https://www.wunc.org/2022-12-21/germany-returns-looted-artifacts-to-nigeria-to-rectify-a-dark-colonial-history",
      citation: "NPR, 21 December 2022.",
    },
  ],

  // Which sources back which item. Keys match the lists above.
  citations: {
    section: {
      kingdom: ["britannica-benin"],
      court: ["british-museum", "artnet-casters"],
      fall: ["khan-bronzes"],
      scattered: ["british-museum", "khan-bronzes"],
      return: ["news-ab", "artnewspaper-cambridge"],
    },
    person: {
      ewuare: ["britannica-ewuare", "wiki-ewuare", "barbados-ewuare"],
      ovonramwen: ["britannica-benin", "khan-bronzes", "wiki-bronzes"],
      rawson: ["khan-bronzes", "wiki-bronzes"],
      phillips: ["wiki-phillips", "khan-bronzes"],
    },
    place: {
      "benin-city": ["britannica-benin", "ancient-origins-walls"],
      palace: ["dutum", "ecoi", "edoworld"],
      igun: ["edoworld", "blueprint-igun", "africarebirth"],
      "british-museum": ["british-museum", "khan-bronzes", "wiki-bronzes"],
    },
    event: {
      walls: [
        "guinness-earthworks",
        "nasa-earthworks",
        "ancient-origins-walls",
        "archaeology-worlds",
      ],
      "ewuare-reign": ["britannica-ewuare", "wiki-ewuare"],
      portuguese: ["british-museum", "plos-brass", "africarebirth"],
      attack: ["wiki-massacre", "khan-bronzes"],
      expedition: ["khan-bronzes", "wiki-bronzes", "britannica-benin"],
      dispersal: ["british-museum", "khan-bronzes"],
      germany: ["bbc-germany", "dw-germany", "npr-germany"],
      "horniman-smithsonian": ["horniman", "smithsonian"],
      decree: ["artnewspaper-cambridge", "cambridge-release"],
      netherlands: ["euronews-nl", "gov-nl"],
      cambridge: [
        "cambridge-release",
        "artnewspaper-cambridge",
        "bbc-cambridge",
      ],
    },
    artifact: {
      plaque: ["british-museum", "met-brilliance"],
      head: ["britannica-benin", "british-museum", "met-brilliance"],
      commander: ["britannica-benin", "british-museum"],
      "portuguese-plaque": ["british-museum", "africarebirth", "plos-brass"],
    },
  },
};

// Everything about the Benin exhibition lives in this one file.
// Edit the text freely. Fill in the image fields when you have images:
//   image: { url: "https://...", credit: "British Museum", license: "CC BY-NC-SA 4.0" }
// Empty urls are skipped, so you can run the seed now and add images later.
// No image is used twice: an item without its own image is simply left without one.
//
// HOW THIS FILE IS ORGANISED (13 chapters, in the order visitors meet them):
//   Before the Oba > A Kingdom Takes Shape > Ewuare and the Warrior Kings >
//   The Sacred Court > Court, Craft and Contact > Trade, Faith and Diplomacy >
//   A Kingdom Under Strain > The Fall of Benin > Scattered Across the World >
//   Exile and Restoration > Asking for Them Back > The Long Return > Living Heritage
//
// RULES TO KEEP (the app depends on them):
//  1. Every event needs an eventDate (YYYY-MM-DD). Events are shown in date
//     order, and events without a date are shown LAST. The text people read is
//     dateDisplay; eventDate is only for sorting. For year-only dates we use
//     30 June so the year never shows one year early in other time zones.
//  2. A person's description: the FIRST paragraph is the short card in the
//     exhibition drawer. All paragraphs together are the full story on the
//     person's own page. Paragraphs are separated by a new line.
//  3. Places marked (approx.) have close but not exact coordinates.

const noImage = { url: "", credit: "", license: "" };

export const benin = {
  exhibition: {
    title: "The Benin Empire",
    slug: "the-benin-empire",
    subtitle: "Power, art and the long road home",
    description: "For more than seven centuries the Kingdom of Benin, in what is now Edo State, Nigeria, was one of West Africa's great states. Its Obas ruled from a walled capital, kept a court of chiefs, queen mothers and hereditary guilds, and turned brass, ivory and coral into a record of their history.\nThis exhibition follows that history from the Ogiso kings of tradition to the Oba dynasty, from the golden age of Ewuare and Esigie to the British conquest of 1897, and from the scattering of thousands of objects to the return still under way today, including the disputes about who should keep them. Where tradition and written records disagree, we say so.",
    startDate: "1100-06-30",
    image: {
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzpXKTjhoIYpb9oqi0yuRQ0MXlTNNcRz490dWboIATok1k2A7gAzYUOVmvHgOm29mwBYwDcIJEwVsQOmAMGWua9kKSnIrb8ZaPJYKbUnO7Z259dBTNqWdX3dDTDczzf8VC9Xmk9q_RJU0/s1600/1603943159413089-1.png",
      credit: "British Museum",
      license: "CC BY-NC-SA 4.0"
    },
    endDate: "2026-06-30"
  },
  sections: [
    {
      key: "origins",
      title: "Before the Oba",
      slug: "before-the-oba",
      introduction: "Long before the Obas, the Edo people lived in a land they called Igodomigodo, ruled by kings known as the Ogiso, the Kings of the Sky.\nOur knowledge of this age rests mostly on Edo oral tradition, set down in the twentieth century by Edo historians such as Chief Jacob Egharevba. Archaeology confirms that people were building and settling in the Benin area long before the Oba dynasty began, but it cannot confirm the names or the order of the Ogiso. Tradition is rich here, and it is also disputed, so this chapter reads it as tradition.\nThe story that matters most is how the Ogiso age ended, because it explains why the Edo came to see the Oba as both a new beginning and a return to something older.",
      image: noImage
    },
    {
      key: "kingdom",
      title: "A Kingdom Takes Shape",
      slug: "a-kingdom-takes-shape",
      introduction: "By tradition the Oba dynasty began about 1180, when Eweka I became the first Oba. Over the next three centuries a small kingdom grew into a walled city with a court, a priesthood of ancestors and a growing claim on its neighbours.\nTwo accounts of the dynasty's roots survive. One says the Edo chiefs invited Prince Oranmiyan of Ife to restore order, and that his son Eweka became the first Oba. The other says the dynasty descends from Prince Ekaladerhan, a son of the last Ogiso who was driven into exile. Both accounts tie Benin to Ife, and both are told with pride.\nThe great earthworks around Benin City, the hands of artisans from Ife and the first ambitious Obas belong to these centuries. Together they prepared the ground for the golden age that followed.",
      image: {
        url: "https://i.guim.co.uk/img/media/e0fd6147a67600c3bfa00ad8b0761b8b5c9a57d1/43_198_1101_660/master/1101.jpg?width=1300&dpr=2&s=none&crop=none",
        credit: "Trustees of the British Museum",
        license: "CC BY-NC-SA 4.0"
      }
    },
    {
      key: "warrior-kings",
      title: "Ewuare and the Warrior Kings",
      slug: "ewuare-and-the-warrior-kings",
      introduction: "In the fifteenth and sixteenth centuries Benin became an empire. Oba Ewuare the Great rebuilt the capital and reshaped the state, his son Ozolua carried the kingdom's wars far beyond its heartland, and Ozolua's son Esigie ruled at the moment Europeans first arrived.\nMuch of this story is carried by oral history, which credits these Obas with victories, reforms and festivals that written sources of the time can only partly confirm. Historians generally agree on the outline: a more powerful crown, a larger territory, a capital that visitors described as orderly and impressive.\nWomen also stand at the centre of this age. Queen Idia, the mother of Esigie, is remembered as a queen mother who went to war beside her son, and the title her son created for her, Iyoba, the Queen Mother, still exists today.",
      image: noImage
    },
    {
      key: "sacred-court",
      title: "The Sacred Court",
      slug: "the-sacred-court",
      introduction: "In Benin the Oba was more than a ruler. He stood between the living and the ancestors, and the whole kingdom's well-being was thought to depend on him.\nAround him stood three orders of chiefs: the Uzama, hereditary kingmakers who crowned the Oba; the Eghaevbo n'Ore, the town chiefs who ran the state; and the Eghaevbo n'Ogbe, the palace chiefs. Festivals such as Igue renewed the Oba's power each year, and altars to royal ancestors, decorated with cast heads and carved tusks, kept the dynasty present.\nThis chapter explains how that system worked, who held which office, and why the palace of the Oba mattered as much as the city that grew around it.",
      image: noImage
    },
    {
      key: "court",
      title: "Court, Craft and Contact",
      slug: "court-craft-and-contact",
      introduction: "Brass and ivory work was central to the court of the Oba. Hereditary guilds of casters and carvers made plaques, heads and figures that recorded rulers, ceremonies and, from the late fifteenth century, the arrival of Portuguese traders.\nThe guilds lived in quarters close to the palace and worked for the Oba. Their skills passed from parent to child, and the metal they used came, in part, from far away: European brass rings called manillas were melted down and cast again into Benin's own art.\nThe objects in this chapter were made to be seen in the palace, on altars and in shrines. They are best understood as the kingdom's archive in metal, not as decoration.",
      image: {
        url: "https://smarthistory.org/wp-content/uploads/2020/01/benin2.jpg",
        credit: "Steven Zucker / Smarthistory (Object courtesy of Museum of Fine Arts, Boston)",
        license: "CC BY-NC-SA 4.0"
      }
    },
    {
      key: "trade",
      title: "Trade, Faith and Diplomacy",
      slug: "trade-faith-and-diplomacy",
      introduction: "When Portuguese ships reached the coast in the 1480s, Benin met them as an equal. The Oba sent an ambassador to Lisbon, sold pepper, ivory and cloth, bought brass and coral, and allowed missionaries in on his own terms.\nThe trade in people was part of this story too, and it is not simple. Benin's Obas restricted the sale of male captives for long periods, yet women were sold, the kingdom's own wars produced captives, and the trade grew in the eighteenth century. Historians still debate how much the Oba controlled and how much he could not.\nThe relationship with Europe shaped Benin's art, its wealth and its politics for four hundred years, long before the events of 1897.",
      image: noImage
    },
    {
      key: "strain",
      title: "A Kingdom Under Strain",
      slug: "a-kingdom-under-strain",
      introduction: "After 1600 the Oba's role changed. He no longer led the army in person, and the chiefs gained influence. Succession disputes grew into a civil war that lasted from about 1689 to 1721 and left the capital badly damaged.\nThen Benin recovered. Oba Akenzua I and his son Eresoyen restored royal authority and the guilds, and the eighteenth century is remembered as a time of renewed wealth and a flowering of the arts.\nIn the nineteenth century, new pressures arrived: British traders on the coast, rivals on the rivers, and a colonial government that wanted open trade and no obstacles. When Ovonramwen became Oba in 1888, the stage for 1897 was already being set.",
      image: noImage
    },
    {
      key: "fall",
      title: "The Fall of Benin",
      slug: "the-fall-of-benin",
      introduction: "In January 1897 a British mission was attacked near Gwato. A month later British forces captured Benin City. Accounts of why it happened differ, so this chapter sets out what is documented.\nBritish sources call the attack on the mission the Benin Massacre and describe the expedition as a punishment. Edo accounts stress that the Oba's authority had been pressed for years, that the 1892 treaty was understood differently by each side, and that the city was burned and looted.\nWhat is not disputed is the result: the palace was destroyed, the Oba was captured and exiled, thousands of objects were taken, and a kingdom that had been independent for centuries came under colonial rule.",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Looted_objects_from_the_Benin_Punative_Raid%2C_1897.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20170308201330",
        credit: "Unknown Author / British Museum Collection (via Wikimedia Commons)",
        license: "Public Domain"
      }
    },
    {
      key: "scattered",
      title: "Scattered Across the World",
      slug: "scattered-across-the-world",
      introduction: "After the city fell, thousands of objects were taken, sold in London and dispersed to museums and collectors in Europe and North America.\nEstimates of how many were taken vary. Scholars put the figure at more than five thousand objects, including plaques, heads, ivory carvings, coral regalia and everyday items. Some were sold to cover the costs of the expedition. Others were given as gifts or kept by officers.\nWithin a few years, pieces made for the Oba's altars were on display in Berlin, London, Vienna and New York. Museums wrote the objects into their own histories, and for generations visitors learned about Benin mostly through what had been taken from it.",
      image: {
        url: "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/06/24/17/benin-bronzes-british-museum.jpg?quality=75&width=1250&crop=3%3A2%2Csmart&auto=webp",
        credit: " Leon Neal / Getty Images via The Independent.",
        license: "Used under non-commercial educational fair use. All rights reserved."
      }
    },
    {
      key: "restoration",
      title: "Exile and Restoration",
      slug: "exile-and-restoration",
      introduction: "Oba Ovonramwen died in exile in Calabar in January 1914. That same year his son was crowned Eweka II, and the monarchy was restored, though with far less power than before.\nThe Obas who followed rebuilt in a changed world. Eweka II set up altars to his ancestors and revived the guilds. Akenzua II, who reigned from 1933, became a figure of national standing, and Oba Erediauwa and Oba Ewuare II carried the throne through independence, military rule and the return of democracy.\nThis chapter is about continuity: how a dynasty that had been conquered kept its ceremonies, its craftspeople and its claim on the past.",
      image: noImage
    },
    {
      key: "asking",
      title: "Asking for Them Back",
      slug: "asking-for-them-back",
      introduction: "The call to bring the objects home is almost as old as their removal. Oba Akenzua II made requests in the 1930s and 1940s. In 1977 Nigeria asked the British Museum for the loan of a single ivory mask for a world festival of Black arts, and was refused.\nNigerian artists, scholars and officials kept the question alive through the decades that followed, through exhibitions, books and meetings with the museums that held the objects. Their arguments were moral, legal and artistic, and they did not always agree with each other.\nThis chapter follows that long campaign, from the first letters to the Benin Dialogue Group, and shows how patient work by Nigerians made the returns of recent years possible.",
      image: noImage
    },
    {
      key: "return",
      title: "The Long Return",
      slug: "the-long-return",
      introduction: "Since 2021, museums in the United Kingdom, Germany, the Netherlands, Switzerland and the United States have agreed to return or transfer ownership of Benin objects. Questions of ownership, custody and the largest collections remain unresolved.\nReturning an object is not one event. Legal ownership may move first, and the physical return may follow months or years later. In Nigeria itself, the National Commission for Museums and Monuments, the Oba of Benin and the Edo State government have held different views about who should keep the objects and where they should be shown.\nWe set out those positions as their holders state them, because the disagreement is part of the history. The largest single collection, at the British Museum, has not been returned.",
      image: {
        url: "https://media.npr.org/assets/img/2022/12/21/ap22354541824412-fcd0e2443b2e7b8aa209fdc22cf3ea9ebead4a4b.jpg?s=1200&c=85&f=webp",
        credit: "Restitution Ceremony of Benin Bronzes in Abuja (December 20, 2022). Credit: Olamikan Gbemiga / Associated Press.",
        license: "All Rights Reserved / Editorial Use Only."
      }
    },
    {
      key: "living",
      title: "Living Heritage",
      slug: "living-heritage",
      introduction: "Benin's art is not only in museums. On Igun Street in Benin City, casters still work in the quarter their guild has held for centuries, using the lost-wax method their ancestors used, though under new pressures.\nThe past is also being recorded in new ways. Digital Benin gathers records of objects held across the world so that people in Benin can see where they are. Artists such as Peju Layiwola make the events of 1897 a subject for contemporary art, and in 2023 a bronze statue of a Queen Mother was unveiled in the city.\nThe kingdom's story did not stop in 1897. It is still being written by the people who live in it.",
      image: noImage
    }
  ],
  people: [
    {
      image: noImage,
      key: "eweka-i",
      name: "Oba Eweka I",
      slug: "oba-eweka-i",
      description: "Traditionally the first Oba of Benin, who began the Oba dynasty about 1180. Later Obas who took the name Eweka, such as Oba Eweka II in 1914, did so to honour him.\nAccording to the most widespread Edo tradition, Eweka was the son of Prince Oranmiyan of Ife and a daughter of an Edo chief. Oranmiyan came to Benin at the invitation of Edo chiefs after the end of the Ogiso age, but, as the story goes, left again, saying that only a child born on Edo soil should rule the Edo. Tradition names Eweka as that child.\nHe is said to have reigned until about 1246, and the Oba dynasty founded in his name has continued, with interruptions, to the present. A second tradition traces the dynasty to Prince Ekaladerhan, an exiled son of the last Ogiso, and treats Eweka as his descendant. The two accounts agree that the dynasty linked Benin to Ife and that it began with a restoration of order.\nHistorians do not agree on how much of this can be treated as history. What is not in dispute is that by the thirteenth century a royal court was established in Benin City and that later Obas, up to the present day, claimed descent from him."
    },
    {
      image: noImage,
      key: "oranmiyan",
      name: "Prince Oranmiyan",
      slug: "prince-oranmiyan",
      description: "A prince of Ife in Edo and Yoruba tradition, said to have been invited to Benin to end a period of disorder after the Ogiso age. Benin tradition names him as the father of the first Oba, Eweka I.\nIn the best-known Edo account, the chiefs of Benin, unhappy with a long breakdown of royal authority, sent to Ife for a ruler. Oranmiyan came, married the daughter of an Edo chief, and had a son. He is then said to have left, naming his son as ruler because the Edo should be ruled by a child of Edo soil.\nThe tradition is also remembered in Yoruba history, where Oranmiyan has a different and much larger story, including the founding of Oyo. That overlap is one reason scholars handle the story carefully. In 1965 the historian Alan Ryder published a reconsideration of the relationship between Ife and Benin, and the debate has continued since.\nIn Edo tradition there is another account in which the dynasty descends from Prince Ekaladerhan, a son of the last Ogiso who went into exile. Both stories explain why Benin and Ife are linked, and both are part of how Edo people have understood their own kingship."
    },
    {
      key: "ewuare",
      name: "Oba Ewuare the Great",
      slug: "oba-ewuare-the-great",
      description: "Twelfth Oba of Benin, who reigned from about 1440 to 1473. Oral tradition credits him with rebuilding Benin City, reorganising the state and strengthening royal patronage of the guilds. He is remembered as one of the greatest rulers in Benin's history.\nTradition says he was born Prince Ogun, the third son of Oba Ohen. Ohen was deposed after he lost the use of his legs, because the Oba's body was believed to carry the well-being of the kingdom. Ogun took the throne after a struggle and the name Ewuare.\nOnce in power, Ewuare is said to have rebuilt the capital with walls, moats and wide streets, and to have expanded the kingdom's territory. He is also credited with reducing the power of the Uzama chiefs, who had controlled who could become Oba. In their place he is said to have made succession pass to the eldest son, and to have created two new orders of chiefs, the Eghaevbo n'Ore (town chiefs) and the Eghaevbo n'Ogbe (palace chiefs), who answered to the Oba.\nOral tradition also credits him with founding festivals such as Igue, which renews the Oba's spiritual power each year, and Ugie Erha Oba, which honours royal ancestors. Many of these details come from Benin's oral history as written down in the twentieth century, so historians treat them as tradition, but the shape of the story, a strengthened crown and a rebuilt capital, is widely accepted.\nHis sons included Ezoti, who was killed, Olua, who ruled briefly and was removed after the Uzama revolted, and Ozolua, who became Oba about 1481. Sources give slightly different dates for these successions.",
      image: {
        url: "https://adf-magazine.com/wp-content/uploads/2023/12/Flashback_DP-25381-001_CMYK.jpg",
        credit: "The Metropolitan Museum of Art, New York (Bequest of Alice K. Bache, 1977)",
        license: "Public Domain (CC0 1.0)"
      },
      deathDate: "1473-06-30"
    },
    {
      image: noImage,
      key: "ozolua",
      name: "Oba Ozolua",
      slug: "oba-ozolua",
      deathDate: "1504-06-30",
      description: "Oba of Benin from about 1481 until about 1504, known as Ozolua the Conqueror. His wars carried the kingdom's power outwards, and Portuguese ships first reached Benin during his reign.\nHe was the third son of Ewuare and took the throne after his brothers Ezoti and Olua. Edo tradition remembers him as a great warrior king. Sources give different dates for his reign, some placing it from 1481 to 1504 and others from about 1483 to 1514.\nThe Portuguese captain João Afonso d'Aveiro reached Benin in 1485 or 1486, during his reign. The Oba sent an envoy, the chief of the port of Ughoton (Gwato), back to Portugal with him. Historians such as Alan Ryder have argued that the Portuguese came partly to buy captives to exchange on the Gold Coast, and that Ozolua's campaigns provided some of them.\nOzolua was succeeded by his son Esigie. Later Obas of the eighteenth century, such as Akenzua I and Eresoyen, compared themselves to Ozolua and Esigie as the great kings of the past."
    },
    {
      image: noImage,
      key: "esigie",
      name: "Oba Esigie",
      slug: "oba-esigie",
      deathDate: "1550-06-30",
      description: "Oba of Benin from about 1504 until about 1550. He ruled when Benin's relations with Portugal were at their closest, and he honoured his mother, Idia, with the new title of Iyoba, the Queen Mother.\nHe became Oba after a struggle with his brother Arhuaran. Tradition says that his mother Idia, a woman of great political skill, supported him, and that she accompanied him in the war with Idah, the Igala capital, in about 1515 to 1516.\nAfter the victory he is said to have created the office of Iyoba for her and built her a palace at Uselu. He is also credited with introducing the Uzama N'Ibie, a lower order of the Uzama chiefs, and with giving his brass casters their organisation and a head, the Ine n'Igun, according to Igun tradition.\nHis reign saw the closest contact with the Portuguese. Missionaries built a church in Benin City in 1516, and the Oba ordered his son and two nobles to become Christians. Portuguese activity in Benin faded in later years. Historians note that Benin restricted the sale of male captives in this period, so the Oba set terms for the trade, while women continued to be sold.\nHe died about 1550. In later centuries, Obas and artists treated Esigie and his father Ozolua as the model of the warrior king."
    },
    {
      image: noImage,
      key: "idia",
      name: "Queen Mother Idia",
      slug: "queen-mother-idia",
      description: "The mother of Oba Esigie and the first Iyoba, or Queen Mother, of Benin. Tradition remembers her as a political and spiritual force who helped her son take the throne and who went to war beside him.\nIdia lived in the early sixteenth century. When her son Esigie contested the throne with his brother, she is said to have supported him with her counsel. Al Jazeera, in a 2026 report on Benin's craft, describes her as the first Benin woman recorded as having waged a war to secure her son's reign.\nAfter the victory over Idah, Esigie is said to have created the title Iyoba for her and given her a palace at Uselu, just north of Benin City. The Iyoba has a court of her own at Uselu, and the title is still held today.\nAfter her death, Esigie ordered ivory and brass works in her memory. Ivory pendant masks, now in the British Museum, the Metropolitan Museum of Art and other collections, are linked with her. The identification was first made in a newspaper article in 1956 by Oba Akenzua II.\nIn 1977 a copy of one of the masks became the emblem of FESTAC 77, the Second World Black and African Festival of Arts and Culture, held in Lagos, and her face became a symbol across Nigeria of the demand for the return of Benin's treasures."
    },
    {
      image: noImage,
      key: "akenzua-i",
      name: "Oba Akenzua I",
      slug: "oba-akenzua-i",
      description: "Oba of Benin in the early eighteenth century, remembered for ending a long civil war and restoring the crown's authority and wealth. His reign is generally dated from about 1713 or 1715 to about 1735.\nThe civil war of about 1689 to 1721 had left the capital badly damaged and the Oba's power reduced. Historians such as Paula Ben-Amos and John Thornton, who studied the war, describe how royal authority was rebuilt afterwards. Akenzua is credited with introducing reforms that strengthened the throne.\nHis reign and that of his son Eresoyen, who ruled from about 1735 to 1750, are remembered as a period of renewed wealth and political power. Eresoyen is associated with a revival of bronze casting, and many notable Benin bronzes are attributed to the reigns of these two Obas.\nThey compared themselves to Ozolua and Esigie, and began the tradition of seeing those two sixteenth-century kings as the greatest of Benin's history. Dutch records mention an Oba trading with the Dutch company around 1715, most likely Akenzua I."
    },
    {
      key: "ovonramwen",
      name: "Oba Ovonramwen Nogbaisi",
      slug: "oba-ovonramwen-nogbaisi",
      description: "The last independent Oba of Benin, who reigned from 1888 until British forces captured Benin City in 1897. He was captured, tried and exiled to Calabar, where he died in January 1914. He is remembered as a symbol of resistance to colonial conquest.\nHe was the son of Oba Adolo, who reigned from 1848 to 1888, and took the name Ovonramwen, often translated as the Rising Sun, when he was crowned. He inherited a kingdom under pressure, with British traders pressing from the coast and the colonial government on the Niger Coast wanting open trade.\nIn March 1892 the British Vice-Consul Henry Gallwey came to Benin to conclude a treaty of protection. Edo accounts say the Oba was cautious and that the treaty was explained through several interpreters, so it is unclear how fully he understood its terms. Some accounts say he marked the document himself, others that his chiefs signed. British officials later accused him of breaking the treaty and blocking trade.\nIn January 1897 a British mission led by James Phillips was attacked on its way to Benin City, and Britain sent a force that captured the city in February. The Oba left the city and later surrendered, in August 1897. He was tried by the British, found guilty, deposed and exiled to Calabar with two of his wives, Queen Egbe and Queen Aighobahi.\nHe died in Calabar in January 1914 and was later buried in the palace grounds in Benin City. Edo people have honoured him ever since as the Oba who faced the empire. His son Aiguobasimwin was crowned as Oba Eweka II in July 1914, and his descendants, including the present Oba, Ewuare II, still speak of him as the king whose treasures were taken.",
      image: {
        url: "https://cdn.britannica.com/73/172973-050-605882F6/Ovonramwen.jpg?w=300",
        credit: "Jonathan Adagogo Green / British Museum Collection (via ASIRI Magazine)",
        license: "Public Domain"
      },
      deathDate: "1914-01-13"
    },
    {
      image: noImage,
      key: "agho-obaseki",
      name: "Chief Agho Obaseki",
      slug: "chief-agho-obaseki",
      deathDate: "1920-09-09",
      description: "A leading Edo chief who became the British administration's most important local partner after 1897. He headed the Benin Native Council from 1898 to 1914 and was Iyase of Benin from 1914 until his death in 1920.\nAfter Oba Ovonramwen was exiled, there was a leadership gap in Benin. The British made Obaseki the de facto head of the newly formed Benin Native Council, in part because of his administrative skill.\nWhen Ovonramwen died in January 1914 and his son became Oba Eweka II, the British appointed Obaseki Iyase of Benin, the traditional chief adviser to the Oba. The appointment broke with tradition, because the Oba normally chooses his own chiefs, and Eweka II was dismayed. A power struggle followed between the new Oba and the new Iyase.\nObaseki died on 9 September 1920 after an illness. Opinions about his role differ. Some see a pragmatic administrator who kept order in a time of upheaval, while others see a chief whom the colonial government preferred to the Oba."
    },
    {
      key: "rawson",
      name: "Rear-Admiral Sir Harry Rawson",
      slug: "rear-admiral-sir-harry-rawson",
      description: "British naval officer (1843 to 1910) who commanded the 1897 expedition that captured Benin City. After the city fell, objects seized by British forces were sold at auction in London and dispersed to museums around the world.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Portrait_of_Admiral_Sir_Harry_Rawson%2C_Sydney%2C_c._1902.jpg/500px-Portrait_of_Admiral_Sir_Harry_Rawson%2C_Sydney%2C_c._1902.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        credit: "Freeman Brothers Studio / State Library of New South Wales (via Wikimedia Commons)",
        license: "Public Domain"
      },
      birthDate: "1843-06-30",
      deathDate: "1910-06-30"
    },
    {
      key: "phillips",
      name: "James Robert Phillips",
      slug: "james-robert-phillips",
      description: "British Acting Consul-General of the Niger Coast Protectorate (1863 to 1897). In January 1897 he led a party toward Benin City that was attacked near Gwato. Phillips and six other Europeans were killed, and two survivors escaped. Britain used his death to justify the expedition that followed a month later.",
      deathDate: "1897-01-04",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/en/4/48/Consul_General_J._R._Phillips.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail_unscaled",
        credit: "Wikipedia / Wikimedia Commons",
        license: "Public Domain"
      },
      birthDate: "1863-06-30"
    },
    {
      image: noImage,
      key: "eweka-ii",
      name: "Oba Eweka II",
      slug: "oba-eweka-ii",
      description: "Oba of Benin from 24 July 1914 until 1933, the son of Ovonramwen. He restored the monarchy after the exile, set up new ancestral altars and revived the palace guilds.\nHe was born Aiguobasimwin, the son of Ovonramwen and Queen Eghaghe. Before he became Oba he was himself a skilled brass-smith and an expert in ivory and wood carving. He took the name Eweka in honour of the dynasty's founder.\nAmong his first acts was to set up an altar to his father, Oba Ovonramwen, and a single altar to all the Obas who had reigned before. He also revived the craft guilds and commissioned works to replace those looted in 1897, and is said to have started the Benin Arts and Crafts School.\nHe ruled under colonial indirect rule, which limited the Oba's power, and he faced a struggle with Chief Agho Obaseki, whom the British had made Iyase. He died in 1933 and was succeeded by his son Akenzua II."
    },
    {
      image: noImage,
      key: "akenzua-ii",
      name: "Oba Akenzua II",
      slug: "oba-akenzua-ii",
      birthDate: "1899-01-07",
      deathDate: "1978-06-11",
      description: "Oba of Benin from 1933 to 1978, a statesman who rebuilt royal institutions and campaigned for the return of the objects taken in 1897.\nHe received Queen Elizabeth II on her state visit to Nigeria in 1956, and in 1966 became Chancellor of Ahmadu Bello University. He also took an interest in his kingdom's own history, and it was he who first identified, in a Nigerian newspaper in 1956, the ivory masks as portraits of Queen Mother Idia.\nOn 17 June 1943 the English barrister Philip Guedalla made a request for the return of Benin objects on his behalf. In the 1970s, when Nigeria asked the British Museum for the loan of the Idia mask for FESTAC 77, he advised on how to obtain a replica. A line attributed to him, reported in the New York Review of Books, says that Benin's forefathers made the first bronzes and could do it again.\nHis granddaughter, the artist Peju Layiwola, later made the history of 1897 a subject of her own work. He died in 1978 and was succeeded by Oba Erediauwa in 1979."
    },
    {
      image: noImage,
      key: "erediauwa",
      name: "Oba Erediauwa",
      slug: "oba-erediauwa",
      deathDate: "2016-06-30",
      description: "Oba of Benin from 1979 until his death in 2016, a reign of more than three decades through military rule and the return of democracy.\nHe was the successor of Akenzua II. During his reign the question of Benin's looted treasures moved from letters and petitions to international meetings. He supported scholars and artists who worked on the subject, and wrote the foreword to Peju Layiwola's 2010 exhibition Benin1897.com: Art and the Restitution Question.\nHis eldest son was crowned as Oba Ewuare II in 2016. His younger son, Prince Aghatise Erediauwa, represented the palace at ceremonies for the returned objects in 2021 and 2025."
    },
    {
      image: noImage,
      key: "ewuare-ii",
      name: "Oba Ewuare II",
      slug: "oba-ewuare-ii",
      description: "The present Oba of Benin, crowned in 2016. He is a great-great-grandson of Oba Ovonramwen and a central figure in the campaign to bring Benin's objects home.\nIn February 2022 he received the bronze cockerel from Jesus College, Cambridge, and the head of an Oba from the University of Aberdeen, in a ceremony at the palace in Benin City. In 2023 the Nigerian government of President Muhammadu Buhari recognised him as the owner and custodian of returned objects.\nHe has said that returned objects belong in a royal museum under the palace's care, and the palace has criticised the Museum of West African Art, a separate project in Benin City backed by the former Edo State government, saying it was not consulted. Supporters of that museum say it will serve the whole region, and the dispute remains unresolved.\nIn 2023 he unveiled a 22-foot bronze statue of his mother, Queen Mother Ikuoyemwen, the Iyoba of Uselu, in Benin City, made by Igun Street casters. In July 2026 he received the 18 Benin objects returned by Swiss museums, saying that to delay a return is to continue dispossession by other means."
    },
    {
      image: noImage,
      key: "egharevba",
      name: "Chief Jacob Egharevba",
      slug: "chief-jacob-egharevba",
      description: "Benin historian (1893 to 1980) and the author of A Short History of Benin, an early history of the kingdom written by an Edo author. Much of what is known of Benin's oral history comes through his work.\nHe collected the traditions of the palace, the guilds and the chiefs and published them in English. His lists of Obas, the story of the Ogiso dynasty and the accounts of Oranmiyan and Eweka I, which fill this exhibition's earlier chapters, depend on his writing.\nScholars have used his work for decades while also questioning it. An article in the journal History in Africa, The Scholarship of Jacob Egharevba of Benin, discusses his methods and the limits of oral tradition as a source for dates.\nChief Egharevba's work was important because it was written by an Edo about the kingdom's own past at a time when most published accounts, including those of the 1897 expedition, were written by Europeans."
    },
    {
      image: noImage,
      key: "erhabor-emokpae",
      name: "Erhabor Emokpae",
      slug: "erhabor-emokpae",
      birthDate: "1934-06-30",
      deathDate: "1984-06-30",
      description: "Nigerian sculptor and painter (1934 to 1984), credited in the British Museum's records with making the bronze replica of the Queen Idia mask that became the emblem of FESTAC 77.\nIn 1976 the Nigerian government asked the British Museum to lend the original ivory mask for the Second World Black and African Festival of Arts and Culture, held in Lagos in January and February 1977. The museum refused, and says it did so mainly on conservation grounds. Nigerian accounts say a very large payment was also demanded.\nA replica was made and used as the official emblem. The British Museum credits Emokpae with a bronze replica. Nigerian accounts add that the Benin carver Joseph Alufa carved an ivory replica, and a 2026 report says Alufa received little credit. We note both because the full story of who made which copy is still being told.\nWhoever made it, the replica did something the original could not: it travelled, and it became the best-known image of the demand for the return of Benin's treasures."
    },
    {
      image: noImage,
      key: "peju-layiwola",
      name: "Peju Layiwola",
      slug: "peju-layiwola",
      birthDate: "1967-09-29",
      description: "Nigerian artist and art historian, born in 1967, whose 2010 exhibition Benin1897.com: Art and the Restitution Question made the British sack of Benin a subject of contemporary Nigerian art.\nShe is the granddaughter of Oba Akenzua II and the daughter of the sculptor Princess Elizabeth Olowu, and she grew up in Benin City. She studied at the University of Benin and the University of Ibadan and teaches art history at the University of Lagos, where she has led the Department of Creative Arts.\nBenin1897.com opened in Lagos in April 2010 and travelled to Ibadan. In the name, 1897 is the date of the attack, Benin the place and .com a pointed reference to commerce, and to the sale of Benin objects at international auctions. It included an installation of a thousand heads, and Oba Erediauwa wrote the foreword to the accompanying book, which she edited with Sola Olorunyomi.\nIn 2014 she made Face Off, a work in terracotta and bronze, together with the brass casters of Igun Street. She has written on how artists in Nigeria have returned to the events of 1897 again and again, and her own work is a part of that long conversation."
    }
  ],
  places: [
    {
      key: "benin-city",
      name: "Benin City",
      description: "Capital of the Benin Empire and today the capital of Edo State in southern Nigeria. The historic city was surrounded by walls and moats, with the Oba's palace at its centre and craft guilds organised in dedicated quarters.",
      latitude: 6.3381,
      longitude: 5.6258,
      image: {
        url: "https://i0.wp.com/panafrocore.com/wp-content/uploads/2024/03/GGzu6YDXoAAHyYz.jpeg?w=640&ssl=1",
        credit: "Francis Moore / Alamy",
        license: "Public Domain"
      }
    },
    {
      key: "palace",
      name: "Royal Palace of the Oba of Benin",
      description: "The administrative and religious centre of the Benin kingdom, in the heart of Benin City. By tradition the palace was established at its present site in the thirteenth century. It was damaged in 1897 and rebuilt, and remains the residence of the Oba of Benin, Ewuare II, who was crowned in 2016.",
      latitude: 6.3323,
      longitude: 5.6202,
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Royal_Palace_of_the_Oba_of_Benin_cropped.jpg/500px-Royal_Palace_of_the_Oba_of_Benin_cropped.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        credit: "Kelechukwu Ajoku",
        license: "CC BY-SA 4.0"
      }
    },
    {
      key: "igun",
      name: "Igun Street",
      description: "The historic quarter of Benin City where hereditary guilds of brass casters have worked for centuries using the lost-wax technique. Casters on the street still produce traditional and contemporary work.",
      latitude: 6.34,
      longitude: 5.6335,
      image: {
        url: "https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/14D9B/production/_104730458_gettyimages-549406563.jpg.webp",
        credit: "Markus Matzel / ullstein bild via Getty Images",
        license: "Rights-managed / Getty Images Standard Editorial License "
      }
    },
    {
      key: "british-museum",
      name: "The British Museum",
      description: "The London museum holds about 900 Benin objects, the largest single collection outside Nigeria. It says the British Museum Act 1963 restricts it from permanently transferring objects out of its collection, and it has not returned any of its Benin objects.",
      latitude: 51.5194,
      longitude: -0.127,
      image: {
        url: "https://smarthistory.org/wp-content/uploads/2023/04/wall-of-plaques-copy-1536x864.jpg",
        credit: "Steven Zucker / Smarthistory (Object courtesy of the British Museum)",
        license: "CC BY-NC-SA 4.0"
      }
    },
    {
      key: "ile-ife",
      name: "Ile-Ife",
      description: "The ancient Yoruba city in Osun State, regarded by Yoruba and Edo traditions alike as a source of kingship. Benin tradition links its first Oba, Eweka I, to Ife through Prince Oranmiyan. A later tradition says Oba Oguola asked the Ooni of Ife to send a master caster to teach brass casting at the Benin court.\nIfe's own bronze and terracotta sculptures, made between about the twelfth and fifteenth centuries, are among the finest in Africa, and art historians have long compared them with Benin's.",
      latitude: 7.4905,
      longitude: 4.5521,
      image: noImage
    },
    {
      key: "idah",
      name: "Idah",
      description: "The old capital of the Igala kingdom on the Niger, in present-day Kogi State. Benin and the Igala fought over the northern borderlands in the early sixteenth century. Oral tradition remembers the war of about 1515 as the one in which Queen Idia went to the battlefield beside her son, Oba Esigie. (approx.)",
      latitude: 7.11,
      longitude: 6.74,
      image: noImage
    },
    {
      key: "uselu",
      name: "Uselu",
      description: "A district on the northern edge of Benin City. According to tradition, Oba Esigie built a palace for his mother, Idia, here and created the title Iyoba, the Queen Mother. The holder of the title, the Iyoba n'Uselu, still has her own court in Uselu today. (approx.)",
      latitude: 6.379,
      longitude: 5.612,
      image: noImage
    },
    {
      key: "calabar",
      name: "Calabar",
      description: "The port city in south-eastern Nigeria where the British exiled Oba Ovonramwen in 1897, together with two of his wives. He lived there until his death in January 1914. Today it is the capital of Cross River State.",
      latitude: 4.9757,
      longitude: 8.3417,
      image: noImage
    },
    {
      key: "abuja",
      name: "Abuja",
      description: "Nigeria's capital. On 20 December 2022 it hosted the ceremony at which Germany handed over the first 22 of more than 1,100 Benin objects to the Nigerian government.",
      latitude: 9.0765,
      longitude: 7.3986,
      image: noImage
    },
    {
      key: "national-museum-lagos",
      name: "National Museum, Lagos",
      description: "A national museum run by the National Commission for Museums and Monuments. It has received many of the returned Benin objects, including those from the Netherlands in 2025 and from Swiss museums in June 2026. Museum of Looted Antiquities reporting in October 2026 says 99 of the 116 objects transferred by Cambridge are to be displayed here. (approx.)",
      latitude: 6.4475,
      longitude: 3.403,
      image: noImage
    },
    {
      key: "cambridge-maa",
      name: "Museum of Archaeology and Anthropology, Cambridge",
      description: "The University of Cambridge museum that transferred legal ownership of 116 Benin objects to Nigeria's National Commission for Museums and Monuments in 2026. A small number remain in Cambridge on long-term loan.",
      latitude: 52.2005,
      longitude: 0.1207,
      image: noImage
    },
    {
      key: "met-museum",
      name: "The Metropolitan Museum of Art",
      description: "The New York museum holds important Benin works, including one of the ivory pendant masks that tradition links to Queen Mother Idia. Several Benin objects in the Met's collection are available online as open-access images.",
      latitude: 40.7794,
      longitude: -73.9632,
      image: noImage
    }
  ],
  events: [
    {
      image: noImage,
      section: "origins",
      key: "ogiso-age",
      title: "The Ogiso, Kings of the Sky",
      slug: "the-ogiso-kings-of-the-sky",
      eventDate: "1100-06-30",
      dateDisplay: "Tradition, to about 1100",
      description: "Edo tradition remembers a line of kings called the Ogiso, a title usually translated as King of the Sky, who ruled the land of Igodomigodo before the Obas. One Edo account counts 31 Ogisos, from about 40 BC to about AD 1100, though the number and the dates are matters of tradition, not of proven history.\nBefore the Ogisos, tradition says, villages were run by councils of elders and age-grade systems. The Ogiso kings are said to have drawn the villages into a single state. Archaeology shows that the Benin area was settled and being built up in these centuries, but it cannot confirm the kings' names.",
      people: [],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "origins",
      key: "ekaladerhan-and-ife",
      title: "Exile, Ife and an Invitation",
      slug: "exile-ife-and-an-invitation",
      eventDate: "1170-06-30",
      dateDisplay: "Late twelfth century, by tradition",
      description: "Tradition says the Ogiso age ended in conflict. The last Ogiso's son, Prince Ekaladerhan, was driven into exile, and the port of Ughoton (Gwato) is linked in tradition with his story. After him there followed a period without a king, which scholars call the interregnum, and which Dmitri Bondarenko and Peter Roese have examined in a 2004 study of the gap between the Ogiso and Oba dynasties.\nAnother account says the Edo chiefs, tired of disorder, sent to Ife for a ruler, and that Prince Oranmiyan came to Benin. Both stories link the Oba dynasty to Ife, and both frame it as a restoration of order. Which one is closer to the truth is still debated.",
      people: [
        "oranmiyan"
      ],
      places: [
        "ile-ife",
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "kingdom",
      key: "oba-dynasty",
      title: "The Oba Dynasty Begins",
      slug: "the-oba-dynasty-begins",
      eventDate: "1180-06-30",
      dateDisplay: "c. 1180",
      description: "By tradition Eweka I became the first Oba of Benin about 1180 and is said to have reigned until about 1246. The title Oba replaced the Ogiso, and the dynasty he founded has continued to the present.\nEdo tradition names his father as Oranmiyan of Ife and his mother as the daughter of an Edo chief, and says the Edo chose a ruler born on their own soil. The dynasty's early Obas shared power with the Uzama, the hereditary chiefs who crowned each new Oba and who could, at times, limit what he did.",
      people: [
        "eweka-i",
        "oranmiyan"
      ],
      places: [
        "benin-city",
        "ile-ife"
      ]
    },
    {
      key: "walls",
      section: "kingdom",
      title: "The Walls of Benin",
      slug: "the-walls-of-benin",
      dateDisplay: "c. 700 to 1400 AD",
      description: "Benin City was surrounded by a system of earthen walls and moats. Together with earthworks across the surrounding region they form one of the longest earthwork systems in the world. In the 1970s the archaeologist Patrick Darling estimated the whole network at about 16,000 km, a figure recorded by Guinness World Records. The inner city walls were a smaller part of this network, and estimates vary.",
      places: [
        "benin-city"
      ],
      image: {
        url: "https://disappointedtourist.org/wp-content/uploads/2024/02/102CR-2048x1536.jpg",
        credit: "Ellen Harvey / Photograph by Etienne Frossard (via disappointedtourist.org)",
        license: "Copyright © Ellen Harvey. All rights reserved. The digital file is intended strictly for educational, research, and non-commercial documentation of the project. Any commercial reproduction requires explicit permission from the artist."
      },
      eventDate: "1200-06-30"
    },
    {
      image: noImage,
      section: "kingdom",
      key: "oguola-and-ife-caster",
      title: "Brass Casting Comes to the Court",
      slug: "brass-casting-comes-to-the-court",
      eventDate: "1280-06-30",
      dateDisplay: "Traditionally the late thirteenth century",
      description: "In Benin oral tradition it was an Oba of the late thirteenth century, remembered as Oguola, who asked the king of Ife to send a master craftsman to Benin to teach casting. The caster is said to have founded the guild that became the Igun Eronmwon.\nScholars read the story as a memory of real contact between the two places. Ife's own sculptors had been making fine cast heads for generations, and the lost-wax technique, in which a wax model is covered in clay, melted out and replaced with molten metal, was practised in both. Benin made the technique its own, and by the sixteenth century its casters were producing work found nowhere else.",
      people: [],
      places: [
        "ile-ife",
        "igun"
      ]
    },
    {
      key: "ewuare-reign",
      section: "warrior-kings",
      title: "The Reign of Oba Ewuare the Great",
      slug: "the-reign-of-oba-ewuare-the-great",
      eventDate: "1440-06-30",
      dateDisplay: "c. 1440 to 1473",
      description: "Ewuare's reign is remembered as Benin's golden age: military expansion, the rebuilding of Benin City and royal patronage of the bronze-casting guilds.\nOral tradition says he took the throne after a civil war, then rebuilt the capital with walls, moats and wide streets. Historians treat the details with care, because they come from traditions written down centuries later, but the broad picture of a stronger crown and a larger, better-ordered state is widely accepted.",
      people: [
        "ewuare"
      ],
      places: [
        "benin-city"
      ],
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Oba_Ewuare_I%2C_Benin_Bronzes%2C_Horniman_Museum_4_%28cropped%29.jpg/500px-Oba_Ewuare_I%2C_Benin_Bronzes%2C_Horniman_Museum_4_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        credit: "Photograph by Mike Peel",
        license: "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)"
      }
    },
    {
      image: noImage,
      section: "warrior-kings",
      key: "ewuare-reforms",
      title: "Ewuare Redraws the State",
      slug: "ewuare-redraws-the-state",
      eventDate: "1455-06-30",
      dateDisplay: "Fifteenth century, by tradition",
      description: "Oral tradition credits Ewuare with changing how Benin was governed. The Uzama chiefs had been able to choose and, at times, restrain the Oba. Ewuare is said to have taken away their power to appoint him and to have made the throne pass to the eldest son.\nIn their place he is said to have built two new ranks of officials who answered to him: the Eghaevbo n'Ore, the town chiefs, and the Eghaevbo n'Ogbe, the palace chiefs. These accounts come from tradition, but the three-part system they describe is how the court was organised in the centuries that followed.",
      people: [
        "ewuare"
      ],
      places: [
        "benin-city",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "warrior-kings",
      key: "ozolua-reign",
      title: "Ozolua the Conqueror",
      slug: "ozolua-the-conqueror",
      eventDate: "1481-06-30",
      dateDisplay: "c. 1481 to 1504",
      description: "Ewuare's third son Ozolua became Oba after his brothers Ezoti and Olua, and is remembered as a great warrior king. His campaigns carried Benin's power far beyond the capital's heartland.\nHis reign overlapped with the arrival of the Portuguese. Sources differ on his dates, with some giving about 1481 to 1504 and others about 1483 to 1514. Historians note that his wars also produced captives, some of whom were sold to the Portuguese in his time.",
      people: [
        "ozolua"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "warrior-kings",
      key: "esigie-succession",
      title: "Esigie Takes the Throne",
      slug: "esigie-takes-the-throne",
      eventDate: "1504-06-30",
      dateDisplay: "c. 1504",
      description: "After Ozolua's death his son Esigie came to the throne, though not without a fight. His brother Arhuaran challenged him, and in tradition it was Esigie, backed by his mother Idia, who prevailed.\nEsigie's reign, which lasted until about 1550, is remembered as a time when the court was at its most confident. He dealt with the Portuguese as a ruler to a ruler, and the later Obas looked back to him and to Ozolua as models of kingship.",
      people: [
        "esigie",
        "idia"
      ],
      places: [
        "benin-city",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "warrior-kings",
      key: "idah-war",
      title: "The War Against Idah",
      slug: "the-war-against-idah",
      eventDate: "1515-06-30",
      dateDisplay: "Early sixteenth century (about 1515)",
      description: "Tradition remembers a war between Benin and the Igala kingdom, with its capital at Idah on the Niger, in the early part of Esigie's reign. Its date is uncertain, but it is often placed about 1515.\nQueen Idia is said to have gone to the battlefield with her son. Al Jazeera, reporting from Benin City in 2026, describes her as the first Benin woman recorded as having waged a war. After the victory, Esigie is said to have honoured her with the title of Iyoba and a palace of her own.",
      people: [
        "idia",
        "esigie"
      ],
      places: [
        "idah",
        "uselu"
      ]
    },
    {
      image: noImage,
      section: "sacred-court",
      key: "three-orders",
      title: "Three Orders of Chiefs",
      slug: "three-orders-of-chiefs",
      eventDate: "1460-06-30",
      dateDisplay: "Fifteenth and sixteenth centuries",
      description: "The Oba's court was organised in three ranks. The Uzama n'Ihinron, seven hereditary titleholders led by the Oliha, are the kingmakers who crown the Oba. The Eghaevbo n'Ore, the town chiefs, form the executive council of the state, with the Iyase, the senior chief, as its leader. The Eghaevbo n'Ogbe are the palace chiefs, who serve the Oba's household and manage palace affairs.\nTradition says Ewuare created the second and third ranks, and that Esigie added a junior group of the Uzama called the Uzama N'Ibie, who can stand in for the senior titleholders. The system balanced the Oba against the chiefs and the chiefs against each other, and it is still how the Benin palace is organised.",
      people: [
        "ewuare",
        "esigie"
      ],
      places: [
        "palace"
      ]
    },
    {
      image: noImage,
      section: "sacred-court",
      key: "igue",
      title: "The Igue Festival",
      slug: "the-igue-festival",
      eventDate: "1465-06-30",
      dateDisplay: "Every year; by tradition from the fifteenth century",
      description: "Igue is the great annual festival of the Benin court. Its rituals renew the Oba's spiritual power and the well-being of the kingdom and its people. Tradition credits Ewuare with establishing it.\nA second major festival, Ugie Erha Oba, honours the Oba's royal ancestors. The Oba, the chiefs and the palace guilds each have roles, and some rites are held in private. The coral-bead regalia worn at these occasions, which gives the Oba a god-like appearance, is one of the best-known images of Benin.",
      people: [
        "ewuare"
      ],
      places: [
        "palace"
      ]
    },
    {
      image: noImage,
      section: "sacred-court",
      key: "first-iyoba",
      title: "The First Iyoba",
      slug: "the-first-iyoba",
      eventDate: "1516-06-30",
      dateDisplay: "Early sixteenth century",
      description: "Oba Esigie is said to have created the title of Iyoba, the Queen Mother, for his mother Idia, and to have built her a palace at Uselu. The Iyoba has her own court and her own title-holders, and the title is still held today by the mother of the reigning Oba.\nAfter Idia's death, Esigie ordered ivory and brass works in her memory. Carved ivory pendant masks, now in the British Museum, the Metropolitan Museum of Art and other collections, are linked to her. In 1956 Oba Akenzua II identified them as portraits of Idia, and in 1977 a copy of one of them became the emblem of FESTAC 77.",
      people: [
        "idia",
        "esigie"
      ],
      places: [
        "uselu",
        "met-museum"
      ]
    },
    {
      image: noImage,
      section: "court",
      key: "manillas-and-brass",
      title: "Where the Brass Came From",
      slug: "where-the-brass-came-from",
      eventDate: "1500-06-30",
      dateDisplay: "Sixteenth century onwards",
      description: "Benin's casters worked with brass, an alloy of copper and zinc, not true bronze, though the name Benin Bronzes has stuck. Much of the metal reached them as manillas, open brass rings that Europeans brought to the coast and that were used as currency.\nA 2023 scientific study of Benin objects, titled German brass for Benin Bronzes, traced much of the metal to brass made in Germany. The casters melted the manillas and cast them again into heads, plaques and figures, so that the Atlantic trade is recorded, quite literally, in the metal. Today's casters have used other materials too, from old spoons to modern copper and tin.",
      people: [],
      places: [
        "igun"
      ]
    },
    {
      image: noImage,
      section: "court",
      key: "brass-casters-organised",
      title: "The Brass Casters Are Organised",
      slug: "the-brass-casters-are-organised",
      eventDate: "1525-06-30",
      dateDisplay: "During Esigie's reign (1504 to 1550), by tradition",
      description: "Benin tradition says the brass casters, the Igun Eronmwon, were properly organised in Esigie's reign, and that their leader was given the title Ine n'Igun, which is still held by his descendants. Brass casters see themselves as the children of a first caster, and an altar to him stands on Igun Street.\nOther palace guilds worked beside them: the Igbesanmwan, ivory and wood carvers; the Enisen, makers of coral and agate beads; the Owina n'Ido, weavers; leatherworkers; and the Igun Ematon, blacksmiths. The casters' quarter stood within the palace grounds until 1897. Cast brass heads honoured the Obas' ancestors on royal altars, while the altars of chiefs used carved wooden heads.",
      people: [
        "esigie"
      ],
      places: [
        "igun",
        "palace"
      ]
    },
    {
      key: "portuguese",
      section: "trade",
      title: "First Portuguese Contact",
      slug: "first-portuguese-contact",
      eventDate: "1485-06-30",
      dateDisplay: "c. 1485 or 1486",
      description: "Portuguese traders reached Benin in the late fifteenth century, during the reign of Oba Ozolua. The captain João Afonso d'Aveiro is believed to have made the first visit, in 1485 or 1486, travelling up to Benin City from the port of Ughoton (Gwato).\nThey brought brass manillas, which were used as currency and as raw material for casting, and bought pepper, ivory and cloth. Portuguese figures appear on Benin plaques and carved ivories as a record of the meeting.\nHistorians such as Alan Ryder have argued that the Portuguese came partly to buy captives to exchange on the Gold Coast, and that Benin dealt with them on its own terms.",
      places: [
        "benin-city"
      ],
      image: {
        url: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/316490/2316086/main-image",
        credit: " Gift of Mr. and Mrs. Klaus G. Perls, 1991 / Photograph courtesy of The Metropolitan Museum of Art",
        license: "Creative Commons Zero (CC0 1.0 Universal / Public Domain Dedication)"
      },
      people: [
        "ozolua"
      ]
    },
    {
      image: noImage,
      section: "trade",
      key: "envoy-to-lisbon",
      title: "Benin's Ambassador Goes to Lisbon",
      slug: "benins-ambassador-goes-to-lisbon",
      eventDate: "1486-06-30",
      dateDisplay: "c. 1486",
      description: "A Portuguese chronicle of 1486 says that the king of Benin sent one of his captains, a man from the seaport of Gwato, as ambassador to King João II of Portugal, because he wanted to learn more about Europe. The envoy is described as a man of good speech and natural wisdom, who was honoured with great feasts and shown many of Europe's fine things.\nPortuguese agents went back with him to buy pepper, and the first Guinea pepper to reach Europe is recorded as coming from Benin. The exchange of envoys was a meeting between two courts, not a conquest, and the Oba kept the terms of trade in his own hands.",
      people: [
        "ozolua"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "trade",
      key: "church-1516",
      title: "Missionaries and a Church",
      slug: "missionaries-and-a-church",
      eventDate: "1516-06-30",
      dateDisplay: "1514 to 1516",
      description: "In November 1514 King Manuel of Portugal wrote to the Oba of Benin about sending priests. Portuguese missionaries built a church in Benin City in 1516, and in the same year Oba Esigie ordered his son and two of his nobles to become Christians.\nThe Oba seems to have been most interested in trade and in firearms. Portuguese activity in Benin faded in later years. Part of the reason is that the Portuguese crown banned private trade in African pepper in order to protect its monopoly of spices from the East.",
      people: [
        "esigie"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "trade",
      key: "captives-trade",
      title: "Benin and the Trade in People",
      slug: "benin-and-the-trade-in-people",
      eventDate: "1520-06-30",
      dateDisplay: "Sixteenth to eighteenth centuries",
      description: "From the early sixteenth century Benin's Obas restricted the sale of male captives to Europeans. In 1522, the Portuguese merchant Machin Fernandes bought 83 captives at Benin; only two were male, and he spent a month at Ughoton trying in vain to open a market in men. Alan Ryder records the episode in Benin and the Europeans, and it is often cited as evidence of how tightly the Oba controlled the sale of men.\nThe story does not end there. Women were sold in these years, the kingdom's own wars produced captives, and Benin's officials took part in re-selling people from other regions. After the civil war of 1689 to 1721 the trade grew, and by the eighteenth century Benin was fully part of it. Historians still debate how much was the Oba's choice and how much was beyond his control.",
      people: [
        "esigie"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "strain",
      key: "oba-stays-home",
      title: "The Oba Stays Home",
      slug: "the-oba-stays-home",
      eventDate: "1600-06-30",
      dateDisplay: "After 1600",
      description: "When Oba Ehengbuda died in 1600, the way Benin was governed changed. The Oba was no longer allowed to lead the army in person. Command passed to the Iyase, the senior town chief, and to the Ezomo, a senior Uzama chief, and the Oba became a secluded, semi-divine figure.\nThe shift raised the status of the Oba as a sacred king, but it also gave chiefs more power. Succession disputes grew into struggles between the crown and the chiefs, and they contributed to the civil wars of the seventeenth century.",
      people: [],
      places: [
        "palace"
      ]
    },
    {
      image: noImage,
      section: "strain",
      key: "civil-war",
      title: "The Civil War",
      slug: "the-civil-war",
      eventDate: "1689-06-30",
      dateDisplay: "c. 1689 to 1721",
      description: "A dynastic crisis in the late seventeenth century led to a civil war that lasted, by most counts, from about 1689 to 1721. European visitors noted that Benin had been racked by fighting for years, and the capital was left badly damaged.\nPaula Ben-Amos and John Thornton, who studied the war in a 2001 article, link it to a shift in how power worked in Benin and to a change in trade away from ivory and pepper. Some historians stress how quickly the monarchy recovered, and argue that Benin's real decline came only in the nineteenth century.",
      people: [],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "strain",
      key: "akenzua-restores",
      title: "Akenzua I Restores the Crown",
      slug: "akenzua-i-restores-the-crown",
      eventDate: "1715-06-30",
      dateDisplay: "Early eighteenth century",
      description: "Oba Akenzua I, who reigned from about 1713 or 1715, ended the civil war and rebuilt the authority of the throne. He and his son Eresoyen, who reigned from about 1735 to 1750, are remembered for a revival of royal wealth, ceremonies and the casting of brass.\nMany notable Benin bronzes are attributed to their reigns. They compared themselves to Ozolua and Esigie, and began the habit of treating those two sixteenth-century kings as the greatest in the kingdom's history.",
      people: [
        "akenzua-i"
      ],
      places: [
        "benin-city",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "strain",
      key: "ovonramwen-crowned",
      title: "Ovonramwen Becomes Oba",
      slug: "ovonramwen-becomes-oba",
      eventDate: "1888-06-30",
      dateDisplay: "1888",
      description: "Ovonramwen Nogbaisi, the son of Oba Adolo, was crowned in 1888. His name is often translated as the Rising Sun. He took the throne at a time when British traders pressed on the coast and the colonial government of the Niger Coast Protectorate was pressing for access to the trade of the interior.",
      people: [
        "ovonramwen"
      ],
      places: [
        "benin-city",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "strain",
      key: "gallwey-treaty",
      title: "The Gallwey Treaty",
      slug: "the-gallwey-treaty",
      eventDate: "1892-03-15",
      dateDisplay: "March 1892",
      description: "In March 1892 the British Vice-Consul Henry Gallwey travelled to Benin to conclude a treaty of protection. The document placed Benin under British protection and promised the suppression of the slave trade.\nEdo accounts say the Oba was cautious about receiving European visitors, and that it is unclear how fully he understood the terms, as several interpreters were involved. Accounts differ on whether the Oba himself marked the treaty or whether his chiefs signed. A few months later, British officials were already talking about removing him.",
      people: [
        "ovonramwen"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      key: "attack",
      section: "fall",
      title: "The Attack Near Gwato",
      slug: "the-attack-near-gwato",
      eventDate: "1897-01-04",
      dateDisplay: "4 January 1897",
      description: "A British mission led by James Phillips was attacked on its way to Benin City. Phillips and six other Europeans were killed, and two survivors escaped. British accounts call it the Benin Massacre. Britain used the incident to justify a military expedition.",
      people: [
        "phillips"
      ],
      image: {
        url: "https://c7.alamy.com/comp/EDRX37/the-advance-on-benin-map-showing-the-route-of-the-expedition-1897-EDRX37.jpg",
        credit: "Penta Springs Limited / Artokoloro / Alamy Stock Photo (Image ID: EDRX37). Original work by British military cartographers, 1897.",
        license: "Public Domain historical work."
      }
    },
    {
      key: "expedition",
      section: "fall",
      title: "British Forces Capture Benin City",
      slug: "british-forces-capture-benin-city",
      eventDate: "1897-02-09",
      dateDisplay: "9 to 18 February 1897",
      description: "A British force of about 1,400 soldiers and 2,500 carriers, commanded by Rear-Admiral Sir Harry Rawson, captured Benin City after nine days. The city was looted and much of it burned. Oba Ovonramwen was later captured, tried and exiled to Calabar.",
      people: [
        "rawson",
        "ovonramwen"
      ],
      places: [
        "benin-city"
      ],
      image: {
        url: "https://beninexpedition120yearson.weebly.com/uploads/1/5/0/7/15075616/final-assault_orig.png",
        credit: "Fidelia Nimmons / Benin Expedition 120 Years On (beninexpedition120yearson.weebly.com). Original drawing titled \"The Final Assault on Benin City\" by an unidentified 1897 British military officer or press illustrator.",
        license: "Public Domain for the underlying 1897 historical illustration. The digital hosting site hosts its curated educational content under a Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license."
      }
    },
    {
      image: noImage,
      section: "fall",
      key: "surrender-and-trial",
      title: "Surrender, Trial and Exile",
      slug: "surrender-trial-and-exile",
      eventDate: "1897-08-05",
      dateDisplay: "August 1897",
      description: "After the city fell, Ovonramwen left Benin and for months could not be found. He surrendered in August 1897, and was tried by the British. The chiefs held responsible for the killing of Phillips' party were tried and executed. The Oba was found guilty, deposed and exiled.\nHe was taken to Calabar with two of his wives, Queen Egbe and Queen Aighobahi. A photograph taken on the steam yacht Ivy, by the Nigerian photographer Jonathan Adagogo Green, shows him on the way into exile.",
      people: [
        "ovonramwen"
      ],
      places: [
        "calabar",
        "benin-city"
      ]
    },
    {
      key: "dispersal",
      section: "scattered",
      title: "The Objects Are Sold and Dispersed",
      slug: "the-objects-are-sold-and-dispersed",
      dateDisplay: "1897 onwards",
      description: "Objects taken from Benin were sold at auction in London and passed to museums and private collectors in Europe and North America. Scholars estimate that more than five thousand were taken.\nSome were sold to cover the costs of the expedition, others were gifts or personal trophies. Within a few years Benin works were on show in London, Berlin and elsewhere, and generations of visitors learned about Benin mainly through what had been taken from it.",
      places: [
        "british-museum"
      ],
      image: {
        url: "https://www.britishmuseum.org/sites/default/files/styles/uncropped_small/public/2024-05/Ivory_armlet_pair_750_529.jpg?itok=ClY2vwXN",
        credit: "© The Trustees of the British Museum. Benin ivory armlet pair, acquired following the 1897 Benin Expedition.",
        license: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) for non-commercial educational use."
      },
      eventDate: "1897-06-30"
    },
    {
      image: noImage,
      section: "restoration",
      key: "ovonramwen-dies",
      title: "Ovonramwen Dies in Exile",
      slug: "ovonramwen-dies-in-exile",
      eventDate: "1914-01-13",
      dateDisplay: "January 1914",
      description: "Ovonramwen died in Calabar in January 1914, after sixteen years in exile. He was later buried in the grounds of the royal palace in Benin City.\nHis death opened the way for his son to be crowned, and ever since he has been honoured in Edo memory as the last independent Oba.",
      people: [
        "ovonramwen"
      ],
      places: [
        "calabar",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "restoration",
      key: "eweka-ii-crowned",
      title: "Eweka II Restores the Monarchy",
      slug: "eweka-ii-restores-the-monarchy",
      eventDate: "1914-07-24",
      dateDisplay: "24 July 1914",
      description: "Ovonramwen's son Aiguobasimwin was crowned as Oba Eweka II on 24 July 1914, restoring the monarchy, though with far less power than before. The British had made Chief Agho Obaseki Iyase, which Eweka II resented, and a rivalry followed.\nAmong Eweka II's first acts was to set up an altar to his father and one altar to all the Obas before him. He revived the craft guilds and ordered works to replace those that had been looted. He had himself been a brass-smith and carver before he became Oba.",
      people: [
        "eweka-ii",
        "agho-obaseki"
      ],
      places: [
        "palace",
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "restoration",
      key: "akenzua-ii-reign",
      title: "Akenzua II Becomes Oba",
      slug: "akenzua-ii-becomes-oba",
      eventDate: "1933-04-05",
      dateDisplay: "5 April 1933",
      description: "Akenzua II was crowned on 5 April 1933, after the death of his father Eweka II in February, and reigned until 1978. The Art Institute of Chicago notes that he and Eweka II used the arts strategically to reinvent the kingdom after 1897.\nHe received Queen Elizabeth II on her 1956 visit to Nigeria and became Chancellor of Ahmadu Bello University in 1966. He also pressed for the return of Benin's treasures, a campaign his successors have continued.",
      people: [
        "akenzua-ii"
      ],
      places: [
        "palace",
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "restoration",
      key: "erediauwa-reign",
      title: "Oba Erediauwa",
      slug: "oba-erediauwa",
      eventDate: "1979-06-30",
      dateDisplay: "1979 to 2016",
      description: "Oba Erediauwa came to the throne in 1979 and reigned until his death in 2016. His reign spanned military rule and the return of democracy in Nigeria, and the first international meetings on the return of Benin's objects.\nHe lent his support to scholars and artists who worked on the history of 1897, and wrote the foreword to Peju Layiwola's exhibition Benin1897.com in 2010.",
      people: [
        "erediauwa"
      ],
      places: [
        "palace"
      ]
    },
    {
      image: noImage,
      section: "restoration",
      key: "ewuare-ii-crowned",
      title: "Ewuare II Is Crowned",
      slug: "ewuare-ii-is-crowned",
      eventDate: "2016-06-30",
      dateDisplay: "2016",
      description: "Oba Erediauwa's eldest son was crowned as Oba Ewuare II in 2016. He is a great-great-grandson of Oba Ovonramwen. He has made the return of Benin's objects, and their return to the palace, one of the central causes of his reign.",
      people: [
        "ewuare-ii",
        "erediauwa"
      ],
      places: [
        "palace",
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "asking",
      key: "akenzua-requests",
      title: "The First Requests",
      slug: "the-first-requests",
      eventDate: "1943-06-17",
      dateDisplay: "1930s and 1940s",
      description: "Nigeria's mission to reclaim the bronzes began in the 1930s. On 17 June 1943 the English barrister Philip Guedalla made a request for the return of Benin objects on behalf of Oba Akenzua II.\nThe requests did not succeed. Britain did not agree to return objects, and the campaign continued through the 1960 independence and after, in letters, petitions and, later, in exhibitions and meetings.",
      people: [
        "akenzua-ii"
      ],
      places: [
        "british-museum",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "asking",
      key: "festac-77",
      title: "FESTAC 77 and the Mask of Queen Idia",
      slug: "festac-77-and-the-mask-of-queen-idia",
      eventDate: "1977-01-15",
      dateDisplay: "15 January to 12 February 1977",
      description: "The ivory mask of Queen Idia was chosen as the emblem of FESTAC 77, the Second World Black and African Festival of Arts and Culture, held in Lagos. In 1976 the Nigerian government asked the British Museum to lend the original for the festival.\nThe museum refused. It says it did so mainly because of the mask's condition. Nigerian accounts say the museum also asked for a very large payment, reported as 2 million naira plus insurance. A replica was made and used as the emblem. The British Museum credits the sculptor Erhabor Emokpae with a bronze replica, and Nigerian reports credit the Benin carver Joseph Alufa with an ivory one. Oba Akenzua II advised the organisers on how to obtain a copy.\nThe replica became one of the most recognisable images in Nigerian history, and the symbol of the demand for return.",
      people: [
        "idia",
        "akenzua-ii",
        "erhabor-emokpae"
      ],
      places: [
        "british-museum",
        "national-museum-lagos"
      ]
    },
    {
      image: noImage,
      section: "asking",
      key: "benin-dialogue-group",
      title: "The Benin Dialogue Group",
      slug: "the-benin-dialogue-group",
      eventDate: "2007-06-30",
      dateDisplay: "From 2007",
      description: "In 2007 representatives of Nigerian and European museums and of the Benin Royal Court formed the Benin Dialogue Group, a working party to discuss the future of Benin objects held in Europe. Its meetings led to proposals for loans and for a museum in Benin City.\nCritics noted that the group focused for years on loans rather than on returns. Some institutions, such as the University of Aberdeen, chose to consider outright return and did not wait for the group.",
      people: [],
      places: [
        "british-museum",
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "asking",
      key: "layiwola-1897com",
      title: "Benin1897.com",
      slug: "benin1897com",
      eventDate: "2010-04-08",
      dateDisplay: "8 April to 30 May 2010",
      description: "As part of Nigeria's fiftieth anniversary celebrations, the artist and art historian Peju Layiwola, a granddaughter of Oba Akenzua II, staged Benin1897.com: Art and the Restitution Question at the University of Lagos. The show travelled to Ibadan, and was accompanied by a colloquium and a book of essays she edited with Sola Olorunyomi.\nOba Erediauwa wrote the foreword. The show brought artists, lawyers and scholars together, and its speakers did not agree on whether Nigeria should ask for reparation, restitution or restoration. The disagreement was a sign of how rich the Nigerian debate had become.",
      people: [
        "peju-layiwola",
        "erediauwa"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "return",
      key: "jesus-aberdeen",
      title: "The Cockerel and the Oba's Head Come Home",
      slug: "the-cockerel-and-the-obas-head-come-home",
      eventDate: "2021-10-27",
      dateDisplay: "27 and 28 October 2021",
      description: "Jesus College, Cambridge, held a livestreamed ceremony on 27 October 2021 at which it returned the bronze cockerel known as Okukor to Nigeria's National Commission for Museums and Monuments. The college had taken the cockerel out of its hall in 2017 after a student protest, and announced in 2019 that it would be returned. The next day the University of Aberdeen handed over the head of an Oba, which it had bought at auction in 1957.\nAberdeen had been the first institution to agree to the full return of a Benin bronze from a museum, in March 2021. In February 2022 the two objects were received by Oba Ewuare II at the palace in Benin City, in a ceremony in which Nigerian officials, chiefs and the public took part.",
      people: [
        "ewuare-ii"
      ],
      places: [
        "benin-city",
        "palace"
      ]
    },
    {
      key: "horniman-smithsonian",
      section: "return",
      title: "UK and US Museums Transfer Ownership",
      slug: "uk-and-us-museums-transfer-ownership",
      dateDisplay: "October to November 2022",
      description: "In 2022 the Horniman Museum in London transferred ownership of 72 Benin objects and the Smithsonian Institution transferred ownership of 29. A transfer of ownership does not always mean the objects have physically returned.",
      image: {
        url: "https://cdn.sanity.io/images/cxgd3urn/production/f0892e6014a57fd1dd3a7436413c86a0b5e05257-4000x2668.jpg?rect=1,0,3999,2668&w=1920&h=1281&q=85&fit=crop&auto=format",
        credit: "Joshua Bratt / PA Images via Getty Images / Horniman Museum and Gardens. Displays a historic 16th-century Benin Bronze plaque on exhibition during the official ownership transfer ceremony in London, November 28, 2022.",
        license: "Copyrighted by PA Images/Getty Images. Used under promotional and editorial distribution parameters by the Horniman Museum via their Sanity content architecture platform."
      },
      eventDate: "2022-10-15",
      places: [
        "abuja"
      ]
    },
    {
      key: "germany",
      section: "return",
      title: "Germany Returns Benin Objects",
      slug: "germany-returns-benin-objects",
      eventDate: "2022-12-20",
      dateDisplay: "20 December 2022",
      description: "In July 2022 Germany agreed to transfer ownership of more than 1,100 Benin objects held in its public museums to Nigeria. On 20 December 2022, at a ceremony in Abuja, the first 22 were physically handed over.\nThe agreement covered the great majority of the Benin objects in German public collections, which had been among the largest outside Britain.",
      image: {
        url: "https://i.guim.co.uk/img/media/a05d83d4d2a4ab14e33a393dd9853b6ce6c15da6/0_113_4872_2924/master/4872.jpg?width=1300&dpr=2&s=none&crop=none",
        credit: "Kola Sulaimon / AFP / Getty Images / The Guardian (Image ID: a05d83d4d2a4ab14e33a393dd9853b6ce6c15da6). Displays German Foreign Minister Annalena Baerbock and her Nigerian counterpart Geoffrey Onyeama during the official handover ceremony of 21 returned Benin Bronzes in Abuja, December 20, 2022.",
        license: "Rights-Managed editorial license required from Agence France-Presse (AFP) or Getty Images for public reproduction. The image belongs to the master news photographic catalog hosted by The Guardian."
      },
      places: [
        "abuja"
      ]
    },
    {
      key: "decree",
      section: "return",
      title: "The 2023 Ownership Decree",
      slug: "the-2023-ownership-decree",
      dateDisplay: "March 2023",
      description: "In March 2023 President Muhammadu Buhari recognised the Oba of Benin as the owner of returned bronzes. The declaration caused confusion for institutions preparing returns. A later agreement between Nigeria's National Commission for Museums and Monuments and the Oba's Palace allows the commission to manage returned objects on the Oba's behalf.\nSome institutions have since handed objects to the Oba directly. In 2025 the Museum of Fine Arts, Boston, returned two bronzes to Oba Ewuare II at a ceremony in New York.",
      image: {
        url: "https://tlivemedia.com/wp-content/uploads/2023/03/IMG-20230329-WA0039.jpg",
        credit: "Lauretta Ojiesele / Tlivemedia. Displays President Muhammadu Buhari receiving the Oba of Benin, Omo N'Oba N'Edo Uku Akpolokpolo Ewuare II, in audience at the State House, Abuja on March 23, 2023.",
        license: "Copyrighted by Tlivemedia."
      },
      eventDate: "2023-03-15"
    },
    {
      key: "netherlands",
      section: "return",
      title: "The Netherlands Returns 119 Objects",
      slug: "the-netherlands-returns-119-objects",
      dateDisplay: "June 2025",
      description: "The Netherlands returned 119 Benin objects to Nigeria in 2025, at a handover ceremony at the National Museum in Lagos. It was one of the largest single returns to date.",
      image: {
        url: "https://dims.apnews.com/dims4/default/4daee7e/2147483647/strip/true/crop/8640x5760+0+0/resize/2880x1920!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F6b%2F2f%2F21fa536fd7f66052e04f668babfb%2F3548d72da48e443ab0113311c1ed5e99",
        credit: "Freek van den Bergh / AFP via Getty Images / Associated Press. Displays a glass case containing Benin Bronzes during the formal ownership transfer signing ceremony between Dutch and Nigerian officials at the Wereldmuseum in Leiden, Netherlands, February 19, 2025.",
        license: "Rights-Managed editorial license required from Agence France-Presse (AFP) or Getty Images for public reproduction. The image is distributed under standard Associated Press (AP Photo) news syndication parameters."
      },
      eventDate: "2025-06-18",
      places: [
        "national-museum-lagos"
      ]
    },
    {
      image: noImage,
      section: "return",
      key: "mowaa-protest",
      title: "A Museum Opening Disrupted",
      slug: "a-museum-opening-disrupted",
      eventDate: "2025-11-09",
      dateDisplay: "9 November 2025",
      description: "The Museum of West African Art (MOWAA) in Benin City, a campus of about $25 million designed by Adjaye Associates and led by its executive director, Phillip Ihenacho, was due to open in November 2025. It began as a plan, backed by the then Edo State government, for a museum to house returned bronzes. On 9 November a group of protesters broke into a preview event.\nThe protesters said the museum should be called the Benin Royal Museum and be under the Oba's authority. Oba Ewuare II had asked the governor to stop the opening, and the palace has said it was not consulted. Mr Ihenacho said he believed the protesters were from the palace and that MOWAA had never claimed the Benin Bronzes. On 10 November Edo State's governor, Monday Okpebholo, announced that the land title for the site was being revoked. MOWAA holds no Benin Bronzes.\nSupporters of MOWAA say it will serve the whole region. The palace says the bronzes were taken from the royal court and belong in the royal court's care. The dispute shows that the return of the objects raises hard questions about who should look after them.",
      people: [
        "ewuare-ii"
      ],
      places: [
        "benin-city"
      ]
    },
    {
      key: "cambridge",
      section: "return",
      title: "Cambridge Transfers Ownership of 116 Objects",
      slug: "cambridge-transfers-ownership-of-116-objects",
      eventDate: "2026-02-08",
      dateDisplay: "8 February 2026",
      description: "The University of Cambridge's Museum of Archaeology and Anthropology announced on 8 February 2026 that it had transferred legal ownership of 116 Benin objects to Nigeria's National Commission for Museums and Monuments. The Charity Commission had approved the move, and the commission holds the objects under an arrangement with the Benin Royal Palace.\nPhysical transfer of most objects was to be arranged later. In October 2026, the Museum of Looted Antiquities reported that 99 of them are to be shown at the National Museum in Lagos, with 17 staying in Cambridge on long-term loan. Not all returned objects go to Benin City, and where they should be shown remains part of the wider debate.",
      image: {
        url: "https://thejournalnigeria.com/wp-content/uploads/2026/02/IMG_20260209_132143.jpg",
        credit: "The Guardian",
        license: "Copyrighted / Editorial Use Only"
      },
      places: [
        "cambridge-maa"
      ]
    },
    {
      image: noImage,
      section: "return",
      key: "switzerland",
      title: "Switzerland Returns 18 Objects",
      slug: "switzerland-returns-18-objects",
      eventDate: "2026-06-29",
      dateDisplay: "29 June 2026",
      description: "Three Swiss museums, the Ethnographic Museum of the University of Zurich, the Museum Rietberg in Zurich and the Musée d'ethnographie de Genève, returned 18 Benin objects to Nigeria at a ceremony at the National Museum in Lagos. The decision to transfer ownership of 28 objects in total was signed on 20 March 2026, and nine works stay in Switzerland on loan at the Museum Rietberg and one at the Geneva museum.\nMost of the 18 objects are to go to Benin City, where they will be stored for now at the Oba Ovonramwen storage facility of the National Museum there. The Oba received the objects at the palace soon after, and said that to delay their return is to continue dispossession by other means. The Swiss project, the Benin Initiative Switzerland, began in 2021.",
      people: [
        "ewuare-ii"
      ],
      places: [
        "national-museum-lagos",
        "palace"
      ]
    },
    {
      image: noImage,
      section: "living",
      key: "iyoba-statue",
      title: "A Queen Mother in Bronze",
      slug: "a-queen-mother-in-bronze",
      eventDate: "2023-06-30",
      dateDisplay: "2023",
      description: "In 2023 Oba Ewuare II unveiled a 22-foot bronze statue of his mother, Queen Mother Ikuoyemwen, the Iyoba of Uselu, at Five Junction in Benin City. It was made over months by sculptors from several foundries on Igun Street.\nBenin City has had few public monuments in bronze, which long frustrated casters, and the statue was a sign of what the craft can still do. Priestesses, dancers in coral beads and dignitaries took part in the unveiling.",
      people: [
        "ewuare-ii"
      ],
      places: [
        "igun",
        "benin-city"
      ]
    },
    {
      image: noImage,
      section: "living",
      key: "igun-today",
      title: "Igun Street Today",
      slug: "igun-street-today",
      eventDate: "2026-06-30",
      dateDisplay: "2026",
      description: "On Igun Street the casters still work with clay, wax and molten brass in the way their ancestors did, and still pass on skills from parent to child. A 2026 Al Jazeera report counted fewer than 40 active art shops and barely two dozen foundries, many of which had not been in use for weeks.\nThe casters say that young people are leaving the craft for other work, and that the price of brass has risen from about 500 naira to nearly 8,000 naira a kilogram in five years. To keep the craft alive the guild has relaxed its old rule that only family members could learn it, and people from outside can now join through initiation. Younger casters sell through social media and build online galleries.",
      people: [],
      places: [
        "igun"
      ]
    },
    {
      image: noImage,
      section: "living",
      key: "digital-benin",
      title: "Digital Benin",
      slug: "digital-benin",
      eventDate: "2026-07-01",
      dateDisplay: "Today",
      description: "Digital Benin is a non-profit research project that gathers records of Benin objects held in museums around the world. Its team has sorted more than 12,000 museum catalogue cards by hand and transcribed thousands of them, and in doing so has found wrong labels, names and dates on museum records.\nIt is also building a library of oral histories, with local names and pronunciations recorded from elderly people in Benin. A researcher on the project told Al Jazeera that the aim is to help people see the objects as things that had meaning where they were made, and not only as museum pieces.",
      people: [],
      places: [
        "benin-city"
      ]
    }
  ],
  artifacts: [
    {
      key: "plaque",
      section: "court",
      place: "palace",
      title: "Benin Bronze Plaque",
      slug: "benin-bronze-plaque",
      artifactType: "Brass relief plaque",
      dateDisplay: "16th to 17th century",
      description: "Rectangular relief plaques once decorated the wooden pillars of the Oba's palace. Arranged in rows, they formed narrative friezes showing court ceremonies, warriors and Portuguese traders. They were made by lost-wax casting.",
      historicalContext: "Plaques of this type are held today in the British Museum, in Berlin and in other collections.",
      image: {
        url: "https://www.art-prints-on-demand.com/kunst/noartist/a/afinebeninbronzeplaqueinh_hi.jpg",
        credit: "Christie's / Art-Prints-On-Demand.com",
        license: "Public Domain (Historical artwork); website terms apply for the specific digital print file usage"
      }
    },
    {
      key: "head",
      section: "court",
      place: "palace",
      title: "Commemorative Head of an Oba",
      slug: "commemorative-head-of-an-oba",
      artifactType: "Brass head",
      dateDisplay: "16th to 18th century",
      description: "Cast brass heads honoured deceased Obas and were placed on royal ancestral altars. This naturalistic form, often with a coral-bead collar, is one of the best-known Benin art forms.",
      historicalContext: "Examples are held in the British Museum, in Berlin and at the Smithsonian.",
      image: {
        url: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/312290/674960/main-image",
        credit: "The Metropolitan Museum of Art, New York, The Michael C. Rockefeller Wing",
        license: "CC0 1.0 Universal (Public Domain Dedication) / Open Access"
      }
    },
    {
      key: "commander",
      section: "court",
      place: "palace",
      title: "Figure of a Military Commander",
      slug: "figure-of-a-military-commander",
      artifactType: "Brass figure",
      dateDisplay: "17th to 18th century",
      description: "A standing figure of a military commander holding a sword or ceremonial staff, shown with coral beads and a leopard-tooth necklace. Figures like this commemorated important court officials and were displayed in the palace or in shrines.",
      historicalContext: "Examples are held in the British Museum, in Berlin and at the Horniman Museum.",
      image: {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0uNEddqyDSJnzRe04xYXFvlZnzonDZc2C8HSvz9Ojag&s=10",
        credit: "Historical Royal Court Art of the Benin Empire / Photo distributed via social network hosting",
        license: "Public Domain (Historical artwork); educational / personal fair use applies to the specific digital image file"
      }
    },
    {
      key: "portuguese-plaque",
      section: "court",
      place: "palace",
      title: "Portuguese Trader Plaque",
      slug: "portuguese-trader-plaque",
      artifactType: "Brass relief plaque",
      dateDisplay: "16th century",
      description: "A plaque made by the Edo people of the kingdom of Benin in the 16th or 17th century depicts a Portuguese explorer or trader.",
      historicalContext: "Examples are held in the British Museum and in Berlin.",
      image: {
        url: "https://cdn.britannica.com/00/134500-004-ACD60E9E.jpg",
        credit: "© Photograph by CJ Nye. Brooklyn Museum, New York, gift of Arturo and Paul Peralta-Ramos, 56.6.74",
        license: "CC0 1.0 Universal (Public Domain Dedication) / Open Access"
      }
    },
    {
      image: noImage,
      key: "idia-mask",
      section: "sacred-court",
      place: "met-museum",
      title: "Ivory Pendant Mask of Queen Mother Idia",
      slug: "ivory-pendant-mask-of-queen-mother-idia",
      artifactType: "Carved ivory pendant mask",
      dateDisplay: "Sixteenth century",
      description: "A small carved ivory mask of a woman's face, made to be worn at the Oba's hip. Its crown and collar are an openwork band of tiny heads of Portuguese men, a sign of the Oba's relationship with the foreign traders. Several of these masks survive, in the British Museum, the Metropolitan Museum of Art and elsewhere, and tradition links them with Queen Mother Idia.\nThe mask in the British Museum has been in London since 1910. In 1977 a replica of it became the emblem of FESTAC 77.",
      historicalContext: "Oba Akenzua II identified the masks as portraits of Idia in a newspaper article in 1956. The British Museum's original is not currently on display."
    },
    {
      image: noImage,
      key: "okukor",
      section: "return",
      place: "palace",
      title: "Okukor, the Bronze Cockerel",
      slug: "okukor-the-bronze-cockerel",
      artifactType: "Cast brass cockerel",
      dateDisplay: "Before 1897",
      description: "A cast brass cockerel, known as Okukor, taken from Benin in 1897 and given to Jesus College, Cambridge, in 1905 by the father of a student. The college removed it from its hall in 2017 after a student protest, and returned it in October 2021.\nIt was received at the palace in Benin City in February 2022, together with the head of an Oba from the University of Aberdeen.",
      historicalContext: "The college's working group concluded that the cockerel belongs with the Oba of Benin."
    },
    {
      image: noImage,
      key: "aberdeen-head",
      section: "return",
      place: "palace",
      title: "Bronze Head of an Oba (Aberdeen)",
      slug: "bronze-head-of-an-oba-aberdeen",
      artifactType: "Cast brass commemorative head",
      dateDisplay: "Before 1897",
      description: "A cast brass head of an Oba, made to stand on a royal ancestral altar. It was bought by the University of Aberdeen at a Sotheby's auction in 1957. In March 2021 the university's governing board voted to return it, and it was handed over on 28 October 2021.",
      historicalContext: "The university said it had been acquired in a way that it now considers extremely immoral."
    },
    {
      image: noImage,
      key: "osemwende-heads",
      section: "return",
      place: "national-museum-lagos",
      title: "Commemorative Heads of Oba Osemwende",
      slug: "commemorative-heads-of-oba-osemwende",
      artifactType: "Cast brass commemorative heads",
      dateDisplay: "Nineteenth century",
      description: "Cast brass heads made to honour Oba Osemwende, who reigned before Oba Adolo. They were among the objects returned by the Ethnographic Museum of the University of Zurich and the Museum Rietberg, and were shown at the National Museum in Lagos at the handover on 29 June 2026.",
      historicalContext: "Heads such as these stood on the altars of the Obas to honour their predecessors."
    }
  ],
  sectionPeople: {
    origins: [
      "oranmiyan"
    ],
    kingdom: [
      "eweka-i",
      "oranmiyan"
    ],
    "warrior-kings": [
      "ewuare",
      "ozolua",
      "esigie",
      "idia"
    ],
    "sacred-court": [
      "idia",
      "esigie",
      "ewuare"
    ],
    court: [
      "esigie"
    ],
    strain: [
      "akenzua-i",
      "ovonramwen"
    ],
    fall: [
      "phillips",
      "rawson",
      "ovonramwen",
      "agho-obaseki"
    ],
    restoration: [
      "ovonramwen",
      "eweka-ii",
      "agho-obaseki",
      "akenzua-ii",
      "erediauwa",
      "ewuare-ii"
    ],
    asking: [
      "akenzua-ii",
      "erhabor-emokpae",
      "peju-layiwola",
      "egharevba"
    ],
    living: [
      "peju-layiwola",
      "ewuare-ii"
    ]
  },
  sectionPlaces: {
    origins: [
      "benin-city",
      "ile-ife"
    ],
    kingdom: [
      "benin-city",
      "palace",
      "ile-ife"
    ],
    "warrior-kings": [
      "benin-city",
      "idah",
      "uselu"
    ],
    "sacred-court": [
      "palace",
      "uselu",
      "benin-city"
    ],
    court: [
      "igun",
      "palace",
      "met-museum"
    ],
    trade: [
      "benin-city",
      "british-museum"
    ],
    strain: [
      "benin-city",
      "palace"
    ],
    fall: [
      "benin-city",
      "calabar"
    ],
    scattered: [
      "british-museum",
      "met-museum"
    ],
    restoration: [
      "palace",
      "calabar"
    ],
    asking: [
      "british-museum",
      "national-museum-lagos"
    ],
    return: [
      "abuja",
      "cambridge-maa",
      "national-museum-lagos",
      "british-museum"
    ],
    living: [
      "igun",
      "benin-city"
    ]
  },
  sources: [
    {
      key: "britannica-benin",
      title: "Benin - historical kingdom, West Africa",
      publication: "Encyclopaedia Britannica",
      sourceType: "encyclopedia",
      url: "https://www.britannica.com/place/Benin-historical-kingdom-West-Africa"
    },
    {
      key: "khan-bronzes",
      title: "The Benin 'Bronzes': a story of violence, theft, and artistry",
      publication: "Khan Academy",
      sourceType: "educational",
      url: "https://www.khanacademy.org/humanities/art-africa/west-africa/nigeria/a/the-benin-bronzes-a-story-of-violence-theft-and-artistry"
    },
    {
      key: "wiki-bronzes",
      title: "Benin Bronzes",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Benin_bronzes",
      note: "Wikipedia is a general reference. Check its own citations before relying on it."
    },
    {
      key: "bbc-germany",
      title: "Benin Bronzes: Germany returns looted artefacts to Nigeria",
      publication: "BBC News",
      sourceType: "news",
      url: "https://www.bbc.com/news/world-africa-64038626",
      citation: "BBC News, December 2022."
    },
    {
      key: "ancient-origins-walls",
      title: "The Walls of Benin: Four Times Longer Than The Great Wall of China!",
      publication: "Ancient Origins",
      sourceType: "magazine",
      url: "https://www.ancient-origins.net/ancient-places-africa/walls-benin-0016222",
      citation: "Ancient Origins, December 2021.",
      note: "Popular history magazine. Used for context only."
    },
    {
      key: "archaeology-worlds",
      title: "Ancient Walls of Benin: Longer Than the Great Wall of China",
      publication: "Archaeology Worlds",
      sourceType: "magazine",
      url: "https://archaeologyworlds.com/ancient-walls-benin-longer-great-wall-china/",
      citation: "Archaeology Worlds, September 2024.",
      note: "Popular history site. Used for context only."
    },
    {
      key: "dutum",
      title: "What makes the Oba of Benin Royal Palace unique",
      publication: "Dutum Group",
      sourceType: "web",
      url: "https://dutumgroup.com/what-makes-the-oba-of-benin-royal-palace-unique/",
      citation: "Dutum Group, 2025.",
      note: "Non-specialist source. Used for context only."
    },
    {
      key: "ecoi",
      title: "The Oba of Benin: rituals and practices",
      publication: "Immigration and Refugee Board of Canada",
      sourceType: "government report",
      url: "https://www.ecoi.net/en/document/1146102.html",
      citation: "Immigration and Refugee Board of Canada, February 2002."
    },
    {
      key: "edoworld",
      title: "Benin kingdom Historical Sites",
      publication: "Edoworld.net",
      sourceType: "web",
      url: "http://www.edoworld.net/Benin_kingdom_Historical_Sites.html",
      note: "Community website. Used for context only."
    },
    {
      key: "blueprint-igun",
      title: "The untold story of Igun, Nigeria's centre of bronze casting",
      publication: "Blueprint",
      sourceType: "news",
      url: "https://blueprint.ng/the-untold-story-of-igun-nigerias-centre-of-bronze-casting/",
      citation: "Blueprint, September 2021."
    },
    {
      key: "britannica-ewuare",
      title: "Ewuare the Great",
      publication: "Encyclopaedia Britannica",
      sourceType: "encyclopedia",
      url: "https://www.britannica.com/biography/Ewuare-the-Great"
    },
    {
      key: "wiki-ewuare",
      title: "Ewuare",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Ewuare",
      note: "Wikipedia is a general reference. Check its own citations before relying on it."
    },
    {
      key: "barbados-ewuare",
      title: "#AfricanAwarenessMonth - Ewuare the Great - King of Benin",
      publication: "Barbados Today",
      sourceType: "news",
      url: "https://barbadostoday.bb/2023/02/18/ewuare-the-great-king-of-benin/",
      citation: "Barbados Today, February 2023."
    },
    {
      key: "africarebirth",
      title: "What Are the Benin Bronzes? Inside the Royal Art of the Kingdom of Benin",
      publication: "Africa Rebirth",
      sourceType: "web",
      url: "https://www.africarebirth.com/what-are-the-benin-bronzes-inside-the-royal-art-of-the-kingdom-of-benin/",
      citation: "Africa Rebirth, April 2026.",
      note: "General-interest site. Used for context only."
    },
    {
      key: "plos-brass",
      title: "German brass for Benin Bronzes: Geochemical analysis insights into the early Atlantic trade",
      publication: "PLOS ONE",
      sourceType: "academic",
      url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0283415",
      coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeWx1Nu4mYDTdjYbUf-vvqp1adWRAg4YOtswLanuFsvQ&s",
      citation: "PLOS ONE, April 2023."
    },
    {
      key: "british-museum",
      title: "Benin Bronzes",
      publication: "The British Museum",
      sourceType: "museum",
      url: "https://www.britishmuseum.org/about-us/british-museum-story/contested-objects-collection/benin-bronzes",
      note: "The museum is a party to the restitution debate."
    },
    {
      key: "met-brilliance",
      title: "Recovering the Brilliance of a Benin Bronze",
      publication: "The Metropolitan Museum of Art",
      sourceType: "museum",
      url: "https://www.metmuseum.org/essays/recovering-benin-bronze",
      citation: "The Metropolitan Museum of Art, August 2022."
    },
    {
      key: "artnet-casters",
      title: "The Benin Bronzes Aren't Just Ancient History. Meet the Contemporary Casters Who Are Still Making Them Today",
      publication: "Artnet News",
      sourceType: "news",
      url: "https://news.artnet.com/art-world/barnaby-philips-benin-1967703",
      citation: "Artnet News, May 2021."
    },
    {
      key: "wiki-massacre",
      title: "Benin Massacre",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Benin_Massacre",
      note: "Wikipedia is a general reference. 'Massacre' is the British name for the event."
    },
    {
      key: "wiki-phillips",
      title: "James Robert Phillips",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/James_Robert_Phillips",
      note: "Wikipedia is a general reference. Check its own citations before relying on it."
    },
    {
      key: "dw-germany",
      title: "Germany returns Benin Bronzes to Nigeria",
      publication: "DW",
      sourceType: "news",
      url: "https://www.dw.com/en/germany-returns-benin-bronzes-to-nigeria/a-62323704",
      citation: "DW, July 2022."
    },
    {
      key: "euronews-nl",
      title: "Netherlands returns more than 100 Benin Bronzes looted from Nigeria",
      publication: "Euronews",
      sourceType: "news",
      url: "https://www.euronews.com/2025/06/19/netherlands-returns-more-than-100-benin-bronzes-looted-from-nigeria",
      citation: "Euronews, June 2025."
    },
    {
      key: "gov-nl",
      title: "Benin Bronzes from the Netherlands returning home to Nigeria",
      publication: "Government of the Netherlands",
      sourceType: "government",
      url: "https://www.government.nl/latest/news/2025/06/18/benin-bronzes-from-the-netherlands-returning-home-to-nigeria",
      citation: "Government of the Netherlands, June 2025."
    },
    {
      key: "bbc-cambridge",
      title: "Looted African artefacts to be returned by Cambridge University",
      publication: "BBC News",
      sourceType: "news",
      url: "https://www.bbc.com/news/articles/c4g2l9j0ny1o",
      citation: "BBC News, February 2026."
    },
    {
      key: "artnewspaper-cambridge",
      title: "Cambridge University to return 100 Benin Bronzes to Nigeria",
      publication: "The Art Newspaper",
      sourceType: "news",
      url: "https://www.theartnewspaper.com/2026/02/09/cambridge-university-return-100-benin-bronzes-nigeria",
      citation: "The Art Newspaper, 9 February 2026."
    },
    {
      key: "horniman",
      title: "Horniman returns ownership of Benin Bronzes to Nigeria",
      publication: "Horniman Museum",
      sourceType: "museum",
      url: "https://www.horniman.ac.uk/news/horniman-returns-ownership-of-benin-bronzes-to-nigeria/",
      citation: "Horniman Museum, November 2022."
    },
    {
      key: "smithsonian",
      title: "Smithsonian Transfers Ownership of Benin Bronzes to Nigeria",
      publication: "Smithsonian Institution",
      sourceType: "museum",
      url: "https://www.si.edu/newsdesk/releases/smithsonian-transfers-ownership-benin-bronzes-nigeria",
      citation: "Smithsonian Institution, October 2022."
    },
    {
      key: "news-ab",
      title: "The Benin Bronzes after restitution: ownership, custody and what comes next",
      publication: "News-AB",
      sourceType: "web",
      url: "https://news-ab.com/en/topics/ngde-bronzes-2026/",
      citation: "News-AB, February 2026.",
      note: "Secondary source. Used for context only."
    },
    {
      key: "guinness-earthworks",
      title: "Longest earthworks of the pre-mechanical era",
      publication: "Guinness World Records",
      sourceType: "reference",
      url: "https://www.guinnessworldrecords.com/world-records/97959-longest-earthworks-of-the-pre-mechanical-era"
    },
    {
      key: "nasa-earthworks",
      title: "A Glimpse of History in Benin City",
      publication: "NASA Earth Observatory",
      sourceType: "government",
      url: "https://earthobservatory.nasa.gov/images/154894/a-glimpse-of-history-in-benin-city"
    },
    {
      key: "cambridge-release",
      title: "Cambridge University returns legal ownership of 116 Benin artefacts to Nigeria's National Commission for Museums and Monuments",
      publication: "University of Cambridge",
      sourceType: "press release",
      url: "https://www.cam.ac.uk/stories/benin-artefacts-return",
      citation: "University of Cambridge, 8 February 2026."
    },
    {
      key: "npr-germany",
      title: "Germany returns looted artifacts to Nigeria to rectify a 'dark colonial history'",
      publication: "NPR",
      sourceType: "news",
      url: "https://www.wunc.org/2022-12-21/germany-returns-looted-artifacts-to-nigeria-to-rectify-a-dark-colonial-history",
      citation: "NPR, 21 December 2022."
    },
    {
      key: "wiki-kingdom",
      title: "Kingdom of Benin",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Kingdom_of_Benin"
    },
    {
      key: "wiki-eweka-i",
      title: "Eweka I",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Eweka_I"
    },
    {
      key: "worldhistory-benin",
      title: "Kingdom of Benin",
      publication: "World History Encyclopedia",
      sourceType: "encyclopedia",
      url: "https://www.worldhistory.org/Kingdom_of_B%C3%A9nin/"
    },
    {
      key: "blackpast-obas",
      title: "The Obas of Benin: A Brief History of the Rulers of a West African State for Nine Centuries",
      publication: "BlackPast",
      sourceType: "web",
      url: "https://www.blackpast.org/global-african-history/the-obas-of-benin-a-brief-history-of-the-rulers-of-a-west-african-state-for-nine-centuries/"
    },
    {
      key: "edoworld-custodian",
      title: "Benin Kingdom as a Custodian of African Traditional Heritage",
      publication: "Edoworld.net (paper by Aiko Obobaifo)",
      sourceType: "web",
      url: "https://edoworld.net/BENIN_KINGDOM_AS_A_CUSTODIAN_OF_AFRICAN_TRADITIONAL_HERITAGE.html",
      note: "A paper by an Edo author, delivered at a symposium in Benin City. Useful for the Edo account of the Ogiso and Oba dynasties and the three orders of chiefs."
    },
    {
      key: "edo-words-glossary",
      title: "Edo words, language and phonology",
      publication: "Dawodu.net",
      sourceType: "web",
      url: "https://dawodu.net/articles/edo-wordslanguage-phonology-1555"
    },
    {
      key: "ebsco-portuguese",
      title: "Portuguese Establish a Foothold in Africa",
      publication: "EBSCO Research Starters",
      sourceType: "encyclopedia",
      url: "https://www.ebsco.com/research-starters/history/portuguese-establish-foothold-africa"
    },
    {
      key: "ebsco-decline",
      title: "Decline of Benin",
      publication: "EBSCO Research Starters",
      sourceType: "encyclopedia",
      url: "https://ebsco.com/research-starters/history/decline-benin"
    },
    {
      key: "everyculture-edo",
      title: "Edo: History and Cultural Relations",
      publication: "Countries and Their Cultures",
      sourceType: "encyclopedia",
      url: "https://www.everyculture.com/Africa-Middle-East/Edo-History-and-Cultural-Relations.html"
    },
    {
      key: "jah-civil-war",
      title: "Civil War in the Kingdom of Benin, 1689-1721: Continuity or Political Change?",
      publication: "Journal of African History (Paula Ben-Amos Girshick and John Thornton, 2001)",
      sourceType: "academic",
      url: "https://doi.org/10.1017/S0021853701007915"
    },
    {
      key: "dhspriory-1486",
      title: "1486 mission to Benin (translated extracts from Ruy de Pina and João de Barros)",
      publication: "Dominican House of Studies, Washington (from J. W. Blake, Europeans in West Africa)",
      sourceType: "primary source",
      url: "https://dhspriory.org/kenny/DH01E.htm",
      note: "Translated extracts from Portuguese chroniclers. They are Portuguese accounts, so they show what Portugal recorded, not what Benin said."
    },
    {
      key: "edoworld-ryder",
      title: "Edo Warrior Kingdom Opposed Atlantic Slave Trade",
      publication: "Edoworld.net",
      sourceType: "web",
      url: "https://edoworld.net/Edo_Warrior_Kingdom_Opposed_Atlantic_Slave_Trade.html",
      note: "A community website that quotes Alan Ryder's Benin and the Europeans. It argues one side of the debate, so read it with the other sources on the chapter."
    },
    {
      key: "ajol-guild",
      title: "The Origin and Development of the Guild of Bronze Casters of Benin Kingdom up to 1914",
      publication: "International Journal of Arts and Humanities (Ese Vivian Odiahi, 2017)",
      sourceType: "academic",
      url: "https://www.ajol.info/index.php/ijah/article/view/152306"
    },
    {
      key: "sothebys-guilds",
      title: "Commemorative Heads of the Oba for Members of the Brass Casters Guild (catalogue note)",
      publication: "Sotheby's",
      sourceType: "web",
      url: "https://sothebys.com/en/auctions/ecatalogue/2015/african-oceanic-n09347/lot.188.html",
      note: "An auction house note. It draws on scholars including Kingsley Inneh and Philip Igbafe."
    },
    {
      key: "wiki-igun-street",
      title: "Igun Street",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Igun_Street"
    },
    {
      key: "aljazeera-casting",
      title: "'If it dies, it's on you': Saving Nigeria's Benin bronze casting",
      publication: "Al Jazeera (Orji Sunday, 3 July 2026)",
      sourceType: "news",
      url: "https://www.aljazeera.com/features/longform/2026/7/3/if-it-dies-its-on-you-saving-nigerias-benin-bronze-casting"
    },
    {
      key: "met-idia",
      title: "Idia: The First Queen Mother of Benin",
      publication: "The Metropolitan Museum of Art",
      sourceType: "museum",
      url: "https://www.metmuseum.org/essays/idia-the-first-queen-mother-of-benin"
    },
    {
      key: "digitalbenin-idia",
      title: "Digital Benin catalogue record for an ivory pendant mask",
      publication: "Digital Benin",
      sourceType: "web",
      url: "https://digitalbenin.org/catalogue/344_BELC716"
    },
    {
      key: "wiki-ivory-mask",
      title: "Benin ivory mask",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Benin_ivory_mask"
    },
    {
      key: "bm-idia-mask",
      title: "Collection record: ivory pendant mask and FESTAC 77 emblem",
      publication: "The British Museum",
      sourceType: "museum",
      url: "https://www.britishmuseum.org/collection/object/E_CRS-50"
    },
    {
      key: "bpb-rezeption",
      title: "Eine Rezeptionsgeschichte der Benin-Bronzen (a reception history of the Benin bronzes, in German)",
      publication: "Bundeszentrale für politische Bildung",
      sourceType: "web",
      url: "https://www.bpb.de/apuz/nigeria-2021/337818/eine-rezeptionsgeschichte-der-benin-bronzen"
    },
    {
      key: "nybooks-repair",
      title: "A Delicate Repair",
      publication: "The New York Review of Books (4 October 2026)",
      sourceType: "news",
      url: "https://www.nybooks.com/online/2026/10/04/a-delicate-repair-benin-bronzes/"
    },
    {
      key: "thisday-custodians",
      title: "The Last of the Custodians (Tam Fiofori)",
      publication: "ThisDay (Nigeria)",
      sourceType: "news",
      url: "https://thisdaylive.com/index.php/2016/08/14/the-last-of-the-custodians"
    },
    {
      key: "pulse-alufa",
      title: "The story of the man who carved Queen Idia's mask, got no pay, and watched another man take the credit",
      publication: "Pulse Nigeria (October 2026)",
      sourceType: "news",
      url: "https://www.pulse.ng/story/festac-77-queen-idia-mask-carver-joseph-obayagbona-2026100110251123951"
    },
    {
      key: "wiki-ovonramwen",
      title: "Ovonramwen",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Ovonramwen"
    },
    {
      key: "edoworld-ovonramwen",
      title: "Oba Ovonramwen (1888 to 1914)",
      publication: "Edoworld.net (Osahon Naiwuere)",
      sourceType: "web",
      url: "https://www.edoworld.net/OBA_OVONRAMWEN_NOGBAISI.html"
    },
    {
      key: "camb-archive",
      title: "Archive description: Benin and the 1897 expedition",
      publication: "Cambridge University archives",
      sourceType: "web",
      url: "https://archivesearch.lib.cam.ac.uk/repositories/2/archival_objects/213172"
    },
    {
      key: "artic-benin",
      title: "Benin: Kings and Rituals (the conquest and its aftermath)",
      publication: "Art Institute of Chicago",
      sourceType: "museum",
      url: "https://archive.artic.edu/benin/conquest"
    },
    {
      key: "wiki-agho-obaseki",
      title: "Agho Obaseki",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Agho_Obaseki"
    },
    {
      key: "edoworld-eweka-ii",
      title: "Oba Eweka II",
      publication: "Edoworld.net",
      sourceType: "web",
      url: "https://edoworld.net/Oba_Eweka_II.html"
    },
    {
      key: "legit-eweka-ii",
      title: "Retro: The life and times of Oba Eweka II of Benin",
      publication: "Legit.ng",
      sourceType: "news",
      url: "https://www.legit.ng/1183204-retro-the-life-times-oba-eweka-ii-benin.html"
    },
    {
      key: "wiki-akenzua-ii",
      title: "Akenzua II",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Akenzua_II"
    },
    {
      key: "wiki-akengbuda",
      title: "Akengbuda",
      publication: "Wikipedia",
      sourceType: "encyclopedia",
      url: "https://en.wikipedia.org/wiki/Akengbuda"
    },
    {
      key: "natgeo-uk",
      title: "Benin bronzes return to Nigeria",
      publication: "National Geographic",
      sourceType: "news",
      url: "https://www.nationalgeographic.co.uk/travel/2022/09/benin-bronzes-return-to-nigeria"
    },
    {
      key: "returningheritage-aberdeen",
      title: "University of Aberdeen repatriates a Benin bronze head to Edo State",
      publication: "Returning Heritage",
      sourceType: "web",
      url: "https://returningheritage.com/university-of-aberdeen-repatriates-a-benin-bronze-head-to-edo-state"
    },
    {
      key: "layiwola-site",
      title: "Benin1897.com",
      publication: "Peju Layiwola (artist's website)",
      sourceType: "web",
      url: "https://pejulayiwola.com/benin1897-com/"
    },
    {
      key: "modernghana-layiwola",
      title: "Revisiting the 1897 destruction of Benin",
      publication: "ModernGhana",
      sourceType: "news",
      url: "https://www.modernghana.com/news/270386/revisiting-the-1897-destruction-of-benin.html"
    },
    {
      key: "modernghana-colloquium",
      title: "In Lagos, 'Benin 1897.com' spurs looted artefacts' debate",
      publication: "ModernGhana (from Compass Newspaper, Nigeria)",
      sourceType: "news",
      url: "https://www.modernghana.com/news/272203/in-lagos-benin-1897com-spurs-looted-artefacts-debate.html"
    },
    {
      key: "thisday-layiwola",
      title: "A Toast to a Resilient Art Amazon",
      publication: "ThisDay (Nigeria, 2017)",
      sourceType: "news",
      url: "https://www.thisdaylive.com/2017/12/03/a-toast-to-a-resilient-art-amazon/"
    },
    {
      key: "artnewspaper-jesus",
      title: "Cambridge University college becomes first UK institution to return looted Benin bronze to Nigeria",
      publication: "The Art Newspaper",
      sourceType: "news",
      url: "https://www.theartnewspaper.com/2021/10/28/cambridge-university-college-becomes-first-uk-institution-to-return-looted-benin-bronze-to-nigeria"
    },
    {
      key: "guardian-ng-okpa",
      title: "125 years after invasion of Benin, Okpa and Uhunilao return",
      publication: "The Guardian (Nigeria)",
      sourceType: "news",
      url: "https://guardian.ng/art/125-years-after-invasion-of-benin-okpa-uhunilao-return/"
    },
    {
      key: "thisday-heat",
      title: "Now that Nigeria has turned up the heat on the looters",
      publication: "ThisDay (Nigeria, 31 October 2021)",
      sourceType: "news",
      url: "https://www.thisdaylive.com/2021/10/31/now-that-nigeria-has-turned-up-the-heat-on-the-looters/"
    },
    {
      key: "artnet-mowaa",
      title: "Protest erupts at Benin's Museum of West African Art, delaying its opening",
      publication: "Artnet News",
      sourceType: "news",
      url: "https://news.artnet.com/art-world/benin-mowaa-opening-delayed-protesters-271079"
    },
    {
      key: "apollo-mowaa",
      title: "What has gone wrong at the Museum of West African Art? (Barnaby Phillips)",
      publication: "Apollo Magazine, 15 December 2025",
      sourceType: "news",
      url: "https://apollo-magazine.com/?p=1036066"
    },
    {
      key: "nairametrics-mowaa",
      title: "Protest stops opening of $25 million Museum of West African Art in Benin City",
      publication: "Nairametrics (Nigeria)",
      sourceType: "news",
      url: "https://nairametrics.com/2025/11/10/protest-stops-opening-of-25-million-museum-of-west-african-art-in-benin-city/"
    },
    {
      key: "channels-okpebholo",
      title: "Benin Bronzes belong to Oba's palace and not for politics, says Okpebholo",
      publication: "Channels Television (Nigeria), 1 July 2026",
      sourceType: "news",
      url: "https://www.channelstv.com/2026/07/01/benin-bronzes-belong-to-obas-place-and-not-for-politics-says-okpebholo/"
    },
    {
      key: "museumsassoc-cambridge",
      title: "Cambridge University transfers ownership of 116 Benin bronzes to Nigeria",
      publication: "Museums Association",
      sourceType: "news",
      url: "https://www.museumsassociation.org/museums-journal/news/2026/02/cambridge-university-transfers-ownership-of-116-benin-bronzes-to-nigeria/"
    },
    {
      key: "premiumtimes-cambridge",
      title: "Cambridge University to repatriate looted artefacts to Nigeria",
      publication: "Premium Times (Nigeria)",
      sourceType: "news",
      url: "https://www.premiumtimesng.com/news/top-news/856006-cambridge-university-to-repatriate-looted-artefacts-to-nigeria.html"
    },
    {
      key: "restitutionmatters-lagos",
      title: "Benin bronzes, after return by Cambridge University, in National Museum, Lagos",
      publication: "Restitution Matters (summarising Museum of Looted Antiquities, October 2026)",
      sourceType: "web",
      url: "https://restitutionmatters.org/publication/11331/"
    },
    {
      key: "maa-cambridge-return",
      title: "Our approach to the return of museum objects",
      publication: "Museum of Archaeology and Anthropology, Cambridge",
      sourceType: "museum",
      url: "https://maa.cam.ac.uk/about/our-approach-return-museum-objects"
    },
    {
      key: "swiss-release",
      title: "Restitution to Nigeria: Swiss museums return 18 major artefacts (press release, 29 June 2026)",
      publication: "Swiss Federal Department of Foreign Affairs",
      sourceType: "press release",
      url: "https://www.eda.admin.ch/en/newnsb/NmoDpfWO7_yNQ8ugRMxRn"
    },
    {
      key: "scmp-swiss",
      title: "Switzerland returns famed Benin Bronzes to Nigeria",
      publication: "South China Morning Post",
      sourceType: "news",
      url: "https://www.scmp.com/news/world/africa/article/3358811/switzerland-returns-famed-benin-bronzes-nigeria"
    },
    {
      key: "vanguard-oba-swiss",
      title: "Oba of Benin receives 18 looted artefacts after 125 years",
      publication: "Vanguard (Nigeria, July 2026)",
      sourceType: "news",
      url: "https://www.vanguardngr.com/2026/07/oba-of-benin-receives-18-looted-artefacts-after-125-years/"
    }
  ],
  citations: {
    section: {
      kingdom: [
        "britannica-benin",
        "wiki-eweka-i",
        "worldhistory-benin"
      ],
      court: [
        "british-museum",
        "artnet-casters",
        "ajol-guild",
        "sothebys-guilds"
      ],
      fall: [
        "khan-bronzes",
        "artic-benin"
      ],
      scattered: [
        "british-museum",
        "khan-bronzes",
        "aljazeera-casting"
      ],
      return: [
        "news-ab",
        "artnewspaper-cambridge",
        "swiss-release",
        "restitutionmatters-lagos"
      ],
      origins: [
        "edoworld-custodian",
        "wiki-kingdom",
        "worldhistory-benin"
      ],
      "warrior-kings": [
        "blackpast-obas",
        "ebsco-portuguese"
      ],
      "sacred-court": [
        "edoworld-custodian",
        "blackpast-obas",
        "ecoi"
      ],
      trade: [
        "ebsco-portuguese",
        "worldhistory-benin",
        "dhspriory-1486"
      ],
      strain: [
        "ebsco-decline",
        "jah-civil-war",
        "everyculture-edo"
      ],
      restoration: [
        "artic-benin",
        "wiki-agho-obaseki",
        "edoworld-eweka-ii"
      ],
      asking: [
        "nybooks-repair",
        "natgeo-uk",
        "bm-idia-mask"
      ],
      living: [
        "aljazeera-casting",
        "ajol-guild"
      ]
    },
    person: {
      ewuare: [
        "britannica-ewuare",
        "wiki-ewuare",
        "barbados-ewuare",
        "blackpast-obas"
      ],
      ovonramwen: [
        "britannica-benin",
        "khan-bronzes",
        "wiki-bronzes",
        "wiki-ovonramwen",
        "edoworld-ovonramwen",
        "artic-benin"
      ],
      rawson: [
        "khan-bronzes",
        "wiki-bronzes"
      ],
      phillips: [
        "wiki-phillips",
        "khan-bronzes"
      ],
      "eweka-i": [
        "wiki-eweka-i",
        "britannica-benin"
      ],
      oranmiyan: [
        "wiki-kingdom",
        "edoworld-custodian"
      ],
      ozolua: [
        "ebsco-portuguese",
        "wiki-ewuare"
      ],
      esigie: [
        "ebsco-portuguese",
        "blackpast-obas",
        "sothebys-guilds"
      ],
      idia: [
        "met-idia",
        "digitalbenin-idia",
        "aljazeera-casting",
        "bpb-rezeption"
      ],
      "akenzua-i": [
        "ebsco-decline",
        "wiki-akengbuda"
      ],
      "agho-obaseki": [
        "wiki-agho-obaseki"
      ],
      "eweka-ii": [
        "edoworld-eweka-ii",
        "legit-eweka-ii",
        "artic-benin"
      ],
      "akenzua-ii": [
        "wiki-akenzua-ii",
        "artic-benin",
        "bpb-rezeption",
        "nybooks-repair"
      ],
      erediauwa: [
        "layiwola-site",
        "artnet-mowaa"
      ],
      "ewuare-ii": [
        "artnet-mowaa",
        "vanguard-oba-swiss",
        "aljazeera-casting"
      ],
      egharevba: [
        "edoworld-custodian"
      ],
      "erhabor-emokpae": [
        "bm-idia-mask",
        "nybooks-repair",
        "pulse-alufa"
      ],
      "peju-layiwola": [
        "layiwola-site",
        "modernghana-layiwola",
        "thisday-layiwola"
      ]
    },
    place: {
      "benin-city": [
        "britannica-benin",
        "ancient-origins-walls"
      ],
      palace: [
        "dutum",
        "ecoi",
        "edoworld"
      ],
      igun: [
        "edoworld",
        "blueprint-igun",
        "africarebirth",
        "ajol-guild",
        "aljazeera-casting"
      ],
      "british-museum": [
        "british-museum",
        "khan-bronzes",
        "wiki-bronzes"
      ],
      "ile-ife": [
        "worldhistory-benin"
      ],
      idah: [
        "met-idia"
      ],
      uselu: [
        "met-idia",
        "aljazeera-casting"
      ],
      calabar: [
        "wiki-ovonramwen",
        "artic-benin"
      ],
      abuja: [
        "bbc-germany"
      ],
      "national-museum-lagos": [
        "restitutionmatters-lagos",
        "swiss-release"
      ],
      "cambridge-maa": [
        "maa-cambridge-return",
        "museumsassoc-cambridge"
      ],
      "met-museum": [
        "met-idia",
        "wiki-ivory-mask"
      ]
    },
    event: {
      walls: [
        "guinness-earthworks",
        "nasa-earthworks",
        "ancient-origins-walls",
        "archaeology-worlds"
      ],
      "ewuare-reign": [
        "britannica-ewuare",
        "wiki-ewuare",
        "blackpast-obas"
      ],
      portuguese: [
        "british-museum",
        "plos-brass",
        "africarebirth",
        "ebsco-portuguese"
      ],
      attack: [
        "wiki-massacre",
        "khan-bronzes"
      ],
      expedition: [
        "khan-bronzes",
        "wiki-bronzes",
        "britannica-benin"
      ],
      dispersal: [
        "british-museum",
        "khan-bronzes",
        "aljazeera-casting"
      ],
      germany: [
        "bbc-germany",
        "dw-germany",
        "npr-germany"
      ],
      "horniman-smithsonian": [
        "horniman",
        "smithsonian"
      ],
      decree: [
        "artnewspaper-cambridge",
        "cambridge-release",
        "artnet-mowaa"
      ],
      netherlands: [
        "euronews-nl",
        "gov-nl"
      ],
      cambridge: [
        "cambridge-release",
        "artnewspaper-cambridge",
        "bbc-cambridge",
        "museumsassoc-cambridge",
        "premiumtimes-cambridge",
        "restitutionmatters-lagos"
      ],
      "ogiso-age": [
        "edoworld-custodian",
        "worldhistory-benin"
      ],
      "ekaladerhan-and-ife": [
        "wiki-kingdom",
        "edoworld-custodian"
      ],
      "oba-dynasty": [
        "wiki-eweka-i",
        "britannica-benin",
        "blackpast-obas"
      ],
      "oguola-and-ife-caster": [
        "worldhistory-benin",
        "britannica-benin"
      ],
      "ewuare-reforms": [
        "blackpast-obas",
        "wiki-ewuare",
        "barbados-ewuare"
      ],
      "ozolua-reign": [
        "ebsco-portuguese",
        "wiki-ewuare"
      ],
      "esigie-succession": [
        "blackpast-obas",
        "met-idia"
      ],
      "idah-war": [
        "met-idia",
        "aljazeera-casting"
      ],
      "three-orders": [
        "edoworld-custodian",
        "edo-words-glossary",
        "blackpast-obas"
      ],
      igue: [
        "blackpast-obas",
        "ecoi",
        "edoworld-custodian"
      ],
      "first-iyoba": [
        "met-idia",
        "digitalbenin-idia",
        "bpb-rezeption"
      ],
      "manillas-and-brass": [
        "plos-brass",
        "aljazeera-casting"
      ],
      "brass-casters-organised": [
        "sothebys-guilds",
        "wiki-igun-street",
        "ajol-guild"
      ],
      "envoy-to-lisbon": [
        "dhspriory-1486",
        "ebsco-portuguese"
      ],
      "church-1516": [
        "ebsco-portuguese",
        "dhspriory-1486"
      ],
      "captives-trade": [
        "edoworld-ryder",
        "worldhistory-benin",
        "jah-civil-war"
      ],
      "oba-stays-home": [
        "ebsco-decline"
      ],
      "civil-war": [
        "jah-civil-war",
        "ebsco-decline",
        "everyculture-edo"
      ],
      "akenzua-restores": [
        "wiki-akengbuda",
        "ebsco-decline",
        "blackpast-obas"
      ],
      "ovonramwen-crowned": [
        "wiki-ovonramwen",
        "edoworld-ovonramwen"
      ],
      "gallwey-treaty": [
        "camb-archive",
        "edoworld-ovonramwen"
      ],
      "surrender-and-trial": [
        "camb-archive",
        "artic-benin",
        "wiki-ovonramwen"
      ],
      "ovonramwen-dies": [
        "wiki-ovonramwen",
        "wiki-agho-obaseki"
      ],
      "eweka-ii-crowned": [
        "artic-benin",
        "edoworld-eweka-ii",
        "legit-eweka-ii",
        "wiki-agho-obaseki"
      ],
      "akenzua-ii-reign": [
        "artic-benin",
        "wiki-akenzua-ii"
      ],
      "erediauwa-reign": [
        "layiwola-site"
      ],
      "ewuare-ii-crowned": [
        "artnet-mowaa"
      ],
      "akenzua-requests": [
        "wiki-akenzua-ii",
        "natgeo-uk",
        "aljazeera-casting"
      ],
      "festac-77": [
        "bm-idia-mask",
        "nybooks-repair",
        "thisday-custodians",
        "pulse-alufa"
      ],
      "benin-dialogue-group": [
        "natgeo-uk",
        "returningheritage-aberdeen"
      ],
      "layiwola-1897com": [
        "layiwola-site",
        "modernghana-layiwola",
        "modernghana-colloquium"
      ],
      "jesus-aberdeen": [
        "artnewspaper-jesus",
        "guardian-ng-okpa",
        "thisday-heat"
      ],
      "mowaa-protest": [
        "artnet-mowaa",
        "apollo-mowaa",
        "nairametrics-mowaa",
        "channels-okpebholo",
        "aljazeera-casting"
      ],
      switzerland: [
        "swiss-release",
        "vanguard-oba-swiss"
      ],
      "iyoba-statue": [
        "aljazeera-casting"
      ],
      "igun-today": [
        "aljazeera-casting"
      ],
      "digital-benin": [
        "aljazeera-casting"
      ]
    },
    artifact: {
      plaque: [
        "british-museum",
        "met-brilliance"
      ],
      head: [
        "britannica-benin",
        "british-museum",
        "met-brilliance"
      ],
      commander: [
        "britannica-benin",
        "british-museum"
      ],
      "portuguese-plaque": [
        "british-museum",
        "africarebirth",
        "plos-brass"
      ],
      "idia-mask": [
        "met-idia",
        "bm-idia-mask",
        "wiki-ivory-mask"
      ],
      okukor: [
        "artnewspaper-jesus",
        "guardian-ng-okpa"
      ],
      "aberdeen-head": [
        "returningheritage-aberdeen"
      ],
      "osemwende-heads": [
        "swiss-release",
        "scmp-swiss"
      ]
    }
  }
};

// Books, papers and resources for further reading.
// A missing or broken coverImageUrl is fine: the app shows a designed tile or
// finds a cover itself.
export const reading = [
  {
    title: "The Brutish Museums: The Benin Bronzes, Colonial Violence and Cultural Restitution",
    author: "Dan Hicks",
    publication: "Pluto Press",
    sourceType: "book",
    publicationDate: "2020-01-01",
    url: "https://www.plutobooks.com/9780745341767/the-brutish-museums/",
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780745341767-M.jpg?default=false",
    rightsStatement: "Cover image via Open Library.",
    note: "Makes a committed case for restitution. Read it alongside a more even-handed account such as Loot.",
    chapters: [
      "the-fall-of-benin",
      "scattered-across-the-world",
      "the-long-return"
    ]
  },
  {
    title: "Loot: Britain and the Benin Bronzes (revised edition)",
    author: "Barnaby Phillips",
    publication: "Oneworld Publications",
    sourceType: "book",
    publicationDate: "2022-01-01",
    url: "https://openlibrary.org/isbn/9780861543137",
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/9780861543137-M.jpg?default=false",
    rightsStatement: "Cover image via Open Library.",
    note: "A journalist's account of the kingdom, the 1897 raid and the restitution debate, including Nigerian voices.",
    chapters: [
      "the-fall-of-benin",
      "scattered-across-the-world",
      "asking-for-them-back",
      "the-long-return"
    ]
  },
  {
    title: "The Art of Benin (revised edition)",
    author: "Paula Girshick Ben-Amos",
    publication: "British Museum Press",
    sourceType: "book",
    publicationDate: "1995-01-01",
    url: "https://openlibrary.org/isbn/0714125202",
    coverImageUrl: "https://covers.openlibrary.org/b/isbn/0714125202-M.jpg?default=false",
    rightsStatement: "Cover image via Open Library.",
    note: "Explains the role of art at the Benin court, drawing on oral tradition, archaeology and early travellers' accounts.",
    chapters: [
      "a-kingdom-takes-shape",
      "the-sacred-court",
      "court-craft-and-contact"
    ]
  },
  {
    title: "A Short History of Benin",
    author: "Jacob U. Egharevba",
    publication: "Ibadan University Press",
    sourceType: "book",
    publicationDate: "1968-01-01",
    url: "https://openlibrary.org/search?q=a+short+history+of+benin+egharevba",
    coverImageUrl: "https://images.liverpoolmuseums.org.uk/inline-images/Short%20History%20Benin%20830.jpg",
    note: "A founding work by an Edo historian, built on oral tradition. Much of what is known about the early kings rests on it, so scholars compare it with other evidence.",
    chapters: [
      "before-the-oba",
      "a-kingdom-takes-shape",
      "ewuare-and-the-warrior-kings"
    ]
  },
  {
    title: "The Scholarship of Jacob Egharevba of Benin",
    author: "Uyilawa Usuanlele and Toyin Falola",
    publication: "History in Africa",
    sourceType: "paper",
    publicationDate: "1994-01-01",
    url: "https://www.academia.edu/89744040/The_Scholarship_of_Jacob_Egharevba_of_Benin",
    coverImageUrl: "https://static.cambridge.org/covers/HIA_0_0_0/history-in-africa.jpg",
    rightsStatement: "Journal article. Access may depend on your library.",
    chapters: [
      "a-kingdom-takes-shape"
    ]
  },
  {
    title: "German brass for Benin Bronzes: Geochemical analysis insights into the early Atlantic trade",
    author: "Tobias B. Skowronek and colleagues",
    publication: "PLOS ONE",
    sourceType: "paper",
    publicationDate: "2023-01-01",
    url: "https://doi.org/10.1371/journal.pone.0283415",
    rightsStatement: "Open access.",
    note: "A scientific study of where the brass in the Benin Bronzes came from.",
    chapters: [
      "court-craft-and-contact"
    ]
  },
  {
    title: "Digital Benin",
    publication: "digitalbenin.org",
    sourceType: "database",
    url: "https://digitalbenin.org",
    note: "An online catalogue of Benin objects in museum collections.",
    chapters: [
      "scattered-across-the-world",
      "the-long-return",
      "living-heritage"
    ]
  },
  {
    title: "The military system of Benin Kingdom, c. 1440 - 1897",
    author: "Osarhieme Osadolor",
    sourceType: "paper",
    publicationDate: "2001-01-01",
    url: "https://www.academia.edu/31310702/The_military_system_of_Benin_Kingdom_c_1440_1897",
    coverImageUrl: "https://0.academia-photos.com/attachment_thumbnails/51703714/mini_magick20180816-26171-f506jy.png?1534406315",
    chapters: [
      "ewuare-and-the-warrior-kings",
      "a-kingdom-under-strain",
      "court-craft-and-contact"
    ]
  },
  {
    title: "Benin and the Europeans, 1485-1897",
    author: "A. F. C. Ryder",
    publication: "Longman",
    sourceType: "book",
    publicationDate: "1969-01-01",
    url: "https://openlibrary.org/search?q=benin+and+the+europeans+ryder",
    note: "The classic study of Benin's dealings with Portuguese, Dutch and British traders, drawn mainly from European records. Read it beside Edo accounts of the same years.",
    chapters: [
      "trade-faith-and-diplomacy",
      "a-kingdom-under-strain"
    ]
  },
  {
    title: "Benin Under British Administration: The Impact of Colonial Rule on an African Kingdom, 1897-1938",
    author: "Philip A. Igbafe",
    publication: "Longman",
    sourceType: "book",
    publicationDate: "1979-01-01",
    url: "https://openlibrary.org/search?q=benin+under+british+administration+igbafe",
    note: "A Nigerian historian's study of how colonial rule changed the kingdom after 1897.",
    chapters: [
      "exile-and-restoration",
      "the-fall-of-benin"
    ]
  },
  {
    title: "Benin: Kings and Rituals. Court Arts from Nigeria",
    author: "Barbara Plankensteiner (ed.)",
    publication: "Snoeck / Museum für Völkerkunde Wien",
    sourceType: "book",
    publicationDate: "2007-01-01",
    url: "https://openlibrary.org/search?q=benin+kings+and+rituals+plankensteiner",
    note: "An exhibition catalogue with essays by Nigerian and European scholars on the court, its guilds and its ceremonies.",
    chapters: [
      "the-sacred-court",
      "court-craft-and-contact"
    ]
  },
  {
    title: "Benin1897.com: Art and the Restitution Question",
    author: "Peju Layiwola and Sola Olorunyomi (eds.)",
    publication: "Wy Art Editions, Ibadan",
    sourceType: "book",
    publicationDate: "2010-01-01",
    url: "https://pejulayiwola.com/benin1897-com/",
    note: "Essays by Nigerian scholars, lawyers and artists on art, theft and restitution, published with the exhibition of the same name.",
    chapters: [
      "asking-for-them-back"
    ]
  },
  {
    title: "Making meaning from a fragmented past: 1897 and the creative process",
    author: "Peju Layiwola",
    publication: "Open Arts Journal",
    sourceType: "paper",
    publicationDate: "2014-01-01",
    url: "https://openartsjournal.org/issue-3/2014s15pl",
    rightsStatement: "Open access.",
    note: "How Nigerian artists have returned to the events of 1897 as a subject.",
    chapters: [
      "asking-for-them-back",
      "living-heritage"
    ]
  },
  {
    title: "Civil War in the Kingdom of Benin, 1689-1721: Continuity or Political Change?",
    author: "Paula Ben-Amos Girshick and John Thornton",
    publication: "Journal of African History",
    sourceType: "paper",
    publicationDate: "2001-01-01",
    url: "https://doi.org/10.1017/S0021853701007915",
    note: "A detailed study of the war that shaped eighteenth-century Benin.",
    chapters: [
      "a-kingdom-under-strain"
    ]
  },
  {
    title: "The Origin and Development of the Guild of Bronze Casters of Benin Kingdom up to 1914",
    author: "Ese Vivian Odiahi",
    publication: "International Journal of Arts and Humanities",
    sourceType: "paper",
    publicationDate: "2017-01-01",
    url: "https://www.ajol.info/index.php/ijah/article/view/152306",
    rightsStatement: "Open access.",
    note: "A Nigerian study of the Igun Eronmwon guild, drawing on interviews with its members.",
    chapters: [
      "court-craft-and-contact",
      "living-heritage"
    ]
  }
];

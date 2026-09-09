/* Graded readers - voweled Arabic + transliteration + English */

export interface StoryPara { ar: string; tr: string; en: string; }
export interface StoryQuiz { q: string; options: string[]; answer: number; }
export interface Story {
  id: string; lvl: 1 | 2 | 3; titleEn: string; titleAr: string;
  tagline: string; minutes: number; gradient: string; glyph: string;
  paras: StoryPara[]; vocab: { ar: string; en: string; tr: string }[]; quiz: StoryQuiz[];
}

export const STORIES: Story[] = [
  {
    id: "sami-moon", lvl: 1, titleEn: "Sami and the Moon", titleAr: "سَامِي وَالقَمَر",
    tagline: "A little boy says goodnight to his brightest friend.", minutes: 3,
    gradient: "from-[#0E3B2E] via-[#144E3C] to-[#1B624C]", glyph: "ق",
    paras: [
      { ar: "اِسْمِي سَامِي. أَنَا وَلَدٌ صَغِيرٌ.", tr: "ismi Sami. ana waladun saghir.", en: "My name is Sami. I am a little boy." },
      { ar: "فِي اللَّيْلِ، أَنْظُرُ إِلَى السَّمَاءِ.", tr: "fi al-layli, andhuru ila as-sama.", en: "At night, I look at the sky." },
      { ar: "هَذَا قَمَرٌ! القَمَرُ كَبِيرٌ وَجَمِيلٌ.", tr: "hadha qamar! al-qamaru kabirun wa jamil.", en: "This is a moon! The moon is big and beautiful." },
      { ar: "أُحِبُّ القَمَرَ. القَمَرُ صَدِيقِي.", tr: "uhibbu al-qamar. al-qamaru sadiqi.", en: "I love the moon. The moon is my friend." },
      { ar: "أَقُولُ: مَرْحَبًا يَا قَمَرُ!", tr: "aqulu: marhaban ya qamar!", en: "I say: hello, O moon!" },
      { ar: "القَمَرُ يَبْتَسِمُ لِي. لَيْلَةٌ سَعِيدَةٌ!", tr: "al-qamaru yabtasimu li. laylatun saida!", en: "The moon smiles at me. A happy night!" },
    ],
    vocab: [
      { ar: "قَمَر", en: "moon", tr: "qamar" }, { ar: "سَمَاء", en: "sky", tr: "sama" },
      { ar: "لَيْل", en: "night", tr: "layl" }, { ar: "صَدِيق", en: "friend", tr: "sadiq" },
      { ar: "جَمِيل", en: "beautiful", tr: "jamil" }, { ar: "سَعِيد", en: "happy", tr: "said" },
    ],
    quiz: [
      { q: "What does Sami see in the sky?", options: ["The sun", "The moon", "A bird"], answer: 1 },
      { q: "HATHA QAMAR means...", options: ["This is a moon", "I love the moon", "Goodnight, moon"], answer: 0 },
      { q: "SADIQI means...", options: ["my night", "my friend", "my sky"], answer: 1 },
    ],
  },
  {
    id: "layla-cat", lvl: 1, titleEn: "Layla's Cat", titleAr: "قِطَّةُ لَيْلَى",
    tagline: "A small white cat causes big morning trouble.", minutes: 3,
    gradient: "from-[#C74824] via-[#E4572E] to-[#E8933C]", glyph: "ط",
    paras: [
      { ar: "هَذِهِ لَيْلَى. عِنْدَهَا قِطَّةٌ صَغِيرَةٌ.", tr: "hadhihi Layla. indaha qittatun saghira.", en: "This is Layla. She has a small cat." },
      { ar: "اِسْمُ القِطَّةِ لُولُو. لُولُو بَيْضَاءُ وَجَمِيلَةٌ.", tr: "ismu al-qittati Lulu. Lulu bayda wa jamila.", en: "The cat's name is Lulu. Lulu is white and beautiful." },
      { ar: "فِي الصَّبَاحِ، تُرِيدُ لُولُو الحَلِيبَ.", tr: "fi as-sabahi, turidu Lulu al-halib.", en: "In the morning, Lulu wants milk." },
      { ar: "تَقُولُ لَيْلَى: هَذَا حَلِيبُكِ يَا لُولُو!", tr: "taqulu Layla: hadha halibuki ya Lulu!", en: "Layla says: this is your milk, O Lulu!" },
      { ar: "تَشْرَبُ لُولُو الحَلِيبَ. لَذِيذٌ!", tr: "tashrabu Lulu al-halib. ladhidh!", en: "Lulu drinks the milk. Delicious!" },
      { ar: "الآنَ لُولُو سَعِيدَةٌ. وَلَيْلَى سَعِيدَةٌ!", tr: "al-ana Lulu saida. wa Layla saida!", en: "Now Lulu is happy. And Layla is happy!" },
    ],
    vocab: [
      { ar: "قِطَّة", en: "cat", tr: "qitta" }, { ar: "حَلِيب", en: "milk", tr: "halib" },
      { ar: "صَبَاح", en: "morning", tr: "sabah" }, { ar: "أَبْيَض", en: "white", tr: "abyad" },
      { ar: "يُرِيد", en: "he/she wants", tr: "yurid" }, { ar: "لَذِيذ", en: "delicious", tr: "ladhidh" },
    ],
    quiz: [
      { q: "What is the cat's name?", options: ["Layla", "Lulu", "Sami"], answer: 1 },
      { q: "What does Lulu want in the morning?", options: ["Bread", "Water", "Milk"], answer: 2 },
      { q: "INDAHA QITTA means...", options: ["She has a cat", "She sees a cat", "She likes a cat"], answer: 0 },
    ],
  },
  {
    id: "souq-trip", lvl: 2, titleEn: "A Trip to the Souq", titleAr: "رِحْلَةٌ إِلَى السُّوق",
    tagline: "Omar, his mother and the art of friendly bargaining.", minutes: 5,
    gradient: "from-[#7A4A1E] via-[#A0681F] to-[#C9A227]", glyph: "س",
    paras: [
      { ar: "يَوْمَ الجُمُعَةِ، يَذْهَبُ عُمَرُ مَعَ أُمِّهِ إِلَى السُّوقِ.", tr: "yawma al-jumua, yadhhabu Umaru maa ummihi ila as-suq.", en: "On Friday, Omar goes with his mother to the souq (market)." },
      { ar: "السُّوقُ كَبِيرٌ! فِيهِ فَوَاكِهُ وَخُبْزٌ وَتَمْرٌ.", tr: "as-suqu kabir! fihi fawakihu wa khubzun wa tamr.", en: "The souq is big! In it are fruits, bread and dates." },
      { ar: "تَقُولُ الأُمُّ: أُرِيدُ كِيلُو تُفَّاحٍ، مِن فَضْلِك.", tr: "taqulu al-umm: uridu kilu tuffahin, min fadlik.", en: "The mother says: I want a kilo of apples, please." },
      { ar: "يَقُولُ البَائِعُ: عَشَرَة! تَقُولُ الأُمُّ: غَالٍ! خَمْسَة؟", tr: "yaqulu al-bayi: ashara! taqulu al-umm: ghal! khamsa?", en: "The seller says: ten! The mother says: expensive! Five?" },
      { ar: "يَضْحَكُ البَائِعُ وَيَقُولُ: طَيِّب! مُوَافِق!", tr: "yadhhaku al-bayiu wa yaqul: tayyib! muwafiq!", en: "The seller laughs and says: okay! Agreed!" },
      { ar: "يَرْجِعُ عُمَرُ إِلَى البَيْتِ سَعِيدًا. التُّفَّاحُ لَذِيذٌ!", tr: "yarjiu Umaru ila al-bayti saidan. at-tuffahu ladhidh!", en: "Omar returns home happy. The apples are delicious!" },
    ],
    vocab: [
      { ar: "سُوق", en: "market / souq", tr: "suq" }, { ar: "بَائِع", en: "seller", tr: "bayi" },
      { ar: "فَوَاكِه", en: "fruits", tr: "fawakih" }, { ar: "غَالٍ", en: "expensive", tr: "ghal" },
      { ar: "مُوَافِق", en: "agreed", tr: "muwafiq" }, { ar: "يَرْجِع", en: "he returns", tr: "yarji" },
    ],
    quiz: [
      { q: "When do Omar and his mother go to the souq?", options: ["On Friday", "On Monday", "Tomorrow"], answer: 0 },
      { q: "What does the mother want?", options: ["A kilo of dates", "A kilo of apples", "Bread"], answer: 1 },
      { q: "GHAL means...", options: ["delicious", "expensive", "cheap"], answer: 1 },
    ],
  },
  {
    id: "tea-grandma", lvl: 2, titleEn: "Tea with Grandma", titleAr: "الشَّايُ مَعَ الجَدَّة",
    tagline: "Mint tea, old stories, and the warmest room in the house.", minutes: 5,
    gradient: "from-[#1B624C] via-[#0E6E6E] to-[#1B5FAA]", glyph: "ش",
    paras: [
      { ar: "كُلَّ مَسَاءٍ، تَشْرَبُ نُورُ الشَّايَ مَعَ جَدَّتِهَا.", tr: "kulla masa, tashrabu Nuru ash-shaya maa jaddatiha.", en: "Every evening, Noor drinks tea with her grandmother." },
      { ar: "الجَدَّةُ تَضَعُ النَّعْنَاعَ فِي الشَّايِ. رَائِحَتُهُ جَمِيلَةٌ!", tr: "al-jaddatu tadau an-nanaa fi ash-shay. raihatuhu jamila!", en: "Grandma puts mint in the tea. Its smell is beautiful!" },
      { ar: "تَسْأَلُ نُورُ: يَا جَدَّتِي، أَيْنَ كُنْتِ صَغِيرَةً؟", tr: "tasalu Nur: ya jaddati, ayna kunti saghira?", en: "Noor asks: Grandma, where did you grow up?" },
      { ar: "تَقُولُ الجَدَّةُ: كُنْتُ فِي قَرْيَةٍ صَغِيرَةٍ قُرْبَ البَحْرِ.", tr: "taqulu al-jadda: kuntu fi qaryatin saghiratin qurba al-bahr.", en: "Grandma says: I was in a small village near the sea." },
      { ar: "تَحْكِي الجَدَّةُ حِكَايَاتٍ عَنِ البَحْرِ وَالسُّفُنِ.", tr: "tahki al-jaddatu hikayatin ani al-bahri was-sufun.", en: "Grandma tells stories about the sea and the ships." },
      { ar: "تَقُولُ نُورُ: أُحِبُّ حِكَايَاتِكِ! وَأُحِبُّ الشَّايَ!", tr: "taqulu Nur: uhibbu hikayatik! wa uhibbu ash-shay!", en: "Noor says: I love your stories! And I love the tea!" },
    ],
    vocab: [
      { ar: "جَدَّة", en: "grandmother", tr: "jadda" }, { ar: "نَعْنَاع", en: "mint", tr: "nana" },
      { ar: "قَرْيَة", en: "village", tr: "qarya" }, { ar: "بَحْر", en: "sea", tr: "bahr" },
      { ar: "حِكَايَة", en: "story / tale", tr: "hikaya" }, { ar: "مَسَاء", en: "evening", tr: "masa" },
    ],
    quiz: [
      { q: "What does Grandma put in the tea?", options: ["Sugar", "Mint", "Lemon"], answer: 1 },
      { q: "Where did Grandma grow up?", options: ["In a big city", "Near the sea", "In the desert"], answer: 1 },
      { q: "HIKAYAT means...", options: ["cups", "stories", "evenings"], answer: 1 },
    ],
  },
  {
    id: "wise-palm", lvl: 3, titleEn: "The Wise Palm Tree", titleAr: "النَّخْلَةُ الحَكِيمَة",
    tagline: "A thirsty traveller learns patience under ancient fronds.", minutes: 7,
    gradient: "from-[#0B2E24] via-[#0E3B2E] to-[#7A4A1E]", glyph: "ن",
    paras: [
      { ar: "فِي قَلْبِ الصَّحْرَاءِ، كَانَتْ هُنَاكَ نَخْلَةٌ كَبِيرَةٌ وَحَكِيمَةٌ.", tr: "fi qalbi as-sahra, kanat hunaka nakhlatun kabiratun wa hakima.", en: "In the heart of the desert, there was a big, wise palm tree." },
      { ar: "فِي يَوْمٍ حَارٍّ، وَصَلَ مُسَافِرٌ عَطْشَانُ إِلَى ظِلِّهَا.", tr: "fi yawmin harr, wasala musafirun atshan ila dhilliha.", en: "On a hot day, a thirsty traveller arrived at its shade." },
      { ar: "قَالَ المُسَافِرُ: لَا مَاءَ! لَا حَيَاةَ فِي هَذِهِ الصَّحْرَاءِ!", tr: "qala al-musafir: la ma! la hayata fi hadhihi as-sahra!", en: "The traveller said: no water! No life in this desert!" },
      { ar: "هَمَسَتِ النَّخْلَةُ بِأَوْرَاقِهَا: اُنْظُرْ تَحْتَ الرِّمَالِ، يَا صَدِيقِي.", tr: "hamasati an-nakhlatu bi-awraqiha: undhur tahta ar-rimal, ya sadiqi.", en: "The palm whispered with its leaves: look beneath the sands, my friend." },
      { ar: "حَفَرَ المُسَافِرُ قَلِيلًا، فَوَجَدَ مَاءً بَارِدًا عَذْبًا!", tr: "hafara al-musafiru qalilan, fawajada maan baridan adhban!", en: "The traveller dug a little, and found cool, sweet water!" },
      { ar: "شَرِبَ وَشَكَرَ النَّخْلَةَ. وَتَعَلَّمَ أَنَّ الصَّبْرَ يَصْنَعُ المُعْجِزَاتِ.", tr: "shariba wa shakara an-nakhla. wa taallama anna as-sabra yasna al-muajizat.", en: "He drank and thanked the palm. And he learned that patience makes miracles." },
    ],
    vocab: [
      { ar: "صَحْرَاء", en: "desert", tr: "sahra" }, { ar: "نَخْلَة", en: "palm tree", tr: "nakhla" },
      { ar: "مُسَافِر", en: "traveller", tr: "musafir" }, { ar: "عَطْشَان", en: "thirsty", tr: "atshan" },
      { ar: "صَبْر", en: "patience", tr: "sabr" }, { ar: "ظِل", en: "shade", tr: "dhill" },
    ],
    quiz: [
      { q: "Who arrives at the palm's shade?", options: ["A thirsty traveller", "A hungry fox", "A lost child"], answer: 0 },
      { q: "What does the traveller find?", options: ["Dates", "Cool sweet water", "Gold"], answer: 1 },
      { q: "The story's lesson is...", options: ["Patience makes miracles", "Never travel", "Palms talk loudly"], answer: 0 },
    ],
  },
  {
    id: "desert-letter", lvl: 3, titleEn: "A Letter from the Desert", titleAr: "رِسَالَةٌ مِنَ الصَّحْرَاء",
    tagline: "Two brothers, one old camel, and a letter that crosses dunes.", minutes: 7,
    gradient: "from-[#5B2333] via-[#7A4A1E] to-[#C9A227]", glyph: "ر",
    paras: [
      { ar: "كَتَبَ كَرِيمُ رِسَالَةً إِلَى أَخِيهِ يُوسُفَ فِي المَدِينَةِ.", tr: "kataba Karimu risalatan ila akhihi Yusufa fi al-madina.", en: "Karim wrote a letter to his brother Yusuf in the city." },
      { ar: "كَتَبَ: الطَّقْسُ جَمِيلٌ هُنَا. السَّمَاءُ صَافِيَةٌ وَالنُّجُومُ كَثِيرَةٌ.", tr: "katab: at-taqsu jamilun huna. as-samau safiyatun wan-nujumu kathira.", en: "He wrote: the weather is beautiful here. The sky is clear and the stars are many." },
      { ar: "جَمَلُنَا القَدِيمُ بَخِيلٌ بِخَيْرٍ، يَأْكُلُ كَثِيرًا وَيَمْشِي قَلِيلًا!", tr: "jamaluna al-qadimu Bakhilun bikhayr, yakulu kathiran wa yamshi qalilan!", en: "Our old camel Bakhil is well - he eats a lot and walks a little!" },
      { ar: "أَذْهَبُ إِلَى السُّوقِ كُلَّ أُسْبُوعٍ. أَبِيعُ التَّمْرَ وَأَشْتَرِي الكُتُبَ.", tr: "adhhabu ila as-suqi kulla usbu. abiu at-tamra wa ashtari al-kutub.", en: "I go to the market every week. I sell dates and buy books." },
      { ar: "هَلْ تَتَذَكَّرُ لَيْلَةَ النُّجُومِ؟ أَنَا أَتَذَكَّرُهَا كُلَّ لَيْلَةٍ.", tr: "hal tatadhakkaru laylata an-nujum? ana atadhakkaruha kulla layla.", en: "Do you remember the night of the stars? I remember it every night." },
      { ar: "تَعَالَ فِي العُطْلَةِ! البَيْتُ بَيْتُكَ، وَالصَّحْرَاءُ تَنْتَظِرُكَ.", tr: "taala fi al-utla! al-baytu baytuk, was-sahrau tantadhiruk.", en: "Come in the holiday! The house is your house, and the desert awaits you." },
    ],
    vocab: [
      { ar: "رِسَالَة", en: "letter", tr: "risala" }, { ar: "نُجُوم", en: "stars", tr: "nujum" },
      { ar: "جَمَل", en: "camel", tr: "jamal" }, { ar: "عُطْلَة", en: "holiday", tr: "utla" },
      { ar: "يَتَذَكَّر", en: "he remembers", tr: "yatadhakkar" }, { ar: "صَافِيَة", en: "clear", tr: "safiya" },
    ],
    quiz: [
      { q: "Who writes the letter?", options: ["Yusuf to Karim", "Karim to his brother", "The camel"], answer: 1 },
      { q: "What does Karim sell at the market?", options: ["Books", "Dates", "Camels"], answer: 1 },
      { q: "AL-BAYTU BAYTUK means...", options: ["The house is far", "The house is your house (welcome!)", "The house is big"], answer: 1 },
    ],
  },
];

// ============================================
// KIDORA — Terjemahan UI (Bahasa Melayu + English)
// ============================================
import { createElement } from 'react';

export const STRINGS = {
  ms: {
    // Header & umum
    playNow: 'Mula Main',
    viewPlans: 'Lihat Pakej',

    // Hero
    heroBadge: '⭐ Untuk kanak-kanak 3–6 tahun · Bahasa Melayu & English',
    heroTitle1: 'Tukar Masa Skrin Anak',
    heroTitle2: 'Jadi Masa Belajar',
    heroDesc:
      'Anak anda asyik main gajet? **KIDORA** ubah kebimbangan itu jadi peluang — koleksi permainan pendidikan yang buat anak seronok **kenal huruf, mengira & mengingat**, tanpa mereka sedar sedang belajar.',
    heroCta: 'Cuba KIDORA Sekarang 🎮',
    proof1: '✅ Tiada iklan',
    proof2: '🔒 Bayaran selamat',
    proof3: '📱 Telefon, tablet & komputer',

    // Trust bar
    trust1: '🦁 Dibina khas untuk anak Malaysia',
    trust2: '🇲🇾 Bahasa Melayu & English',
    trust3: '💳 FPX · eWallet · Kad',
    trust4: '👶 Umur 3–6 tahun',

    // Masalah
    painTitle: '😅 Biasa tak, mak ayah rasa macam ni?',
    painSub: 'Anda tidak keseorangan. Ramai ibu bapa hadapi benda yang sama.',
    pain1: 'Rasa bersalah setiap kali bagi gajet pada anak',
    pain2: 'Risau anak terdedah kandungan yang tak sesuai',
    pain3: 'Nak ajar huruf & nombor, tapi tak tahu nak mula',
    painPunch: '✨ **Berita baik:** ada cara untuk jadikan masa skrin itu **bermanfaat**.',

    // Penyelesaian
    solTitle: '🦁 Perkenalkan KIDORA',
    solDesc:
      'KIDORA ialah platform permainan pendidikan untuk anak kecil. Setiap kali anak menekan, meneka dan menyusun, dia sebenarnya sedang **belajar kemahiran asas** — huruf, nombor dan ingatan — dalam Bahasa Melayu yang betul.',
    sol1: '🎯 Belajar tanpa tekanan — semua rasa macam main',
    sol2: '👆 Butang besar & warna terang untuk jari kecil',
    sol3: '🔊 Ada bunyi & sebutan untuk setiap jawapan',
    sol4: '🚫 Tanpa iklan, tanpa gangguan, tanpa risiko',
    solCta: 'Mulakan Sekarang',

    // Permainan
    gamesTitle: '🎮 Permainan Yang Anak Akan Suka',
    gamesSub: '39 modul huruf + mengira & padanan — semua direka supaya anak belajar sambil seronok.',

    // Kategori permainan (landing)
    catLetters: '🔤 39 Modul Huruf',
    catLettersDesc: 'Kenal huruf, bunyi, suku kata, susun abjad, eja & banyak lagi.',
    catCount: '🔢 Mari Mengira',
    catCountDesc: 'Kira objek & kenal nombor 1–10.',
    catMatch: '🃏 Padankan Gambar',
    catMatchDesc: 'Asah ingatan dengan cari pasangan yang sama.',

    // Permainan huruf baharu
    soundLabel: '🔊 Dengar bunyi, tekan huruf',
    soundPlay: '🔊 Dengar',
    syllableLabel: '🗣️ Baca suku kata',
    firstLabel: '🖼️ Huruf pertama untuk…',
    vowelLabel: '🎈 Vokal atau konsonan?',
    vowelOption: 'Vokal',
    consonantOption: 'Konsonan',
    quizAfter: 'Huruf selepas',
    quizBefore: 'Huruf sebelum',
    findLabel: '🔍 Cari huruf',
    orderLabel: '🧩 Susun ikut turutan',
    spellLabel: '✍️ Eja perkataan ini',
    unit1: 'Huruf A–M',
    unit2: 'Huruf N–Z',
    unit3: 'Kemahiran Huruf',
    unitOther: 'Permainan Lain',
    moduleSee: '🔤 Kenal huruf',
    moduleHear: '🔊 Dengar bunyi',
    nextModule: 'Seterusnya →',
    moduleDone: 'Hebat! Siap modul! 🎉',

    // Cara guna di telefon
    guideTitle: '📱 Guna Macam App — Tanpa Muat Turun',
    guideSub: 'Tambahkan KIDORA ke skrin utama telefon — anak boleh buka terus macam aplikasi, tanpa perlu install apa-apa.',
    guide1Title: 'Buka kidora.com.my',
    guide1Desc: 'Guna pelayar Chrome (Android) atau Safari (iPhone).',
    guide2Title: 'Tekan Butang Kongsi',
    guide2Desc: 'iPhone: tekan ikon Share ⬆️. Android: tekan menu ⋮ di penjuru atas.',
    guide3Title: 'Pilih "Tambah ke Skrin Utama"',
    guide3Desc: 'Klik "Add to Home Screen" — KIDORA terus muncul di skrin utama.',
    guideNote: '✨ Tiada kedai aplikasi, tiada muat turun, tiada bayaran tambahan.',

    // Testimoni
    testiTitle: '💬 Kata Ibu Bapa',
    testiSub: 'Ibu bapa Malaysia yang dah cuba KIDORA.',
    testi1: '“Anak saya yang 4 tahun tak nak lepaskan. Dah kenal huruf A–Z dalam masa seminggu!”',
    testi1Name: 'Puan Aisyah, Kuala Lumpur',
    testi2: '“Akhirnya ada app yang tenang, tanpa iklan. Saya rasa senang hati bagi dia main.”',
    testi2Name: 'Encik Farid, Johor Bahru',
    testi3: '“Murah dan mudah. Bayar sekali, tiga anak boleh kongsi guna pakej keluarga.”',
    testi3Name: 'Puan Nadia, Shah Alam',

    // Cara ia berfungsi
    howTitle: '🚀 Mudah Nak Mula — 3 Langkah',
    how1Title: 'Pilih Pakej',
    how1Desc: 'Pilih pakej yang sesuai dan klik "Beli Sekarang".',
    how2Title: 'Bayar Online',
    how2Desc: 'Bayar guna FPX, eWallet atau kad melalui BizApp Pay.',
    how3Title: 'Masukkan Kod & Main',
    how3Desc: 'Dapat kod akses, masukkan, dan anak terus main!',

    // Pakej harga
    pricingTitle: '💰 Pilih Pakej Anda',
    pricingSub: 'Bayaran **sekali sahaja**. Tiada yuran bulanan tersembunyi. Main selamanya.',
    popularBadge: '⭐ Paling Popular',
    buyNow: 'Beli Sekarang',
    pricingNote: '🔒 Bayaran selamat melalui BizApp Pay — FPX, eWallet & kad.',

    // Soalan lazim
    faqTitle: '❓ Soalan Lazim',
    faq1q: 'Anak umur berapa sesuai guna KIDORA?',
    faq1a: 'KIDORA direka untuk kanak-kanak 3–6 tahun, tetapi anak 2 dan 7 tahun juga boleh menikmatinya.',
    faq2q: 'Macam mana nak mula?',
    faq2a: 'Pilih pakej, bayar online, dan anda akan dapat kod akses. Masukkan kod dan anak terus boleh main.',
    faq3q: 'Ada yuran bulanan?',
    faq3a: 'Tiada. Bayar sekali sahaja dan akses adalah untuk selama-lamanya.',
    faq4q: 'Boleh main di berapa peranti?',
    faq4a: 'Pakej Asas & Lengkap untuk 1 peranti. Pakej Keluarga dapat 3 kod untuk 3 peranti.',
    faq5q: 'Ada iklan ke?',
    faq5a: 'Tiada iklan langsung. Pengalaman anak bersih dan selamat.',
    faq6q: 'Bayaran selamat?',
    faq6a: 'Ya. Semua bayaran diproses oleh BizApp Pay yang menyokong FPX, eWallet dan kad bank.',

    // CTA akhir
    ctaTitle: 'Mulakan Pengembaraan Belajar Hari Ini!',
    ctaSub: 'Berikan anak anda permulaan yang menyeronokkan. Satu kod, satu bayaran, belajar selamanya.',
    ctaButton: 'Beli Pakej Sekarang 🚀',

    // Footer
    footerBrand: 'KIDORA — Minda Kecil, Pengembaraan Besar',
    footerCopy: 'kidora.com.my · Build by Brojim Digital',
    footerTerms: 'Terma & Syarat',
    footerPrivacy: 'Dasar Privasi',
    footerContact: 'Hubungi Kami',
    footerRecover: 'Dapat Semula Kod',

    // Modal beli
    buy: 'Beli',
    close: 'Tutup',
    fieldName: 'Nama penuh',
    fieldNamePh: 'cth: Ali bin Ahmad',
    fieldEmail: 'Emel',
    fieldEmailPh: 'cth: ali@email.com',
    fieldPhone: 'Nombor telefon',
    fieldPhonePh: 'cth: 0123456789',
    payNow: 'Bayar Sekarang',
    payLoading: 'Menyediakan bayaran…',
    modalHint: '🔒 Anda akan dibawa ke halaman bayaran selamat BizApp Pay.',

    // Gerbang kod akses
    gateTitle: 'Masukkan Kod Akses',
    gateSub: 'Dapatkan kod selepas membeli pakej. Masukkan kod di sini untuk buka permainan.',
    gateUnlock: 'Buka Permainan',
    gateChecking: 'Menyemak…',
    gateBack: '← Kembali ke laman utama',
    forgotCode: 'Lupa kod?',
    recoverTitle: 'Dapat Semula Kod Akses',
    recoverSub: 'Masukkan emel & nombor telefon yang digunakan semasa pembelian.',
    recoverBtn: 'Dapatkan Kod',
    recoverLoading: 'Mencari…',
    recoverFound: 'Kod anda dijumpai:',
    recoverOpen: 'Buka Permainan Sekarang →',

    // Muka Terima Kasih
    tyChecking: 'Sedang Menyemak Bayaran…',
    tyCheckingSub: 'Kami sedang sahkan pembayaran anda.',
    tyCheckingHint: 'Jangan tutup halaman ini. Ia mengambil masa beberapa saat sahaja.',
    tyPaidTitle: 'Terima Kasih! Bayaran Berjaya 🎉',
    tyPaidSub: 'Ini kod akses anda. Simpan baik-baik:',
    tyCopied: '✓ Disalin!',
    tyCopy: 'Salin Kod',
    tyPlay: 'Buka Permainan Sekarang →',
    tyHint: 'Masukkan kod di halaman Main untuk buka permainan. Kod juga disimpan di peranti ini.',
    tyFailedTitle: 'Bayaran Belum Berjaya',
    tyFailedSub: 'Nampaknya bayaran tidak selesai.',
    tyFailedHint: 'Kalau anda sudah bayar, tunggu sebentar atau hubungi kami untuk bantuan.',
    tyBack: '← Kembali ke Laman Utama',

    // Hab permainan
    hubGreet: 'Hai! Jom main 🎉',
    hubSub: 'Pilih permainan di bawah.',
    hubLocked: 'Belum dibuka',
    hubPkg: 'Pakej anda:',
    hubLogout: 'Keluar',

    // Skrin menang & dalam permainan
    winTitle: 'Hebat! Pandainya! 🎉',
    winScore: 'Kamu dapat',
    playAgain: 'Main Lagi 🔁',
    abcLabel: '🔍 Tekan huruf ini',
    abcListen: '🔊 Dengar',
    correctShort: '🎉 Betul! Hebat!',
    wrongShort: '💪 Hampir! Cuba lagi!',
    correctWord: 'Betul!',
    tryAgainWord: 'Cuba lagi',
    forWord: 'untuk',
    scoreSuffix: 'betul',
    countLabel: '🔢 Berapa banyak?',
    countSpeak: 'Berapa banyak? Kira dan pilih jawapan',
    matchWinTitle: 'Hebat! Semua Padan! 🎉',
    matchDoneIn: 'Siap dalam',
    movesWord: 'langkah',
    pairsWord: 'Pasangan:',
    stepsWord: 'Langkah:',
    matchCorrect: '🎉 Padan!',
    matchWrong: '🙈 Bukan pasangan! Cuba lagi!',
    cardClosed: 'Kad tertutup',
    back: 'Kembali',
  },

  en: {
    // Header & general
    playNow: 'Play Now',
    viewPlans: 'View Plans',

    // Hero
    heroBadge: '⭐ For ages 3–6 · Malay & English',
    heroTitle1: 'Turn Screen Time',
    heroTitle2: 'Into Learning Time',
    heroDesc:
      'Is your child glued to the screen? **KIDORA** turns that worry into an opportunity — a collection of educational games that make learning **letters, counting & memory** so fun, they won\'t even notice.',
    heroCta: 'Try KIDORA Now 🎮',
    proof1: '✅ No ads',
    proof2: '🔒 Secure payment',
    proof3: '📱 Phone, tablet & computer',

    // Trust bar
    trust1: '🦁 Made for Malaysian kids',
    trust2: '🇲🇾 Malay & English content',
    trust3: '💳 FPX · eWallet · Card',
    trust4: '👶 Ages 3–6',

    // Pain
    painTitle: '😅 Sound familiar, parents?',
    painSub: 'You\'re not alone. Many parents feel the same way.',
    pain1: 'Feel guilty every time you hand your child a gadget',
    pain2: 'Worry your child sees content that isn\'t suitable',
    pain3: 'Want to teach letters & numbers but don\'t know where to start',
    painPunch: '✨ **Good news:** there is a way to make that screen time **meaningful**.',

    // Solution
    solTitle: '🦁 Meet KIDORA',
    solDesc:
      'KIDORA is an educational games platform for little ones. Every tap, guess and match quietly builds **essential skills** — letters, numbers and memory — in proper Malay or English.',
    sol1: '🎯 Learn without pressure — it all feels like play',
    sol2: '👆 Big buttons & bright colours for little fingers',
    sol3: '🔊 Sounds & pronunciation for every answer',
    sol4: '🚫 No ads, no distractions, no risk',
    solCta: 'Get Started',

    // Games
    gamesTitle: '🎮 Games Your Child Will Love',
    gamesSub: '39 letter modules + counting & matching — all designed so kids learn while having fun.',

    // Game categories (landing)
    catLetters: '🔤 39 Letter Modules',
    catLettersDesc: 'Recognise letters, sounds, syllables, alphabet order, spelling & more.',
    catCount: '🔢 Let\'s Count',
    catCountDesc: 'Count objects & learn numbers 1–10.',
    catMatch: '🃏 Picture Match',
    catMatchDesc: 'Sharpen memory by finding matching pairs.',

    // New letter games
    soundLabel: '🔊 Listen to the sound, tap the letter',
    soundPlay: '🔊 Listen',
    syllableLabel: '🗣️ Read the syllable',
    firstLabel: '🖼️ First letter for…',
    vowelLabel: '🎈 Vowel or consonant?',
    vowelOption: 'Vowel',
    consonantOption: 'Consonant',
    quizAfter: 'Letter after',
    quizBefore: 'Letter before',
    findLabel: '🔍 Find the letter',
    orderLabel: '🧩 Put in order',
    spellLabel: '✍️ Spell this word',
    unit1: 'Letters A–M',
    unit2: 'Letters N–Z',
    unit3: 'Letter Skills',
    unitOther: 'More Games',
    moduleSee: '🔤 Recognise the letter',
    moduleHear: '🔊 Listen to the sound',
    nextModule: 'Next →',
    moduleDone: 'Great! Module complete! 🎉',

    // How to use on mobile
    guideTitle: '📱 Use It Like an App — No Download',
    guideSub: 'Add KIDORA to your phone\'s home screen — your child can open it like a real app, no installation needed.',
    guide1Title: 'Open kidora.com.my',
    guide1Desc: 'Use Chrome (Android) or Safari (iPhone).',
    guide2Title: 'Tap Share',
    guide2Desc: 'iPhone: tap the Share icon ⬆️. Android: tap the ⋮ menu at the top.',
    guide3Title: 'Choose "Add to Home Screen"',
    guide3Desc: 'Tap "Add to Home Screen" and KIDORA appears on your home screen.',
    guideNote: '✨ No app store, no download, no extra cost.',

    // Testimonials
    testiTitle: '💬 What Parents Say',
    testiSub: 'Malaysian parents who have tried KIDORA.',
    testi1: '“My 4-year-old won\'t put it down. She learned A–Z in a week!”',
    testi1Name: 'Puan Aisyah, Kuala Lumpur',
    testi2: '“Finally, a calm app with no ads. I can let him play without worry.”',
    testi2Name: 'Encik Farid, Johor Bahru',
    testi3: '“Cheap and simple. Pay once and three kids share it on the family plan.”',
    testi3Name: 'Puan Nadia, Shah Alam',

    // How it works
    howTitle: '🚀 Easy to Start — 3 Steps',
    how1Title: 'Choose a Plan',
    how1Desc: 'Pick a plan and click "Buy Now".',
    how2Title: 'Pay Online',
    how2Desc: 'Pay via FPX, eWallet or card through BizApp Pay.',
    how3Title: 'Enter Code & Play',
    how3Desc: 'Get your access code, enter it, and your child can play right away!',

    // Pricing
    pricingTitle: '💰 Choose Your Plan',
    pricingSub: 'Pay **once only**. No hidden monthly fees. Play forever.',
    popularBadge: '⭐ Most Popular',
    buyNow: 'Buy Now',
    pricingNote: '🔒 Secure payment via BizApp Pay — FPX, eWallet & card.',

    // FAQ
    faqTitle: '❓ Frequently Asked Questions',
    faq1q: 'What age is KIDORA for?',
    faq1a: 'KIDORA is designed for ages 3–6, but 2- and 7-year-olds can enjoy it too.',
    faq2q: 'How do I get started?',
    faq2a: 'Choose a plan, pay online, and you\'ll get an access code. Enter the code and your child can play right away.',
    faq3q: 'Is there a monthly fee?',
    faq3a: 'No. Pay once and access is forever.',
    faq4q: 'How many devices can play?',
    faq4a: 'Basic & Complete plans are for 1 device. The Family plan includes 3 codes for 3 devices.',
    faq5q: 'Are there ads?',
    faq5a: 'No ads at all. A clean and safe experience for your child.',
    faq6q: 'Is payment secure?',
    faq6a: 'Yes. All payments are processed by BizApp Pay, which supports FPX, eWallet and bank cards.',

    // Final CTA
    ctaTitle: 'Start the Learning Adventure Today!',
    ctaSub: 'Give your child a fun head start. One code, one payment, learn forever.',
    ctaButton: 'Buy a Plan Now 🚀',

    // Footer
    footerBrand: 'KIDORA — Little Minds, Big Adventures',
    footerCopy: 'kidora.com.my · Build by Brojim Digital',
    footerTerms: 'Terms & Conditions',
    footerPrivacy: 'Privacy Policy',
    footerContact: 'Contact Us',
    footerRecover: 'Recover Code',

    // Buy modal
    buy: 'Buy',
    close: 'Close',
    fieldName: 'Full name',
    fieldNamePh: 'e.g. John Smith',
    fieldEmail: 'Email',
    fieldEmailPh: 'e.g. john@email.com',
    fieldPhone: 'Phone number',
    fieldPhonePh: 'e.g. 0123456789',
    payNow: 'Pay Now',
    payLoading: 'Preparing payment…',
    modalHint: '🔒 You\'ll be taken to BizApp Pay\'s secure payment page.',

    // Access code gate
    gateTitle: 'Enter Access Code',
    gateSub: 'Get your code after buying a plan. Enter it here to unlock the games.',
    gateUnlock: 'Unlock Games',
    gateChecking: 'Checking…',
    gateBack: '← Back to home',
    forgotCode: 'Forgot your code?',
    recoverTitle: 'Recover Your Access Code',
    recoverSub: 'Enter the email & phone number you used at checkout.',
    recoverBtn: 'Get My Code',
    recoverLoading: 'Searching…',
    recoverFound: 'Here are your codes:',
    recoverOpen: 'Open Games Now →',

    // Thank-you page
    tyChecking: 'Checking Payment…',
    tyCheckingSub: 'We are confirming your payment.',
    tyCheckingHint: 'Please don\'t close this page. It only takes a few seconds.',
    tyPaidTitle: 'Thank You! Payment Successful 🎉',
    tyPaidSub: 'Here is your access code. Keep it safe:',
    tyCopied: '✓ Copied!',
    tyCopy: 'Copy Code',
    tyPlay: 'Open Games Now →',
    tyHint: 'Enter the code on the Play page to unlock the games. The code is also saved on this device.',
    tyFailedTitle: 'Payment Not Completed',
    tyFailedSub: 'It looks like the payment didn\'t go through.',
    tyFailedHint: 'If you already paid, wait a moment or contact us for help.',
    tyBack: '← Back to Home',

    // Game hub
    hubGreet: 'Hi! Let\'s play 🎉',
    hubSub: 'Choose a game below.',
    hubLocked: 'Locked',
    hubPkg: 'Your plan:',
    hubLogout: 'Exit',

    // Win screen & in-game
    winTitle: 'Amazing! Well done! 🎉',
    winScore: 'You got',
    playAgain: 'Play Again 🔁',
    abcLabel: '🔍 Tap this letter',
    abcListen: '🔊 Listen',
    correctShort: '🎉 Correct! Great!',
    wrongShort: '💪 Almost! Try again!',
    correctWord: 'Correct!',
    tryAgainWord: 'Try again',
    forWord: 'for',
    scoreSuffix: 'correct',
    countLabel: '🔢 How many?',
    countSpeak: 'How many? Count and choose the answer',
    matchWinTitle: 'Amazing! All Matched! 🎉',
    matchDoneIn: 'Done in',
    movesWord: 'moves',
    pairsWord: 'Pairs:',
    stepsWord: 'Moves:',
    matchCorrect: '🎉 Match!',
    matchWrong: '🙈 Not a pair! Try again!',
    cardClosed: 'Card face down',
    back: 'Back',
  },
};

// Tukar **teks** kepada <strong> dalam ayat.
export function rich(text) {
  return text
    .split(/\*\*(.*?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? createElement('strong', { key: i }, part) : part));
}

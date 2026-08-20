import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext.jsx';
import { playTap } from '../../lib/audio.js';
import './Legal.css';

const CONTENT = {
  ms: {
    terms: {
      title: 'Terma & Syarat',
      sections: [
        { h: '1. Produk Digital', b: 'KIDORA ialah produk digital — kod akses kepada permainan pendidikan untuk kanak-kanak. Tiada barangan fizikal dihantar.' },
        { h: '2. Bayaran Sekali Sahaja', b: 'Semua pakej adalah bayaran sekali (one-time). Tiada yuran bulanan atau langganan tersembunyi.' },
        { h: '3. Kod Akses', b: 'Kod akses adalah untuk kegunaan peribadi anda. Sila jangan kongsi atau jual semula kod tersebut.' },
        { h: '4. Pemulangan Wang', b: 'Oleh kerana ini produk digital yang dihantar serta-merta, bayaran tidak boleh dipulangkan selepas kod akses dijana dan dihantar.' },
        { h: '5. Pengawasan Ibu Bapa', b: 'KIDORA direka untuk kanak-kanak 3–6 tahun. Pengawasan ibu bapa digalakkan semasa anak menggunakan platform.' },
        { h: '6. Hak Cipta', b: 'Semua kandungan, reka bentuk dan jenama KIDORA adalah milik Brojim Digital. Dilarang menyalin tanpa kebenaran.' },
      ],
    },
    privacy: {
      title: 'Dasar Privasi',
      sections: [
        { h: '1. Maklumat Yang Dikumpul', b: 'Kami mengumpul nama, emel dan nombor telefon anda semasa pembelian untuk memproses pesanan dan menghantar kod akses.' },
        { h: '2. Cara Kami Menggunakan Maklumat', b: 'Maklumat anda digunakan untuk: memproses bayaran, menghantar kod akses, dan memberikan sokongan pelanggan.' },
        { h: '3. Perkongsian Data', b: 'Kami tidak menjual atau menyewa data anda kepada pihak ketiga. Bayaran diproses oleh BizApp Pay bagi pihak kami.' },
        { h: '4. Penyimpanan Data', b: 'Data pesanan disimpan dengan selamat dan hanya untuk tujuan sokongan dan pemulihan kod akses.' },
        { h: '5. Hak Anda', b: 'Anda boleh meminta kami memadam maklumat anda pada bila-bila masa dengan menghubungi kami.' },
      ],
    },
  },
  en: {
    terms: {
      title: 'Terms & Conditions',
      sections: [
        { h: '1. Digital Product', b: 'KIDORA is a digital product — an access code to educational games for children. No physical items are shipped.' },
        { h: '2. One-Time Payment', b: 'All plans are one-time payments. There are no hidden monthly fees or subscriptions.' },
        { h: '3. Access Codes', b: 'Access codes are for your personal use only. Please do not share or resell them.' },
        { h: '4. Refunds', b: 'As this is a digital product delivered instantly, payments are non-refundable once the access code is generated and delivered.' },
        { h: '5. Parental Supervision', b: 'KIDORA is designed for children aged 3–6. Parental supervision is encouraged while your child uses the platform.' },
        { h: '6. Copyright', b: 'All KIDORA content, design and branding belong to Brojim Digital. Copying without permission is prohibited.' },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      sections: [
        { h: '1. Information We Collect', b: 'We collect your name, email and phone number at checkout to process your order and deliver your access code.' },
        { h: '2. How We Use It', b: 'Your information is used to: process payment, deliver your access code, and provide customer support.' },
        { h: '3. Data Sharing', b: 'We do not sell or rent your data to third parties. Payments are processed by BizApp Pay on our behalf.' },
        { h: '4. Data Storage', b: 'Order data is stored securely and used only for support and access-code recovery.' },
        { h: '5. Your Rights', b: 'You may ask us to delete your information at any time by contacting us.' },
      ],
    },
  },
};

export default function Legal({ kind }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const data = CONTENT[lang][kind];

  return (
    <div className="legal page">
      <div className="legal__card">
        <h1 className="legal__title">{data.title}</h1>
        {data.sections.map((s) => (
          <section key={s.h} className="legal__section">
            <h2 className="legal__h">{s.h}</h2>
            <p className="legal__p">{s.b}</p>
          </section>
        ))}
        <button className="btn btn--primary legal__back" onClick={() => { playTap(); navigate('/'); }}>
          {lang === 'en' ? '← Back to Home' : '← Kembali ke Laman Utama'}
        </button>
      </div>
    </div>
  );
}

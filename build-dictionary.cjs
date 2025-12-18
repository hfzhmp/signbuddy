const fs = require('fs');
const path = require('path');

// --- KONFIGURASI FILE ---
const INDO_FILE = 'kata-dasar.txt';
const ENG_FILE = 'words_dictionary.json';
const OUTPUT_FILE = 'public/kamus-data.json';

async function buildDictionary() {
  try {
    console.log('⏳ Sedang membaca file...');

    // 1. Baca File Indonesia (Text - Newline separated)
    const indoPath = path.join(__dirname, INDO_FILE);
    let indoWords = [];
    if (fs.existsSync(indoPath)) {
        const indoRaw = fs.readFileSync(indoPath, 'utf-8');
        indoWords = indoRaw.split('\n').map(w => w.trim()).filter(w => w);
        console.log(`✅ Kata Indonesia: ${indoWords.length} kata`);
    } else {
        console.warn(`⚠️ File ${INDO_FILE} tidak ditemukan. Melewati...`);
    }

    // 2. Baca File Inggris (JSON - Keys)
    const engPath = path.join(__dirname, ENG_FILE);
    let engWords = [];
    if (fs.existsSync(engPath)) {
        const engRaw = fs.readFileSync(engPath, 'utf-8');
        const engJson = JSON.parse(engRaw);
        engWords = Object.keys(engJson);
        console.log(`✅ Kata Inggris: ${engWords.length} kata`);
    } else {
        console.warn(`⚠️ File ${ENG_FILE} tidak ditemukan. Melewati...`);
    }

    // 3. Gabungkan & Normalisasi (UpperCase + Hapus Duplikat)
    console.log('🔄 Menggabungkan dan membersihkan data...');
    const combinedSet = new Set();
    
    [...indoWords, ...engWords].forEach(word => {
        // Hanya masukkan kata yang valid (bukan string kosong)
        if (word && word.length > 0) {
            combinedSet.add(word.toUpperCase());
        }
    });

    // 4. Tulis ke File Javascript
    console.log(`💾 Menulis ${combinedSet.size} kata ke ${OUTPUT_FILE}...`);
    
    const jsonContent = JSON.stringify(Array.from(combinedSet));

    // Pastikan folder public ada
    const dir = path.dirname(path.join(__dirname, OUTPUT_FILE));
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), jsonContent, 'utf-8');
    
    console.log('🚀 SUKSES! File kamus JSON siap digunakan.');
    
  } catch (error) {
    console.error('❌ Terjadi Error:', error);
  }
}

buildDictionary();
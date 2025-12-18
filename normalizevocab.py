import json
import urllib.request
import os

def filter_natural_words():
    input_file = 'words_dictionary.json'
    output_file = 'natural_words_dictionary.json'
    
    # URL daftar 20.000 kata paling umum (sumber: First20Hours/Google Corpus)
    # Daftar ini mencakup sekitar 95% kosa kata sehari-hari & literatur umum
    common_words_url = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt"

    print("1. Mengunduh daftar kata umum...")
    try:
        with urllib.request.urlopen(common_words_url) as response:
            data = response.read().decode('utf-8')
            # Masukkan ke dalam set untuk pencarian cepat
            common_words_set = set(word.strip().lower() for word in data.splitlines())
    except Exception as e:
        print(f"Gagal mengunduh daftar kata: {e}")
        return

    print(f"2. Membaca file {input_file}...")
    if not os.path.exists(input_file):
        print(f"Error: Pastikan file '{input_file}' ada di folder yang sama dengan script ini.")
        return

    with open(input_file, 'r') as f:
        original_dict = json.load(f)

    print("3. Menyaring kata-kata 'absurd'...")
    filtered_dict = {}
    
    for word in original_dict:
        # Hanya simpan kata jika ada di daftar umum
        # Kita juga bisa memfilter kata 1 huruf kecuali 'a' dan 'i' agar lebih bersih
        clean_word = word.lower()
        if clean_word in common_words_set:
            # Tambahan: Hapus kata 1 huruf yang bukan 'a' atau 'i' (opsional)
            if len(clean_word) == 1 and clean_word not in ['a', 'i']:
                continue
            filtered_dict[word] = 1

    print(f"4. Menyimpan hasil ke {output_file}...")
    with open(output_file, 'w') as f:
        json.dump(filtered_dict, f, indent=2)

    original_count = len(original_dict)
    new_count = len(filtered_dict)
    print(f"\nSelesai! File telah dibersihkan.")
    print(f"Jumlah kata awal: {original_count}")
    print(f"Jumlah kata setelah filter: {new_count}")
    print(f"Kata-kata seperti 'aa', 'ab', 'zizz' telah dihapus.")

if __name__ == "__main__":
    filter_natural_words()
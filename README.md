## 📄 Structura fișierelor JSON

### `products.json`

Conține o listă de produse, fiecare cu:

- `id` (număr/unic)
- `descriere` (nume produs)
- `pret` (preț în RON)
- `poze` (listă de URL-uri imagini)
- `descriereText` (opțional, detalii suplimentare)

**Exemplu:**

```json
{
  "id": 1,
  "descriere": "Cub infinit",
  "pret": 25,
  "poze": ["assets/cub1.jpg", "assets/cub2.jpg"],
  "descriereText": "Cub articulat, perfect de fidgeting."
}
```

### `colors.json`

Conține o listă de culori disponibile, fiecare cu:

- `id` (string, unic)
- `nume` (nume culoare)
- `hex` (cod hexazecimal pentru culoare)

**Exemplu:**

```json
{
  "id": "blue",
  "nume": "Albastru",
  "hex": "#0086d6"
}
```

# Levi 3D Lab – Magazin 3D interactiv

**Proiect web pentru prezentarea și vânzarea creațiilor 3D realizate de Levi.**

---

## 📦 Scop și descriere

Acest proiect este un magazin online simplu, static, pentru prezentarea și comandarea produselor 3D (cuburi, fluiere, axolotl etc). Utilizatorul poate selecta produse, alege culori și trimite comanda pe WhatsApp.

## 🗂️ Structura proiectului

- `index.html` – Pagina principală, conține structura și interfața magazinului.
- `styles.css` – Stiluri moderne, responsive, cu accente jucăușe.
- `script.js` – Logica aplicației (încărcare produse/culori, interacțiuni, sumar comandă, integrare WhatsApp, galerie imagini).
- `products.json` – Lista produselor disponibile (id, descriere, preț, poze).
- `colors.json` – Lista culorilor disponibile pentru personalizare.
- `assets/` – Imagini produse, favicon, avatar Levi etc.
- `manifest.json` – Pentru PWA (Progressive Web App).
- `README.md` – (acest fișier)

## 🛠️ Tehnologii folosite

- HTML5, CSS3 (Flexbox, media queries, animații)
- JavaScript (ES6+, DOM, fetch API)
- JSON pentru date produse/culori
- WhatsApp API pentru trimitere comenzi
- Fără backend/server – static site

## 🚦 Flux aplicație

1. La încărcare, se citesc `products.json` și `colors.json`.
2. Se afișează tabelul cu produse și opțiuni de culoare (radio desktop, dropdown mobil).
3. Utilizatorul selectează produse și culori.
4. Sumarul comenzii se actualizează live.
5. Comanda se trimite pe WhatsApp (cu detalii produse, culori, total, nume client).
6. Galerie de imagini pentru fiecare produs (modal, navigare cu săgeți).

## 📝 Notițe pentru viitor

- Pentru a adăuga produse/culori, modifică fișierele JSON.
- Pentru a schimba numărul de telefon WhatsApp, modifică variabila `phoneNumber` din `script.js`.
- Pentru a schimba stilul notei de producție, editează `.production-note` în `styles.css`.
- Pentru a adăuga funcționalități noi (ex: plată online, stocuri, backend), proiectul trebuie extins cu un server.

## 🖥️ Pornire locală

1. Descarcă proiectul sau clonează repo-ul.
2. Deschide `index.html` direct în browser (nu necesită server local pentru funcționalitatea de bază).
3. Pentru fetch local pe unele browsere, folosește un server static (ex: VSCode Live Server, Python http.server):

```sh
# cu Python 3
python -m http.server 8080
# apoi accesează http://localhost:8080
```

## 👨‍💻 Dezvoltatori

- Levi (creator produse, idee)
- Ovidiu (programare, design, mentor)

---

**Proiect educațional, pentru joacă și învățare.**

Dacă revii peste ani: citește acest fișier pentru a-ți reaminti rapid cum funcționează totul! Spor la printat și programat! 🚀

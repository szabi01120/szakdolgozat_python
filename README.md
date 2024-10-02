# Szakdolgozat - Webalkalmazás fejlesztés Python nyelven

Ez a webalkalmazás a diplomamunkámhoz készült webalkalmazást tartalmazza, amely egy **Python Flask** backenddel, **React** frontenddel és különböző adatbázis technológiákkal készült. 
Az alkalmazás egy nyilvántartó rendszer, amely személyre szabottan édesapám vállalkozásának könnyebb és átláthatóbb menedzseléséhez készült.
Általános célja -mint diplomamunka-, hogy bemutassa a modern webfejlesztés főbb technológiáit, integrálva az adatkezelést és a felhasználói session menedzsmentet.

## Fő technológiák

- **Backend:** Python - Flask
- **Frontend:** React + Bootstrap
- **Adatbázis:** SQLite, SQLAlchemy ORM
- **Session management:** Redis

## Az alkalmazás funkciói
- **User authentication, session management (Redis session)** 
- **Raktár felület a termékek nyomonkövetésére:** 
  - Termékek hozzáadása
  - Termékek lekérdezése
  - Termékek szerkesztése
  - Termékek törlése
  - Termék képek feltöltése (Drag & Drop), menedzselése
  - Egyéni logika szerinti termék áthelyezés a Forgalom felületre
- **Eladott termékek nyomonkövetése:**
  - Eladott termékek lekérdezése
  - Eladott termékek szerkesztése
  - Eladott termékek törlése
- **Automatizált ajánlatkészítő rendszer:**
  - Adott 'form' kitöltésével emailben ajánlat küldése egy saját, testreszabott sablon alapján. (smtp)
  - Email sablon hozzáadása
  - Email sablon törlése
- **Termék hozzáadása:**
  - 'Form' kitöltésével termék hozzáadása
  - Választható opció egy adott termékhez a képfeltöltés
    - Drag & Drop módszer
    - Amennyiben választott opció a képfeltöltés, a rendszer dinamikusan menedzseli az adott termékhez tartozó képeket
- **Kezdőoldalon "dashboard" összesítés:**
  - Raktáron lévő termékek száma
  - Eladott termékek száma
  - Jövedelem (HUF, EUR, USD)
  - Legutóbbi eladott termék
  - Legutóbbi vásárló neve
  - Utolsó 5 tranzakció

## Tulajdonságok

- **Backend:** 
  - REST API implementálás Flask segítségével
  - Adatbázis kezelés SQLAlchemy ORM segítségével
  - Redis alapú session kezelés és felhasználói jogosultságkezelés
  - Adatvalidáció és hibaüzenetek kezelése
  - Termékekhez tartozó képek menedzselése
  
- **Frontend:**
  - Modern, reszponzív felhasználói felület a Bootstrap és React kombinációjával
  - Dinamikus komponensek és state menedzsment React állapotkezeléssel
  - Kommunikáció a backend API-kkal (Axios)

## Előfeltételek

Az alkalmazás futtatásához szükséges eszközök és könyvtárak:

- Python 3.x
- Flask
- Node.js (React)
- Redis
- SQLite

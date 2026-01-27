#  Machining Calculator / Workflow Simulator

Dette prosjektet er et interaktivt verktøy for maskinering, med fokus på både beregning (planlegging) og stegvis utførelse (execution).  
Prosjektet er bygget som et lærings- og porteføljeprosjekt, med hovedvekt på TypeScript, React og tydelig arkitektur.

Målet har vært å modellere faktiske arbeidsflyter fra maskinering, ikke bare lage en enkel kalkulator.

---

##  Hensikt og mål

Hensikten med prosjektet er å utforske hvordan komplekse, virkelige prosesser kan modelleres på en ryddig og forståelig måte i kode.

Spesifikke mål:
- Skille tydelig mellom planlegging og utførelse
- Modellere felter som endrer rolle over tid (input → låst → tilgjengelig igjen)
- Beskytte brukerinput mot utilsiktet overskriving
- La UI alltid reflektere faktisk systemtilstand
- Bygge et system som er lett å utvide videre

---

##  Funksjonalitet

### Spiral / Helix machining
- Beregning av pitch, vinkel og relaterte parametere
- Maskinberegnede verdier markeres tydelig
- Brukerinput kan ikke overskrives av maskinen uten tillatelse

### Hole Machining (finkjøring)
- Planlegging av kutt basert på startdiameter, måldiameter, antall steg og ae
- Interaktiv execution-tabell for stegvis utførelse
- Registrering og oppdatering av målinger
- Støtte for tastatur (Enter / Esc)
- Felter låses automatisk når utførelsen faktisk starter
- Felter låses opp igjen når utførelsen er fullført

### Cutting data

### Trekant

---

##  Arkitektur og kjerneidéer

### FieldState-modell

Alle inputfelt er modellert eksplisitt med både kilde og bruksstatus:

```ts
type FieldState = {
  value: string;
  source: "empty" | "user" | "machine";
  usage?: "idle" | "active";
};


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

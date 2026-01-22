export const holeTooltips = {
  D_start:
    "Startdiameter på hullet før fresing. Dette er målt diameter før første kutt.",

  D_target:
    "Ønsket slutt-diameter på hullet etter ferdig maskinering.",

  N:
    "Antall kutt fresingen deles opp i. Brukes for å beregne diameterøkning per steg.",

  ae:
    "Radialt inngrep per steg. Dette er halvparten av diameterøkningen i hvert kutt.",

  measured:
    "Målt diameter etter utført kutt. Brukes for å beregne neste mål.",

  deltaD:
    "Diameterøkningen fra forrige steg til dette steget.",

  execution:
    "Utførelsesmodus. Registrer målt diameter etter hvert kutt for å få neste mål.",

} as const;


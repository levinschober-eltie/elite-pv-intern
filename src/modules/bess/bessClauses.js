// ============================================================
// BESS – Vertragsklauseln (Flächennutzungsvertrag)
// Basis: Enerpeak BESS-Vorlage (13 §§ + 5 Anlagen)
// Angepasst für Elite PV GmbH
// ============================================================

export const BESS_KLAUSELN = [
  {
    id: "bess-p",
    titel: "Pr\u00E4ambel",
    text: `Der Grundst\u00FCckseigent\u00FCmer ist {EIGENTUEMER_TYP} des unter \u00A7 1 Abs. 1 n\u00E4her bezeichneten Grundst\u00FCcks.

Der Grundst\u00FCcksnutzer beabsichtigt auf dem Grundst\u00FCck ein oder mehrere Batterie-Energiespeichersysteme einschlie\u00DFlich der hierzu erforderlichen Zuwegungen, Anschlussleitungen, Wechselrichter, Transformatoren und sonstigen Nebenanlagen (nachfolgend: \u201EBESS\u201C) zu errichten, zu erhalten, zu betreiben und \u2013 soweit sinnvoll \u2013 ganz oder in Teilen zu ersetzen.

Nach Ma\u00DFgabe der folgenden Bestimmungen gestattet der Grundst\u00FCckseigent\u00FCmer dem Grundst\u00FCcksnutzer die Nutzung einer in \u00A7 1 Abs. 2 n\u00E4her spezifizierten Teilfl\u00E4che zu diesem Zweck.`,
  },
  {
    id: "bess-1",
    titel: "\u00A7 1 Vertragsgegenstand",
    text: `1.1. Der Grundst\u00FCckseigent\u00FCmer ist Eigent\u00FCmer der folgenden Grundst\u00FCcke:

{GRUNDBUCH_TABELLE}

1.2. Der Grundst\u00FCcksnutzer plant die Errichtung, den Betrieb, die Wartung und Instandsetzung des BESS auf Teilfl\u00E4chen des Grundst\u00FCcks (nachfolgend: \u201EBESS-Fl\u00E4che\u201C) zur alleinigen Nutzung nach Ma\u00DFgabe dieses Vertrags. Die BESS-Fl\u00E4che umfasst ca. {BESS_FLAECHE_M2} m\u00B2.

1.3. Der vorl\u00E4ufige Lageplan (Anlage 1) zeigt den gegenw\u00E4rtigen Planungsstand. Die Festlegung der endg\u00FCltigen BESS-Fl\u00E4chen erfolgt im Rahmen einer Nachtragsvereinbarung.

1.4. Der Grundst\u00FCckseigent\u00FCmer kann eine katasterliche Vermessung der endg\u00FCltigen BESS-Fl\u00E4che verlangen. Die Kosten tragen die Parteien jeweils zur H\u00E4lfte.

1.5. Dem Fl\u00E4chennutzungsvertrag ist ein Grundbuchauszug beigef\u00FCgt (Anlage 2). Der Grundst\u00FCckseigent\u00FCmer erteilt dem Grundst\u00FCcksnutzer Vollmacht zur Einholung aktueller Grundbuchausz\u00FCge (Anlage 3).`,
  },
  {
    id: "bess-2",
    titel: "\u00A7 2 Nutzungsumfang, Eigentum",
    text: `2.1. Der Grundst\u00FCckseigent\u00FCmer gestattet dem Grundst\u00FCcksnutzer auf der BESS-Fl\u00E4che die Errichtung, den Betrieb, die Wartung und Instandsetzung des BESS. Hierunter f\u00E4llt ausdr\u00FCcklich auch die Berechtigung, Batteriecontainer, Transformator- und/oder \u00DCbergabestationen zu errichten und die erforderlichen Fundamente, Zuwege und Zaunanlagen zu erstellen.

2.2. Das BESS bleibt Eigentum des Grundst\u00FCcksnutzers. Das BESS wird nur zu einem vor\u00FCbergehenden Zweck i.S.v. \u00A7 95 Abs. 1 Satz 1 BGB als Scheinbestandteil mit der BESS-Fl\u00E4che verbunden.

2.3. Alle mit dem Eigentum am Grundst\u00FCck zusammenh\u00E4ngenden \u00F6ffentlichen Abgaben und Lasten tr\u00E4gt weiterhin der Grundst\u00FCckseigent\u00FCmer. Kommt es aufgrund des BESS zu einer Neubewertung der Grundsteuer, tr\u00E4gt der Grundst\u00FCcksnutzer die nachgewiesenen Mehrabgaben.

2.4. Der Grundst\u00FCckseigent\u00FCmer erkl\u00E4rt, dass er alleiniger Eigent\u00FCmer des Grundst\u00FCcks ist und keine vertraglichen Nutzungsrechte Dritter bestehen, die der Aus\u00FCbung der Rechte des Grundst\u00FCcksnutzers entgegenstehen.`,
  },
  {
    id: "bess-3",
    titel: "\u00A7 3 Rechte und Pflichten der Parteien",
    text: `3.1. Der Grundst\u00FCckseigent\u00FCmer \u00FCbernimmt keinerlei Gew\u00E4hr f\u00FCr die Eignung der BESS-Fl\u00E4che.

3.2. Der Grundst\u00FCcksnutzer ist verpflichtet, die bauliche Eignung auf eigene Kosten zu pr\u00FCfen und alle erforderlichen Genehmigungen beizubringen.

3.3. Der Grundst\u00FCckseigent\u00FCmer ist verpflichtet, alle erforderlichen Vollmachten und Mitwirkungshandlungen vorzunehmen.

3.4. Der Grundst\u00FCcksnutzer versichert, f\u00FCr das BESS ausschlie\u00DFlich Komponenten zu verwenden, die nach IEC-Normen zertifiziert sind und von denen keine Schadstoffe ins Erdreich eingetragen werden k\u00F6nnen.

3.5. Der Grundst\u00FCcksnutzer, dessen Beauftragte und Drittbetreiber sind befugt, die BESS-Fl\u00E4che jederzeit mit Fahrzeugen aller Art zu betreten und zu befahren.

3.6. Dem Grundst\u00FCcksnutzer obliegen die Verkehrssicherungspflichten sowie die Gr\u00FCnpflege der BESS-Fl\u00E4che.

3.7. Der Grundst\u00FCckseigent\u00FCmer verzichtet auf das Vermieterpfandrecht am BESS (\u00A7\u00A7 562 ff. BGB).`,
  },
  {
    id: "bess-4",
    titel: "\u00A7 4 Bereitstellung und \u00DCbergabe der BESS-Fl\u00E4che",
    text: `4.1. Die \u00DCbergabe der BESS-Fl\u00E4che erfolgt zum Bereitstellungstermin. Der Grundst\u00FCcksnutzer zeigt diesen mit einer Frist von mindestens acht (8) Wochen schriftlich an.

4.2. Vor dem Bereitstellungstermin ist ein von beiden Parteien zu unterzeichnendes Protokoll \u00FCber den Zustand der BESS-Fl\u00E4che anzufertigen.

4.3. Der Grundst\u00FCcksnutzer hat auf Wunsch des Grundst\u00FCckseigent\u00FCmers vor dem Bereitstellungstermin und nach Vertragsende Bodenproben nehmen zu lassen und die Ergebnisse unaufgefordert vorzulegen.`,
  },
  {
    id: "bess-5",
    titel: "\u00A7 5 Nutzungsentgelt",
    text: `5.1. Der Grundst\u00FCcksnutzer zahlt ab Bereitstellung der BESS-Fl\u00E4che bis Vertragsende ein j\u00E4hrliches Nutzungsentgelt von {PACHTZINS_JAHR} EUR ({PACHTZINS_WORT} Euro).

5.2. Ab dem 11. vollen Betriebsjahr nach Inbetriebnahme erh\u00F6ht sich das Nutzungsentgelt einmalig um {STEIGERUNG}%.

5.3. Im Zeitraum ab Bereitstellung bis zur Inbetriebnahme betr\u00E4gt das Nutzungsentgelt {VORHALTE_PROZENT}% des vollen Entgelts ({VORHALTE_BETRAG} EUR/Jahr).

5.4. Die Inbetriebnahme ist dem Grundst\u00FCckseigent\u00FCmer unverz\u00FCglich schriftlich mitzuteilen. Ma\u00DFgeblich ist die Aufnahme des kommerziellen Betriebs.

5.5. Das Nutzungsentgelt ist jeweils zum 30.06. des laufenden Kalenderjahres f\u00E4llig.

5.6. Bankverbindung des Grundst\u00FCckseigent\u00FCmers:
IBAN: {EIGENTUEMER_IBAN}
BIC: {EIGENTUEMER_BIC}`,
  },
  {
    id: "bess-6",
    titel: "\u00A7 6 Vertragslaufzeit, K\u00FCndigung",
    text: `6.1. Dieser Vertrag tritt mit beidseitiger Unterzeichnung in Kraft. Er l\u00E4uft bis zum Ende des Kalenderjahres der Inbetriebnahme zuz\u00FCglich weiterer {LAUFZEIT_JAHRE} Kalenderjahre (Festlaufzeit).

6.2. Der Grundst\u00FCcksnutzer kann die Festlaufzeit zweimal um jeweils f\u00FCnf (5) Jahre verl\u00E4ngern (Verl\u00E4ngerungsoption). Bei Aus\u00FCbung der ersten Option erh\u00F6ht sich das Entgelt einmalig um weitere 10%.

6.3. W\u00E4hrend der Festlaufzeit ist die ordentliche K\u00FCndigung ausgeschlossen. Das Recht zur au\u00DFerordentlichen K\u00FCndigung aus wichtigem Grund bleibt unber\u00FChrt.

6.4. Ein wichtiger Grund liegt insbesondere vor:
a) F\u00FCr den Eigent\u00FCmer: wenn der Nutzer mit dem Entgelt l\u00E4nger als 3 Monate in Verzug ist und trotz zweimaliger Mahnung nicht zahlt.
b) F\u00FCr den Nutzer: wenn eine erforderliche Genehmigung aufgehoben wird oder das BESS zerst\u00F6rt wird.

6.5. Sonderk\u00FCndigungsrecht f\u00FCr den Eigent\u00FCmer: wenn bis zum 31.12. des 3. Jahres nach Vertragsschluss mit der Errichtung nicht begonnen wurde.

6.6. Sonderk\u00FCndigungsrecht f\u00FCr den Nutzer: bei fehlender Netzanschlusszusage, fehlender Dienstbarkeitseintragung, Altlastenbelastung oder verweigerter Finanzierung.`,
  },
  {
    id: "bess-7",
    titel: "\u00A7 7 Haftung, Versicherung",
    text: `7.1. Die Parteien haften bei Vorsatz oder grober Fahrl\u00E4ssigkeit unbegrenzt, bei schuldhafter Verletzung wesentlicher Vertragspflichten begrenzt auf vorhersehbare, vertragstypische Sch\u00E4den.

7.2. Der Grundst\u00FCcksnutzer stellt sicher, dass vor Baubeginn eine Haftpflichtversicherung mit einer Mindestdeckungssumme von 5.000.000 EUR pro Schadensfall abgeschlossen wird.

7.3. Der Grundst\u00FCcksnutzer haftet nicht f\u00FCr Altlasten nach BBodSchG.`,
  },
  {
    id: "bess-8",
    titel: "\u00A7 8 Rechtsnachfolge, \u00DCbertragung",
    text: `8.1. Der Grundst\u00FCcksnutzer darf den Vertrag auf Dritte \u00FCbertragen. Die \u00DCbertragung ist dem Eigent\u00FCmer schriftlich mitzuteilen und wird wirksam, wenn nicht innerhalb von 2 Wochen widersprochen wird.

8.2. Bei Ver\u00E4u\u00DFerung des Grundst\u00FCcks ist folgende Klausel in den Kaufvertrag aufzunehmen:
\u201EDer K\u00E4ufer tritt in alle Verpflichtungen aus dem Fl\u00E4chennutzungsvertrag vom {VERTRAGSDATUM} ein.\u201C

8.3. Mit \u00DCbergang des Eigentums tritt der K\u00E4ufer in die Rechtsposition des Eigent\u00FCmers ein.`,
  },
  {
    id: "bess-9",
    titel: "\u00A7 9 R\u00FCckbau, B\u00FCrgschaft",
    text: `9.1. Der Grundst\u00FCcksnutzer ist verpflichtet, nach Ablauf der Festlaufzeit das BESS innerhalb von 6 Monaten auf eigene Kosten abzubauen und den urspr\u00FCnglichen Zustand der BESS-Fl\u00E4che wiederherzustellen.

9.2. Vor Bereitstellung der BESS-Fl\u00E4che legt der Grundst\u00FCcksnutzer eine selbstschuldnerische Bankb\u00FCrgschaft in H\u00F6he von {RUECKBAU_BETRAG} EUR ({RUECKBAU_SATZ} EUR pro kWh installierter Kapazit\u00E4t) vor.

9.3. Die H\u00F6he der B\u00FCrgschaft wird nach dem 11. Betriebsjahr und dann alle 7 Jahre durch einen Sachverst\u00E4ndigen \u00FCberpr\u00FCft.

9.4. Kommt der Grundst\u00FCcksnutzer der R\u00FCckbaupflicht nicht nach, darf der Eigent\u00FCmer auf Kosten des Nutzers r\u00E4umen lassen.`,
  },
  {
    id: "bess-10",
    titel: "\u00A7 10 Dingliche Rechte",
    text: `10.1. Die Rechte des Grundst\u00FCcksnutzers werden durch beschr\u00E4nkt pers\u00F6nliche Dienstbarkeiten dinglich gesichert. Das Muster der Bestellungsurkunde ist als Anlage 4 beigef\u00FCgt.

10.2. Die Eintragung muss im Rang vor allen anderen in Abt. II und III eingetragenen Rechten Dritter erfolgen.

10.3. Der Grundst\u00FCckseigent\u00FCmer gibt alle erforderlichen Erkl\u00E4rungen ab, einschlie\u00DFlich Rangr\u00FCcktritte.

10.4. Nach Beendigung der Festlaufzeit werden die Eintragungen auf Veranlassung des Grundst\u00FCcksnutzers gel\u00F6scht. Die Kosten tr\u00E4gt der Grundst\u00FCcksnutzer.`,
  },
  {
    id: "bess-11",
    titel: "\u00A7 11 Sicherungs\u00FCbereignung",
    text: `11.1. Dem Eigent\u00FCmer ist bekannt, dass das BESS an eine finanzierende Bank sicherungs\u00FCbereignet werden kann.

11.2. Der Eigent\u00FCmer willigt ein, dass die Bank im Verwertungsfall das BESS selbst betreibt oder ver\u00E4u\u00DFert. Der Eintritt wird mit Zugang der Eintrittserkl\u00E4rung wirksam.

11.3. Vor einer K\u00FCndigung ist die Bank schriftlich zu benachrichtigen und ihr 2 Monate Frist zum Selbsteintritt einzur\u00E4umen.`,
  },
  {
    id: "bess-12",
    titel: "\u00A7 12 Gerichtsstand, Rechtswahl",
    text: `12.1. Ausschlie\u00DFlicher Gerichtsstand ist der Belegenheitsort der BESS-Fl\u00E4che.

12.2. Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss der international-privatrechtlichen Kollisionsnormen.`,
  },
  {
    id: "bess-13",
    titel: "\u00A7 13 Schlussbestimmungen",
    text: `13.1. Anlagen:
Anlage 1 \u2013 Vorl\u00E4ufiger Lageplan
Anlage 2 \u2013 Grundbuchauszug
Anlage 3 \u2013 Vollmacht Einholung Grundbuchauszug
Anlage 4 \u2013 Muster Bestellungsurkunde Dienstbarkeit
Anlage 5 \u2013 Muster Bestellung Vormerkung

13.2. M\u00FCndliche Nebenabreden bestehen nicht.

13.3. \u00C4nderungen und Erg\u00E4nzungen bed\u00FCrfen der Schriftform.

13.4. Sollten einzelne Bestimmungen unwirksam sein, wird die G\u00FCltigkeit der \u00FCbrigen Bestimmungen nicht ber\u00FChrt. Die Parteien ersetzen die unwirksame Bestimmung durch eine dem wirtschaftlichen Zweck am n\u00E4chsten kommende Regelung.

{ZUSATZVEREINBARUNGEN}`,
  },
];

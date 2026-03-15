// ============================================================
// FREIFLÄCHE – Vertragsklauseln (Gestattungsvertrag)
// Basis: Vorderthürn-Vertrag (16 §§ + 8 Anlagen)
// ============================================================

export const FREIFLAECHE_KLAUSELN = [
  {
    id: "ff0",
    titel: "Präambel",
    text: `Der Eigentümer ist {EIGENTUEMER_TYP} des/der in § 1 näher bezeichneten Grundstücke.

Die Betreiberin ist Projektentwicklerin im Bereich regenerative Energien.

Die Betreiberin beabsichtigt, auf den nachstehend beschriebenen Flächen des Eigentümers eine Freiflächen-Photovoltaikanlage mit einer geplanten Leistung von ca. {LEISTUNG_MWP} MWp sowie einen Grünstrom-/Graustromspeicher (nachfolgend zusammen „Energieanlagen") zu errichten und zu betreiben.

Die Energieanlagen werden Strom erzeugen und in das Netz der allgemeinen Versorgung einspeisen. Die Betreiberin wird mit diesen Energieanlagen an verschiedenen Strommärkten teilnehmen.

Vor diesem Hintergrund schließen die Vertragspartner folgenden Gestattungsvertrag:`,
  },
  {
    id: "ff1",
    titel: "§ 1 Vertragsgegenstand",
    text: `1.1. Der Eigentümer sichert zu, dass er {EIGENTUEMER_TYP} des/der folgenden Grundstücke ist und zur freien Verfügung über die für den Vertragszweck erforderlichen Flächen berechtigt ist:

Anschrift des Grundstücks: {GRUNDSTUECK_ADRESSE}

{GRUNDBUCH_TABELLE}

Es bestehen keine Rechte Dritter am Grundstück, die der Ausübung der Rechte nach diesem Vertrag entgegenstehen.

1.2. Der Eigentümer gibt keine Gewähr für die Eignung des Grundstücks für den Nutzungszweck, die genauen Flächenmaße oder die Mangelfreiheit des Grundstücks.

1.3. Soweit die Flächen verpachtet sind, ist die Einverständniserklärung des Pächters als Anlage 2 beigefügt.`,
  },
  {
    id: "ff2",
    titel: "§ 2 Nutzungsrechte der Betreiberin",
    text: `2.1. Die Betreiberin und von ihr beauftragte Unternehmen dürfen das Grundstück nach Maßgabe behördlicher Vorgaben und nach billigem Ermessen (§ 315 BGB) für Errichtung, Betrieb, Wartung, Instandsetzung, Rückbau und Erneuerung der PV-Anlage nutzen.

2.2. Die Nutzungsrechte umfassen insbesondere:
a) Errichtung der PV-Module, Unterkonstruktionen, Einzäunung, Bepflanzung und eines Batteriespeichers samt aller erforderlichen elektrischen Komponenten;
b) Verlegung von Anschluss-, Hochspannungs- und Telekommunikationskabeln (Erdkabel in mind. 1,0 m Tiefe);
c) Errichtung und Betrieb von Übergabestationen und Umspannwerken;
d) Bau und Unterhaltung von Schotterzufahrten von der öffentlichen Straße zum Gelände;
e) Durchführung von Ausgleichs- und Ersatzmaßnahmen nach Planungsrecht.

2.3. Die Betreiberin darf das Grundstück jederzeit mit Maschinen und Gerätschaften betreten. Material darf vorübergehend zwischengelagert werden.

2.4. Die technischen Details werden in der Planungsphase festgelegt. Nach Abschluss der Planung übergibt die Betreiberin dem Eigentümer einen aktualisierten Lageplan als Vertragsergänzung.

2.5. Nicht genutzte Flächen stehen dem Eigentümer weiterhin zur land- und forstwirtschaftlichen Nutzung zur Verfügung.

2.6. Der Eigentümer darf die von der Betreiberin gebauten Zufahrtswege für landwirtschaftliche Zwecke mitnutzen, ohne Beschädigungen zu verursachen.`,
  },
  {
    id: "ff3",
    titel: "§ 3 Eigentumslage und Vermieterpfandrecht",
    text: `3.1. Das Grundstück verbleibt im Eigentum des Eigentümers. Der Eigentümer trägt weiterhin alle Grundsteuern und öffentlichen Lasten.

3.2. Die Energieanlagen verbleiben als Scheinbestandteile i.S.v. § 95 Abs. 1 BGB im Eigentum der Betreiberin. Sie werden nur vorübergehend errichtet und bei Vertragsende entfernt.

3.3. Der Eigentümer verzichtet gegenüber einer die Energieanlagen finanzierenden Bank auf sein Vermieterpfandrecht an den Energieanlagen für die Dauer der Finanzierung.`,
  },
  {
    id: "ff4",
    titel: "§ 4 Grundbuchrechtliche Sicherung",
    text: `4.1. Der Eigentümer verpflichtet sich, eine beschränkte persönliche Dienstbarkeit zugunsten der Betreiberin gemäß Anlage 7 zu bestellen. Die Dienstbarkeit ist auf Dritte übertragbar.

4.2. Bei Eintritt eines Dritten oder der finanzierenden Bank ist eine inhaltsgleiche Dienstbarkeit zu deren Gunsten zu bestellen.

4.3. Zur Sicherung ist eine Vormerkung für die Dienstbarkeit und etwaige Ansprüche der finanzierenden Bank einzutragen.

4.4. Die Eintragung erfolgt in Abt. II lastenfrei und in Abt. III ohne vorrangige Belastungen.

4.5. Der Eigentümer wird alle erforderlichen Erklärungen in der erforderlichen Form abgeben. Ist eine rangrichtige Eintragung nicht sofort möglich, ist zunächst an verfügbarer Stelle einzutragen und eine rangrichtige Eintragung nachzuholen.

4.6. Verlangt die finanzierende Bank eine abweichende Sicherungsstruktur, ist der Eigentümer zur Mitwirkung verpflichtet, sofern ihm hieraus kein wesentlicher Nachteil entsteht.

4.7. Bei Veräußerung des Grundstücks vor Eintragung der Dienstbarkeit ist die Dienstbarkeit vor Eigentumsumschreibung einzutragen.

4.8. Die Betreiberin ist nach Vertragsende zur Löschung der Dienstbarkeiten und Vormerkungen verpflichtet. Sonderregelungen gelten bei vorzeitiger Beendigung durch Insolvenz (§ 57a ZVG, § 111 InsO) oder Formverstoß (§ 550 BGB).

4.9. Die Kosten der Eintragung und Löschung trägt die Betreiberin.`,
  },
  {
    id: "ff5",
    titel: "§ 5 Pflichten des Eigentümers",
    text: `5.1. Der Eigentümer unterlässt sämtliche Handlungen, die den Betrieb der Energieanlagen nachweislich beeinträchtigen. Er duldet keine schattenverursachenden Bauten, Hindernisse oder Bepflanzungen.

5.2. Der Eigentümer belastet das Grundstück nicht mit weiteren Dienstbarkeiten, Baulasten oder Beschränkungen, die nicht unmittelbar mit der PV-Anlage zusammenhängen.

5.3. Die Betreiberin holt alle Genehmigungen ein. Der Eigentümer gibt die erforderlichen Erklärungen und Zustimmungen ab, einschließlich Abstandsflächenverzichtserklärungen und beschränkter persönlicher Dienstbarkeiten.`,
  },
  {
    id: "ff6",
    titel: "§ 6 Pflichten der Betreiberin",
    text: `6.1. Die Betreiberin zeigt den Baubeginn schriftlich mit 8 Wochen Vorlauf an.

6.2. Bestehende Drainagen sind während der Bauphase zu schützen. Bei unvermeidlicher Beeinträchtigung stellt die Betreiberin die Gesamtfunktion sicher. Der Eigentümer stellt vorhandene Drainagepläne zur Verfügung.

6.3. Alle Anlagen werden nach dem aktuellen Stand der Technik und den anerkannten Regeln der Technik errichtet, betrieben und unterhalten.

6.4. Vorübergehend genutzte Baustellenflächen sind nach Fertigstellung in den landwirtschaftlich nutzbaren Zustand zurückzuversetzen.

6.5. Erforderliche Baum- und Gehölzrodungen erfolgen nach Absprache mit dem Eigentümer und auf Kosten der Betreiberin. Das Eigentum am geschlagenen Holz verbleibt beim Eigentümer.

6.6. Bau- und Feldschäden werden vom Eigentümer schriftlich gemeldet und nach Sätzen der Landwirtschaftskammer ersetzt. Bei Meinungsverschiedenheiten bestimmt ein neutraler Sachverständiger verbindlich den Betrag.`,
  },
  {
    id: "ff7",
    titel: "§ 7 Verkehrssicherungspflichten und Haftung",
    text: `7.1. Die Betreiberin trägt sämtliche Verkehrssicherungspflichten für die Energieanlagen während Bau, Betrieb und Rückbau, einschließlich Zufahrten und temporärer Arbeitsbereiche.

7.2. Die Betreiberin haftet gegenüber dem Eigentümer und Dritten nach den gesetzlichen Bestimmungen. Sie unterhält eine Haftpflichtversicherung mit einer Deckungssumme von mindestens 5.000.000 EUR und weist diese auf Verlangen bei Baubeginn nach.

7.3. Beschädigte Grenzsteine sind durch die Betreiberin auf eigene Kosten wiederherzustellen. Feld- und Gebäudeschäden sind zu beheben.`,
  },
  {
    id: "ff8",
    titel: "§ 8 Vergütung",
    text: `8.1. Vorhaltevergütung
Ab Vertragsunterzeichnung bis Inbetriebnahme erhält der Eigentümer eine jährliche Vorhaltevergütung in Höhe von {VORHALTE_BETRAG} EUR. Fällig jeweils zum 15.01. des Folgejahres, anteilig für angefangene Kalenderjahre.

8.2. Nutzungsentgelt (PV-Anlage)
Ab Inbetriebnahme erhält der Eigentümer ein jährliches Nutzungsentgelt basierend auf der tatsächlich genutzten Fläche (Module, Einzäunung, Bepflanzung, Übergabestation, Ausgleichsflächen; Restflächen < 5 m werden mitgerechnet).

Staffelvergütung:
Betriebsjahr 1–10: {STAFFEL_1} EUR/ha/Jahr
Betriebsjahr 11–20: {STAFFEL_2} EUR/ha/Jahr
Betriebsjahr 21+: {STAFFEL_3} EUR/ha/Jahr

Das Nutzungsentgelt ist zum 01.03. eines jeden Jahres für das Vorjahr fällig. Für das erste und letzte Betriebsjahr wird anteilig nach Kalendermonaten abgerechnet.

Voraussetzung für die Zahlung: Eintragung aller Dienstbarkeiten und Vormerkungen sowie ggf. Einverständniserklärung des Pächters.

8.3. Speichervergütung (Graustrom)
Wird ein Graustromspeicher errichtet, erhält der Eigentümer zusätzlich {SPEICHER_SATZ} EUR/m² Speichergrundfläche pro Jahr. Es gilt der jeweils höhere Betrag (Grundvergütung oder Speichervergütung).

8.4. Wertsicherungsklausel
Nach 10 vollen Betriebsjahren erhöht sich das Nutzungsentgelt um {WERTSICHERUNG}%. Weitere Erhöhungen erfolgen alle 10 Jahre.

8.5. Zahlung
Die Beträge gelten als nicht umsatzsteuerpflichtig. Sollte sich die Rechtslage ändern, gelten die genannten Beträge als Nettobeträge zuzüglich USt. Die Vergütung wird bis spätestens 3 Monate nach Vertragsende gezahlt.

Bankverbindung des Eigentümers:
IBAN: {EIGENTUEMER_IBAN}
BIC: {EIGENTUEMER_BIC}`,
  },
  {
    id: "ff9",
    titel: "§ 9 Vertragslaufzeit",
    text: `9.1. Dieser Vertrag wird mit Unterzeichnung durch beide Parteien wirksam.

9.2. Der Vertrag endet nach Ablauf von 20 vollen Kalenderjahren, gerechnet ab dem 31.12. des Jahres der Inbetriebnahme, spätestens jedoch 30 Jahre nach Vertragsunterzeichnung. Die Betreiberin teilt dem Eigentümer die Inbetriebnahme schriftlich mit.

9.3. Nach Ablauf der Grundlaufzeit verlängert sich der Vertrag automatisch um jeweils ein Jahr zu gleichen Bedingungen, sofern nicht eine Partei mit einer Frist von 6 Monaten vor Ablauf schriftlich kündigt. Die Gesamtlaufzeit darf 30 Jahre ab Unterzeichnung nicht überschreiten.`,
  },
  {
    id: "ff10",
    titel: "§ 10 Rücktritt und Kündigung",
    text: `10.1. Rücktrittsrecht (beide Parteien)
a) Ist ein Bebauungsplan erforderlich, können beide Parteien zurücktreten, wenn dieser nicht innerhalb von 5 Jahren ab Vertragsunterzeichnung genehmigt wird.
b) Nach Planungsgenehmigung können beide Parteien zurücktreten, wenn die Anlage nicht innerhalb von 3 weiteren Jahren in Betrieb genommen wird.
Einschränkung: Der Eigentümer kann nicht zurücktreten, solange die Betreiberin einen EEG-Zuschlag für diesen Standort hält.

10.2. Außerordentliche Kündigung durch die Betreiberin
Die Betreiberin kann aus wichtigem Grund kündigen, insbesondere bei:
a) Zerstörung der Anlage durch höhere Gewalt,
b) Unmöglichkeit eines wirtschaftlichen Betriebs,
c) Behördlich angeordnetem Rückbau,
d) Wirtschaftlich begründeter Einstellung des Betriebs,
e) Entscheidung, die Anlage nicht zu errichten.

10.3. Außerordentliche Kündigung durch den Eigentümer
Der Eigentümer kann kündigen, wenn die Betreiberin mit der Jahresvergütung mehr als 6 Monate in Verzug ist, die Rückstände mindestens 30% der Jahresvergütung betragen und eine schriftliche Mahnung mit angemessener Nachfrist erfolglos geblieben ist.

10.4. Beteiligung der finanzierenden Bank
Vor jeder Kündigung während laufender Finanzierung ist die Bank unverzüglich schriftlich zu benachrichtigen. Die Bank hat 2 Monate Zeit, in den Vertrag einzutreten oder einen Ersatzbetreiber zu benennen.

10.5. Während der Vertragslaufzeit ist eine ordentliche Kündigung ausgeschlossen.

10.6. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.

10.7. Sämtliche Rücktritts- und Kündigungserklärungen bedürfen der Schriftform.`,
  },
  {
    id: "ff11",
    titel: "§ 11 Rückbau und Rückbausicherheit",
    text: `11.1. Rückbaupflicht
Die Betreiberin entfernt innerhalb von 12 Monaten nach Vertragsende sämtliche Anlagen und stellt den ursprünglichen Zustand des Grundstücks wieder her. Der Eigentümer kann verlangen, dass Anlagenteile verbleiben. Eine ggf. erforderliche Wiederaufforstung obliegt dem Eigentümer.

11.2. Rückbausicherheit
Sofern die Betreiberin bereits aufgrund von Planungsrecht oder gemeindlichen Verträgen eine Rückbaubürgschaft stellt, wird dem Eigentümer eine Kopie übermittelt.

Andernfalls stellt die Betreiberin vor Baubeginn eine selbstschuldnerische, unbefristete Bankbürgschaft in Höhe von {RUECKBAU_SATZ} EUR pro installiertem kW auf dem Grundstück des Eigentümers.

Alternativ: Hinterlegung des Betrags auf einem Treuhandkonto (Treuhänder: Steuerberater oder Rechtsanwalt).

11.3. Kostenanpassung
Vor dem 18. Betriebsjahr legt die Betreiberin ein Sachverständigengutachten oder Rückbauangebot über die tatsächlichen Rückbaukosten vor. Übersteigen diese die gestellte Bürgschaft, wird die Bürgschaft entsprechend erhöht.`,
  },
  {
    id: "ff12",
    titel: "§ 12 Übertragung auf Dritte und Rechtsnachfolge",
    text: `12.1. Die Betreiberin darf den Vertrag mit allen Rechten und Pflichten auf Dritte übertragen, einzelne Rechte abtreten oder Unterpachtverträge schließen. Der Eigentümer wird schriftlich benachrichtigt und stimmt bereits mit Vertragsunterzeichnung zu. Innerhalb von 2 Wochen nach Mitteilung kann der Eigentümer aus wichtigem Grund widersprechen.

12.2. Bei Aufteilung des Vertrags auf Teilanlagen verhandeln die Parteien die Einzelheiten und halten diese in Nachträgen fest.

12.3. Der Eigentümer kann den Vertrag nur zusammen mit der Eigentumsübertragung am Grundstück übertragen. Bei Teilverkauf einzelner Flurstücke ist der Kaufvertrag um folgende Klausel zu ergänzen:

„Der Käufer ist dem Gestattungsvertrag vom {VERTRAGSDATUM} bekannt. Der Käufer tritt in alle Verpflichtungen ein und verpflichtet sich, gleiche Verpflichtungen bei Weiterverkauf aufzuerlegen."

Bei Verstoß haftet der Eigentümer für alle Schäden der Betreiberin.

12.4. Der Eigentümer informiert die Betreiberin unverzüglich über jeden Verkauf oder eine Zwangsversteigerung des Grundstücks.`,
  },
  {
    id: "ff13",
    titel: "§ 13 Eintrittsrecht zugunsten der finanzierenden Bank",
    text: `13.1. Der Eigentümer stimmt dem Eintritt eines Ersatzbetreibers oder der finanzierenden Bank in den Vertrag vorab zu, sofern diese alle Vertragspflichten übernimmt.

13.2. Die Betreiberin erteilt der Bank unwiderrufliche Vollmacht, Eintrittsvereinbarungen mit Anlagenkäufern abzuschließen.

13.3. Eintrittsvereinbarungen mit Dritten bedürfen während laufender Finanzierung der Zustimmung der Bank.

13.4. Während der Finanzierung dürfen die Vertragsparteien keine Vertragsänderungen vornehmen, die die Sicherheiten der Bank beeinträchtigen.

13.5. Die Betreiberin teilt dem Eigentümer Name und Adresse der finanzierenden Bank mit und informiert schriftlich über die vollständige Rückzahlung.`,
  },
  {
    id: "ff14",
    titel: "§ 14 Zusatzvereinbarungen",
    text: `{ZUSATZVEREINBARUNGEN}`,
  },
  {
    id: "ff15",
    titel: "§ 15 Besondere Vereinbarungen (Erbschaftsteuerrisiko)",
    text: `15.1. Die Parteien erkennen an, dass die PV-Grundstückspacht ein erbschaftsteuerliches Risiko für den Eigentümer begründen kann. Dieses Risiko entsteht frühestens mit Satzungsbeschluss des Bebauungsplans.

15.2. Zur Minderung des Risikos erhält der Eigentümer die Option, eine Kommanditbeteiligung von bis zu 1% an einer künftigen Betreibergesellschaft zu erwerben, die ausschließlich die Module auf dem Grundstück des Eigentümers betreibt.

15.3. Die Beteiligungsvereinbarung ist spätestens vor öffentlicher Auslegung des Bebauungsplans (§ 3 Abs. 2 BauGB) bzw. vor dem Satzungsbeschluss abzuschließen.

15.4. Die Option wird per Einschreiben mit Rückschein ausgeübt. Der Anteilskaufvertrag wird nach Inbetriebnahme geschlossen und enthält ein gegenseitiges schuldrechtliches Vorkaufsrecht.`,
  },
  {
    id: "ff16",
    titel: "§ 16 Abschließende Bestimmungen",
    text: `a) Dieser Vertrag enthält alle Vereinbarungen der Parteien. Mündliche Nebenabreden bestehen nicht.

b) Änderungen und Ergänzungen dieses Vertrags bedürfen der Schriftform. Dies gilt auch für eine Aufhebung des Schriftformerfordernisses.

c) Sollte eine Bestimmung dieses Vertrags unwirksam sein oder werden, so wird die Wirksamkeit der übrigen Bestimmungen hierdurch nicht berührt. Die Parteien verpflichten sich, die unwirksame Bestimmung durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck am nächsten kommt.

d) Gerichtsstand ist der Ort des Grundstücks, soweit gesetzlich zulässig.

Anlagen:
Anlage 1 – Lageplan mit Planungsgebiet
Anlage 2 – Einverständniserklärung Pächter
Anlage 3 – Vollmacht Grundbuchauszug
Anlage 4 – Grundbuchauszug
Anlage 5 – Einverständniserklärung Netzanfrage
Anlage 6 – Vollmacht Altlastenkataster
Anlage 7 – Muster Dienstbarkeit
Anlage 8 – Beteiligungsmodell (Erbschaftsteuer)`,
  },
];

// ============================================================
// BAULEITPLANUNG – Vertragsklauseln
// Drei Vertragstypen:
//   1. Durchführungsvertrag (§ 12 BauGB)
//   2. Kommunalbeteiligung (§ 6 EEG)
//   3. Ökologischer Ausgleich (§ 1a BauGB / § 15 BNatSchG)
// ============================================================

// ============================================================
// TYP 1: DURCHFÜHRUNGSVERTRAG nach § 12 BauGB
// ============================================================
export const DURCHFUEHRUNG_KLAUSELN = [
  {
    id: "df1",
    titel: "§ 1 Gegenstand des Vertrages",
    text: `Gegenstand des Vertrages ist die Errichtung einer Photovoltaikanlage in einem Sondergebiet gemäß § 11 BauNVO auf den Grundstücken der Gemarkung {GEMARKUNG} Fl.Nrn. {FLURSTUECKE}. Der Vorhabenträger ist Pächter der Fläche und hat einen entsprechenden Nutzungsvertrag abgeschlossen.

Der Vorhabenträger hat bei der Gemeinde einen mit dieser abgestimmten Vorhaben- und Erschließungsplan mit dem Antrag auf Einleitung eines vorhabenbezogenen Bauleitplanverfahrens für die Photovoltaikanlage eingereicht. Durch die Vereinbarungen in diesem Vertrag bleibt die Planungshoheit der Gemeinde unberührt. Eine Verpflichtung zur Einleitung eines Bauleitplanverfahrens wird durch diesen Vertrag ausdrücklich nicht begründet.

Das Grundstück mit Darstellung der Gesamtanlage ist auf dem vorhabenbezogenen Bebauungs- und Grünordnungsplan „{PROJEKT_NAME}", dargestellt (Anlage 1). Die Anlage ist Bestandteil dieses Vertrages.

Die derzeitige Photovoltaikanlagenplanung besteht im Wesentlichen aus:
- ca. {MODULE_ANZAHL} Modulen ({MODULE_TYP})
- ca. {WR_ANZAHL} Wechselrichtern
- Modultischen
- ca. {TRAFO_ANZAHL} Trafostationen
- ca. {BESS_ANZAHL} Batteriespeicher
- ca. 1 Technikcontainer
- 1 Übergabeschutzstation (ÜSS) am Netzverknüpfungspunkt in {NVP_NAME}

Der Vorhabenträger verpflichtet sich auf den Grundstücken der Gemarkung {GEMARKUNG} Flst.-Nr. {FLURSTUECKE} mit ca. {GRUNDSTUECKSFLAECHE_HA} ha die beste Ertragsleistung zu erwirtschaften. Abhängig der Verfügbarkeit von Material und Lieferzeit. Modulmengen, Modulleistung, Hersteller, Wechselrichterleistung und Menge Trafoanzahl können abweichen.

Die derzeitige Leistung beträgt ca. {LEISTUNG_KWP} kWp (WR Leistung) bei einer Grundstücksfläche von ca. {GRUNDSTUECKSFLAECHE_HA} ha. Die endgültigen Mengen und Leistungen ergeben sich aus der Berechnung, die erst nach der Vergabe des Bauvertrags (EPC) final erstellt werden. Abweichungen sind daher möglich.

Module mit Schwermetallanteilen (z.B. Cadmium) dürfen nicht verbaut werden. Ein Anspruch auf die geplante Leistung wird seitens der Gemeinde ausgeschlossen.`,
  },
  {
    id: "df2",
    titel: "§ 2 Ausführung des Vorhabens",
    text: `Der Vorhabenträger verpflichtet sich, das Bauvorhaben nach den Regelungen dieses Vertrages und nach den künftigen Festsetzungen der Erweiterung des vorhabenbezogenen Bebauungsplans Sondergebiet Freiflächen-PV-Anlage „{PROJEKT_NAME}" mit integriertem Vorhaben- und Erschließungsplan durchzuführen, sofern und soweit das Vorhaben für den Vorhabenträger wirtschaftlich realisierbar ist und für die Teilanlagen kumulativ entsprechende Zuschläge aus einer EEG-Ausschreibungsrunde vorliegen.

Der Vorhabenträger verpflichtet sich, sofern und soweit das Vorhaben einen Zuschlag in einer EEG-Ausschreibungsrunde erhält, spätestens 12 Monate nach Rechtskraft des vorhabenbezogenen Bebauungsplanes mit dem Vorhaben zu beginnen und das Vorhaben innerhalb von weiteren 24 Monaten fertig zu stellen. Die beiden Fristen können auf Antrag des Vorhabenträgers von der Gemeinde verlängert werden.

Die Durchführung der Ausgleichsmaßnahmen ist nach Inbetriebnahme der Anlage durch den Vorhabenträger zu realisieren. Sie sind in Abstimmung mit dem zuständigen Landratsamt {LANDKREIS} – Untere Naturschutzbehörde – durchzuführen.

Das Vertragsgebiet ist bereits vollständig über die gemeindlichen Wege Fl.Nr. {WEG_FLURNR} der Gemarkung {GEMARKUNG} (öffentliche Feld- und Waldwege) i.S.v. § 123 BauGB erschlossen.

Vorhabenbedingte Erschließungsmaßnahmen sind deshalb nicht erforderlich. Sollten dennoch Erschließungsmaßnahmen durch das o.g. Vorhaben nötig sein, so hat der Vorhabenträger die entstehenden Kosten selbst zu tragen. Die o.g. öffentlichen Wege können während der Bau- und Betriebsphase der Photovoltaikanlage jederzeit und auf Dauer vom Vorhabenträger genutzt werden. Die Wege müssen vor allem während der Bauphase für Dritte benutzbar bleiben. Nach Beendigung der Bau- bzw. Betriebsphase muss der Weg wieder im ursprünglichen Zustand hergestellt sein.

Mutterboden, der bei der Errichtung und/oder Änderung baulicher Anlagen und von Erschließungsanlagen im Vorhabengebiet ausgehoben wird, ist in nutzbarem Zustand zu erhalten und vor Vergeudung oder Vernichtung zu schützen. Seine Verbringung und Verwertung außerhalb des Vertragsgebietes bedarf der Zustimmung der Gemeinde.

Staubemissionen durch die ordnungsgemäße Bewirtschaftung benachbarter landwirtschaftlicher Flächen sind durch den Vorhabenträger entschädigungslos hinzunehmen.

Der Vorhabenträger verpflichtet sich dazu, die Zerlegung der Gewerbesteuer gemäß § 29 Abs. 1 Nr. 2 GewStG zu veranlassen, welches vorschreibt, dass mind. 90% der für den „{PROJEKT_NAME}" anfallenden Gewerbesteuer in der Gemeinde bleibt.

Der Vorhabenträger verpflichtet sich wegen möglicher Stromkabelverlegungen, soweit diese auf gemeindlichen Grundstücken und öffentlichen Wegen verlegt werden soll, vor Baubeginn mit der Gemeinde einen eigenen Gestattungsvertrag nach dem Muster des Bayerischen Gemeindetags (BayGT) abzuschließen und für die Kabelverlegung eine Grunddienstbarkeit eintragen zu lassen.

Gemäß § 6 Abs. 1 EEG soll die Gemeinde, die von der Errichtung der Anlage betroffen ist, finanziell beteiligt werden. Dazu soll neben diesem Vertrag ein Vertrag zur finanziellen Beteiligung von Kommunen an Freiflächenanlagen gemäß § 6 Abs. 1 Nr. 2 EEG nach dem Muster des Bayerischen Gemeindetags (BayGT) nach Satzungsbeschluss des vorhabenbezogenen Bebauungsplans geschlossen werden.`,
  },
  {
    id: "df3",
    titel: "§ 3 Wasserversorgung, Abwasserbeseitigung",
    text: `Das Vertragsgebiet liegt im Außenbereich und außerhalb des Versorgungsgebietes der öffentlichen Wasserversorgungs- und Entwässerungseinrichtung der Gemeinde {GEMEINDE_NAME}. Es ist weder an die gemeindliche Wasserversorgungseinrichtung noch an die gemeindliche Entwässerungseinrichtung angeschlossen.

Der Vorhabenträger verpflichtet sich, einen etwaigen Wasserbedarf für die Reinigung der Photovoltaikanlage selbst zu decken und die Entsorgung des anfallenden Schmutzwassers selbst ordnungsgemäß sicherzustellen.

Der Vorhabenträger verpflichtet sich, die Reinigung der Photovoltaikanlage nur mit klarem Wasser vorzunehmen, um eine Kontamination des Bodens zu vermeiden.`,
  },
  {
    id: "df4",
    titel: "§ 4 Altlasten",
    text: `Sollten Altlasten im Vertragsgebiet bekannt werden, so werden gegen die Gemeinde keinerlei Regressansprüche erhoben.

Die Kompensation der zu erwartenden Eingriffe in Natur und Landschaft ist gem. den Festsetzungen des vorhabenbezogenen Bebauungsplanes und den Beschreibungen des Umweltberichtes und der Bebauungsplanbegründung vom Vorhabenträger zu erbringen. Gleiches gilt für geforderte Ausgleichsmaßnahmen bzw. -Zahlungen. Naturschutzrechtliche Ausgleichsforderungen können gegen die Gemeinde nicht geltend gemacht werden.`,
  },
  {
    id: "df5",
    titel: "§ 5 Verkehrssicherung, Haftung und Haftungsausschluss",
    text: `Der Vorhabenträger übernimmt von Baubeginn an bis zum Abschluss des Rückbaus im gesamten Bebauungsplangebiet die Verkehrssicherungspflicht. Er haftet für sämtliche Schäden, die durch die Photovoltaikanlage (Errichtung, Betrieb und Rückbau) verursacht werden. Er trägt die Kosten der Straßenunterhaltung und Instandsetzung für den von ihm benutzten Wegebereich in vollem Umfang und übernimmt den notwendigen Winterdienst, soweit seitens des Vorhabenträgers erforderlich.

Aus diesem Vertrag entstehen der Gemeinde keine Verpflichtungen zur Aufstellung des vorhabenbezogenen Bebauungsplans sowie der nötigen Deckblattänderung des gemeindlichen Flächennutzungsplans. Die Beteiligten betonen, dass die gesetzliche Planungshoheit der Gemeinde und ihr Abwägungsspielraum gem. § 1 Abs. 5–7 BauGB durch diese Vereinbarung nicht berührt werden. Eine Haftung der Gemeinde für etwaige Aufwendungen des Vorhabenträgers, die diese im Hinblick auf die Aufstellung des vorhabenbezogenen Bebauungsplans bzw. der Deckplanänderung des Flächennutzungsplans der Gemeinde tätigt oder getätigt hat, ist ausgeschlossen.

Für den Fall, dass die Unwirksamkeit des vorhabenbezogenen Bebauungsplans im Verlaufe eines gerichtlichen Streitverfahrens festgestellt wird, können Ansprüche gegen die Gemeinde nicht geltend gemacht werden.`,
  },
  {
    id: "df6",
    titel: "§ 6 Rückbau, Straßenschäden, Sicherheitsleistung",
    text: `Der Vorhabenträger verpflichtet sich, die errichtete Anlage nach Ablauf des Baurechtes oder nach Außerbetriebnahme auf eigene Kosten zurückzubauen und den ursprünglichen Zustand der überbauten Flächen wiederherzustellen. Das gleiche gilt, wenn der Bau der Anlage zwar begonnen, aber nicht gemäß § 2 Abs. 2 innerhalb 12 Monaten fertig gestellt wurde; die Frist zur Fertigstellung kann auf Antrag des Vorhabenträgers von der Gemeinde verlängert werden.

Sollte der Vorhabenträger innerhalb von 3 Monaten nach Entstehen der Rückbauverpflichtung dieser nicht nachkommen, so ist die Gemeinde berechtigt, nach Inkenntnissetzung des Grundstückseigentümers durch die Gemeinde den Rückbau im Wege der Ersatzvornahme auf Kosten des Vorhabenträgers durchführen zu lassen.

Wegen der etwaigen genannten Zahlungsansprüche hinterlegt der Vorhabenträger bei der Gemeinde vor Baubeginn eine selbstschuldnerische und unbefristete Bankbürgschaft eines deutschen Kreditinstituts bis zum Höchstbetrag von € {BUERGSCHAFT_RUECKBAU} (= {BUERGSCHAFT_PRO_KWP} € je verbauten kWp). Doppelsicherheitsleistungen z.B. durch die Gemeinde und das Landratsamt {LANDKREIS} sind zu vermeiden. Die Sicherheitsleistung wird bei Nichtinanspruchnahme nach ordnungsgemäßem Rückbau der Anlage und Abnahme durch die beiden Vertragsparteien zurückgegeben.

Zur Sicherung aller sich aus diesem Vertrag für den Vorhabenträger ergebenden sonstigen Verpflichtungen, für mögliche Schäden, Aufwendungen und Instandsetzungen von Straßen und Wegen der Gemeinde, hat der Vorhabenträger der Gemeinde vor Baubeginn eine selbstschuldnerische und unbefristete Bankbürgschaft eines deutschen Kreditinstituts in Höhe von {BUERGSCHAFT_STRASSEN} € vorzulegen. Die Sicherheitsleistung wird bei Nichtinanspruchnahme nach ordnungsgemäßem Bau der Anlage und Abnahme durch die beiden Vertragsparteien zurückgegeben.`,
  },
  {
    id: "df7",
    titel: "§ 7 Kostentragung",
    text: `Der Vorhabenträger trägt die gesamten Kosten des Vorhabens, insbesondere sämtliche Planungskosten einschließlich Aufgabenübertragung nach § 4b Baugesetzbuch (Flächennutzungs- und Bebauungsplan), die Kosten eventueller Erschließungsmaßnahmen und der naturschutzrechtlichen Ausgleichsmaßnahmen. Er trägt auch die Kosten für etwa erforderliche Genehmigungen.

Der Vorhabenträger verpflichtet sich, die Kosten für die beauftragten Büros für die Erstellung des vorhabenbezogenen Bebauungsplans sowie der Deckblattänderung des gemeindlichen Flächennutzungsplans sowie alle erforderlichen Fachgutachten zu übernehmen.

Der Vorhabenträger zahlt der Gemeinde für den bei ihr verbleibenden Aufwand (insbesondere Bauleitplanverfahren) eine Verwaltungskostenpauschale in Höhe von {VERWALTUNGSKOSTEN} € (falls USt.-pflichtig, dann zzgl.). Dieser Betrag ist unabhängig vom Ausgang der Bauleitplanverfahren zum Zeitpunkt des Satzungsbeschlusses gemäß § 10 BauGB als Gesamtsumme fällig.

Hinsichtlich der Kostentragungspflicht verbleibt es auch dann, wenn der vorhabenbezogene Bebauungsplan nicht in Kraft treten sollte oder sonst eine Vertragsauflösung erfolgt.

Zweck der Kostenregelung ist allein, die Gemeinde von Kosten im Zusammenhang mit dem Vorhaben des Vorhabenträgers zu entlasten.`,
  },
  {
    id: "df8",
    titel: "§ 8 Anpassung, Rücktritt",
    text: `Sollte bis spätestens zum Ablauf des {FRIST_RECHTSVERBINDLICH} kein rechtsverbindlicher vorhabenbezogener Bebauungsplan zu dem Vorhaben und Erschließungsplan des Vorhabenträgers bestehen, so ist der Vorhabenträger berechtigt, von den schuldrechtlichen Vereinbarungen dieses Vertrages zurückzutreten. Dies gilt in gleicher Weise, wenn ein gegen eine Baugenehmigung oder Freistellung eingelegter Rechtsbehelf nicht innerhalb von 18 Monaten nach Einlegung rechtskräftig zurückgewiesen wurde.

Sollten sich im Bauleitplanverfahren Änderungen gegenüber den jetzt vorliegenden Plänen und Baubeschreibungen ergeben, so ist der Vertrag entsprechend anzupassen. Der Vorhabenträger hat Nebenbestimmungen der Baubehörde im Verfahren auf eigene Kosten zu erfüllen bzw. durchzuführen.`,
  },
  {
    id: "df9",
    titel: "§ 9 Kündigung",
    text: `Die Gemeinde kann den Vertrag bei Vorliegen eines wichtigen Grundes kündigen. Als wichtiger Grund gilt auch, wenn der Vorhabenträger die ihm aufgrund dieses Vertrags obliegende Investition nicht innerhalb der vereinbarten Frist ausführt oder gegen andere Vertragspflichten verstößt.`,
  },
  {
    id: "df10",
    titel: "§ 10 Salvatorische Klausel",
    text: `Sollten einzelne Bestimmungen dieses Vertrags unwirksam oder undurchführbar sein oder nach Vertragsabschluss unwirksam oder undurchführbar werden, bleibt davon die Wirksamkeit des Vertrages im Übrigen unberührt. An die Stelle der unwirksamen oder undurchführbaren Bestimmungen soll diejenige wirksame und durchführbare Regelung treten, deren Wirkungen der wirtschaftlichen Zielsetzung am nächsten kommen, die die Vertragsparteien mit der unwirksamen oder undurchführbaren Bestimmung verfolgt haben.`,
  },
  {
    id: "df11",
    titel: "§ 11 Informations- und Auskunftsrecht",
    text: `Die Gemeinde hat zur Überprüfung der Verpflichtungen des Vorhabenträgers aus diesem Vertrag ein umfassendes projektbezogenes Informations- und Auskunftsrecht. Der Vorhabenträger hat hinsichtlich der Einhaltung seiner Verpflichtungen eine umfassende Informationspflicht.`,
  },
  {
    id: "df12",
    titel: "§ 12 Regelung der kooperativen Zusammenarbeit",
    text: `Die Gemeinde und der Vorhabenträger verpflichten sich gegenseitig alles zu tun, um in einer guten und vertrauensvollen Zusammenarbeit eine zügige Abwicklung des Vorhabens zu erreichen.`,
  },
  {
    id: "df13",
    titel: "§ 13 Rechtsnachfolge",
    text: `Der Vorhabenträger hat das Recht, diesen Vertrag sowie die darin enthaltenen Rechte und Pflichten auf Dritte zu übertragen. Der Vorhabenträger verpflichtet sich dabei, sämtliche Verpflichtungen aus diesem Vertrag seinen Rechtsnachfolgern aufzuerlegen oder aber diese entsprechend zu verpflichten (Weitergabeverpflichtung).

Der Vorhabenträger verpflichtet sich weiterhin, eine Veräußerung der Anlage an einen Rechtsnachfolger unabhängig von der Form der Weiterführung der Anlage, davon abhängig zu machen, dass der Rechtsnachfolger vollinhaltlich und ohne Vorbehalte in diesen Durchführungsvertrag eintritt.

Der Vorhabenträger haftet neben seinen Rechtsnachfolgern gesamtschuldnerisch weiter, sofern die Gemeinde den Eintritt der Rechtsnachfolger nicht schriftlich genehmigt. Die Übertragung bzw. Abtretung ist dem jeweils anderen Vertragspartner schriftlich anzuzeigen.`,
  },
  {
    id: "df14",
    titel: "§ 14 Schlussbestimmungen und Wirksamwerden des Vertrages",
    text: `Vertragsänderungen oder -ergänzungen bedürfen zu ihrer Rechtswirksamkeit der Schriftform. Dies gilt auch für Anträge zur Änderung oder Ergänzung. Nebenabreden bestehen nicht.

Die Anlagen sind Bestandteil des Vertrags. Die Vertragsparteien bestätigen, dass ihnen die Anlagen vollständig vorliegen und sie hiervon Kenntnis genommen haben. Sofern einzelne Anlagen zum Zeitpunkt der gegenseitigen Unterschriftsabgabe noch nicht vorliegen, müssen diese Anlagen von der Gemeinde als Teil zu diesem Vertrag nachträglich genehmigt werden.

Der Vertrag wird zweifach ausgefertigt. Jeder Vertragspartner erhält eine Ausfertigung. Dieser Vertrag wird mit Genehmigung des Gemeinderates und der rechtswirksamen Unterzeichnung durch die Erste Bürgermeisterin oder ihren Stellvertreter sowie der Zustimmung der Rechtsaufsicht des Landratsamts {LANDKREIS} wirksam.

Der Gemeinderat {GEMEINDE_NAME} hat diesem Durchführungsvertrag in seiner Sitzung am {BESCHLUSS_DATUM} beschlussmäßig zugestimmt.`,
  },
];

// ============================================================
// TYP 2: KOMMUNALBETEILIGUNG nach § 6 Abs. 1 Nr. 2 EEG
// ============================================================
export const KOMMUNAL_KLAUSELN = [
  {
    id: "kb0",
    titel: "Präambel",
    text: `Der Betreiber plant die Errichtung und den Betrieb einer Freiflächensolarinstallation. Die Freiflächensolarinstallation besteht aus mehreren Modulen und damit aus mehreren Solaranlagen i.S.d. § 3 Nr. 1 und 41 EEG 2021. Jede dieser Solaranlagen ist eine Freiflächenanlage i.S.d. § 3 Nr. 22 EEG 2021 (im Folgenden bezogen auf das Modul: „FFA", in der Mehrzahl: „FFAen"). Der jeweilige Standort der vom Betreiber geplanten FFAen ergibt sich aus der diesem Vertrag beigefügten Anlage. Eine Inbetriebnahme i.S.d. § 3 Nr. 30 EEG 2021 der FFAen ist voraussichtlich für {IBN_ZEITRAUM} vorgesehen.

Der Betreiber plant, der {GEMEINDE_NAME} einseitige Zuwendungen ohne Gegenleistung gemäß § 6 Abs. 1 Nr. 2 EEG 2021 ab Inbetriebnahme der jeweiligen FFA, die sich vollständig auf dem Gemeindegebiet befindet, verbindlich anzubieten. Die Gemeinde ist gewillt das Angebot des Betreibers anzunehmen. Zu diesem Zweck schließen die Parteien den nachfolgenden Vertrag.

Da die Freiflächensolarinstallation noch nicht errichtet ist, kann der Vertrag nur auf Basis der bei Vertragsschluss bekannten Umstände geschlossen werden. Für den Fall, dass sich noch Änderungen für relevante Parameter ergeben oder die Freiflächensolarinstallation oder einzelne FFAen aus gegenwärtig nicht absehbaren Gründen nicht errichtet werden, sieht der Vertrag entsprechende Anpassungs- und Kündigungsrechte vor.

Die Parteien gehen davon aus, dass § 6 Abs. 1 Nr. 2 EEG 2021 gemäß § 105 Abs. 5 EEG 2021 erst nach der beihilferechtlichen Genehmigung durch die Europäische Kommission und nur nach Maßgabe dieser Genehmigung angewandt werden darf.`,
  },
  {
    id: "kb1",
    titel: "§ 1 Einseitige Zuwendungen des Betreibers ohne Gegenleistung",
    text: `Der Betreiber verpflichtet sich, der {GEMEINDE_NAME} als betroffener Gemeinde gemäß § 6 Abs. 3 Satz 2 i.V.m. Satz 4 EEG 2021 Zuwendungen in Höhe von {CENT_PRO_KWH} Cent pro Kilowattstunde (ct/kWh) ohne Gegenleistung für alle von diesem Vertrag umfassten FFAen zu zahlen, die sich vollständig auf dem Gemeindegebiet der {GEMEINDE_NAME} befinden. Der Betrag ist für die von der jeweiligen FFA tatsächlich eingespeiste Strommenge ab Inbetriebnahme der FFA zu zahlen.

Die Parteien gehen davon aus, dass sich eine FFA vollständig auf dem Gebiet der {GEMEINDE_NAME} befindet, wenn die Modulfläche der FFA zu keinem Zeitpunkt die Grenze des Gebiets der {GEMEINDE_NAME} überschreitet. Für Strom aus einer FFA, die sich sowohl auf dem Gemeindegebiet der {GEMEINDE_NAME} als auch auf dem Gemeindegebiet einer anderen Gemeinde befindet (im Folgenden: „Grenzanlage"), wird keine Zuwendung gezahlt; eine Aufteilung der Zuwendungen auf mehrere Gemeinden im Sinne des § 6 Abs. 2 Satz 4 EEG 2021 erfolgt daher nicht.`,
  },
  {
    id: "kb2",
    titel: "§ 2 Änderungen des Standorts und der Parameter der FFA",
    text: `Der Standort, der Inbetriebnahmezeitpunkt und die weiteren Parameter der jeweiligen FFA stehen noch nicht abschließend fest. Alle vorliegend abgegebenen Angaben dazu sind unverbindlich und spiegeln lediglich die aktuelle Planung des Betreibers wider.

Der Betreiber wird der {GEMEINDE_NAME} spätestens vier Wochen nach Inbetriebnahme der jeweiligen FFA den tatsächlichen Standort und die tatsächlichen Parameter der jeweiligen FFA schriftlich mitteilen.

Sofern der tatsächliche Standort der jeweiligen FFA von dem in der Anlage genannten Standort abweicht, ist dies im Rahmen des § 1 Abs. 1 ab dem Zeitpunkt der jeweiligen Änderung zugrunde zu legen. Die Parteien werden im Fall der Änderung die Anlage in einem schriftlichen Nachtrag zu diesem Vertrag unverzüglich anpassen.

Dieser Vertrag verpflichtet den Betreiber nicht, die einzelnen FFAen der Freiflächensolarinstallation auf dem Gebiet der {GEMEINDE_NAME} zu errichten bzw. in Betrieb zu nehmen. Der Betreiber ist auch nicht verpflichtet, bei Errichtung der FFAen die Parameter in der Anlage einzuhalten. Soweit die FFAen nicht errichtet oder in Betrieb genommen werden, entsteht der Zahlungsanspruch der Gemeinde nach § 1 nicht.`,
  },
  {
    id: "kb3",
    titel: "§ 3 Änderungen des Gemeindegebiets",
    text: `Die {GEMEINDE_NAME} wird dem Betreiber jede Änderung des Gemeindegebietes und den Zeitpunkt, zu dem die Änderung des Gemeindegebiets erfolgt, unverzüglich schriftlich mitteilen.

Wenn die {GEMEINDE_NAME} aufgrund einer Änderung des Gemeindegebiets nicht mehr oder in einem anderen Umfang durch die von diesem Vertrag erfassten FFAen betroffen ist, ist dies im Rahmen des § 1 Abs. 1 ab dem Zeitpunkt der Änderung des Gemeindegebiets zugrunde zu legen.`,
  },
  {
    id: "kb4",
    titel: "§ 4 Ermittlung der relevanten Strommengen",
    text: `Die tatsächlich eingespeiste Strommenge nach § 1 Absatz 1 Satz 2 bestimmt sich nach den Strommengen, die der Betreiber am Verknüpfungspunkt der FFAen mit dem Netz für die allgemeine Versorgung an den Stromabnehmer (z.B. Direktvermarkter, Netzbetreiber) liefert. Der Umfang der Strommengen entspricht den an den relevanten Messstellen gemessenen Strommengen.

Wenn über den Netzverknüpfungspunkt auch Strom aus Stromspeichern des Betreibers eingespeist wird, erfolgt eine geeignete messtechnische Abgrenzung der Strommengen aus den FFAen einerseits und der Strommengen aus den Stromspeichern andererseits.

Wenn gegenüber dem Stromabnehmer keine Aufteilung der Strommengen auf die einzelnen FFAen erfolgt und eine solche Aufteilung erforderlich ist, erfolgt die Aufteilung gemäß dem Anteil der installierten Leistung in kWp der relevanten FFAen an der installierten Leistung aller FFAen.`,
  },
  {
    id: "kb5",
    titel: "§ 5 Keine Gegenleistung der Gemeinde und keine Zweckbindung",
    text: `Die Zahlung der Beträge nach § 1 Abs. 1 erfolgt als einseitige Leistung des Betreibers an die Gemeinde ohne jedweden – direkten oder indirekten – Gegenleistungsanspruch des Betreibers. Die Gemeinde ist aufgrund dieses Vertrages nicht verpflichtet, irgendeine – direkte oder indirekte – Handlung oder Unterlassung für den Betreiber vorzunehmen.

Die Zahlung nach § 1 erfolgt ohne jedwede Zweckbindung an die Gemeinde, und die Gemeinde kann ohne jede Mitwirkung oder Einflussnahme des Betreibers über die Verwendung der nach § 1 gezahlten Mittel selbstbestimmt entscheiden.

Die Parteien sind sich darüber einig, dass der vorliegende Vertrag über eine Zahlung des Betreibers an die Gemeinde gemäß § 6 Abs. 4 Satz 2 EEG 2021 nicht als Vorteil im Sinne der §§ 331 bis 334 des Strafgesetzbuchs gilt.`,
  },
  {
    id: "kb6",
    titel: "§ 6 Abrechnung und Zahlung",
    text: `Der Betreiber erstellt für die tatsächlich eingespeisten Strommengen nach § 4 Absatz 1 jährlich (Abrechnungszeitraum 01.12 bis 30.11) bis zum 15.12 des Jahres eine ordnungsgemäße Gutschrift für die Gemeinde. Die Gutschrift ist sodann innerhalb von 10 Werktagen nach dem 15.12 des Jahres zur Zahlung fällig.

Die Gemeinde ist berechtigt, sich die Höhe der Zahlungen über die gutgeschriebenen Strommengen in geeigneter Form nachweisen zu lassen. Als Nachweis für die tatsächlichen Strommengen genügt die Vorlage der Abrechnungen des Betreibers über die an den Netzbetreiber und/oder anderen Stromabnehmer gelieferten Strommengen.

Die Parteien gehen davon aus, dass die Zuwendungen nach diesem Vertrag nicht der Umsatzsteuerpflicht unterliegen.

Die Zahlungen des Betreibers erfolgen auf das nachfolgende Konto der Gemeinde:
Bank: {BANK}
IBAN: {IBAN}
BIC: {BIC}`,
  },
  {
    id: "kb7",
    titel: "§ 7 Vertragsbeginn, Vertragslaufzeit, Kündigung",
    text: `Der Vertrag beginnt mit der beiderseitigen Unterzeichnung des Vertrages.

Die Vertragslaufzeit beträgt {LAUFZEIT_JAHRE} Jahre. Nach Ablauf der Vertragslaufzeit verlängert sich der Vertrag zweimalig um weitere 5 Jahre, wenn er nicht mit einer Frist von 3 Monaten vor Ablauf der Vertragslaufzeit von einer Partei gekündigt wird.

Die Gemeinde kann diesen Vertrag jederzeit mit einer Frist von 3 Monaten zum Ende eines Kalenderjahres kündigen. Das ordentliche Kündigungsrecht für den Betreiber ist vorbehaltlich des Satzes 2 ausgeschlossen.

Beide Parteien können diesen Vertrag aus wichtigem Grund kündigen. Ein wichtiger Grund liegt insbesondere vor, wenn:
a) die Gemeinde nicht bzw. nicht mehr betroffen ist,
b) die Regelung in § 6 EEG 2021 gestrichen oder für verfassungs-/europarechtswidrig erklärt wird,
c) die Zahlungen verboten oder unzulässig werden,
d) notwendige Nutzungs- oder Leitungsrechte nicht eingeräumt werden,
e) erforderliche Genehmigungen nicht erteilt oder zurückgenommen werden,
f) kein EEG-Zuschlag erteilt wurde,
g) sonstige Gründe den wirtschaftlichen Betrieb verhindern,
h) der Betrieb aller FFAen endgültig eingestellt wird,
i) der EEG-Förderzeitraum endet.

Im Falle einer Kündigung aus wichtigem Grund enden die beiderseitigen Vertragspflichten mit sofortiger Wirkung.`,
  },
  {
    id: "kb8",
    titel: "§ 8 Rechtsnachfolge bezüglich der Betreiberstellung",
    text: `Wenn und soweit der Betreiber seine Stellung als Anlagenbetreiber verliert oder aufgibt und die Betreiberstellung auf einen Dritten übergeht, ist der Betreiber verpflichtet, alle Rechte und Pflichten aus diesem Vertrag auf den neuen Betreiber zu übertragen.

Der Betreiber zeigt der Gemeinde jede Übertragung unaufgefordert und unverzüglich schriftlich an unter Beifügung der vollständigen Kontaktdaten des neuen Betreibers. Eine Zustimmung der Gemeinde zur Rechtsnachfolge ist nicht erforderlich.`,
  },
  {
    id: "kb9",
    titel: "§ 9 Veröffentlichung und Weitergabe des Vertrages, Datenschutz",
    text: `Die Parteien sind berechtigt, diesen Vertrag unter anderem aus Gründen der Transparenz insgesamt oder Teile dieses Vertrages zu veröffentlichen. Sofern der Vertrag personenbezogene Daten enthält, deren Offenlegung datenschutzrechtlich unzulässig ist, ist der Vertrag ohne diese Daten zu veröffentlichen. Sofern der Vertrag Betriebs- und Geschäftsgeheimnisse des Betreibers enthält, wird die Gemeinde den Vertrag ohne diese veröffentlichen.

Der Betreiber ist berechtigt, diesen Vertrag sowie die geleisteten Zahlungen gegenüber dem Netzbetreiber offen zu legen, soweit dies zur Geltendmachung des Anspruchs nach § 6 Abs. 5 EEG 2021 erforderlich ist.`,
  },
  {
    id: "kb10",
    titel: "§ 10 Verhältnis zu anderen Pflichten",
    text: `Die Zahlungspflichten des Betreibers nach diesem Vertrag lassen andere Zahlungspflichten des Betreibers an die {GEMEINDE_NAME}, insbesondere landesrechtliche Zahlungspflichten von Solaranlagenbetreibern an die Gemeinden, unberührt.`,
  },
  {
    id: "kb11",
    titel: "§ 11 Beihilferechtliche Genehmigung",
    text: `§ 1 gilt ab dem Zeitpunkt, ab dem § 6 Abs. 1 Nr. 2 EEG 2021 nach Maßgabe der beihilferechtlichen Genehmigung für § 6 Abs. 1 Nr. 2 EEG 2021 durch die Europäische Kommission anwendbar ist.

Wenn die beihilferechtliche Genehmigung nur mit Änderungen erteilt wird, gilt § 1 nicht. In diesem Fall streben die Parteien an, den Vertrag so anzupassen, dass die Änderungen unter Berücksichtigung der Interessen beider Parteien umgesetzt werden. Kommt es innerhalb von sechs Monaten ab Erteilung nicht zu einer Einigung, können beide Parteien kündigen.`,
  },
  {
    id: "kb12",
    titel: "§ 12 Schlussbestimmungen",
    text: `Sollten einzelne Bestimmungen dieses Vertrages unwirksam oder undurchführbar sein oder werden, so bleibt dieser Vertrag im Übrigen davon unberührt.

Sofern die Bestimmungen dieses Vertrages von den Vorgaben des EEG 2021 abweichen, gehen die Vorgaben des EEG 2021 den Bestimmungen dieses Vertrages vor.

Veränderungen und Ergänzungen zu diesem Vertrag bedürfen zu ihrer Wirksamkeit der Schriftform.

Der ausschließliche Gerichtsstand ist der Sitz der Gemeinde.

Ergänzend zu diesem Vertrag ist folgende Anlage beigefügt:
Anlage „Standort und Parameter der Freiflächenanlagen (FFAen)"`,
  },
];

// ============================================================
// TYP 3: ÖKOLOGISCHER AUSGLEICH (§ 1a BauGB / § 15 BNatSchG)
// ============================================================
export const AUSGLEICH_KLAUSELN = [
  {
    id: "ag1",
    titel: "§ 1 Vertragsgegenstand und Rechtsgrundlage",
    text: `(1) Gegenstand dieses Vertrags ist die Durchführung von Kompensationsmaßnahmen zum Ausgleich und Ersatz der durch die Errichtung und den Betrieb der Freiflächen-Photovoltaikanlage „{PROJEKT_NAME}" auf den Grundstücken der Gemarkung {GEMARKUNG}, Fl.Nrn. {FLURSTUECKE}, verursachten Eingriffe in Natur und Landschaft gemäß § 1a Abs. 3 BauGB i.V.m. § 15 BNatSchG und der Bayerischen Kompensationsverordnung (BayKompV).

(2) Die Art und der Umfang der Ausgleichs- und Ersatzmaßnahmen ergeben sich aus dem Umweltbericht zum vorhabenbezogenen Bebauungsplan „{PROJEKT_NAME}" sowie aus dem Grünordnungsplan (Anlage 1 zu diesem Vertrag). Die darin festgesetzten Maßnahmen sind Bestandteil dieses Vertrags.

(3) Der Vorhabenträger verpflichtet sich, sämtliche in der Anlage 1 festgesetzten Ausgleichs- und Ersatzmaßnahmen auf eigene Kosten durchzuführen, zu pflegen und dauerhaft zu erhalten.`,
  },
  {
    id: "ag2",
    titel: "§ 2 Ausgleichsflächen",
    text: `(1) Die Ausgleichs- und Ersatzmaßnahmen werden auf folgenden Flächen durchgeführt:

Gemarkung {GEMARKUNG}, Flurstück(e) {AUSGLEICH_FLURSTUECKE}
Gesamtfläche der Ausgleichsflächen: ca. {AUSGLEICH_FLAECHE_HA} ha

(2) Der Vorhabenträger weist nach, dass er über die genannten Ausgleichsflächen für die Dauer der Verpflichtungen aus diesem Vertrag verfügungsberechtigt ist (Eigentum, Pacht oder dinglich gesichertes Nutzungsrecht). Ein entsprechender Nachweis ist der Gemeinde vor Baubeginn der PV-Anlage vorzulegen.

(3) Die Ausgleichsflächen sind im Grünordnungsplan (Anlage 1) zeichnerisch dargestellt. Geringfügige Anpassungen der Flächenzuschnitte sind in Abstimmung mit der Unteren Naturschutzbehörde des Landratsamts {LANDKREIS} zulässig, soweit Umfang und ökologische Wertigkeit der Maßnahmen nicht gemindert werden.`,
  },
  {
    id: "ag3",
    titel: "§ 3 Maßnahmenkatalog",
    text: `(1) Der Vorhabenträger verpflichtet sich zur Durchführung folgender Ausgleichs- und Ersatzmaßnahmen:

{MASSNAHMEN_TEXT}

(2) Vorgezogene Ausgleichsmaßnahmen (CEF-Maßnahmen), die zum Schutz besonders oder streng geschützter Arten erforderlich sind, müssen vor Baubeginn der PV-Anlage wirksam umgesetzt sein. Die Wirksamkeit ist gegenüber der Unteren Naturschutzbehörde nachzuweisen.

(3) Die Maßnahmen innerhalb des Anlagenzauns (z.B. Extensivgrünland unter Modulen, Blühstreifen zwischen Modulreihen) sind integraler Bestandteil der Ausgleichskonzeption. Eine Verschlechterung dieser anlagenbezogenen Maßnahmen durch Betrieb oder Wartung ist zu vermeiden.

(4) Die Detailplanung der Maßnahmen ist vor Baubeginn mit der Unteren Naturschutzbehörde des Landratsamts {LANDKREIS} abzustimmen und von dieser zu genehmigen.`,
  },
  {
    id: "ag4",
    titel: "§ 4 Zeitplan und Durchführung",
    text: `(1) Die Ausgleichs- und Ersatzmaßnahmen sind spätestens bis {FRIST_UMSETZUNG} umzusetzen, sofern im Grünordnungsplan oder in der naturschutzfachlichen Stellungnahme keine abweichenden Fristen festgelegt sind.

(2) CEF-Maßnahmen und Schutzmaßnahmen sind vor Beginn der jeweiligen Bauphase abzuschließen und der Unteren Naturschutzbehörde zur Abnahme anzuzeigen.

(3) Alle übrigen Ausgleichsmaßnahmen sind in der ersten Vegetationsperiode nach Inbetriebnahme der PV-Anlage abzuschließen.

(4) Der Vorhabenträger hat den Beginn und die Fertigstellung der einzelnen Maßnahmen der Gemeinde und der Unteren Naturschutzbehörde schriftlich anzuzeigen.`,
  },
  {
    id: "ag5",
    titel: "§ 5 Pflege und Unterhaltung",
    text: `(1) Der Vorhabenträger verpflichtet sich, die Ausgleichsflächen und Ausgleichsmaßnahmen für die gesamte Dauer des Betriebs der PV-Anlage zuzüglich einer Nachsorgephase von {PFLEGEDAUER_JAHRE} Jahren nach Rückbau ordnungsgemäß zu pflegen und zu unterhalten.

(2) Die Pflege umfasst insbesondere:
a) Extensivgrünland: Mahd 1–2× jährlich (frühestens ab 15. Juni), Mähgut ist abzuräumen, keine Düngung, kein Einsatz von Pflanzenschutzmitteln
b) Hecken- und Gehölzpflanzungen: Ausfallkontrolle und Nachpflanzung bis zur gesicherten Anwachsphase (mind. 3 Jahre), abschnittsweiser Rückschnitt alle 10–15 Jahre
c) Blühflächen/Brachestreifen: Pflegeschnitt 1× jährlich im Spätherbst, Neuansaat bei Qualitätsverlust
d) Gewässer/Feuchtflächen: Freihalten von Verbuschung, Unterhaltung der Uferbereiche

(3) Der Vorhabenträger kann die Pflege auf qualifizierte Dritte (z.B. Landschaftspflegeverbände, örtliche Landwirte) übertragen. Die Verantwortlichkeit verbleibt beim Vorhabenträger.

(4) Ändert sich der ökologische Zustand der Ausgleichsflächen wesentlich (z.B. durch Extremwetter, invasive Arten), hat der Vorhabenträger in Abstimmung mit der Unteren Naturschutzbehörde geeignete Gegenmaßnahmen zu ergreifen.`,
  },
  {
    id: "ag6",
    titel: "§ 6 Monitoring und Dokumentation",
    text: `(1) Der Vorhabenträger ist verpflichtet, die Entwicklung der Ausgleichsflächen durch ein fachkundiges Büro {MONITORING_INTERVALL} dokumentieren zu lassen (Monitoring). Das Monitoring umfasst insbesondere:
a) Fotodokumentation der Ausgleichsflächen (Festpunktfotos)
b) Vegetationsaufnahme und Bewertung der Zielartenvorkommen
c) Dokumentation der durchgeführten Pflegemaßnahmen
d) Bewertung des Maßnahmenerfolgs und ggf. Anpassungsempfehlungen

(2) Der Monitoringbericht ist der Gemeinde und der Unteren Naturschutzbehörde des Landratsamts {LANDKREIS} jeweils bis zum 31.12. des Berichtsjahres vorzulegen.

(3) Das Monitoring ist für die Dauer der Pflegeverpflichtung gemäß § 5 durchzuführen. In den ersten 5 Jahren nach Herstellung erfolgt das Monitoring jährlich, danach kann der Turnus in Abstimmung mit der Unteren Naturschutzbehörde auf alle 3 Jahre verlängert werden.

(4) Die Kosten des Monitorings trägt der Vorhabenträger.`,
  },
  {
    id: "ag7",
    titel: "§ 7 Sicherheitsleistung",
    text: `(1) Zur Sicherung der Durchführung und dauerhaften Pflege der Ausgleichs- und Ersatzmaßnahmen hinterlegt der Vorhabenträger bei der Gemeinde vor Baubeginn eine selbstschuldnerische und unbefristete Bankbürgschaft eines deutschen Kreditinstituts in Höhe von {BUERGSCHAFT_AUSGLEICH} €.

(2) Der Bürgschaftsbetrag bemisst sich an den geschätzten Kosten für die Herstellung der Ausgleichsmaßnahmen sowie deren Pflege für die Dauer von {PFLEGEDAUER_JAHRE} Jahren. Eine Anpassung der Bürgschaftshöhe kann im Einvernehmen beider Vertragsparteien erfolgen.

(3) Die Sicherheitsleistung wird nach Ablauf der Pflegeverpflichtung und nach erfolgreicher Abnahme der Ausgleichsflächen durch die Untere Naturschutzbehörde zurückgegeben.

(4) Die Gemeinde ist berechtigt, die Bürgschaft in Anspruch zu nehmen, wenn der Vorhabenträger seinen Verpflichtungen aus diesem Vertrag trotz schriftlicher Mahnung mit angemessener Fristsetzung (mindestens 3 Monate) nicht nachkommt.`,
  },
  {
    id: "ag8",
    titel: "§ 8 Kostentragung",
    text: `(1) Sämtliche Kosten für Planung, Herstellung, Pflege, Monitoring und Dokumentation der Ausgleichs- und Ersatzmaßnahmen trägt der Vorhabenträger.

(2) Dies umfasst auch die Kosten für:
a) Erstellung des Grünordnungsplans und naturschutzfachlicher Gutachten
b) Saatgut, Pflanzgut und sonstige Materialien
c) Beauftragung von Fachfirmen für Herstellung und Pflege
d) Monitoringberichte durch Fachbüros
e) Eventuelle Nachbesserungen oder Anpassungen der Maßnahmen

(3) Die Gemeinde ist von sämtlichen Kosten im Zusammenhang mit den Ausgleichsmaßnahmen freizustellen.`,
  },
  {
    id: "ag9",
    titel: "§ 9 Kontrollrecht",
    text: `(1) Die Gemeinde und die Untere Naturschutzbehörde des Landratsamts {LANDKREIS} sind berechtigt, die Ausgleichsflächen jederzeit – nach vorheriger Ankündigung mit angemessener Frist – zu betreten und den Zustand der Maßnahmen zu überprüfen.

(2) Der Vorhabenträger hat den Kontrolleuren ungehinderten Zugang zu den Ausgleichsflächen zu gewähren und auf Verlangen die Pflegedokumentation vorzulegen.

(3) Werden bei einer Kontrolle Mängel festgestellt, setzt die Gemeinde dem Vorhabenträger eine angemessene Frist zur Nachbesserung. Kommt der Vorhabenträger der Nachbesserung nicht nach, kann die Gemeinde die Maßnahmen im Wege der Ersatzvornahme auf Kosten des Vorhabenträgers durchführen lassen.`,
  },
  {
    id: "ag10",
    titel: "§ 10 Vertragsstrafe bei Nichterfüllung",
    text: `(1) Kommt der Vorhabenträger seinen Verpflichtungen zur Herstellung der Ausgleichsmaßnahmen nicht innerhalb der in § 4 genannten Fristen nach, ist die Gemeinde berechtigt, eine Vertragsstrafe in Höhe von 10 % des Bürgschaftsbetrags gemäß § 7 Abs. 1 für jeden angefangenen Monat des Verzugs zu verlangen, höchstens jedoch den einfachen Bürgschaftsbetrag insgesamt.

(2) Die Geltendmachung der Vertragsstrafe lässt weitergehende Ansprüche der Gemeinde auf Erfüllung und Schadensersatz unberührt.

(3) Weist der Vorhabenträger nach, dass die Verzögerung auf Umstände zurückzuführen ist, die er nicht zu vertreten hat (z.B. höhere Gewalt, behördliche Verzögerungen), entfällt die Vertragsstrafe für die Dauer dieser Umstände.`,
  },
  {
    id: "ag11",
    titel: "§ 11 Veräußerung und Rechtsnachfolge",
    text: `(1) Im Falle der Veräußerung der PV-Anlage oder der Übertragung der Betreiberstellung ist der Vorhabenträger verpflichtet, sämtliche Rechte und Pflichten aus diesem Vertrag auf den Rechtsnachfolger zu übertragen und dies gegenüber der Gemeinde schriftlich nachzuweisen.

(2) Der Vorhabenträger haftet gesamtschuldnerisch neben dem Rechtsnachfolger, bis die Gemeinde den Eintritt des Rechtsnachfolgers in diesen Vertrag schriftlich bestätigt.

(3) Im Falle der Veräußerung der Ausgleichsflächen hat der Vorhabenträger sicherzustellen, dass die Ausgleichsverpflichtungen dinglich gesichert sind oder der neue Eigentümer in die Pflege- und Duldungspflichten eintritt.`,
  },
  {
    id: "ag12",
    titel: "§ 12 Vertragsdauer und Beendigung",
    text: `(1) Dieser Vertrag tritt mit beiderseitiger Unterzeichnung in Kraft und gilt für die gesamte Dauer des Betriebs der PV-Anlage „{PROJEKT_NAME}" zuzüglich der Nachsorgephase gemäß § 5 Abs. 1.

(2) Bei vorzeitigem Rückbau der PV-Anlage bleiben die Pflege- und Monitoringpflichten für die in § 5 Abs. 1 genannte Nachsorgephase bestehen.

(3) Eine ordentliche Kündigung dieses Vertrags durch den Vorhabenträger ist ausgeschlossen, solange die PV-Anlage betrieben wird oder die Nachsorgephase läuft.

(4) Beide Parteien können den Vertrag aus wichtigem Grund kündigen. Ein wichtiger Grund für die Gemeinde liegt insbesondere vor, wenn der Vorhabenträger seine Ausgleichsverpflichtungen trotz zweimaliger Mahnung dauerhaft nicht erfüllt.`,
  },
  {
    id: "ag13",
    titel: "§ 13 Schlussbestimmungen",
    text: `(1) Änderungen und Ergänzungen dieses Vertrags bedürfen der Schriftform. Dies gilt auch für die Aufhebung des Schriftformerfordernisses.

(2) Sollten einzelne Bestimmungen dieses Vertrags unwirksam sein oder werden, so bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Die Parteien verpflichten sich, unwirksame Bestimmungen durch solche zu ersetzen, die dem wirtschaftlichen und ökologischen Zweck der unwirksamen Bestimmung am nächsten kommen.

(3) Gerichtsstand ist der Sitz der Gemeinde.

(4) Anlagen zu diesem Vertrag:
- Anlage 1: Grünordnungsplan mit Darstellung der Ausgleichsflächen und Maßnahmen
- Anlage 2: Nachweis der Verfügungsberechtigung über die Ausgleichsflächen
- Anlage 3: Detaillierter Pflegeplan

(5) Dieser Vertrag wird in zwei Ausfertigungen erstellt. Jede Vertragspartei erhält eine Ausfertigung.`,
  },
];

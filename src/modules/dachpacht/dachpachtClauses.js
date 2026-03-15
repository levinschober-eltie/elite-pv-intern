// ============================================================
// DACHPACHT – Vertragsklauseln (Nutzungsvertrag Dachflächen)
// V2: Komplett überarbeitet gegen echten Döllnitz-Vertrag
// ============================================================

export const DACHPACHT_KLAUSELN = [
  {
    id: "dp0",
    titel: "Präambel",
    text: `Der Eigentümer ist {EIGENTUEMER_TYP} des/der in § 1 näher beschriebenen Grundstücke.

Der Nutzer ist Projektentwickler im Bereich regenerative Energien.

Der Nutzer beabsichtigt, auf nachstehend beschriebenen Flächen des Eigentümers eine Photovoltaik-Anlage mit einer Anlagenleistung von ca. {LEISTUNG_KWP} kWp und einen Batterie-Speicher (in der Folge zusammen auch als „Energieanlagen" bezeichnet) zu errichten und zu betreiben.

Diese werden dabei Strom aus dem Netz der allgemeinen Versorgung beziehen und in das Netz der allgemeinen Versorgung einspeisen. Der Nutzer wird mit diesen Energieanlagen an verschiedenen Strommärkten teilnehmen.

Darüber hinaus können die Energieanlagen in die elektrische Infrastruktur des Nutzers mit dem Ziel, für den Eigentümer verschiedene Einsparpotenziale auszuschöpfen, eingebunden werden – Voraussetzung ist die technische und rechtliche Umsetzbarkeit.

Vor diesem Hintergrund schließen die Vertragspartner folgenden Nutzungsvertrag:`,
  },
  {
    id: "dp1",
    titel: "§ 1 Gegenstand der Vereinbarung und der Kooperation",
    text: `1.1. Der Eigentümer sichert zu, dass er Eigentümer des/der folgenden Grundstücks/e ist und zur freien Verfügung über die für den Vertragszweck erforderlichen Flächen berechtigt ist:

Anschrift des Nutzungsobjekts: {EIGENTUEMER_ADRESSE}

{GRUNDBUCH_TABELLE}

Es bestehen keine Rechte Dritter am Grundstück, die der Ausübung der Rechte nach diesem Vertrag entgegenstehen.

1.2. Der Eigentümer ist berechtigt, das Grundstück weiter für eigene Zwecke zu nutzen und an Dritte zu verpachten und zu vermieten, soweit dies der Nutzung nach § 3 dieses Vertrages nicht entgegensteht oder diese hindert.`,
  },
  {
    id: "dp2",
    titel: "§ 2 Energieanlagen",
    text: `2.1. Die genutzten Dachflächen sind in Anlage 1 dargestellt.

2.2. Der Eigentümer gestattet dem Nutzer, der Elite PV GmbH, Lindenhof 4b, 92670 Windischeschenbach, {VERTRETEN_DURCH}, auf den Dachflächen des auf dem vorbezeichneten Grundstück befindlichen Gebäudes eine Photovoltaikanlage mit einer Leistung von ca. {LEISTUNG_KWP} kWp sowie einen Batteriespeicher zu errichten, zu betreiben und zu unterhalten.

2.3. Über eine gegebenenfalls erforderlich werdende oder sinnvoll erscheinende Änderung der Energieanlagen selbst, des Verlaufs der Anschlussleitungen oder der Lage der Energieanlagen einschließlich der Nebenanlagen oder einer Erweiterung oder Ersetzung wird der Nutzer den Eigentümer durch Übergabe einer entsprechend angepassten Projektbeschreibung informieren. Widerspricht der Eigentümer der Änderung nicht innerhalb von zehn Werktagen nach Übergabe, so gilt seine Zustimmung hierzu als erteilt.`,
  },
  {
    id: "dp3",
    titel: "§ 3 Grundstücksnutzung",
    text: `3.1. Der Eigentümer gestattet dem Nutzer die Nutzung der für die Errichtung, den dauerhaften Betrieb und den Unterhalt der Energieanlagen einschließlich der Nebenanlagen und Anschlussleitungen erforderlichen Flächen auf seinem/n Grundstück/en und gegebenenfalls in, an oder auf seinen Gebäuden gemäß Anlage 1.

3.2. Der Eigentümer gestattet dem Nutzer und vom Auftragnehmer beauftragten Personen, alle Arbeiten auf seinen Grundstücken und in, an oder auf seinen Gebäuden vorzunehmen, die für die Installation, den dauerhaften Betrieb und den Unterhalt der Energieanlagen einschließlich der Nebenanlagen und der Anschlussleitungen erforderlich oder sinnvoll sind, insbesondere:

a. Die Errichtung und Installation der Energieanlagen,
b. die Installation aller sonstigen für den Betrieb erforderlichen technischen Anlagen und Bauteile, wie z.B. Wechselrichtern, Schaltanlagen und Messeinrichtungen (Nebenanlagen),
c. die Verlegung von Anschlussleitungen zur Einbindung der elektrischen Infrastruktur und ins öffentliche Netz sowie
d. den Betrieb und die Unterhaltung der Energieanlagen einschließlich sämtlicher Nebenanlagen und Anschlussleitungen.

3.3. Der Eigentümer übernimmt keine Haftung dafür, dass die Grundstücke oder die Gebäude für den Nutzungszweck des Nutzers geeignet sind.`,
  },
  {
    id: "dp4",
    titel: "§ 4 Pflichten des Nutzers",
    text: `4.1. Der Nutzer hat die Energieanlagen, sämtliche Nebenanlagen und Anschlussleitungen gemäß den jeweils zum Zeitpunkt der Vornahme der entsprechenden Maßnahmen geltenden technischen Vorschriften, insbesondere den allgemein anerkannten Regeln der Technik, den technischen Regeln des zuständigen Netzbetreibers und DIN-Normen zu errichten, zu betreiben und zu unterhalten, sowie mit dem Stromnetz und, falls erforderlich, mit den elektrischen Anlagen bestehender Gebäude zu verbinden.

4.2. Der Nutzer hat bei der Ausübung seiner Rechte und insbesondere des Zutrittsrechts zu den genutzten Grundstücken stets so zu handeln, dass die Interessen des Eigentümers möglichst wenig beeinträchtigt werden, und zwar unter Beachtung der auf dem Gelände sowie in und an Gebäuden geltenden Sicherheitsstandards.`,
  },
  {
    id: "dp5",
    titel: "§ 5 Pflichten des Eigentümers",
    text: `5.1. Der Eigentümer gewährt dem Nutzer und vom Nutzer beauftragten Personen nach vorheriger Absprache zu den üblichen Betriebszeiten ungehinderten und unbeschränkten Zugang zu seinen Grundstücken einschließlich aller Räume, Gebäudeteile, elektrischer Anlagen und Leitungen, soweit dies für eine ordnungsgemäße Installation, den dauerhaften Betrieb und den Unterhalt der Energieanlagen erforderlich ist. Bei Gefahr in Verzug dürfen die Grundstücke sowie die Gebäude jederzeit betreten werden.

5.2. Der Eigentümer wird dem Nutzer das Grundstück in einem für den vertraglichen Zweck geeigneten Zustand bereitstellen. Wird dem Eigentümer bekannt, dass der bauliche Zustand der Grundstücke, der bestehenden Gebäude oder der elektrischen Bestandsanlage den Betrieb der Energieanlagen beeinträchtigt oder zu beeinträchtigen droht, so wird er den Nutzer hiervon unverzüglich in Kenntnis setzen.

5.3. Der Eigentümer beauftragt und bevollmächtigt den Nutzer in seinem Namen alle für die Errichtung, den Netzanschluss, den Betrieb, den Unterhalt und den Rückbau der Energieanlagen erforderlichen Erklärungen und Anfragen abzugeben. Der Eigentümer wird auf Verlangen dem Nutzer entsprechende schriftliche Vollmachten erteilen.

5.4. Der Eigentümer verpflichtet sich:
a) Keine baulichen Veränderungen am Gebäude vorzunehmen, die den Betrieb der PV-Anlage beeinträchtigen könnten, ohne vorherige schriftliche Zustimmung des Nutzers,
b) den Nutzer unverzüglich über alle Umstände zu informieren, die den Betrieb der Anlage beeinträchtigen könnten,
c) Bäume und Bewuchs, die zu einer Verschattung der Anlage führen können, auf Anforderung des Nutzers zu beseitigen oder zurückzuschneiden,
d) bei einem Verkauf des Grundstücks den Erwerber auf die Rechte und Pflichten aus diesem Vertrag hinzuweisen und den Eintritt des Erwerbers sicherzustellen.`,
  },
  {
    id: "dp6",
    titel: "§ 6 Eigentum",
    text: `6.1. Die Vertragspartner sind sich darüber einig, dass die Energieanlagen, sämtliche Nebenanlagen und Anschlussleitungen – mit Ausnahme von ggf. unterirdisch oder unter Putz verlegten Leitungen – nicht in das Eigentum des Eigentümers übergehen, sondern im Eigentum des Nutzers verbleiben. Sie werden nur zeitlich befristet, zu einem vorübergehenden Zweck und in Ausübung entsprechender Rechte aus einer beschränkten persönlichen Dienstbarkeit als Scheinbestandteil i.S.v. § 95 Abs. 1 BGB errichtet und bei Beendigung dieses Vertrages gemäß § 14 wieder entfernt. Die Vertragspartner verpflichten sich, keine die Eigenschaft der Energieanlagen als Scheinbestandteile berührende Vereinbarung aufzuheben, zu ändern oder zu ergänzen.

6.2. Der Eigentümer darf sich in Ausnahme-, Not- und Gefahrensituationen Zugang zu den im Eigentum des Nutzers stehenden Anlagen verschaffen. Hierfür wird der Nutzer dem Eigentümer einen ausschließlich für die Zwecke dieses Absatzes zu nutzenden Schlüssel überlassen.

6.3. Der Eigentümer verzichtet gegenüber einer die Energieanlagen finanzierenden Bank auf sein Verpächter- oder Vermieterpfandrecht an den Energieanlagen nebst Nebenanlagen.`,
  },
  {
    id: "dp7",
    titel: "§ 7 Grundbucheintragung",
    text: `7.1. Der Eigentümer verpflichtet sich, mit dem Nutzer die Vereinbarung zur Bestellung einer beschränkten persönlichen Dienstbarkeit gemäß Anlage 3 abzuschließen.

Die Dienstbarkeit umfasst das Recht zur Errichtung, zum Betrieb, zur Unterhaltung und zum Rückbau der Photovoltaikanlage einschließlich Batteriespeicher auf den Dachflächen und zur Verlegung der notwendigen Leitungen.

Die Kosten für die Eintragung der Dienstbarkeit (Notar- und Grundbuchkosten) trägt der Nutzer.

Grundbuchdaten des Vertragsobjekts:
{GRUNDBUCH_TABELLE}`,
  },
  {
    id: "dp8",
    titel: "§ 8 Genehmigungen",
    text: `8.1. Der Nutzer ist für die Herstellung der gesetzlichen Voraussetzungen für Errichtung und Betrieb seiner Energieanlagen, insbesondere für die Einholung der erforderlichen öffentlich-rechtlichen Genehmigungen oder sonstiger Erlaubnisse, ausschließlich und auf eigene Kosten verantwortlich. Der Eigentümer übernimmt keine Haftung dafür, dass seine bestehende Infrastruktur bestimmten gesetzlichen oder behördlichen Vorgaben entspricht.

8.2. Der Eigentümer wird den Nutzer bei der Beantragung und Einholung der erforderlichen Genehmigungen oder sonstiger Erlaubnisse unterstützen. Er wird insbesondere die erforderlichen Erklärungen abgeben und Informationen in geeigneter Weise zur Verfügung stellen.`,
  },
  {
    id: "dp9",
    titel: "§ 9 Netzanschluss- und Anschlussnutzung",
    text: `9.1. Für die Nutzung des Stromnetzes und gegebenenfalls des Telekommunikationsnetzes wird der Nutzer während der gesamten Vertragslaufzeit die auf dem Grundstück vorhandenen elektrischen Anlagen und Leitungen nutzen. Sollte aufgrund von Errichtung und Betrieb der Energieanlagen eine Erweiterung oder sonstige Änderung der bestehenden Netzanschlüsse notwendig werden, so trägt der Nutzer die hierfür entstehenden Kosten.

9.2. Der Nutzer stellt auf eigene Kosten sicher, dass die erforderlichen Messeinrichtungen zur separaten Messung des in den Energieanlagen erzeugten Stroms sowie des durch die Energieanlagen verbrauchten Stroms installiert und betrieben werden.`,
  },
  {
    id: "dp10",
    titel: "§ 10 Nutzungsentgelt",
    text: `10.1. Für die nach Maßgabe der nach § 1 überlassenen Dachflächen erhält der Eigentümer während der Grundlaufzeit folgendes Nutzungsentgelt:

10.1.1. Hauptnutzungszeitraum
Der Eigentümer erhält für die Überlassung der Dachfläche eine jährliche Vergütung (Pachtzins) in Höhe von {PACHTZINS_JAHR} EUR (in Worten: {PACHTZINS_WORT} Euro). Die Vergütung ist jeweils zum 01.01. eines jeden Jahres fällig. Für das erste und letzte Vertragsjahr wird der Pachtzins anteilig (pro rata temporis) berechnet.

Die Vergütung wird jährlich um {PREISANPASSUNG}% angepasst. Die erste Anpassung erfolgt zum Beginn des zweiten Vertragsjahres.

Die Berechnung der Vergütung basiert auf dem gewählten Pachtmodell gemäß beigefügtem Preisblatt (Anlage 7).

10.1.2. Verlängerungsoptionen
Für die 1. Verlängerung (5 Jahre) bezahlt der Nutzer: Jährlich 10% der Netto-Einnahmen zzgl. etwaig anfallender MwSt.
Für die 2. Verlängerung (5 Jahre) bezahlt der Nutzer: Jährlich 15% der Netto-Einnahmen zzgl. etwaig anfallender MwSt.

10.1.3. Definition der Netto-Einnahmen
Als Netto-Einnahmen wird die erhaltene Vergütung, die der Nutzer für den erzeugten Strom erhält, abzüglich der Instandhaltungs- und Wartungskosten, definiert.

10.1.4. Fälligkeit
Das vereinbarte Nutzungsentgelt wird binnen 30 Tagen nach Inbetriebnahme und ordnungsgemäßer Rechnungsstellung anteilig für das Inbetriebnahmejahr fällig. Anschließend ist das laufende Nutzungsentgelt bis zum 31. Januar eines Kalenderjahres im Voraus zu entrichten. Das Nutzungsentgelt ist auf ein vom Eigentümer noch zu benennendes Konto zu überweisen.

10.1.5. Die auf dem Grundstück ruhenden öffentlichen Steuern, Abgaben und Lasten sowie sonstige Nebenkosten des Gebäudes trägt der Eigentümer.

10.2. Batteriespeicher
Für die Nutzung und Aufstellung des Batteriespeichers ist kein separates Nutzungsentgelt zu bezahlen, dies ist bereits mit der Zahlung des Nutzungsentgelts für die Photovoltaik-Anlage abgegolten.`,
  },
  {
    id: "dp11",
    titel: "§ 11 Protokoll / Bestandsaufnahme und Abnahme",
    text: `11.1. Vor Beginn der Errichtung der Energieanlagen führen die Vertragspartner eine gemeinsame Begehung aller relevanten Grundstücke und Gebäude durch. Ziel ist die Erfassung und Dokumentation des Zustands der für die Errichtung der Energie- und der Nebenanlagen erforderlichen Flächen und Räume in einem entsprechenden Protokoll. Das Protokoll ist von beiden Vertragspartnern zu unterzeichnen und ist als Anlage 6 zu diesem Vertrag zu nehmen.

11.2. Nach Abschluss der Errichtung der Energieanlagen, der Nebenanlagen und der Anschlussleitungen sowie nach umfangreicheren Bau-, Wartungs- oder Reparaturarbeiten, sowie nach dem Rückbau der Energieanlagen am Ende der Vertragslaufzeit findet jeweils eine gemeinsame Abnahme statt. Der Nutzer hat zum Zwecke der Durchführung der Abnahme jeweils den Abschluss der Arbeiten anzuzeigen.

Über die Abnahme ist ein schriftliches Protokoll zu fertigen und von beiden Vertragspartnern zu unterzeichnen. Werden bei der Abnahme Mängel festgestellt, so sind diese innerhalb einer angemessenen Frist vom Auftragnehmer zu beseitigen.`,
  },
  {
    id: "dp12",
    titel: "§ 12 Haftung und Versicherung",
    text: `12.1. Die Vertragspartner haften einander nach den gesetzlichen Bestimmungen.

12.2. Der Nutzer schließt spätestens zu Beginn der Errichtung der Energieanlagen eine ausreichende und marktübliche Versicherung ab. Der Nutzer wird dem Eigentümer bei Beginn der Errichtung eine Bestätigung der Versicherung(en) über den Abschluss der entsprechenden Policen und die jeweiligen Versicherungshöchstsummen vorlegen.

12.3. Der Eigentümer ist verpflichtet, seine bestehende Gebäudeversicherung über die Installation der PV-Anlage zu informieren. Etwaige Mehrprämien infolge der Installation gehen zu Lasten des Nutzers, sofern nachgewiesen.

12.4. Beide Parteien sind verpflichtet, Schadensfälle unverzüglich der anderen Partei anzuzeigen und werden auf Verlangen den Nachweis des Versicherungsschutzes erbringen.`,
  },
  {
    id: "dp13",
    titel: "§ 13 Vertragsdauer und Kündigung",
    text: `13.1. Der Nutzungsvertrag tritt mit seiner Unterzeichnung durch beide Parteien in Kraft und endet mit der Festlaufzeit zum 31. Dezember des {LAUFZEIT_JAHRE}. Jahres, das auf das Jahr der Inbetriebnahme folgt.

13.2. Der Nutzer erhält das Recht, den Vertrag durch schriftliche Anzeige gegenüber dem Eigentümer spätestens 12 Monate vor Ablauf des Vertrages zweimal um jeweils 5 Jahre zu verlängern („Verlängerungsoption").

13.3. Soweit ein gesetzliches Recht zur ordentlichen Kündigung besteht, ist dieses während der vereinbarten Laufzeit ausgeschlossen. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund ohne Einhaltung einer Kündigungsfrist bleibt unberührt.

13.4. Der Nutzer hat insbesondere das Recht zur außerordentlichen Kündigung mit sofortiger Wirkung, wenn:
a. der Eigentümer bauliche Veränderungen vornimmt, die zu einer Leistungsminderung führen;
b. die Möglichkeit zur Einspeisung ins öffentliche Netz entfällt und kein alternativer Einspeisepunkt verfügbar ist;
c. dem Nutzer der Betrieb durch behördliche Auflagen rechtlich unzumutbar wird;
d. sich die Statik der Dachflächen so verändert, dass ein sicherer Betrieb nicht mehr möglich ist;
e. aus vom Nutzer nicht zu vertretenden Gründen ein wirtschaftlicher Betrieb nicht mehr gewährleistet ist;
f. es dem Eigentümer nicht gelingt, den vereinbarten Rang für die Dienstbarkeiten sicherzustellen.

13.5. Das Kündigungsrecht kann auch im Hinblick auf einzelne Dachflächen ausgeübt werden. Das Nutzungsentgelt ist entsprechend anzupassen.

13.6. Der Eigentümer hat das Recht zur außerordentlichen Kündigung, wenn der Nutzer mit der Zahlung sechs Monate in Verzug ist und mindestens zweimal unter Setzung einer angemessenen Nachfrist gemahnt wurde.

13.7. Die Kündigung bedarf der Schriftform und hat unter Darlegung der Gründe zu erfolgen. Die Zustellung erfolgt per Einschreiben mit Rückschein.`,
  },
  {
    id: "dp14",
    titel: "§ 14 Ansprüche nach Vertragsende",
    text: `14.1. Die Photovoltaikanlage wird nach Ablauf der Vertragslaufzeit ({LAUFZEIT_JAHRE} Jahre zzgl. Verlängerungsoptionen), einschließlich aller zugehörigen Komponenten und Dokumentationen unentgeltlich in das Eigentum des Eigentümers übergehen.

Der Nutzer verpflichtet sich, dem Eigentümer alle relevanten technischen Unterlagen, Wartungspläne und Garantien auszuhändigen.

14.2. Alternativ kann der Nutzer die Anlage auf eigene Kosten innerhalb von 6 Monaten nach Vertragsende vollständig zurückbauen. Die Dachfläche ist in einem ordnungsgemäßen Zustand zurückzugeben. Ein solches Rückbauverlangen ist spätestens 6 Monate vor Vertragsende schriftlich zu erklären.

14.3. Der Nutzer stimmt der Löschung der zu seinen Gunsten bestellten dinglichen Sicherheiten nach Vertragsende bereits jetzt ausdrücklich zu.

14.4. Der Eigentümer gewährt dem Nutzer auch nach Vertragsende Zugang zum Grundstück zur Durchführung des Rückbaus.`,
  },
  {
    id: "dp15",
    titel: "§ 15 Rechtsnachfolge und Verkauf des Grundstücks",
    text: `15.1. Der Nutzer ist berechtigt, den Nutzungsvertrag als Ganzes oder in Bezug auf einzelne Gebäude oder Grundstücke mit allen Rechten und Pflichten auf Dritte zu übertragen. Der Eigentümer erteilt bereits jetzt unwiderruflich seine Zustimmung. Die Übertragung wird mit Zugang einer schriftlichen Mitteilung wirksam.

15.2. Bei einem Verkauf des Grundstücks ist der Eigentümer verpflichtet, den Erwerber auf die Rechte und Pflichten aus diesem Vertrag hinzuweisen und den Eintritt des Erwerbers sicherzustellen.`,
  },
  {
    id: "dp16",
    titel: "§ 16 Schlussbestimmungen",
    text: `a) Dieser Vertrag enthält alle Vereinbarungen der Parteien. Mündliche Nebenabreden bestehen nicht. Änderungen und Ergänzungen dieses Vertrags bedürfen der Schriftform.

b) Sollte eine Bestimmung dieses Vertrags unwirksam sein oder werden, so wird die Wirksamkeit der übrigen Bestimmungen hierdurch nicht berührt (salvatorische Klausel).

c) Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist – soweit gesetzlich zulässig – Weiden i.d.OPf.

d) Der Vertrag wird in zwei gleichlautenden Ausfertigungen erstellt, von denen jede Partei eine erhält.

Anlagen:
Anlage 1 – Lageplan Dachflächen
Anlage 2 – Grundbuchauszug
Anlage 3 – Muster / Dienstbarkeit
Anlage 4 – Vollmacht zur Einholung eines Grundbuchauszuges
Anlage 5 – Einverständniserklärung Netzanfrage
Anlage 6 – Protokoll / Bestandsaufnahme und Abnahme
Anlage 7 – Preisblatt / Pachtberechnung`,
  },
];

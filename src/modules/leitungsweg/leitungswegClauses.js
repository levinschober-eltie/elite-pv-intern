// ============================================================
// LEITUNGSWEG – Vertragsklauseln
// Zwei Vertragstypen: Gemeinde (§ 11a EEG) und Privat (Leitungsrecht)
// ============================================================

// ============================================================
// TYP 1: GEMEINDE – Duldungsvertrag gemeindliche Straßen
// ============================================================
export const GEMEINDE_KLAUSELN = [
  {
    id: "lg1",
    titel: "§ 1 Duldungspflicht der Gemeinde",
    text: `(1) Die Gemeinde duldet die Verlegung, die Errichtung, die Instandhaltung, die Instandsetzung, den Schutz und den Betrieb von elektrischen Leitungen sowie von Steuer- und Kommunikationsleitungen (Leitungen) und sonstigen Einrichtungen auf folgenden gemeindlichen Straßen:

Flurnummer {FLURSTUECKE_GEMEINDE} gemäß der diesem Vertrag beigefügten „Anlage 1"

zum Anschluss von der Anlage zur Erzeugung von erneuerbaren Energien {EE_ANLAGE_NAME} ({EE_ANLAGE_KOORDINATEN} – Standort der EE-Anlage) zum Netzverknüpfungspunkt {NVP_NAME} ({NVP_KOORDINATEN} – Lage Netzverknüpfungspunkt).

Die Gemeinde ist verpflichtet, alle Maßnahmen zu unterlassen, die den Bestand oder den Betrieb der Leitung oder sonstiger Einrichtungen gefährden oder beeinträchtigen. Werden o.g. Straßen Dritten zur Nutzung überlassen, ist die Gemeinde verpflichtet, diese im Zuge von angezeigten Bauarbeiten und bei zukünftigen Nutzungsüberlassungen mit deren Gewährung über diese Leitungseinlegung zu unterrichten.

(2) Die Verlegung hat entsprechend den vorgelegten Planunterlagen (Anlagen) zu erfolgen. Eine etwaige Verpflichtung des Betreibers zur Einholung öffentlich-rechtlicher Genehmigungen, Gestattungen oder Erlaubnisse, die nach anderen Rechtsvorschriften erforderlich sind, bleibt unberührt.

(3) Der Schutzstreifen hat eine Breite von {SCHUTZZONE_BREITE} m beiderseits der Leitung.

(4) Die Leitungen und die sonstigen Einrichtungen werden keine wesentlichen Bestandteile des Grundstücks im Sinne des § 94 Absatz 1 des Bürgerlichen Gesetzbuchs.

(5) Für den Fall der Entwidmung o.g. Straßen oder Teilen von diesen (fiskalische Grundstücke) entfällt die Verpflichtung nach Abs. 1 und die Duldungspflichten ergeben sich aus § 11a EEG.

(6) Werden die oder Teile der o.g. Straßengrundstücke entwidmet und einem Dritten übertragen, so informiert die Gemeinde den Betreiber rechtzeitig vorher und bestellt, soweit erforderlich, auf Antrag des Betreibers zu dessen Gunsten und auf dessen Kosten eine beschränkte persönliche Dienstbarkeit. Für die Wertminderung des Grundstücks leistet der Betreiber eine einmalige angemessene Entschädigung, die mit der Eintragung der Dienstbarkeit fällig wird.

(7) Die Duldungspflicht endet 48 Monate nachdem der Betrieb der Leitung dauerhaft eingestellt wurde, es sei denn, dass die Gemeinde dies nicht zugemutet werden kann.`,
  },
  {
    id: "lg2",
    titel: "§ 2 Ausführung von Bauarbeiten",
    text: `Für die Ausführungen von Bauarbeiten für die Verlegung, die Errichtung, die Instandhaltung und die Instandsetzung der Leitungen und sonstigen Einrichtungen durch den Betreiber und ggf. seine Auftragsnehmers gilt Folgendes:

(1) Der Betreiber hat ein fachkundiges, zuverlässiges und leistungsfähiges Unternehmen als Auftragnehmer zu wählen. Er hat hierfür einen geeigneten Nachweis vorzulegen.

(2) Der Betreiber, ggf. sein Auftragnehmer, hat die im Rahmen der Planung notwendige und aktuelle Spartenabfrage nachzuweisen. Den Nachweis über die durchgeführte Spartenabfrage hat der Betreiber spätestens mit der Baubeginnsanzeige vorzulegen.

(3) Der Beginn der Bauarbeiten ist der Gemeinde 14 Tage vorher schriftlich anzuzeigen. Hierbei ist auch der verantwortliche Ansprechpartner für die bauliche Umsetzung des Vorhabens mit seinen Kontaktdaten zu benennen.

(4) Der Betreiber hat rechtzeitig einen Ortstermin vor Baubeginn mit der Gemeinde abzustimmen. Es wird vom Betreiber ein Ergebnisprotokoll verfasst und abgestimmt.

(5) Der Betreiber der Leitung und von ihm Beauftragte sind berechtigt, die Straße zu diesem Zweck zu betreten und zu befahren. Die Bauarbeiten werden so durchgeführt, dass die Sicherheit des Verkehrs nicht und die Leichtigkeit des Verkehrs möglichst wenig beeinträchtigt werden. Der Betreiber trifft im Benehmen mit der Gemeinde alle zum Schutz der Straße und des Straßenverkehrs erforderlichen Vorkehrungen; Baustellen sind abzusperren und zu kennzeichnen. Es gelten die anerkannten Regeln der Straßenbautechnik (z.B. Zusätzliche Technische Vertragsbedingungen und Richtlinien für Aufgrabungen in Verkehrsflächen, Ausgabe 2012 – ZTV A-StB 12). Durch die Bauarbeiten dürfen die Zugänge zu den angrenzenden Grundstücken sowie der Anliegerverkehr nicht mehr als unvermeidbar beschränkt werden.

(6) Die Baumpflanzungen auf den Straßengrundstücken sind nach Möglichkeit zu schonen, auf das Wachstum der Bäume ist Rücksicht zu nehmen.

(7) Nach Beendigung der Arbeiten an den Leitungen hat der Betreiber den Verkehrsweg wieder instand zu setzen, sofern nicht die Gemeinde erklärt hat, die Instandsetzung selbst vornehmen zu wollen. Der Betreiber hat der Gemeinde die Auslagen für die von ihm vorgenommene Instandsetzung zu erstatten.

(8) Der Betreiber hat die Beendigung der Arbeiten an den Leitungen unverzüglich und die Instandsetzung des Verkehrsweges spätestens eine Woche vor der erwarteten Beendigung der Arbeiten schriftlich oder fernmündlich der Gemeinde anzuzeigen. Bei fernmündlicher Mitteilung ist die schriftliche Anzeige unverzüglich nachzureichen.

(9) Der Betreiber stimmt rechtzeitig mit der Gemeinde einen Termin zur Übernahme ab. Über die Übernahme wird vom Betreiber ein Protokoll angefertigt.

(10) Die Inbetriebnahme der Leitungen ist der Gemeinde unverzüglich anzuzeigen.

(11) Der Betreiber übergibt der Gemeinde spätestens sechs Wochen nach Beendigung der Bauarbeiten einen Bestandsplan, in dem der Verlauf der Leitung und die Schutzstreifen auf dem Grundstück, sowie die Verlegungstiefen eingezeichnet sind. Diese Unterlagen zeigen genau und vollständig die Leitungen und sonstigen Einrichtungen, die sich innerhalb und außerhalb der dem öffentlichen Verkehr dienenden Grundstücke befinden. Dies gilt auch für Änderungen der Trassierung. Sie können auf Wunsch der Gemeinde – soweit verfügbar – auch in digitaler Form übergeben werden.

(12) Der Betreiber ist verpflichtet nach Verlegung der Kabel, die genaue Lage und Verlauf gegenüber dem regionalen Netzbetreiber Bayernwerk Netz GmbH auf eigene Kosten so offenzulegen, dass die Bayernwerk Netz GmbH diese an von ihr Dritte zur Verfügung gestellten Planauskünften über die unterirdische Lage von Stromkabeln einpflegen und nachhalten kann.`,
  },
  {
    id: "lg3",
    titel: "§ 3 Bankbürgschaft",
    text: `Zur Sicherung der Rechte aus diesem Vertrag, insbesondere für die ordnungsgemäße Wiederherstellung der Straße für den Kabel-Leitungsbau und sonstigen Einrichtungen, verpflichtet sich die Berechtigte eine Bürgschaft einer Deutschen Bank oder Versicherung zugunsten der Gemeinde in Höhe von {BUERGSCHAFT_BETRAG} € ({BUERGSCHAFT_PROZENT}% der geschätzten Wiederherstellungskosten) vor Beginn der Bauarbeiten vorzulegen.

Zur Sicherung der Rechte aus diesem Vertrag, insbesondere für die ordnungsgemäße Wiederherstellung der Straße bei der Entfernung der Leitung und sonstigen Einrichtungen, verpflichtet sich die Berechtigte nach dem Ablauf der Gewährleistungspflicht im Sinne des § 7 Abs. 2 die Bankbürgschaft nach § 3 S.1 für den Rückbau der Kabelleitungen und sonstigen Einrichtungen umzuschreiben oder eine Rückbaubürgschaft gegen Rückgabe der Bürgschaft nach § 3 Abs. 1 vorzulegen.

Der Betreiber ist berechtigt den benannten Vertragsgegenstand an Dritte abzutreten.

Die Abtretung eines Rechts führt zu einem Gläubigerwechsel. Der neue Gläubiger erwirbt das abgetretene Recht erst in dem Moment, in dem es wirksam entsteht.

Mit Vertragsabschluss tritt der neue Gläubiger an die Stelle des Altgläubigers, der dadurch alle Rechte und Pflichten abgeben. Die Forderung geht so über, wie sie im Zeitpunkt der Abtretung besteht, mit allen Vorzügen und Schwächen.

Der neue Gläubiger hat die abgetretenen Rechte und Forderungen wie im Vertrag geregelt einzuhalten.

Der neue Gläubiger hat eine gleichwertige Bürgschaft von einer Bank oder Versicherung zu hinterlegen, damit die Bürgschaft der Altgläubiger frei wird.`,
  },
  {
    id: "lg4",
    titel: "§ 4 Entschädigung",
    text: `(1) Der Betreiber zahlt der Gemeinde als Gegenleistung für die Gestattung gemäß diesem Vertrag einmalig eine Entschädigung i.H.v. {ENTSCHAEDIGUNG_PRO_METER} € pro laufenden Meter. Die Gesamtlänge der Trasse auf dem Hoheitsgebiet der Gemeinde beträgt vorläufig ca. {TRASSENLAENGE} m.

(2) Die Zahlung wird mit Inbetriebnahme der Leitung fällig. Die Zahlung ist auf das Konto der {GEMEINDE_NAME}, IBAN: {IBAN}, BIC: {BIC}, Bank: {BANK} zu überweisen.

(3) Schadensersatzansprüche der Gemeinde bleiben unberührt.`,
  },
  {
    id: "lg5",
    titel: "§ 5 Unterhaltungserschwernisse",
    text: `(1) Bei der Benutzung der Verkehrswege ist eine Erschwerung ihrer Unterhaltung und eine vorübergehende Beschränkung ihres Widmungszwecks nach Möglichkeit zu vermeiden.

(2) Wird die Unterhaltung erschwert, so hat der Betreiber der Gemeinde die aus der Erschwerung erwachsenden Kosten zu ersetzen.`,
  },
  {
    id: "lg6",
    titel: "§ 6 Umverlegung / Entfernung",
    text: `(1) Die Gemeinde kann die Umverlegung der Leitung und sonstigen Einrichtungen verlangen, wenn die Lage an der bisherigen Stelle für sie nicht mehr zumutbar ist.

(2) Ist die Zumutbarkeit nicht über eine Verlegung der Leitungen und sonstigen Einrichtungen zu erreichen, hat der Betreiber die Leitungen und sonstigen Einrichtungen zu entfernen. § 2 Abs. 7 gilt entsprechend für Entfernung und Wiederherstellung.

(3) Der Betreiber trägt die Kosten der Umverlegung bzw. der Entfernung.`,
  },
  {
    id: "lg7",
    titel: "§ 7 Schadensersatz und Haftung",
    text: `(1) Die Gemeinde ist nicht verpflichtet, eine bestimmte Beschaffenheit oder Eigenschaft der öffentlichen Verkehrswege vorzuhalten. Die Gemeinde hat keine Kenntnis darüber, ob sich in den vom Vorhaben betroffenen Grundstücken bzw. Grundstücksteilflächen Kampfmittel befinden. Eine entsprechende Erkundung ist vom Betreiber durchzuführen.

(2) Der Betreiber hat die Pflicht, den der Gemeinde entstehenden Schaden so gering wie möglich zu halten. Der Betreiber verpflichtet sich, Schäden zu beheben, wenn die Gemeinde deren Auftreten rügt und sie auf die Bauarbeiten des Betreibers zurückzuführen sind, sofern die Abnahme dieser Bauarbeiten nicht länger als sieben Jahre zurückliegt. Innerhalb dieser Frist wird vermutet, dass die gerügten Schäden auf die Bauarbeiten des Betreibers zurückzuführen sind, sofern diese Bauarbeiten am gleichen Ort die letzten waren. Die Frist beginnt mit der Übernahme durch die Gemeinde. Ist auf eine Besichtigung verzichtet worden, beginnt die Frist mit dem Eingang der schriftlichen Anzeige des Betreibers über die Beendigung der Bauarbeiten.

(3) Bei der Anzeige der Durchführung von Bauarbeiten durch Dritte, insbesondere Nutzungsberechtigte, im in § 1 Abs. 1 bezeichneten Straßenabschnitt beschränkt sich die Pflicht der Gemeinde darauf, diese auf eine Leitungseinlegung durch den Betreiber und auf die Notwendigkeit einer Spartenabstimmung hinzuweisen. Der Betreiber ist verpflichtet der Gemeinde stets aktuelle Kontaktdaten zur Verfügung zu stellen. Die Beachtung der Interessen des Betreibers ist Angelegenheit der Dritten.

(4) Die Vertragspartner haften nach Maßgabe der gesetzlichen Bestimmungen für alle Schäden, die infolge der von ihnen oder ihren Beauftragten ausgeführten Arbeiten an Anlagen des jeweils anderen Vertragspartners oder Dritten zugefügt werden.`,
  },
  {
    id: "lg8",
    titel: "§ 8 Kündigung",
    text: `Aus wichtigem Grund, insbesondere bei schwerwiegenden Verstößen gegen die Pflichten bei Ausführung der Bauarbeiten, kann die Gemeinde den Vertrag fristlos mit der Wirkung kündigen, dass die Duldungspflichten erlöschen.`,
  },
  {
    id: "lg9",
    titel: "§ 9 Betriebseinstellung",
    text: `(1) Der Betreiber hat der Gemeinde die dauerhafte Betriebseinstellung unverzüglich anzuzeigen.

(2) Mit Ende der Duldungspflicht (§ 1 Abs. 7) hat der Betreiber die Leitungen und sonstigen Einrichtungen unverzüglich zu entfernen. § 2 Abs. 7 gilt entsprechend für Entfernung und Wiederherstellung.`,
  },
  {
    id: "lg10",
    titel: "§ 10 Betreiberwechsel",
    text: `Kommt es zu einem Wechsel des Betreibers erlöschen die Rechte des Vertragspartners. Eine Übertragung der Rechte und Pflichten aus diesem Vertrag kann nur mit Zustimmung der Gemeinde erfolgen. Bei Vorliegen eines wichtigen Grunds kann diese verweigert werden.`,
  },
  {
    id: "lg11",
    titel: "§ 11 Schlussbestimmungen",
    text: `(1) Sollten einzelne Bestimmungen dieses Vertrags rechtsunwirksam sein oder werden, so wird hierdurch die Wirksamkeit der übrigen Vereinbarungen nicht berührt. Beide Vertragspartner verpflichten sich, in diesem Fall den Vertrag so zu ändern, dass dadurch ein im wirtschaftlichen Erfolg möglichst gleichwertiges Ergebnis erzielt wird.

(2) Mündliche Nebenvereinbarungen sind nicht getroffen. Jede Änderung oder Ergänzung dieses Vertrags bedarf der Schriftform (siehe Art. 38 der Gemeindeordnung für den Freistaat Bayern).

(3) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist das Amtsgericht {GERICHTSSTAND}.

(4) Dieser Vertrag ist in zwei Ausfertigungen erstellt. Die Gemeinde und der Betreiber erhalten vom Vertrag und seinen Anlagen je eine Ausfertigung. Die mit _*_ gekennzeichneten, fehlenden Werte müssen vom Betreiber noch ermittelt werden. Diese werden nach Feststellung ergänzt und es werden danach neue Ausfertigungen für jeden Vertragspartner erstellt und ausgefertigt.`,
  },
];

// ============================================================
// TYP 2: PRIVAT – Leitungsrecht / Dienstbarkeit
// ============================================================
export const PRIVAT_KLAUSELN = [
  {
    id: "lp1",
    titel: "§ 1 Vertragsgegenstand",
    text: `Der Eigentümer des vorgenannten Grundbesitzes räumt der Elite PV GmbH, Lindenhof 4b, 92670 Windischeschenbach im Folgenden Berechtigte genannt, sowie deren Rechtsnachfolgern das dinglich zu sichernde Recht ein, auf dem vorgenannten Grundbesitz, Stromversorgungskabel mit Zubehör wie ggf. Muffen, Schutzrohre oder in Absprache Verteilerkästen (nachfolgend allgemein Anlagen genannt) unterirdisch zu verlegen, dauernd zu betreiben und zu belassen, insbesondere sie zu überwachen, instand zu halten und zu setzen, zu erneuern und für Unterhaltungsmaßnahmen notwendige Vorarbeiten durchzuführen und den vorgenannten Grundbesitz zum Zweck der Bauvorbereitung, insbesondere die für die Planung und Baudurchführung notwendigen Vorarbeiten, des Baues, des Betriebes, der Unterhaltung und Auswechslung der Anlagen zu benutzen, die hierfür erforderlichen Arbeiten vorzunehmen und den Grundbesitz – bei Gefahr in Verzug sofort – zu betreten und zu befahren.

Die Schutzzonenfläche beträgt {SCHUTZZONE_BREITE} m beidseits der Trassenachse; maßgeblich für Umfang und Lage der Schutzzone sind die im Zeitpunkt der Eintragung geltenden technischen Vorgaben sowie die tatsächliche örtliche Ausführung.

Änderungen aufgrund technischer Erfordernisse oder behördlicher Vorgaben bleiben zulässig, soweit sie dem Eigentümer zumutbar sind und keine wesentliche Erweiterung der Belastung darstellen.

Der Eigentümer verpflichtet sich, alle Maßnahmen zu unterlassen und nicht zuzulassen, die den Bestand oder Betrieb der Anlagen gefährden oder beeinträchtigen können. Zu den zu unterlassenden Maßnahmen gehören beispielhaft Grabungen in der Leitungstiefe, Überbauen oder Verschieben der Trasse. Er darf in der Leitungstrasse Anlagen, Bäume und Sträucher belassen oder errichten bzw. Pflanzungen sowie Grabungen vornehmen, wenn hierfür von der Berechtigten die Genehmigung, die nach den jeweils gültigen Vorschriften (insbesondere DIN und VDE) erteilt wird, vorliegt. Andernfalls ist der Eigentümer zur entschädigungslosen und sofortigen Beseitigung verpflichtet. Im Verzugsfall erfolgt die Beseitigung durch die Berechtigte selbst auf Kosten des Verpflichteten.

Der Eigentümer verpflichtet sich hierzu zur Bestellung einer beschränkten persönlichen Dienstbarkeit (Leitungsrecht) zur Verlegung, zum Betrieb und zur Unterhaltung von Stromversorgungsleitungen zugunsten der Elite PV GmbH.`,
  },
  {
    id: "lp2",
    titel: "§ 2 Anpassungspflicht bei technischen Änderungen",
    text: `Ändern sich gesetzliche Bestimmungen, technische Normen (insbesondere DIN-, VDE- oder sonstige einschlägige Vorschriften) oder behördliche Auflagen, so ist die Berechtigte berechtigt und verpflichtet, die Anlagen auf ihre Kosten an diese Anforderungen anzupassen, soweit dies für den sicheren und ordnungsgemäßen Betrieb erforderlich ist. Notwendige Arbeiten werden dem Eigentümer rechtzeitig angezeigt. Der Eigentümer hat die hierfür erforderlichen Betretungs- und Nutzungsrechte zu gewähren; § 1 dieses Vertrages gilt entsprechend.`,
  },
  {
    id: "lp3",
    titel: "§ 3 Schadensersatz",
    text: `Die Berechtigte verpflichtet sich, alle während der Bauzeit und des späteren Betriebes angerichteten Flur- und sonstigen Schäden im Rahmen der gesetzlichen Bestimmungen und nach den Bestimmungen des Bayerischen Bauernverbandes zu ersetzen und nach der Durchführung der Maßnahme den ursprünglichen Zustand gemäß § 249 BGB wiederherzustellen. Der Eigentümer verpflichtet sich seinen o.g. Grundbesitz nicht ohne vorherige Eintragung des Leitungsrechtes in das Grundbuch zu veräußern.

Die Parteien vereinbaren eine pauschale Entschädigung in Höhe von {ENTSCHAEDIGUNG_GESAMT} €. Dieser Betrag entspricht, auf Basis der aktuellen Planungsunterlagen, einer durchschnittlichen Vergütung von {ENTSCHAEDIGUNG_PRO_METER} € pro laufenden Meter. Für den baulich bedingten Bewirtschaftungsausfall auf der in Anspruch genommenen Fläche vereinbaren die Parteien eine pauschale Entschädigung von {BEWIRTSCHAFTUNGSAUSFALL} €.

Die Zahlungen erfolgen nach erfolgter Eintragung der Dienstbarkeit im Grundbuch, auf folgendes Bankkonto:
IBAN: {IBAN}
Kreditinstitut: {BANK}`,
  },
  {
    id: "lp4",
    titel: "§ 4 Bau- und Betriebsregeln",
    text: `Die Berechtigte ist verpflichtet, die Kabeltrasse ordnungsgemäß nach geltenden DIN-/VDE-Vorschriften anzulegen und zu betreiben. Außerdem unterhält die Berechtigte eine Betriebs-/Haftpflichtversicherung mit ausreichender Deckung auch für Leitungs- und Erdkabelschäden einschließlich Folgeschäden. Der Versicherungsschutz wird auf Verlangen in geeigneter Form nachgewiesen.

Die Berechtigte übergibt dem Eigentümer vor Inbetriebnahme eine Baudokumentation mit Verlauf und Verlegungstiefe sowie der Schutzzone und aktualisiert diese während der Laufzeit des Vertrages.

Die ordnungsgemäße landwirtschaftliche Bewirtschaftung des Grundstücks bleibt zulässig.

Tiefgreifende Maßnahmen innerhalb der Schutzzone bedürfen einer vorherigen Abstimmung. Der Eigentümer hat derartige Tätigkeiten anzuzeigen und mit der Berechtigten abzustimmen.

Die Berechtigte stellt den Eigentümer gegenüber Ansprüchen Dritter, die im Zusammenhang mit dem Vertragsgegenstand stehen, frei. Der Eigentümer haftet nur, wenn der Schaden vorsätzlich oder grob fahrlässig verursacht wurde oder wenn er gegen die in diesem Vertrag vereinbarten Bewirtschaftungs- und Abstimmungspflichten verstößt. Bei beiderseitigem Verschulden gilt § 254 BGB.

Schäden durch Umstürzen von Bäumen, Wurzelzug oder anderer Umwelteinflüsse sind durch die Berechtigte zu beseitigen. Der Eigentümer haftet nur, wenn er seine Verkehrssicherungspflichten vorsätzlich oder grob fahrlässig verletzt.

Schäden oder Störungen sind der jeweils anderen Partei unverzüglich anzuzeigen. Die Berechtigte ist berechtigt, Sofortmaßnahmen zur Gefahrenabwehr und Schadensbehebung zu ergreifen; der Eigentümer gewährt hierfür Zutritt.`,
  },
  {
    id: "lp5",
    titel: "§ 5 Kosten für Notar- und Grundbuchkosten",
    text: `Die Kosten für die Grundbucheintragung sowie den Notar trägt die Berechtigte. Eine Vollzugsmitteilung an die Berechtigte wird beantragt.

Der Eigentümer bestätigt, eine Durchschrift dieses Vertrages erhalten zu haben.`,
  },
  {
    id: "lp6",
    titel: "§ 6 Speicherung der Daten",
    text: `Die Daten dieses Vertrags werden im Rahmen der vertraglichen Zweckbestimmung unter Beachtung der DSGVO und des BDSG gespeichert.`,
  },
  {
    id: "lp7",
    titel: "§ 7 Streitbeilegung",
    text: `Die Parteien verpflichten sich, etwaige Meinungsverschiedenheiten aus oder im Zusammenhang mit diesem Vertrag zunächst gütlich beizulegen. Kommt eine einvernehmliche Lösung nicht zustande, ist – soweit zulässig – der Gerichtsstand der Sitz der Berechtigten. Zwingende gesetzliche Regelungen über ausschließliche Gerichtsstände bleiben unberührt.`,
  },
  {
    id: "lp8",
    titel: "§ 8 Verjährung",
    text: `Soweit Regelungen in diesem Vertrag nicht dinglicher Gegenstand der beschränkten persönlichen Dienstbarkeit werden, gelten diese von der regelmäßigen Verjährung für die gesamte Dauer des Bestehens der Dienstbarkeit vereinbart ausgeschlossen. Für Regelungen, die der zwingenden gesetzlichen Verjährungsfrist unterliegen, wird eine Verjährungsfrist von 30 Jahren, beginnend ab dem Tag der Vertragsunterzeichnung, vereinbart.

Der Eigentümer verpflichtet sich bei Weiterveräußerung des betroffenen Grundstücks, diese Regelungen an den Rechtsnachfolger weiterzugeben. Die Berechtigte stimmt bereits jetzt dem Eintritt eines jeden Rechtsnachfolgers in diese Vereinbarung zu.`,
  },
  {
    id: "lp9",
    titel: "§ 9 Salvatorische Klausel",
    text: `Sollten einzelne Bestimmungen dieses Vertrages ganz oder teilweise unwirksam oder undurchführbar sein oder werden, so bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. Entsprechendes gilt für den Fall einer Vertragslücke.`,
  },
  {
    id: "lp10",
    titel: "§ 10 Zusatzvereinbarungen",
    text: `{ZUSATZVEREINBARUNGEN}`,
  },
];

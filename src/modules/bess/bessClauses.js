// ============================================================
// BESS – Vertragsklauseln (Flächennutzungsvertrag)
// Basis: Enerpeak BESS-Vorlage (13 §§ + 5 Anlagen)
// Angepasst für Elite PV GmbH
// ============================================================

export const BESS_KLAUSELN = [
  {
    id: "bess0",
    titel: "Präambel",
    text: `Der Grundstückseigentümer ist Eigentümer des unter § 1 Abs. 1 näher bezeichneten Grundstücks.

Der Grundstücksnutzer beabsichtigt auf dem unter § 1 Abs. 1 näher bezeichneten Grundstück ein oder mehrere Batterie-Energiespeichersysteme oder Energiewandlersysteme wie z.B. Elektrolyseure einschließlich der hierzu erforderlichen Zuwegungen, Anschlussleitungen, Wechselrichter, Transformatoren und sonstigen Nebenanlagen (nachfolgend: „BESS") zu errichten, zu erhalten, zu betreiben und – soweit aus Sicht des Grundstücknutzers sinnvoll – ganz oder in Teilen zu ersetzen.

Nach Maßgabe der folgenden Bestimmungen gestattet der Grundstückseigentümer dem Grundstücksnutzer die Nutzung einer in § 1 Abs. 2 näher spezifizierten Teilfläche des unter § 1 Abs. 1 bezeichneten Grundstückes zu diesem Zweck.`,
  },
  {
    id: "bess1",
    titel: "§ 1 Vertragsgegenstand",
    text: `1.1. Der Grundstückseigentümer ist {EIGENTUEMER_TYP} der folgenden Grundstücke:

{GRUNDBUCH_TABELLE}

Größe des Grundstücks: {GRUNDSTUECK_GROESSE}
(die Festlegung der endgültigen BESS-Flächen erfolgt gem. Abs. 3 im Rahmen einer Nachtragsvereinbarung in einer neuen Anlage 1)

1.2. Der Grundstücksnutzer plant die Errichtung, den Betrieb, die Wartung und Instandsetzung des BESS auf Teilflächen des Grundstücks zum vorübergehenden Zweck. Hierfür überlässt der Grundstückseigentümer dem Grundstücksnutzer Teilflächen aus dem oben benannten Grundstück (nachfolgend: „BESS-Fläche"), zur alleinigen Nutzung nach Maßgabe dieses Vertrags.

1.3. Anlage 1 mit dem Lageplan zeigt den gegenwärtigen Planungsstand des BESS zum Zeitpunkt Vertragsunterzeichnung. Der endgültige Lageplan wird im Rahmen der Inbetriebnahme des BESS erstellt und als neue Anlage 1 dem Vertrag beigefügt.

1.4. Der Grundstückseigentümer kann eine katasterliche Vermessung der endgültigen BESS-Fläche im Rahmen der Inbetriebnahme verlangen. Die hierfür anfallenden Kosten tragen die Parteien jeweils zur Hälfte.

1.5. Dem Flächennutzungsvertrag ist ein Grundbuchauszug beigefügt (Anlage 2). Der Grundstückseigentümer erteilt dem Grundstücksnutzer darüber hinaus Vollmacht zur Einholung aktueller Grundbuchauszüge hinsichtlich des Grundstücks gem. Abs. 1 (Anlage 3).`,
  },
  {
    id: "bess2",
    titel: "§ 2 Nutzungsumfang, Eigentum",
    text: `2.1. Der Grundstückseigentümer gestattet dem Grundstücksnutzer auf der BESS-Fläche die Errichtung, den Betrieb, die Wartung und Instandsetzung des BESS unter Beachtung der technischen Vorschriften, der baulichen Auflagen sowie der gesetzlichen Vorgaben. Hierunter fällt ausdrücklich auch die Berechtigung des Grundstücksnutzers, auf der BESS-Fläche Batteriecontainer, Elektrolyseure, Trafo- und/oder Übergabestationen zu errichten und die erforderlichen Fundamente, Zuwege und Zaunanlagen zu erstellen. Soweit zum Anschluss des BESS an das Netz der allgemeinen Versorgung (nachfolgend: „Netz") erforderlich, ist der Grundstücksnutzer berechtigt, die erforderlichen Leitungen und Kabel unterirdisch zu verlegen.

2.2. Das BESS bleibt Eigentum des Grundstücksnutzers. Das BESS wird nur zu einem vorübergehenden Zweck im Sinne von § 95 Abs. 1 Satz 1 BGB als Scheinbestandteil mit der BESS-Fläche verbunden.

2.3. Alle mit dem Eigentum am Grundstück zusammenhängenden öffentlichen Abgaben und Lasten trägt weiterhin der Grundstückseigentümer. Sollte es aufgrund der Errichtung und des Betriebs des BESS zu einer Neubewertung der Grundsteuer kommen, trägt der Grundstücksnutzer die hierdurch verursachten, nachgewiesenen Mehrabgaben.

2.4. Der Grundstückseigentümer erklärt im Sinne eines selbstständigen Garantieversprechens, dass er alleiniger Grundeigentümer des Grundstücks ist, keine vertraglichen Nutzungsrechte Dritter am Grundstück bestehen und auch keine dinglichen Rechte am Grundstück in Abt. II des Grundbuchs bestehen, die der Ausübung der Rechte des Grundstücksnutzers entgegenstehen.`,
  },
  {
    id: "bess3",
    titel: "§ 3 Rechte und Pflichten der Parteien",
    text: `3.1. Der Grundstückseigentümer übernimmt keinerlei Gewähr dafür, dass die BESS-Fläche zur Errichtung und Betrieb des BESS geeignet ist.

3.2. Der Grundstücksnutzer ist allein verpflichtet, die bauliche Eignung der BESS-Flächen auf eigene Kosten zu prüfen (z.B. statische Prüfung, Bodengutachten) und alle baurechtlichen und sonst erforderlichen Genehmigungen selbst beizubringen.

3.3. Der Grundstückseigentümer ist verpflichtet, alle Vollmachten zu erteilen und sonstige Mitwirkungshandlungen vorzunehmen, welche für die Realisierung des BESS erforderlich sind.

3.4. Der Grundstücksnutzer ist berechtigt, einzelne Anlagenteile des BESS nach eigenem wirtschaftlichem und technischem Ermessen stillzulegen, zu ändern, zu erneuern und/oder zu entfernen. Er versichert, für das BESS ausschließlich Komponenten zu verwenden, die nach den aktuell gültigen IEC-Normen zertifiziert sind und keine Schadstoffe ins Erdreich eintragen können. Der Grundstücksnutzer hat dafür zu sorgen, dass von dem BESS keine Gefahren für Personen oder Sachen ausgehen.

3.5. Der Grundstückseigentümer ist verpflichtet, den Grundstücksnutzer über Entwässerungsleitungen, Wasser-Bodenverbände und sonstige Leitungen auf der BESS-Fläche zu informieren. Der Grundstücksnutzer ist verpflichtet, Drainagen zu schützen und nach Rückbau fachgerecht wiederherzustellen.

3.6. Dem Grundstücksnutzer steht es frei, Dritte („Beauftragte und Erfüllungsgehilfen") mit Arbeiten zu beauftragen und die Betreiberstellung auf Dritte („Drittbetreiber") zu übertragen.

3.7. Der Grundstücksnutzer und Drittbetreiber sind befugt, die BESS-Fläche jederzeit mit Fahrzeugen aller Art zu betreten und zu befahren.

3.8. Dem Grundstücksnutzer obliegen die Verkehrssicherungspflichten sowie die Grünpflege hinsichtlich der BESS-Fläche.

3.9. Der Grundstückseigentümer erklärt sein Einverständnis, dass Drohnen-/Copter-Aufnahmen der BESS-Fläche erstellt und für Betriebs- und Referenzzwecke genutzt werden dürfen.

3.10. Dem Grundstückseigentümer ist bekannt, dass das BESS ganz oder teilweise finanziert wird. Der Grundstückseigentümer verzichtet auf das ihm nach §§ 562 ff. BGB zustehende Vermieterpfandrecht am BESS.`,
  },
  {
    id: "bess4",
    titel: "§ 4 Bereitstellung und Übergabe der BESS-Fläche, Bodengutachten",
    text: `4.1. Die Übergabe des Besitzes an der BESS-Fläche an den Grundstücksnutzer erfolgt zum Bereitstellungstermin. Der Grundstücksnutzer wird dem Grundstückseigentümer den Bereitstellungstermin mit einer Frist von mindestens acht (8) Wochen schriftlich anzeigen.

4.2. Vor dem Bereitstellungstermin ist ein von beiden Parteien zu unterzeichnendes Protokoll anzufertigen, in welchem der Zustand der BESS-Fläche festgestellt wird.

4.3. Der Grundstücksnutzer hat vor dem Bereitstellungstermin Bodenproben von der gesamten BESS-Fläche zu nehmen und auf Schadstoffbelastungen untersuchen zu lassen. Das Ergebnis ist dem Grundstückseigentümer unter Überlassung des Originals vorzulegen.`,
  },
  {
    id: "bess5",
    titel: "§ 5 Nutzungsentgelt",
    text: `5.1. Der Grundstücksnutzer ist verpflichtet, ab Bereitstellung der BESS-Fläche und bis zum Vertragsende an den Grundstückseigentümer ein jährliches Nutzungsentgelt zu zahlen.

5.2. Das Nutzungsentgelt beträgt {SATZ_PRO_M2} €/m² der BESS-Fläche zuzügl. der gesetzlichen Umsatzsteuer, soweit diese anfällt. Ab dem 11. vollen Betriebsjahr nach Inbetriebnahme erhöht sich das Nutzungsentgelt pro m² einmalig um +{WERTSICHERUNG}% zuzügl. der gesetzlicher Umsatzsteuer, soweit diese anfällt.

5.3. Im Zeitraum ab Bereitstellung des Grundstücks bis zur Inbetriebnahme des BESS beträgt das Nutzungsentgelt {VORHALTE_PROZENT}% des Nutzungsentgelts ab Inbetriebnahme des BESS (Vorhaltevergütung).

5.4. Die Inbetriebnahme des BESS ist dem Grundstückseigentümer unverzüglich schriftlich mitzuteilen. Maßgeblich für den Zeitpunkt der Inbetriebnahme ist die Aufnahme des kommerziellen Betriebs nach vollständiger Errichtung des BESS und Abschluss des Probebetriebs.

5.5. Das Nutzungsentgelt ist jeweils zum 30.06. des laufenden Kalenderjahres zur Zahlung fällig.

5.6. Alle Zahlungen erfolgen auf das nachfolgend benannte Konto:
IBAN: {EIGENTUEMER_IBAN}
BIC: {EIGENTUEMER_BIC}`,
  },
  {
    id: "bess6",
    titel: "§ 6 Inkrafttreten, Vertragslaufzeit, Kündigung",
    text: `6.1. Dieser Vertrag tritt mit dem Tag der beidseitigen Unterzeichnung in Kraft. Er läuft bis zum Ende des Kalenderjahres, in dem die Inbetriebnahme des BESS erfolgt, zuzüglich weiterer {LAUFZEIT_JAHRE} Kalenderjahre (nachfolgend: „Festlaufzeit").

6.2. Dem Grundstücksnutzer steht das Recht zu, die Festlaufzeit zweimal um jeweils weitere fünf (5) Jahre zu verlängern (nachfolgend „Verlängerungsoption"). Das Nutzungsentgelt erhöht sich im Falle der Ausübung der ersten Verlängerungsoption um weitere {WERTSICHERUNG}%.

6.3. Während der Festlaufzeit ist die ordentliche Kündigung ausgeschlossen. Ein zur außerordentlichen Kündigung berechtigender wichtiger Grund liegt insbesondere vor:

a) für den Grundstückseigentümer: wenn der Grundstücksnutzer mit der Entrichtung des Nutzungsentgelts länger als drei (3) Monate in Verzug ist und trotz zweimaliger schriftlicher Mahnung nicht gezahlt hat;

b) für den Grundstücksnutzer: wenn eine erforderliche Genehmigung aufgehoben oder widerrufen wird, oder wenn das BESS beschädigt oder zerstört wird und eine Wiederherstellung wirtschaftlich unzumutbar ist;

c) für beide Parteien: bei negativer Creditreform-Auskunft, Zwangsvollstreckung oder Insolvenz der anderen Partei.

6.4. Sonderkündigungsrecht: Beide Parteien können außerordentlich mit 12 Monaten Frist kündigen, wenn die Errichtung des BESS nicht fristgerecht begonnen wurde oder die Netzanschlussbedingungen einem wirtschaftlichen Betrieb entgegenstehen.

6.5. Kündigungserklärungen bedürfen der Schriftform und sind mittels Einschreiben mit Rückschein zuzustellen.`,
  },
  {
    id: "bess7",
    titel: "§ 7 Haftung, Haftpflichtversicherung",
    text: `7.1. Die Parteien haften – unabhängig vom Rechtsgrund – für Schäden nur bei Vorsatz oder grober Fahrlässigkeit unbegrenzt, bei Verletzung wesentlicher Vertragspflichten begrenzt auf vorhersehbare, vertragstypische Schäden.

7.2. Die geschädigte Partei hat einen Schaden unverzüglich mitzuteilen.

7.3. Der Grundstücksnutzer verpflichtet sich, den Grundstückseigentümer von Ansprüchen Dritter freizustellen, soweit diese aus einer Pflichtverletzung des Grundstücksnutzers resultieren.

7.4. Der Grundstücksnutzer hat vor Baubeginn eine Haftpflichtversicherung abzuschließen und aufrechtzuerhalten mit einer Mindestdeckungssumme von 5.000.000 EUR (Personen- und Sachschäden, max. drei Schadensfälle pro Jahr). Die Deckungszusage ist auf Verlangen nachzuweisen.

7.5. Sollte das BESS durch einen Dritten beschädigt werden und der Grundstückseigentümer einen Schadensersatzanspruch haben, tritt er diesen an den Grundstücksnutzer ab.

7.6. Der Grundstücksnutzer haftet nicht für Altlasten nach BBodSchG. Der Grundstückseigentümer sichert zu, dass ihm keine Altlasten bekannt sind.`,
  },
  {
    id: "bess8",
    titel: "§ 8 Rechtsnachfolge, Übertragung von Rechten und Pflichten",
    text: `8.1. Der Grundstücksnutzer ist berechtigt, den Flächennutzungsvertrag auf Dritte zu übertragen. Die Übertragung ist dem Grundstückseigentümer schriftlich mitzuteilen und wird wirksam, wenn dieser nicht innerhalb von zwei (2) Wochen widerspricht.

8.2. Eine Verweigerung der Übertragung ist ausgeschlossen bei verbundenen Unternehmen (§§ 15 ff. AktG) oder bei Übernahme durch die finanzierende Bank.

8.3. Der Grundstückseigentümer ist verpflichtet, den Grundstücksnutzer über jede Veräußerung der BESS-Fläche schriftlich zu informieren.

8.4. Bei Veräußerung ist folgende Klausel in den Kaufvertrag aufzunehmen:
„Der Käufer tritt in alle Verpflichtungen ein, die sich aufgrund der eingetragenen Dienstbarkeiten und Vormerkungen sowie aus dem Flächennutzungsvertrag vom {VERTRAGSDATUM} dem jeweiligen Berechtigten gegenüber ergeben."

8.5. Mit Übergang des Eigentums tritt der Käufer in die Rechtsposition des Grundstückseigentümers ein.`,
  },
  {
    id: "bess9",
    titel: "§ 9 Rückbau, Rückbau-Bürgschaft",
    text: `9.1. Der Grundstücksnutzer ist verpflichtet, nach Ablauf der Festlaufzeit das BESS innerhalb von sechs Monaten auf eigene Kosten abzubauen und den ursprünglichen Zustand der BESS-Fläche wiederherzustellen (Rückbau- und Wiederherstellungspflicht). Eine Wiederherstellung der Bodenfruchtbarkeit ist von der Rückbaupflicht ausgenommen.

9.2. Die Rückbaupflicht besteht nicht, soweit Gesetze, Vorschriften oder behördliche Anordnungen dem entgegenstehen.

9.3. Die Rückbaupflicht besteht nicht, solange die finanzierende Bank aufgrund beschränkt persönlicher Dienstbarkeiten berechtigt ist, die BESS-Fläche zu nutzen.

9.4. Kommt der Grundstücksnutzer der Rückbaupflicht nicht nach, hat der Grundstückseigentümer das Recht, das BESS auf Kosten des Grundstücksnutzers zu entfernen.

9.5. Der Grundstücksnutzer verpflichtet sich, vor Bereitstellung der BESS-Fläche eine auf erstes Anfordern fällige, selbstschuldnerische Bankbürgschaft eines europäischen Bankinstituts vorzulegen. Die Bürgschaftshöhe bemisst sich nach Branchenüblichkeit für vergleichbare BESS. Geschätzte Rückbausicherheit: {RUECKBAU_BETRAG} EUR.

9.6. Die Höhe der Bürgschaft soll nach Ablauf des elften vollen Betriebsjahres durch einen unabhängigen Sachverständigen überprüft werden.`,
  },
  {
    id: "bess10",
    titel: "§ 10 Dingliche Rechte",
    text: `10.1. Die Rechte des Grundstücksnutzers werden durch beschränkt persönliche Dienstbarkeiten desselben Ranges lastend auf dem Grundstück dinglich gesichert. Das Muster einer Bestellungsurkunde ist als Anlage 4 beigefügt.

10.2. Die Eintragungen müssen im Rang vor allen anderen in Abt. II und III des Grundbuchs eingetragenen Rechten Dritter erfolgen.

10.3. Soweit störende oder wertmindernde vorrangige Rechte eingetragen sind, wird der Grundstückseigentümer alle erforderlichen Erklärungen abgeben.

10.4. Der Grundstückseigentümer verpflichtet sich, der finanzierenden Bank sowie einem noch zu benennenden Dritten mit unmittelbarer Drittwirkung das Eintrittsrecht in den Vertrag einzuräumen (Anlage 5).

10.5. Nach Beendigung der Festlaufzeit werden die Grundbucheintragungen auf Veranlassung des Grundstücksnutzers zur Löschung gebracht.

10.6. Der Grundstücksnutzer trägt die Kosten der Eintragung und Löschung.`,
  },
  {
    id: "bess11",
    titel: "§ 11 Sicherungsübereignung",
    text: `11.1. Dem Grundstückseigentümer ist bekannt, dass das BESS an eine finanzierende Bank sicherungsübereignet werden kann. Sämtliche Ansprüche aus diesem Vertrag werden an die finanzierende Bank sicherungshalber abgetreten.

11.2. Die finanzierende Bank sowie ein Wechsel der finanzierenden Bank sind dem Grundstückseigentümer schriftlich mitzuteilen.

11.3. Der Grundstückseigentümer ist damit einverstanden, dass die finanzierende Bank im Verwertungsfall das BESS selbst weiterbetreibt oder an einen neuen Grundstücksnutzer veräußert.

11.4. Die Vertragsparteien werden keine Vereinbarungen treffen, die das Sicherungsinteresse der finanzierenden Bank beeinträchtigen. Grundbuchrechtliche Dienstbarkeiten und Vormerkungen dürfen nicht ohne Zustimmung der Bank geändert oder gelöscht werden.`,
  },
  {
    id: "bess12",
    titel: "§ 12 Gerichtsstand, Rechtswahl",
    text: `12.1. Ausschließlicher Gerichtsstand für alle Streitigkeiten im Zusammenhang mit dem Flächennutzungsvertrag ist der Belegenheitsort der BESS-Fläche, sofern nicht zwingend ein davon abweichender gesetzlicher Gerichtsstand besteht.

12.2. Für den Flächennutzungsvertrag gilt das Recht der Bundesrepublik Deutschland unter Ausschluss der international-privatrechtlichen Kollisionsnormen sowie unter Ausschluss des UN-Kaufrechts.`,
  },
  {
    id: "bess13",
    titel: "§ 13 Schlussbestimmungen",
    text: `13.1. Die nachfolgend aufgeführten Anlagen sind wesentliche Bestandteile dieses Flächennutzungsvertrages:

Anlage 1 – Vorläufiger Lageplan (ggfs. durch Nachtragsvereinbarung zu ersetzen)
Anlage 2 – Grundbuchauszug
Anlage 3 – Vollmacht Einholung Grundbuchauszug
Anlage 4 – Muster Bestellungsurkunde Dienstbarkeit
Anlage 5 – Muster Bestellung Vormerkung

13.2. Alle Vereinbarungen sind in diesem Vertrag schriftlich niedergelegt. Mündliche Nebenabreden bestehen nicht.

13.3. Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.

13.4. Sollten einzelne Bestimmungen dieses Vertrages rechtsunwirksam sein oder werden, so soll hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt werden. Die Vertragsparteien haben sich vielmehr so zu verhalten, dass der angestrebte Zweck erreicht wird.`,
  },
];

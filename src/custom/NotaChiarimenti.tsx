// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("NotaChiarimenti");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("NotaChiarimenti");
import { useState } from "react";
import { Badge, Button, Dialog, TextArea, useTable } from "../floware";

export default function NotaChiarimenti(props) {__mk();
  const table = useTable(props.pageId);
  const [aperta, setAperta] = useState(false);
  const [testo, setTesto] = useState("");
  const [copia, setCopia] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  if (!table || !table.rows[props.rowIndex]) return <span>{props.value}</span>;
  const necessarie = ["Comune", "Ambito", "Motivo", "Destinatario", "Data ispezione", "Sintesi richiesta", "Stato bozza", "Nota"];
  const disponibile = necessarie.every((nome) => (__mk(), table.column(nome) >= 0));
  const leggi = (nome) => (__mk(), table.value(props.rowIndex, nome));
  const genera = () => {__mk();
    const comune = leggi("Comune");
    const destinatario = leggi("Destinatario");
    const intestazione = destinatario.toLowerCase().includes("funzionario") ? "Al " + destinatario : "Al Sindaco del Comune di " + comune;
    return intestazione + "\n\nOggetto: richiesta di chiarimenti — " + comune + " — " + leggi("Ambito") + "\n\nCon riferimento all’ispezione del " + leggi("Data ispezione") + " relativa al Comune di " + comune + ", ambito " + leggi("Ambito") + ", si richiedono chiarimenti per il seguente motivo:\n" + leggi("Motivo") + ".\n\nSintesi della richiesta:\n" + leggi("Sintesi richiesta") + ".\n\nSi chiede di fornire un riscontro e gli eventuali elementi utili a completare la verifica.\n\nDistinti saluti.\nUfficio ispezioni\n\nBozza dimostrativa — nessun invio automatico.";
  };
  const apri = () => {__mk();
    setTesto(leggi("Nota") || genera());
    setCopia(false);
    setMessaggio("");
    setAperta(true);
  };
  const salva = (verificata) => {__mk();
    table.setCell(props.rowIndex, "Nota", testo);
    table.setCell(props.rowIndex, "Stato bozza", verificata ? "Verificata" : "Da verificare");
    setMessaggio(verificata ? "Nota salvata e bozza verificata. Nessun invio effettuato." : "Nota salvata in memoria, da verificare.");
  };
  const modifica = (valore) => {__mk();
    setTesto(valore);
    setCopia(false);
    setMessaggio("Modifiche da salvare e verificare.");
    if (leggi("Stato bozza") === "Verificata") table.setCell(props.rowIndex, "Stato bozza", "Da verificare");
  };
  return <div className="space-y-2">
    <span>{props.value}</span>
    {disponibile ? <div><Button variant="secondary" onClick={apri}>{leggi("Nota") ? "Apri nota" : "Crea nota"}</Button></div> : <p className="text-sm text-(--mk-muted)">Colonne necessarie alla nota non disponibili.</p>}
    {aperta && <Dialog title="Nota di richiesta chiarimenti" onClose={() => (__mk(), setAperta(false))} footer={<Button variant="secondary" onClick={() => (__mk(), setAperta(false))}>Chiudi</Button>}>
      <div className="space-y-4">
        <Badge tone="neutral">{leggi("Stato bozza")}</Badge>
        <p className="text-sm text-(--mk-muted)">Dati dimostrativi. Salvataggio solo in memoria; nessun invio automatico. Chiudendo senza salvare, le modifiche al testo vengono perse.</p>
        <TextArea label="Testo della nota" value={testo} onChange={modifica} rows={16} />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={!testo.trim()} onClick={() => (__mk(), salva(false))}>Salva bozza</Button>
          <Button disabled={!testo.trim()} onClick={() => (__mk(), salva(true))}>Segna come verificata</Button>
          <Button variant="secondary" disabled={!testo.trim()} onClick={() => (__mk(), setCopia(true))}>Copia nota</Button>
        </div>
        {copia && <div className="space-y-2"><p>Seleziona il testo nel campo seguente e usa il comando Copia del dispositivo. La copia non è automatica e non salva la bozza.</p><TextArea label="Testo da copiare manualmente" value={testo} onChange={modifica} rows={12} /></div>}
        <p aria-live="polite">{messaggio}</p>
      </div>
    </Dialog>}
  </div>;
}

// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("FiltriRegistroIspezioni");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("FiltriRegistroIspezioni");
import { useState } from "react";
import { Badge, Button, Card, Select, usePrototype, useTable } from "../floware";

export default function FiltriRegistroIspezioni(props) {__mk();
  const table = useTable(props.pageId);
  const { openDetail } = usePrototype();
  const [comune, setComune] = useState("Tutti");
  const [funzionario, setFunzionario] = useState("Tutti");
  const [stato, setStato] = useState("Tutti");
  const [criticita, setCriticita] = useState("Tutte");
  const [svolgimento, setSvolgimento] = useState("Tutte");
  if (!table) return null;
  const richieste = ["Comune", "Funzionario", "Stato", "Criticità"];
  if (richieste.some((nome) => (__mk(), table.column(nome) < 0))) return <Card title="Filtri ispezioni"><p>Per usare i filtri servono le colonne Comune, Funzionario, Stato e Criticità.</p></Card>;
  const opzioni = (nome, tutte) => (__mk(), [tutte, ...new Set(table.rows.map((riga) => (__mk(), table.value(riga, nome))))]);
  const base = table.rows.map((riga, indice) => ((__mk(), { riga, indice }))).filter(({ riga }) =>
    (__mk(), (comune === "Tutti" || table.value(riga, "Comune") === comune) &&
    (funzionario === "Tutti" || table.value(riga, "Funzionario") === funzionario) &&
    (stato === "Tutti" || table.value(riga, "Stato") === stato) &&
    (criticita === "Tutte" || table.value(riga, "Criticità") === criticita))
  );
  const svolte = base.filter(({ riga }) => (__mk(), table.value(riga, "Stato") === "Conclusa")).length;
  const risultati = base.filter(({ riga }) => (__mk(), svolgimento === "Tutte" || (svolgimento === "Svolte" ? table.value(riga, "Stato") === "Conclusa" : table.value(riga, "Stato") !== "Conclusa")));
  const reset = () => {__mk();
    setComune("Tutti");
    setFunzionario("Tutti");
    setStato("Tutti");
    setCriticita("Tutte");
    setSvolgimento("Tutte");
  };
  return <Card title="Filtra le ispezioni">
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Comune" value={comune} options={opzioni("Comune", "Tutti")} onChange={setComune} />
        <Select label="Funzionario" value={funzionario} options={opzioni("Funzionario", "Tutti")} onChange={setFunzionario} />
        <Select label="Stato" value={stato} options={opzioni("Stato", "Tutti")} onChange={setStato} />
        <Select label="Criticità" value={criticita} options={opzioni("Criticità", "Tutte")} onChange={setCriticita} />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <Select label="Svolgimento" value={svolgimento} options={["Tutte", "Svolte", "Da svolgere"]} onChange={setSvolgimento} />
        <Button variant="secondary" onClick={reset}>Azzera filtri</Button>
      </div>
      <p className="text-sm text-(--mk-muted)">Svolte: Stato «Conclusa». Da svolgere: tutti gli altri stati, inclusi «Programmata» e «Scaduta».</p>
      <div className="flex flex-wrap gap-2">
        <Badge tone="primary">Svolte: {svolte}</Badge>
        <Badge tone="neutral">Da svolgere: {base.length - svolte}</Badge>
        <span className="text-sm text-(--mk-muted)">Conteggi relativi ai quattro filtri sulle colonne.</span>
      </div>
      <p aria-live="polite">Risultati: {risultati.length} su {table.rows.length}</p>
      {risultati.length === 0 ? <p>Nessuna ispezione corrisponde ai filtri selezionati.</p> : <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr>{table.columns.map((nome) => (__mk(), <th key={nome} className="border-b border-(--mk-border) p-2">{nome}</th>))}<th className="border-b border-(--mk-border) p-2">Svolgimento</th><th className="border-b border-(--mk-border) p-2">Dettaglio</th></tr></thead>
          <tbody>{risultati.map(({ riga, indice }) => (__mk(), <tr key={indice}>
            {table.columns.map((nome) => (__mk(), <td key={nome} className="border-b border-(--mk-divider) p-2">{table.value(riga, nome)}</td>))}
            <td className="border-b border-(--mk-divider) p-2"><Badge tone={table.value(riga, "Stato") === "Conclusa" ? "primary" : "neutral"}>{table.value(riga, "Stato") === "Conclusa" ? "Svolta" : "Da svolgere"}</Badge></td>
            <td className="border-b border-(--mk-divider) p-2"><Button variant="link" onClick={() => (__mk(), openDetail(props.pageId, indice))}>Apri</Button></td>
          </tr>))}</tbody>
        </table>
      </div>}
    </div>
  </Card>;
}

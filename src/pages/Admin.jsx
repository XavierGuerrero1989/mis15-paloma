import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase"; // <-- ajustá el path si tu firebase está en otro lado
import "./Admin.css";

/* ---------------- Helpers ---------------- */

function buildDietLabel(restricciones) {
  if (!restricciones) return "-";
  const tags = [];

  if (restricciones.vegetariano) tags.push("Vegetariano");
  if (restricciones.celiaco) tags.push("Celíaco");

  const otros = (restricciones.otros ?? "").toString().trim();
  if (otros) tags.push(otros);

  return tags.length ? tags.join(" • ") : "-";
}

function formatConfirmDate(ts) {
  if (!ts) return "-";
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "-";
  }
}

function computeStats(rows) {
  const total = rows.length;

  const asisten = rows.filter((r) => r.asiste === true).length;
  const noAsisten = rows.filter((r) => r.asiste === false).length;

  const totalPersonas = rows.reduce((acc, r) => acc + (Number(r.personas) || 0), 0);
  const totalPersonasAsisten = rows
    .filter((r) => r.asiste === true)
    .reduce((acc, r) => acc + (Number(r.personas) || 0), 0);

  const vegetarianos = rows.filter((r) => r.restricciones?.vegetariano === true).length;
  const celiacos = rows.filter((r) => r.restricciones?.celiaco === true).length;
  const otros = rows.filter((r) => (r.restricciones?.otros ?? "").toString().trim().length > 0).length;

  return { total, asisten, noAsisten, totalPersonas, totalPersonasAsisten, vegetarianos, celiacos, otros };
}

function Stat({ label, value }) {
  return (
    <div className="adminStat">
      <div className="adminStatValue">{value}</div>
      <div className="adminStatLabel">{label}</div>
    </div>
  );
}

/* ---------------- Component ---------------- */

export default function Admin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        // ✅ lee tu coleccion real: "rsvps"
        const q = query(collection(db, "rsvps"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        if (alive) setRows(data);
      } catch (e) {
        console.error(e);
        if (alive) setErr(e?.message || "Error cargando RSVPs");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => computeStats(rows), [rows]);

  return (
    <main className="adminPage">
      <section className="adminCard">
        <header className="adminHeader">
          <h1 className="adminTitle">Confirmaciones</h1>

          {/* ✅ Mini celdas */}
          <div className="adminStatsGrid">
            <Stat label="RSVPs" value={stats.total} />
            <Stat label="Asisten" value={stats.asisten} />
            <Stat label="No asisten" value={stats.noAsisten} />
            <Stat label="Personas (total)" value={stats.totalPersonas} />
            <Stat label="Personas (asisten)" value={stats.totalPersonasAsisten} />
            <Stat label="Vegetarianos" value={stats.vegetarianos} />
            <Stat label="Celíacos" value={stats.celiacos} />
            <Stat label="Otros" value={stats.otros} />
          </div>
        </header>

        {loading ? (
          <div className="adminEmpty">
            <p className="adminEmptyTitle">Cargando…</p>
            <p className="adminEmptyText">Leyendo RSVPs desde Firestore.</p>
          </div>
        ) : err ? (
          <div className="adminEmpty">
            <p className="adminEmptyTitle">No pude leer Firestore</p>
            <p className="adminEmptyText">{err}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="adminEmpty">
            <p className="adminEmptyTitle">Todavía no hay confirmaciones</p>
            <p className="adminEmptyText">Cuando alguien confirme, va a aparecer acá.</p>
          </div>
        ) : (
          <div className="adminTableWrap" role="region" aria-label="Tabla de confirmaciones">
            <table className="adminTable">
              <thead>
                <tr>
                  <th className="colName">Nombre</th>
                  <th className="colCenter">Asiste</th>
                  <th className="colCenter">Personas</th>
                  <th className="colCenter">Dieta / Restricciones</th>
                  <th className="colCenter">Tema sugerido</th>
                  <th className="colCenter">Confirmó</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => {
                  const tema = r.temaSugerido?.titulo
                    ? `${r.temaSugerido.titulo}${r.temaSugerido.autor ? " — " + r.temaSugerido.autor : ""}`
                    : "-";

                  const confirmo = formatConfirmDate(r.createdAt || r.updatedAt);

                  return (
                    <tr key={r.id}>
                      <td className="colName">{r.nombreCompleto || "-"}</td>
                      <td className="colCenter">{r.asiste ? "Sí" : "No"}</td>
                      <td className="colCenter">{r.personas ?? "-"}</td>
                      <td className="colCenter">{buildDietLabel(r.restricciones)}</td>
                      <td className="colCenter tdTema">{tema}</td>
                      <td className="colCenter">{confirmo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

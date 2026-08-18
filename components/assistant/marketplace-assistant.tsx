"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { getApiDetailBySlug, type ApiDetail } from "@/components/catalog/content/apis";

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type AssistantSession = {
  id: string;
  title: string;
  contextKey: string;
  messages: AssistantMessage[];
  lastUpdated: number;
};

type AssistantContext = {
  key: string;
  title: string;
  subtitle: string;
  prompt: string;
  suggestions: string[];
  api?: ApiDetail;
};

const STORAGE_KEY = "davivienda-marketplace-assistant-sessions";

function buildGeneralSuggestions() {
  return [
    "Que APIs estan disponibles?",
    "Como empiezo a integrar?",
    "Que API me sirve para tesoreria?",
    "Muestrame APIs de pagos",
  ];
}

function buildApiSuggestions(api: ApiDetail) {
  return [
    `Como me autentico en ${api.name}?`,
    `Cual es el primer endpoint de ${api.name}?`,
    `Muestrame un ejemplo de request de ${api.name}`,
    `Que errores comunes tiene ${api.name}?`,
  ];
}

function createAssistantGreeting(context: AssistantContext): AssistantMessage {
  const content = context.api
    ? `Estoy contextualizado en ${context.api.name}. Puedo ayudarte con autenticacion, endpoints, errores comunes, casos de uso y ejemplos tecnicos.`
    : "Puedo ayudarte a explorar el marketplace, comparar APIs y orientarte sobre el mejor punto de inicio para una integracion.";

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
  };
}

function createSession(context: AssistantContext): AssistantSession {
  return {
    id: crypto.randomUUID(),
    title: context.api ? context.api.name : "Consulta general",
    contextKey: context.key,
    messages: [createAssistantGreeting(context)],
    lastUpdated: Date.now(),
  };
}

function formatSessionTitle(message: string, fallback: string) {
  const trimmed = message.trim();
  if (!trimmed) {
    return fallback;
  }

  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed;
}

function getGeneralReply(question: string) {
  const lower = question.toLowerCase();

  if (lower.includes("tesorer")) {
    return "Si buscas visibilidad de liquidez, saldos y movimientos, la API Tesoreria es el mejor punto de partida dentro del marketplace actual.";
  }

  if (lower.includes("pag")) {
    return "Para pagos, las opciones mas cercanas en el catalogo actual son APIs orientadas a dispersion de fondos, notificacion de pagos y experiencias de cobro.";
  }

  if (lower.includes("integr") || lower.includes("empez")) {
    return "Lo recomendable es comenzar por explorar el catalogo, elegir la API segun el caso de uso, revisar autenticacion, probar en Sandbox y luego pasar a un flujo controlado de produccion.";
  }

  return "Puedo ayudarte a encontrar una API, entender para que sirve, comparar opciones o indicarte como iniciar una integracion dentro del portal.";
}

function getApiReply(question: string, api: ApiDetail) {
  const lower = question.toLowerCase();

  if (lower.includes("autent") || lower.includes("token") || lower.includes("credencial")) {
    return `${api.name} usa ${api.authentication.title.toLowerCase()}. Las cabeceras clave son ${api.authentication.headers.join(", ")}.`;
  }

  if (lower.includes("primer") || lower.includes("endpoint") || lower.includes("consumo")) {
    const firstEndpoint = api.endpoints[0];
    return firstEndpoint
      ? `El primer endpoint sugerido es ${firstEndpoint.method} ${firstEndpoint.path}. ${firstEndpoint.description}`
      : `Lo recomendable es comenzar validando el primer consumo en Sandbox para ${api.name}.`;
  }

  if (lower.includes("request") || lower.includes("ejemplo")) {
    return `Puedo orientarte con un ejemplo de consumo para ${api.name}. En la seccion tecnica ya tienes request y response de referencia listos para copiar.`;
  }

  if (lower.includes("error")) {
    return `Los errores mas importantes a revisar en ${api.name} son ${api.errors.map((error) => error.code).join(", ")}. Normalmente se relacionan con parametros, autorizacion o limites operativos.`;
  }

  if (lower.includes("caso") || lower.includes("uso")) {
    return `${api.name} esta pensada para ${api.useCases.join(" ")}`;
  }

  return `Puedo ayudarte con autenticacion, endpoints, errores, ejemplos y casos de uso de ${api.name}. Si quieres, puedes preguntarme algo mas especifico.`;
}

function buildReply(question: string, context: AssistantContext) {
  return context.api ? getApiReply(question, context.api) : getGeneralReply(question);
}

export function MarketplaceAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [panelView, setPanelView] = useState<"chat" | "history">("chat");
  const [sessions, setSessions] = useState<AssistantSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  const context = useMemo<AssistantContext>(() => {
    const slug = pathname?.startsWith("/catalogo-apis/") ? pathname.split("/")[2] : undefined;
    const api = slug ? getApiDetailBySlug(slug) : undefined;

    if (api) {
      return {
        key: api.slug,
        title: "Asistente de API",
        subtitle: `Contexto activo: ${api.name}`,
        prompt: `Tienes alguna consulta de ${api.name}?`,
        suggestions: buildApiSuggestions(api),
        api,
      };
    }

    return {
      key: "general",
      title: "Asistente del marketplace",
      subtitle: "Contexto general",
      prompt: "Tienes alguna consulta?",
      suggestions: buildGeneralSuggestions(),
    };
  }, [pathname]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        setHasHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored) as AssistantSession[];
      setSessions(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || sessions.length === 0) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [hasHydrated, sessions]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const matchingSession = sessions.find((session) => session.contextKey === context.key);

    if (matchingSession) {
      setActiveSessionId(matchingSession.id);
      return;
    }

    const newSession = createSession(context);
    setSessions((current) => [newSession, ...current].slice(0, 8));
    setActiveSessionId(newSession.id);
  }, [context, hasHydrated, sessions]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? null;

  function createNewConversation() {
    const newSession = createSession(context);
    setSessions((current) => [newSession, ...current].slice(0, 8));
    setActiveSessionId(newSession.id);
    setDraft("");
    setPanelView("chat");
  }

  function deleteSession(sessionId: string) {
    setSessions((current) => current.filter((session) => session.id !== sessionId));

    if (sessionId === activeSessionId) {
      setActiveSessionId(null);
    }
  }

  function appendUserQuestion(question: string) {
    if (!question.trim() || !activeSessionId) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question.trim(),
    };

    const assistantMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: buildReply(question, context),
    };

    setSessions((current) =>
      current.map((session) => {
        if (session.id !== activeSessionId) {
          return session;
        }

        return {
          ...session,
          title: formatSessionTitle(question, session.title),
          messages: [...session.messages, userMessage, assistantMessage],
          lastUpdated: Date.now(),
        };
      }),
    );
    setDraft("");
  }

  function handleSubmit() {
    appendUserQuestion(draft);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setPanelView("chat");
        }}
        className="fixed bottom-5 right-5 z-[70] inline-flex h-14 items-center gap-3 rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white shadow-[0_20px_44px_rgba(225,37,27,0.28)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E1111C] sm:bottom-7 sm:right-7"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/18 text-[13px]">Q&A</span>
        <span className="hidden sm:inline">Asistente</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] bg-transparent sm:bg-[#141F25]/10">
          <div className="flex h-full justify-end">
            <div className="flex h-[100dvh] w-full max-w-[520px] flex-col overflow-hidden border-l border-[#E7EAEE] bg-white/98 shadow-[-28px_0_80px_rgba(20,31,37,0.18)] backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-[#E7EAEE] px-5 py-4">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">{context.title}</p>
                  <h2 className="mt-1 text-[24px] font-bold tracking-[0.2px] text-[#202A31]">{context.prompt}</h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={createNewConversation}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#202A31] px-4 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-[#141F25]"
                    >
                      Nueva
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setPanelView("chat");
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-[#E3E7EC] px-4 text-[13px] font-medium text-[#404040] transition-colors duration-300 hover:bg-[#F6F8FA]"
                    >
                      Cerrar
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPanelView("history")}
                    className="rounded-full bg-[#F4F6F8] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7A8188] transition-colors duration-300 hover:bg-[#EEF1F4] hover:text-[#5F676E]"
                  >
                    Historial
                  </button>
                </div>
              </div>

              <section className="flex min-h-0 flex-1 flex-col bg-white">
                <div className="border-b border-[#E7EAEE] px-5 py-3">
                  <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Preguntas sugeridas</p>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {context.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => appendUserQuestion(suggestion)}
                        className="inline-flex shrink-0 items-center rounded-full border border-[#E3E7EC] bg-[#F6F8FA] px-3 py-1 text-[11px] font-medium text-[#4F575E] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CBD2D9] hover:bg-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {panelView === "chat" ? (
                  <>
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                      <div className="space-y-4">
                        {activeSession?.messages.map((message, index) => (
                          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`rounded-[24px] text-[15px] leading-7 shadow-[0_10px_24px_rgba(20,31,37,0.04)] ${
                                message.role === "user"
                                  ? "max-w-[92%] bg-[#202A31] px-5 py-4 text-white"
                                  : index === 0
                                    ? "max-w-[86%] border border-[#E7EAEE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-4 py-3 text-[#30383F]"
                                    : "max-w-[92%] border border-[#E7EAEE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FB_100%)] px-5 py-4 text-[#30383F]"
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#E7EAEE] px-5 py-4">
                      <div className="flex gap-3 rounded-[28px] border border-[#E3E7EC] bg-[#FBFCFD] p-3">
                        <textarea
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          placeholder={context.api ? `Pregunta sobre ${context.api.name}...` : "Escribe tu consulta..."}
                          className="min-h-[88px] flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-7 text-[#30383F] outline-none placeholder:text-[#8E8E8E]"
                        />
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="inline-flex h-12 items-center justify-center self-end rounded-full bg-[#E1251B] px-5 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-[#E1111C]"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#8E8E8E]">Historial completo</p>
                        <p className="mt-1 text-[14px] leading-6 text-[#6A7178]">Abra o elimine conversaciones guardadas.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPanelView("chat")}
                        className="rounded-full border border-[#E3E7EC] px-4 py-2 text-[12px] font-medium text-[#404040] transition-colors duration-300 hover:bg-[#F6F8FA]"
                      >
                        Volver al chat
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {sessions
                        .slice()
                        .sort((left, right) => right.lastUpdated - left.lastUpdated)
                        .map((session) => {
                          const isActive = session.id === activeSessionId;
                          const lastMessage = session.messages[session.messages.length - 1];

                          return (
                            <div
                              key={session.id}
                              className={`rounded-[22px] border px-4 py-4 ${
                                isActive
                                  ? "border-[#202A31] bg-white shadow-[0_14px_28px_rgba(20,31,37,0.08)]"
                                  : "border-[#E3E7EC] bg-[#FBFCFD]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveSessionId(session.id);
                                    setPanelView("chat");
                                  }}
                                  className="flex-1 text-left"
                                >
                                  <p className="text-[14px] font-medium text-[#202A31]">{session.title}</p>
                                  <p className="mt-2 text-[13px] leading-6 text-[#6A7178]">{lastMessage?.content}</p>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSession(session.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] text-[#8E8E8E] transition-colors duration-300 hover:bg-[#EEF1F4] hover:text-[#404040]"
                                  aria-label={`Eliminar conversacion ${session.title}`}
                                >
                                  x
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

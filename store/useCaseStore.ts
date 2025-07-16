import { create, StateCreator } from 'zustand';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Case {
  id: string;
  title: string;
  messages: Message[];
}

interface CaseStoreState {
  cases: Case[];
  pendingCaseId: string | null;
  currentCaseId: string | null;
  currentId: string | null; // 兼容旧组件
  setPendingCaseId: (id: string | null) => void;
  setCurrentCaseId: (id: string | null) => void;
  addCase: (payload: { id: string; title: string; messages: Message[] }) => void;
  appendMessage: (id: string, message: Message) => void;
  createEmptyCase: () => string;
  deleteCase: (id: string) => void;
  renameCase: (id: string, title: string) => void;
  cloneCase: (id: string) => string | null;
}

export const useCaseStore = create<CaseStoreState>((set, get) => ({
  cases: [],
  pendingCaseId: null,
  currentCaseId: null,
  currentId: null,

  setPendingCaseId: (id) => set({ pendingCaseId: id }),
  setCurrentCaseId: (id) => set({ currentCaseId: id, currentId: id }),

  addCase: ({ id, title, messages }) => {
    set((state) => ({
      cases: [...state.cases, { id, title, messages }],
    }));
  },

  appendMessage: (id, message) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === id ? { ...c, messages: [...c.messages, message] } : c
      ),
    }));
  },

  createEmptyCase: () => {
    const id = crypto.randomUUID();
    set({ pendingCaseId: id });
    return id;
  },

  deleteCase: (id) => {
    set((state) => {
      const newCases = state.cases.filter((c) => c.id !== id);
      const nextId =
        state.currentCaseId === id
          ? (() => {
              const idx = state.cases.findIndex((c) => c.id === id);
              const next = state.cases[idx + 1] || state.cases[idx - 1];
              return next ? next.id : null;
            })()
          : state.currentCaseId;
      return {
        cases: newCases,
        currentCaseId: nextId,
        currentId: nextId,
      };
    });
  },

  renameCase: (id, title) => {
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, title } : c)),
    }));
  },

  cloneCase: (id) => {
    const orig = get().cases.find((c) => c.id === id);
    if (!orig) return null;
    const newId = crypto.randomUUID();
    const newCase = {
      ...orig,
      id: newId,
      title: orig.title + ' (副本)',
      messages: JSON.parse(JSON.stringify(orig.messages)),
    };
    set((state) => ({ cases: [...state.cases, newCase] }));
    set({ currentCaseId: newId, currentId: newId });
    return newId;
  },
})); 
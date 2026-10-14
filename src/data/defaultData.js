export const MUSCLE_GROUPS = [
  { id: 'todos', name: 'Todos' },
  { id: 'pernas', name: 'Pernas' },
  { id: 'peito', name: 'Peito' },
  { id: 'costas', name: 'Costas' },
  { id: 'ombros', name: 'Ombros' },
  { id: 'biceps', name: 'Bíceps' },
  { id: 'triceps', name: 'Tríceps' },
  { id: 'abdomen', name: 'Abdômen' },
  { id: 'corrida', name: 'Corrida' },
];

export const DEFAULT_EXERCISES = [
  // --- TREINO A: MEMBROS INFERIORES + ABS ---
  {
    id: 'ex-agachamento-corpo',
    name: 'Agachamento c/ Peso do Corpo (Aquecimento)',
    muscle: 'pernas',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 0,
    restSeconds: 45,
    notes: 'Bloco 01 - Aquecimento. Flexibilidade e mobilidade de membros inferiores antes da carga.'
  },
  {
    id: 'ex-agachamento-livre',
    name: 'Agachamento Livre',
    muscle: 'pernas',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 40,
    restSeconds: 60,
    notes: 'Bloco 02 - Meta de Repetição. Amplitude completa, joelhos alinhados com a ponta dos pés.'
  },
  {
    id: 'ex-leg-press-45',
    name: 'Leg Press 45º',
    muscle: 'pernas',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 120,
    restSeconds: 45,
    notes: 'Bloco 03 - Meta de Repetição. Não hiperestenda ou trave os joelhos no final.'
  },
  {
    id: 'ex-cadeira-extensora',
    name: 'Cadeira Extensora',
    muscle: 'pernas',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 35,
    restSeconds: 45,
    notes: 'Bloco 04 - Meta de Repetição. Pausa de 1s no pico de contração do quadríceps.'
  },
  {
    id: 'ex-terra-deadlift',
    name: 'Levantamento Terra (Deadlift)',
    muscle: 'pernas',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15 - 12 - 10 - 8 (Pirâmide)',
    weight: 60,
    restSeconds: 120,
    notes: 'Bloco 05 - Pirâmide crescente de carga (15-12-10-8). Coluna neutra e abdômen travado.'
  },
  {
    id: 'ex-abdutora-panturrilha',
    name: 'Cadeira Abdutora + Panturrilha em Pé (Bi-Set)',
    muscle: 'pernas',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15 + 15',
    weight: 40,
    restSeconds: 45,
    notes: 'Bloco 06 - Bi-Set: Faça 15 reps na cadeira abdutora e vá direto para 15 reps de panturrilha em pé sem descanso.'
  },
  {
    id: 'ex-abdominal-tabata',
    name: 'Abdominal (Sequência Tabata)',
    muscle: 'abdomen',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80',
    sets: 2,
    reps: '2x Rodadas Tabata (20s on / 10s off)',
    weight: 0,
    restSeconds: 180,
    notes: 'Bloco 07 - Protocolo Tabata: 8 ciclos de 20s de esforço máximo por 10s de descanso.'
  },

  // --- TREINO B & D: PEITO, OMBRO E BÍCEPS ---
  {
    id: 'ex-supino-reto-halteres',
    name: 'Supino Reto c/ Halteres',
    muscle: 'peito',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15 - 12 - 10 - 8 (Pirâmide)',
    weight: 18,
    restSeconds: 120,
    notes: 'Bloco 02 - Pirâmide crescente de cargas. Escápulas aduzidas no banco.'
  },
  {
    id: 'ex-supino-inclinado-halteres',
    name: 'Supino Inclinado c/ Halteres',
    muscle: 'peito',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 16,
    restSeconds: 90,
    notes: 'Bloco 03 - Meta de Repetições. Banco inclinado a 30°-45° para foco peitoral superior.'
  },
  {
    id: 'ex-voador-crossover',
    name: 'Voador / Crossover Polia Alta',
    muscle: 'peito',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 15,
    restSeconds: 90,
    notes: 'Bloco 04 - Meta de Repetições. Cotovelos firmes e contração isométrica no centro.'
  },
  {
    id: 'ex-elevacao-frontal',
    name: 'Elevação Frontal c/ Halteres',
    muscle: 'ombros',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 8,
    restSeconds: 90,
    notes: 'Bloco 05 - Meta de Repetições. Elevação até a altura dos olhos sem impulsos corporais.'
  },
  {
    id: 'ex-elevacao-lateral',
    name: 'Elevação Lateral c/ Halteres',
    muscle: 'ombros',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 8,
    restSeconds: 90,
    notes: 'Bloco 06 - Meta de Repetições. Trapézio relaxado, movimento guiado pelos cotovelos.'
  },
  {
    id: 'ex-rosca-biceps-w',
    name: 'Rosca Bíceps Barra W',
    muscle: 'biceps',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 20,
    restSeconds: 90,
    notes: 'Bloco 07 - Meta de Repetições. Cotovelos colados ao lado do corpo, sem balançar o tronco.'
  },
  {
    id: 'ex-biceps-concentrado',
    name: 'Bíceps Concentrado',
    muscle: 'biceps',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 10,
    restSeconds: 90,
    notes: 'Bloco 08 - Meta de Repetições. Apoio na face interna da coxa, foco total no pico do bíceps.'
  },

  // --- TREINO C: COSTAS E TRÍCEPS ---
  {
    id: 'ex-puxada-alta',
    name: 'Puxada Alta (Polia ou Máquina)',
    muscle: 'costas',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 45,
    restSeconds: 120,
    notes: 'Bloco 02 - Meta de Repetições. Puxe puxando os cotovelos para baixo e peito estufado.'
  },
  {
    id: 'ex-remada-baixa',
    name: 'Remada Baixa',
    muscle: 'costas',
    imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 40,
    restSeconds: 90,
    notes: 'Bloco 03 - Meta de Repetições. Ombros para trás na fase concêntrica, tronco estável.'
  },
  {
    id: 'ex-pulldown',
    name: 'Pulldown na Polia (Dropset)',
    muscle: 'costas',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '12 + Drop',
    weight: 25,
    restSeconds: 90,
    notes: 'Bloco 04 - Dropset: Na última repetição, reduza 20-30% da carga e continue até a falha.'
  },
  {
    id: 'ex-remada-supinada',
    name: 'Remada Supinada (Barra ou Máquina)',
    muscle: 'costas',
    imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 35,
    restSeconds: 45,
    notes: 'Bloco 05 - Meta de Repetição. Pegada supinada (palmas para cima) com foco na porção inferior do dorsal.'
  },
  {
    id: 'ex-triceps-barra-reta',
    name: 'Tríceps na Barra Reta (Dropset)',
    muscle: 'triceps',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '12 + Drop',
    weight: 30,
    restSeconds: 45,
    notes: 'Bloco 06 - Dropset: Extensão completa dos cotovelos, na última série reduza o peso e busque a falha.'
  },
  {
    id: 'ex-peck-deck-invertido',
    name: 'Peck Deck Invertido (Crucifixo Invertido)',
    muscle: 'ombros',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    sets: 4,
    reps: '15',
    weight: 25,
    restSeconds: 45,
    notes: 'Bloco 07 - Meta de Repetições. Foco em deltoide posterior e romboides.'
  },

  // --- PLANILHA DE CORRIDA 3KM (TIME HÍBRIDO) ---
  {
    id: 'ex-corrida-terca',
    name: 'Corrida Intervalada 1:3 (Terça-Feira)',
    muscle: 'corrida',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    sets: 7,
    reps: '30s Z3 / 90s Z1',
    weight: 0,
    restSeconds: 90,
    notes: 'Aquecimento: 5 min Z1. Tiro: 7x (30 seg em Zona 3 [70-79% FC] + 90 seg em Zona 1 [50-59% FC]). Desaquecimento: 5 min Z1.'
  },
  {
    id: 'ex-corrida-quinta',
    name: 'Corrida Intervalada 1:2 (Quinta-Feira)',
    muscle: 'corrida',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    sets: 7,
    reps: '45s Z3 / 90s Z1',
    weight: 0,
    restSeconds: 90,
    notes: 'Aquecimento: 5 min Z1. Tiro: 7x (45 seg em Zona 3 [70-79% FC] + 90 seg em Zona 1 [50-59% FC]). Desaquecimento: 5 min Z1.'
  },
  {
    id: 'ex-corrida-sabado',
    name: 'Corrida Intervalada 1:1 (Sábado)',
    muscle: 'corrida',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80',
    sets: 7,
    reps: '1min Z3 / 1min Z1',
    weight: 0,
    restSeconds: 60,
    notes: 'Aquecimento: 5 min Z1. Tiro: 7x (1 min em Zona 3 [70-79% FC] + 1 min em Zona 1 [50-59% FC]). Desaquecimento: 5 min Z1.'
  }
];

export const DEFAULT_ROUTINES = [
  {
    id: 'routine-treino-a',
    title: 'Treino A — Membros Inferiores + ABS',
    description: 'Plano do Desafio Atleta Híbrido: Agachamento, Leg 45, Extensora, Terra em Pirâmide, Bi-Set Abdutora/Panturrilha e Tabata.',
    tag: 'Pernas & Core',
    color: '#ccff00',
    exercises: [
      { exerciseId: 'ex-agachamento-corpo', sets: 4, reps: '15', weight: 0, restSeconds: 45 },
      { exerciseId: 'ex-agachamento-livre', sets: 4, reps: '15', weight: 40, restSeconds: 60 },
      { exerciseId: 'ex-leg-press-45', sets: 4, reps: '15', weight: 120, restSeconds: 45 },
      { exerciseId: 'ex-cadeira-extensora', sets: 4, reps: '15', weight: 35, restSeconds: 45 },
      { exerciseId: 'ex-terra-deadlift', sets: 4, reps: '15-12-10-8', weight: 60, restSeconds: 120 },
      { exerciseId: 'ex-abdutora-panturrilha', sets: 4, reps: '15 + 15', weight: 40, restSeconds: 45 },
      { exerciseId: 'ex-abdominal-tabata', sets: 2, reps: 'Tabata', weight: 0, restSeconds: 180 },
    ]
  },
  {
    id: 'routine-treino-b',
    title: 'Treino B — Peito, Ombro e Bíceps',
    description: 'Supino Reto com Halteres em Pirâmide, Inclinado, Voador, Elevações Frontal e Lateral, Rosca W e Bíceps Concentrado.',
    tag: 'Superior A',
    color: '#00f0ff',
    exercises: [
      { exerciseId: 'ex-supino-reto-halteres', sets: 4, reps: '15-12-10-8', weight: 18, restSeconds: 120 },
      { exerciseId: 'ex-supino-inclinado-halteres', sets: 4, reps: '15', weight: 16, restSeconds: 90 },
      { exerciseId: 'ex-voador-crossover', sets: 4, reps: '15', weight: 15, restSeconds: 90 },
      { exerciseId: 'ex-elevacao-frontal', sets: 4, reps: '15', weight: 8, restSeconds: 90 },
      { exerciseId: 'ex-elevacao-lateral', sets: 4, reps: '15', weight: 8, restSeconds: 90 },
      { exerciseId: 'ex-rosca-biceps-w', sets: 4, reps: '15', weight: 20, restSeconds: 90 },
      { exerciseId: 'ex-biceps-concentrado', sets: 4, reps: '15', weight: 10, restSeconds: 90 },
    ]
  },
  {
    id: 'routine-treino-c',
    title: 'Treino C — Costas e Tríceps',
    description: 'Puxada Alta, Remada Baixa, Pulldown Dropset, Remada Supinada, Tríceps Barra Reta Dropset e Peck Deck Invertido.',
    tag: 'Puxar & Tríceps',
    color: '#ff5e00',
    exercises: [
      { exerciseId: 'ex-puxada-alta', sets: 4, reps: '15', weight: 45, restSeconds: 120 },
      { exerciseId: 'ex-remada-baixa', sets: 4, reps: '15', weight: 40, restSeconds: 90 },
      { exerciseId: 'ex-pulldown', sets: 4, reps: '12 + Drop', weight: 25, restSeconds: 90 },
      { exerciseId: 'ex-remada-supinada', sets: 4, reps: '15', weight: 35, restSeconds: 45 },
      { exerciseId: 'ex-triceps-barra-reta', sets: 4, reps: '12 + Drop', weight: 30, restSeconds: 45 },
      { exerciseId: 'ex-peck-deck-invertido', sets: 4, reps: '15', weight: 25, restSeconds: 45 },
    ]
  },
  {
    id: 'routine-treino-d',
    title: 'Treino D — Peito, Ombro e Bíceps',
    description: 'Segundo estímulo semanal para peitoral, ombro e bíceps garantindo frequência e hipertrofia equilibrada.',
    tag: 'Superior B',
    color: '#8b5cf6',
    exercises: [
      { exerciseId: 'ex-supino-reto-halteres', sets: 4, reps: '15-12-10-8', weight: 18, restSeconds: 120 },
      { exerciseId: 'ex-supino-inclinado-halteres', sets: 4, reps: '15', weight: 16, restSeconds: 90 },
      { exerciseId: 'ex-voador-crossover', sets: 4, reps: '15', weight: 15, restSeconds: 90 },
      { exerciseId: 'ex-elevacao-frontal', sets: 4, reps: '15', weight: 8, restSeconds: 90 },
      { exerciseId: 'ex-elevacao-lateral', sets: 4, reps: '15', weight: 8, restSeconds: 90 },
      { exerciseId: 'ex-rosca-biceps-w', sets: 4, reps: '15', weight: 20, restSeconds: 90 },
      { exerciseId: 'ex-biceps-concentrado', sets: 4, reps: '15', weight: 10, restSeconds: 90 },
    ]
  },
  {
    id: 'routine-corrida-hibrida',
    title: 'Desafio Corrida 3KM — Time Híbrido',
    description: 'Construção de base aeróbica intervalada: 3ª Feira (1:3 Moderado), 5ª Feira (1:2 Moderado) e Sábado (1:1 Moderado).',
    tag: 'Aeróbico 3KM',
    color: '#10b981',
    exercises: [
      { exerciseId: 'ex-corrida-terca', sets: 7, reps: '30s / 90s', weight: 0, restSeconds: 90 },
      { exerciseId: 'ex-corrida-quinta', sets: 7, reps: '45s / 90s', weight: 0, restSeconds: 90 },
      { exerciseId: 'ex-corrida-sabado', sets: 7, reps: '1m / 1m', weight: 0, restSeconds: 60 },
    ]
  }
];

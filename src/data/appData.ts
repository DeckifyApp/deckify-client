import { avatarUrl } from '../constants/theme';

export type CardStatus = 'ready' | 'learning' | 'due';

export const user = {
  name: 'Renata',
  avatarUrl,
  focusMinutes: 47,
  streakDays: 11,
  dailyGoal: 24,
  completedToday: 18,
};

export const deck = {
  id: 'pointers-cpp',
  title: 'Ponteiros em C++',
  shortTitle: 'Ponteiros',
  subtitle: 'Feito por você',
  description: 'Pratique sintaxe, memória e leitura de código com revisões curtas.',
  topic: 'Introdução à Programação Estruturada',
  roadmap: 'Desenvolvendo Backend',
  nextReview: 'Hoje, 18:30',
  progress: 75,
  questions: 87,
  cardsTotal: 15,
  averageTime: '01:03',
  totalTime: '9:22',
  tags: ['C++', 'Memória', 'Backend'],
  stats: {
    correct: 9,
    partial: 4,
    missed: 2,
  },
  cards: [
    {
      answer: 'int *p = &variavel;',
      index: '01',
      status: 'ready' as CardStatus,
      title: 'Sintaxe da declaração de um ponteiro em C++',
    },
    {
      answer: 'O endereço avança pelo tamanho do tipo apontado.',
      index: '02',
      status: 'learning' as CardStatus,
      title: 'O que acontece ao somar 1 a um ponteiro de inteiros?',
    },
    {
      answer: 'Use *p para acessar o valor armazenado no endereço.',
      index: '03',
      status: 'due' as CardStatus,
      title: 'Como desreferenciar um ponteiro com segurança?',
    },
    {
      answer: 'nullptr representa um ponteiro sem endereço válido.',
      index: '04',
      status: 'ready' as CardStatus,
      title: 'Quando usar nullptr em vez de NULL?',
    },
  ],
};

export const weekPlan = [
  { day: 'Seg', date: '18', state: 'done' },
  { day: 'Ter', date: '19', state: 'done' },
  { day: 'Qua', date: '20', state: 'done' },
  { day: 'Qui', date: '21', state: 'late' },
  { day: 'Sex', date: '22', state: 'today' },
  { day: 'Sáb', date: '23', state: 'upcoming' },
  { day: 'Dom', date: '24', state: 'upcoming' },
];

export const recommendations = [
  {
    author: 'Mariana Alves',
    rating: 5,
    subtitle: '32 cards prontos para revisão incremental',
    title: 'Sintaxe e conceitos para C++',
  },
  {
    author: 'Diego Lima',
    rating: 4,
    subtitle: 'Erros comuns em prova e entrevista técnica',
    title: 'Memória dinâmica sem sofrimento',
  },
];

export const schedule = {
  today: [
    { deck: 'Ponteiros em C++', done: true, time: '18 min' },
    { deck: 'Estruturas de dados', done: true, time: '12 min' },
  ],
  tomorrow: [
    { deck: 'Ponteiros em C++', done: false, time: '08:00' },
    { deck: 'Algoritmos gulosos', done: false, time: '19:30' },
  ],
};

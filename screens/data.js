export const CATEGORIES = [
  { id: '1', name: 'Músicas' },
  { id: '2', name: 'Livros' },
  { id: '3', name: 'Filmes' },
  { id: '4', name: 'Jogos' }
];

export const MOCK_POSTS = [
  { id: 'p1', user: {name:'letzzy'}, categoryId:'1', title:'The Spins', image:null, rating:4, text:'Ótima faixa para relaxar', createdAt: Date.now()-1000000 },
  { id: 'p2', user: {name:'yukizz'}, categoryId:'3', title:'Filme X', image:null, rating:5, text:'Filme emocionante', createdAt: Date.now()-500000 }
];
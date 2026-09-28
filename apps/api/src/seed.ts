import { createDatabase } from './db.js'
import { products } from './schema.js'

const examples = [
  ['Vaso Cerâmica', 18900, 'Um vaso de linhas orgânicas para compor a sala.', 'assets/plates/vase.png'],
  ['Luminária Cúpula', 32900, 'Luz de apoio para leitura e descanso.', 'assets/plates/lamp.png'],
  ['Banqueta Madeira', 28900, 'Um assento compacto para diferentes cantos da casa.', 'assets/plates/stool.png'],
  ['Jarra de Vidro', 15900, 'Uma garrafa de mesa para servir água.', 'assets/plates/carafe.png'],
  ['Cesto Trançado', 21900, 'Um cesto para guardar os objetos do dia a dia.', 'assets/plates/basket.png'],
  ['Almofada Têxtil', 9900, 'Um ponto de cor para sofá ou poltrona.', 'assets/plates/pillow.png'],
  ['Centro de Mesa', 17900, 'Uma peça central para a mesa.', 'assets/plates/bowl.png'],
  ['Cachepô Pedra', 19900, 'Um recipiente para abrigar plantas em casa.', 'assets/plates/planter.png'],
  ['Manta Brisa', 24000, 'Uma manta para deixar ao alcance no sofá.', 'demo/manta-brisa.png'],
  ['Centro de Mesa Pinho', 17900, 'Uma peça simples para reunir pequenos objetos.', 'demo/centro-mesa-pinho.png'],
] as const

const { sqlite, db } = createDatabase()
try {
  const count = sqlite.prepare('SELECT COUNT(*) AS total FROM products').get() as { total: number }
  if (count.total > 0) {
    console.log('O catálogo já contém Produtos; nenhum exemplo foi criado.')
  } else {
    const origin = process.env.CASA_LIRA_WEB_ORIGIN ?? 'http://127.0.0.1:5173'
    const now = new Date().toISOString()
    const rows: Array<typeof products.$inferInsert> = examples.map(([title, priceCents, description, slug], index) => ({
      title,
      priceCents,
      description,
      imageUrl: `${origin}/${slug}`,
      status: 'publicado' as const,
      createdAt: now,
      updatedAt: now,
      publishedAt: new Date(Date.now() - index * 60_000).toISOString(),
    }))
    rows.push(
      { title: 'Bandeja Areia', priceCents: 14900, description: 'Uma bandeja para objetos pequenos.', imageUrl: null, status: 'rascunho', createdAt: now, updatedAt: now, publishedAt: null },
      { title: 'Castiçal Sol', priceCents: 11900, description: null, imageUrl: null, status: 'rascunho', createdAt: now, updatedAt: now, publishedAt: null },
    )
    db.insert(products).values(rows).run()
    console.log(`${rows.length} Produtos fictícios criados para demonstração.`)
  }
} finally {
  sqlite.close()
}

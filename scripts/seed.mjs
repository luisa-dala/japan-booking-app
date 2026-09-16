import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST || 'db',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'japan_booking',
});

const listings = [
  { name: 'Hotel Metropolitan Tokyo', description: 'Modern hotel in the heart of Ikebukuro with city views and easy access to Shinjuku.', location: 'Ikebukuro, Tokyo', prefecture: 'Tokyo', type: 'hotel', price_per_night: 15000, rating: 4.5 },
  { name: 'Hoshinoya Tokyo', description: 'Luxury ryokan-style hotel on the Sumida River with traditional hot spring baths.', location: 'Otemachi, Tokyo', prefecture: 'Tokyo', type: 'ryokan', price_per_night: 65000, rating: 4.8 },
  { name: 'The Thousand Kyoto', description: 'Contemporary hotel blending Japanese aesthetics with modern comfort near Kyoto Station.', location: 'Kyoto Station, Kyoto', prefecture: 'Kyoto', type: 'hotel', price_per_night: 18000, rating: 4.6 },
  { name: 'Tawaraya Ryokan', description: 'A 300-year-old legendary ryokan offering impeccable service and kaiseki dining.', location: 'Nakagyo, Kyoto', prefecture: 'Kyoto', type: 'ryokan', price_per_night: 55000, rating: 4.9 },
  { name: 'Swissôtel Nankai Osaka', description: 'Five-star hotel above Namba Station with panoramic city views.', location: 'Namba, Osaka', prefecture: 'Osaka', type: 'hotel', price_per_night: 14000, rating: 4.4 },
  { name: "K's House Osaka", description: 'Award-winning hostel with dorms and private rooms near Shin-Osaka Station.', location: 'Shin-Osaka, Osaka', prefecture: 'Osaka', type: 'hostel', price_per_night: 3500, rating: 4.3 },
  { name: 'Hakone Ginyu', description: 'Boutique ryokan with private open-air hot spring baths overlooking the Haya River.', location: 'Miyanoshita, Hakone', prefecture: 'Kanagawa', type: 'ryokan', price_per_night: 48000, rating: 4.9 },
  { name: "K's House Hakone", description: 'Friendly hostel in a historic building, perfect for budget travelers exploring Hakone.', location: 'Hakone-Yumoto, Hakone', prefecture: 'Kanagawa', type: 'hostel', price_per_night: 4000, rating: 4.5 },
  { name: 'Nara Hotel', description: 'Historic century-old hotel with classic architecture near Nara Park and Todai-ji Temple.', location: 'Nara Park, Nara', prefecture: 'Nara', type: 'hotel', price_per_night: 20000, rating: 4.5 },
  { name: 'Miyajima Guesthouse', description: 'Cozy hostel steps from the iconic Itsukushima Shrine and floating torii gate.', location: 'Miyajima, Hiroshima', prefecture: 'Hiroshima', type: 'hostel', price_per_night: 4500, rating: 4.6 },
  { name: 'Sapporo Grand Hotel', description: 'Classic hotel in central Sapporo, ideal for winter skiing and summer festivals.', location: 'Odori, Sapporo', prefecture: 'Hokkaido', type: 'hotel', price_per_night: 11000, rating: 4.2 },
  { name: 'Furano Minshuku', description: 'Family-run minshuku serving home-cooked meals amid lavender fields and ski slopes.', location: 'Furano, Hokkaido', prefecture: 'Hokkaido', type: 'minshuku', price_per_night: 6500, rating: 4.7 },
];

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      location VARCHAR(100) NOT NULL,
      prefecture VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      price_per_night INTEGER NOT NULL,
      rating DECIMAL(2,1) NOT NULL
    )
  `);

  await pool.query('DELETE FROM listings');

  for (const l of listings) {
    await pool.query(
      'INSERT INTO listings (name, description, location, prefecture, type, price_per_night, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [l.name, l.description, l.location, l.prefecture, l.type, l.price_per_night, l.rating]
    );
  }

  console.log(`Seeded ${listings.length} listings`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || '';
  const type = searchParams.get('type') || '';
  const minPrice = Number(searchParams.get('minPrice') || '0');
  const maxPrice = Number(searchParams.get('maxPrice') || '999999');
  const sort = searchParams.get('sort') || 'price_asc';

  let sql = 'SELECT * FROM listings WHERE price_per_night >= $1 AND price_per_night <= $2';
  const params: unknown[] = [minPrice, maxPrice];
  let idx = 3;

  if (location) {
    sql += ` AND (location ILIKE $${idx} OR prefecture ILIKE $${idx})`;
    params.push(`%${location}%`);
    idx++;
  }
  if (type) {
    sql += ` AND type = $${idx}`;
    params.push(type);
    idx++;
  }

  switch (sort) {
    case 'price_desc':
      sql += ' ORDER BY price_per_night DESC';
      break;
    case 'rating_desc':
      sql += ' ORDER BY rating DESC';
      break;
    default:
      sql += ' ORDER BY price_per_night ASC';
  }

  try {
    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('DB query error:', err);
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}

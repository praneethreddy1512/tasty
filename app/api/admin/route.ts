import Db from '@/app/utils/config/db';
import {RestaurantModel} from '@/app/utils/models/Login';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await Db();
  const body = await req.json();
  const restaurant = await RestaurantModel.create(body);
  return NextResponse.json(restaurant);
}

export async function GET() {
  await Db();
  const restaurants = await RestaurantModel.find();
  return NextResponse.json(restaurants);
}

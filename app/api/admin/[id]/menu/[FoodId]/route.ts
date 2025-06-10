import { NextRequest, NextResponse } from 'next/server';
import Db from '@/app/utils/config/db';
import { RestaurantModel } from '@/app/utils/models/Login';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; foodId: string } }
) {
  await Db();
  const { name, price, rating, imgurl } = await req.json();

  const updated = await RestaurantModel.findOneAndUpdate(
    { _id: params.id, 'menu._id': params.foodId },
    {
      $set: {
        'menu.$.name': name,
        'menu.$.price': price,
        'menu.$.rating': rating,
        'menu.$.imgurl': imgurl,
      },
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; foodId: string } }
) {
  await Db();

  const updated = await RestaurantModel.findByIdAndUpdate(
    params.id,
    { $pull: { menu: { _id: params.foodId } } },
    { new: true }
  );

  return NextResponse.json(updated);
}

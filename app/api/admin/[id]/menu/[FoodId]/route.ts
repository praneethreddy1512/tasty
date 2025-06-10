import { NextRequest, NextResponse } from 'next/server';
import Db from '@/app/utils/config/db';
import { RestaurantModel } from '@/app/utils/models/Login';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; foodId: string } }
) {
  await Db();

  try {
    const { name, price, rating, imgurl } = await req.json();

    if (!name || !price || !rating || !imgurl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
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

    if (!updatedRestaurant) {
      return NextResponse.json({ message: "Food item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Food item updated", restaurant: updatedRestaurant }, { status: 200 });
  } catch (error) {
    console.error("Update food error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; foodId: string } }
) {
  await Db();

  try {
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      params.id,
      { $pull: { menu: { _id: params.foodId } } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Food item deleted", restaurant: updatedRestaurant }, { status: 200 });
  } catch (error) {
    console.error("Delete food error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

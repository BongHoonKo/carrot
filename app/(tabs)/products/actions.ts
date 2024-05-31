"use server";
import db from "@/lib/db";

const PAGE_PER_VIEW = 1;
export async function getMoreProducts(page:number) {
    const products = await db.product.findMany({
        select : {
            title : true
            , price : true
            , created_at : true
            , photo : true
            , id : true
        },
        skip : page * PAGE_PER_VIEW,
        take : PAGE_PER_VIEW,
        orderBy : {
            created_at : 'desc'
        }
    });

    console.log('products ==> ', products);

    return products;
}
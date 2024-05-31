"use client";
import { getMoreProducts } from "@/app/(tabs)/products/actions";
import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "@/components/list-product";
import { useRef, useState } from "react";

interface ProductListProps {
    initialProducts : InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [ products, setProducts ] = useState(initialProducts);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ page, setPage ] = useState(0);
    const [ isLastPage, setIsLastPage ] = useState(false);

    const trigger = useRef<HTMLSpanElement>(null);

    const onLoadMoreClick = async() => {
        setIsLoading(true);
        const newProducts = await getMoreProducts(page + 1);
        if(newProducts.length !== 0) {
            setPage(prev => prev + 1);
            setProducts(prev => [...prev, ...newProducts]);
            setIsLoading(false);
        } else {
            setIsLastPage(true);
        }
    }

    return (
        <div className="p-5 flex flex-col gap-5">
            { products.map(item => <ListProduct key={item.id} {...item}/>) }

            {/* {isLastPage ? null : (
                <button className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
                        disabled={isLoading}
                        onClick={onLoadMoreClick}>
                    { isLoading ? "Loading..." : "Load More" }
                </button>
            )} */}
            <span ref={trigger} className="mt-[500vh] mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95">
                    { isLoading ? "Loading..." : "Load More" }
            </span>
        </div>
    )
}
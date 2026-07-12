import BootstrapLayout from "@/Layouts/BootstrapLayout";
import React, { useState, useEffect } from "react";

const ProductOthers = () => {
    const [products, setProducts] = useState([]);

    const loadData2 = async () => {
        try {
            const response = await fetch("/api/product");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("There was an error fetching the products!", error);
        }
    };

    useEffect(() => {
        loadData2();
    }, []);

    return (
        <BootstrapLayout>
            <div className="container my-4">
                <h1>Product List</h1>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((item, index) => (
                        <div className="col" key={item.id}>
                            <div className="card h-100">
                                <img src={item.image} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BootstrapLayout>
    );
};

export default ProductOthers;
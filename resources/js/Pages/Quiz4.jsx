import BootstrapLayout from "@/Layouts/BootstrapLayout";
import React, { useState, useEffect } from "react";

const Quiz4 = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            const response = await fetch("/api/quiz4");
            const data = await response.json();
            setMenuItems(data);
        } catch (err) {
            console.error("There was an error fetching the menu items!", err);
            setError("ไม่สามารถโหลดข้อมูลเมนูได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <BootstrapLayout>
            <div className="container my-4">
                <h1>เมนูร้านอาหาร (Quiz4)</h1>

                {loading && <p>กำลังโหลดข้อมูล...</p>}
                {error && <p className="text-danger">{error}</p>}

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {menuItems.map((item) => (
                        <div className="col" key={item.id}>
                            <div className="card h-100">
                                <img
                                    src={item.image}
                                    className="card-img-top"
                                    alt={item.name}
                                />
                                <div className="card-body">
                                    <span className="badge bg-secondary mb-2">
                                        {item.category}
                                    </span>
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text fw-bold">
                                        ฿{item.price}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BootstrapLayout>
    );
};

export default Quiz4;
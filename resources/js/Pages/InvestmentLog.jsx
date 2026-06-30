import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function InvestmentLog() {
    const [formData, setFormData] = useState({ assetName: "", amount: "", date: "" });
    const [investments, setInvestments] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.assetName || !formData.amount || !formData.date) {
            return; // กันกรอกไม่ครบแล้วกดเพิ่ม
        }
        setInvestments([...investments, formData]);
        setFormData({ assetName: "", amount: "", date: "" }); // เคลียร์ฟอร์มหลังเพิ่ม
    };

    const removeItem = (index) => {
        const confirmDelete = window.confirm("ยืนยันการลบรายการนี้?");
        if (confirmDelete) {
            setInvestments(investments.filter((_, i) => i !== index));
        }
    };

    // คำนวณยอดรวมสดจาก state investments ไม่เก็บเป็น state แยก
    const totalAmount = investments.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Investment Log" />
                <h1>บันทึกการลงทุน</h1>

                <form onSubmit={handleSubmit} className="row g-2 align-items-end mb-4">
                    <div className="col-lg-4">
                        <label className="form-label">ชื่อสินทรัพย์</label>
                        <input
                            className="form-control"
                            type="text"
                            name="assetName"
                            value={formData.assetName}
                            onChange={handleChange}
                            placeholder="เช่น หุ้น ABC, ทองคำ, กองทุน X"
                        />
                    </div>
                    <div className="col-lg-3">
                        <label className="form-label">จำนวนเงิน (บาท)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="col-lg-3">
                        <label className="form-label">วันที่ลงทุน</label>
                        <input
                            className="form-control"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-lg-2">
                        <button className="btn btn-primary w-100" type="submit">
                            เพิ่มรายการ
                        </button>
                    </div>
                </form>

                <h5 className="text-center bg-info fs-3 p-2 rounded mb-4">
                    ยอดรวมเงินลงทุนทั้งหมด: {totalAmount.toLocaleString()} บาท
                </h5>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {investments.map((item, index) => (
                        <div className="col" key={index}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{item.assetName}</h5>
                                    <p className="card-text">
                                        จำนวนเงิน: {Number(item.amount).toLocaleString()} บาท
                                        <br />
                                        วันที่: {item.date}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => removeItem(index)}
                                >
                                    <i className="bi bi-trash"></i> ลบ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {investments.length === 0 && (
                    <p className="text-muted">ยังไม่มีรายการบันทึกการลงทุน</p>
                )}
            </div>
        </BootstrapLayout>
    );
}
import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeightTracker = () => {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const response = await fetch("/api/weights");
      const data = await response.json();
      setWeights(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weights:", error);
      setLoading(false);
    }
  };

  const deleteWeight = async (id) => {
    if (window.confirm("ลบรายการนี้?")) {
      try {
        const response = await fetch(`/api/weights/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setWeights(weights.filter((w) => w.id !== id));
          alert("ลบสำเร็จ");
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  // จัดเรียงข้อมูลสำหรับ chart (จากเก่าไปใหม่)
  const chartData = [...weights].reverse();

  return (
    <BootstrapLayout>
      <div className="container my-4">
        <h1>Weight Tracker - บันทึกน้ำหนัก</h1>

        {/* CHART */}
        {!loading && weights.length > 0 && (
          <div className="mb-5 p-3 border rounded bg-light">
            <h3>📈 กราฟแสดงน้ำหนัก</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weight_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight_value"
                  stroke="#8884d8"
                  name="Weight (kg)"
                  dot={{ fill: "#8884d8", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* BUTTON ADD */}
        <Link
          href="/weight/create"
          className="btn btn-primary mb-3"
        >
          + Add Weight
        </Link>

        {/* TABLE */}
        {loading ? (
          <p>Loading...</p>
        ) : weights.length === 0 ? (
          <p>ไม่มีข้อมูล</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((weight) => (
                <tr key={weight.id}>
                  <td>{weight.weight_date}</td>
                  <td>{weight.weight_value}</td>
                  <td>{weight.note}</td>
                  <td>
                    <Link
                      href={`/weight/${weight.id}/edit`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteWeight(weight.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </BootstrapLayout>
  );
};

export default WeightTracker;
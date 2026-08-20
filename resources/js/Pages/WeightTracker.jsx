import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

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

  return (
    <BootstrapLayout>
      <div className="container my-4">
        <h1>Weight Tracker - บันทึกน้ำหนัก</h1>

        <Link
          href="/weight/create"
          className="btn btn-primary mb-3"
        >
          + Add Weight
        </Link>

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
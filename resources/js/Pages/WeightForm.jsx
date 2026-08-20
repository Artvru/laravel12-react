import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const WeightForm = ({ weight }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    weight_date: "",
    weight_value: "",
    note: "",
  });

  useEffect(() => {
    if (weight) {
      setFormData(weight);
    }
  }, [weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = weight ? "PUT" : "POST";
    const url = weight
      ? `/api/weights/${weight.id}`
      : "/api/weights";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const msg = weight
          ? "Weight updated successfully!"
          : "Weight added successfully!";
        alert(msg);
        window.location.href = "/weight-tracker";
      } else {
        setErrors(data.errors || {});
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <BootstrapLayout>
      <div className="container my-4">
        <h1>
          Weight Form for {weight ? "Edit" : "Create"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="weight_date"
              className="form-control"
              value={formData.weight_date}
              onChange={handleChange}
            />
            {errors.weight_date && (
              <small className="text-danger">
                {errors.weight_date}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              name="weight_value"
              className="form-control"
              value={formData.weight_value}
              onChange={handleChange}
              placeholder="e.g., 70.5"
            />
            {errors.weight_value && (
              <small className="text-danger">
                {errors.weight_value}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Note</label>
            <textarea
              name="note"
              className="form-control"
              value={formData.note}
              onChange={handleChange}
              placeholder="Optional"
            />
            {errors.note && (
              <small className="text-danger">
                {errors.note}
              </small>
            )}
          </div>

          <div>
            <button type="submit" className="btn btn-primary me-2">
              Submit
            </button>
            <Link href="/weight-tracker" className="btn btn-secondary">
              Back
            </Link>
          </div>
        </form>
      </div>
    </BootstrapLayout>
  );
};

export default WeightForm;  
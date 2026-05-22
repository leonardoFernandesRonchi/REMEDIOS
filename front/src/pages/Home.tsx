// src/pages/Home.tsx

import { useEffect, useState } from "react";
import * as yup from "yup";
import {
  createMedication,
  getMedications,
  sendToDispenser,
  deleteMedication,
} from "../services/api";

// =========================
// TYPES
// =========================

interface Medication {
  id: number;
  name: string;
  quantity: number;
  posicionamentoMotor: string;
}

// =========================
// SCHEMA
// =========================

const medicationSchema = yup.object({
  name: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres"),

  quantity: yup
    .number()
    .typeError("A quantidade deve ser um número")
    .required("A quantidade é obrigatória")
    .min(1, "A quantidade deve ser maior que 0"),

  posicionamentoMotor: yup
    .string()
    .required("A posição é obrigatória"),
});

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [medications, setMedications] = useState<
    Medication[]
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    posicionamentoMotor: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    posicionamentoMotor: "",
  });

  // =========================
  // LOAD MEDICATIONS
  // =========================

  const loadMedications = async () => {
    try {
      const data = await getMedications();

      setMedications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setErrors({
        name: "",
        quantity: "",
        posicionamentoMotor: "",
      });

      await medicationSchema.validate(
        {
          ...formData,
          quantity: Number(formData.quantity),
        },
        {
          abortEarly: false,
        }
      );

      await createMedication({
        name: formData.name,
        quantity: Number(formData.quantity),
        posicionamentoMotor:
          formData.posicionamentoMotor,
      });

      await loadMedications();

      alert("Medicamento criado com sucesso!");

      setFormData({
        name: "",
        quantity: "",
        posicionamentoMotor: "",
      });

      setIsModalOpen(false);
    } catch (error: any) {
      if (error.inner) {
        const newErrors: any = {};

        error.inner.forEach((err: any) => {
          newErrors[err.path] = err.message;
        });

        setErrors((prev) => ({
          ...prev,
          ...newErrors,
        }));
      }

      console.error(error);
    }
  };

  // =========================
  // GRID POSITIONS
  // =========================

  const positions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  return (
  <div className="min-h-screen bg-gray-100 p-6">

      {/* BOTÃO ADICIONAR */}
    <div className="mb-6 flex justify-end">
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        + Novo Medicamento
      </button>
    </div>
    {loading && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      
      {/* SPINNER */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />

      <p className="text-lg font-semibold text-white">
        Carregando...
      </p>
    </div>
  </div>
)}
    {/* GRID */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }, (_, index) => {
        const position = index + 1;

        const medicationsInPosition = medications.filter(
          (m) => m.posicionamentoMotor === position.toString()
        );

        const firstMedication = medicationsInPosition[0];

        return (
          <div
            key={position}
            className="min-h-[220px] rounded-2xl border border-gray-200 bg-white p-5 shadow-md"
          >

          
            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400">
                Posição {position}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                #{position}
              </span>
            </div>

            {/* MEDICATION */}
            {firstMedication ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                
                {/* TOPO */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {firstMedication.name}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      Quantidade: {firstMedication.quantity}
                    </p>
                  </div>

                  {/* BOTÃO */}
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await sendToDispenser(position);

                        await deleteMedication(firstMedication.id);

                      } catch (error) {
                        console.error(error);
                      } finally {
                        await loadMedications();
                        setLoading(false);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-sm font-bold text-white transition hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>

                {/* quantidade escondida atrás */}
                {medicationsInPosition.length > 1 && (
                  <p className="mt-3 text-sm text-gray-400">
                    + {medicationsInPosition.length - 1} atrás
                  </p>
                )}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-gray-400">
                  Vazio
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* MODAL */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          {/* HEADER */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Novo Medicamento
            </h2>

            <button
              onClick={() => setIsModalOpen(false)}
              className="text-2xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* NAME */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* QUANTITY */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quantidade
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.quantity}
                </p>
              )}
            </div>

            {/* POSITION */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Posição
              </label>

              <select
                name="posicionamentoMotor"
                value={formData.posicionamentoMotor}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">
                  Selecione
                </option>

                {positions.map((position) => (
                  <option
                    key={position}
                    value={position}
                  >
                    {position}
                  </option>
                ))}
              </select>

              {errors.posicionamentoMotor && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.posicionamentoMotor}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-green-600 py-2 font-medium text-white transition hover:bg-green-700"
              >
                Salvar
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg bg-gray-200 py-2 font-medium text-gray-700 transition hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default Home;
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "./services/api";

// Schema de validação com Yup
const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),

  email: yup
    .string()
    .email("Email inválido")
    .required("Email é obrigatório"),

  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha obrigatória"),

  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirmação obrigatória"),
});

type FormData = yup.InferType<typeof schema>;

export default function App() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setMessage("");

    try {
      const response = await registerUser(data);


      setMessage("✅ Registro realizado com sucesso!");
    } catch (error: any) {
      setMessage(
        "❌ Erro: " +
          (error.response?.data?.message || "Verifique os dados.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-300 p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Registro 🚀
        </h1>

        <p className="text-gray-600 mb-6">
          Preencha os campos para criar sua conta.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Nome */}
          <div>
            <input
              type="text"
              placeholder="Nome"
              {...register("name")}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirmar senha */}
          <div>
            <input
              type="password"
              placeholder="Confirme a senha"
              {...register("password_confirmation")}
              className="w-full rounded-xl bg-gray-100 border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>

          {/* Link login */}
          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              to="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </form>

        {/* Mensagem */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

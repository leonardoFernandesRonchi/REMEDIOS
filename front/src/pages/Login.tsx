import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "../services/api";
import * as yup from "yup";

// Schema de validação para login
const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),

  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha obrigatória"),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
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
      const response = await loginUser(data);

          
      setMessage("✅ Login realizado com sucesso!");
      navigate("/home");
    } catch (error: any) {
      setMessage(
        "❌ Erro: " +
          (error.response?.data?.message || "Verifique os dados.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Navbar */}
  

      {/* Conteúdo principal */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-300 p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-2">
            Login 🔑
          </h2>

          <p className="text-gray-600 mb-6">
            Entre com suas credenciais.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
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

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Entrando..." : "Login"}
            </button>

            {/* Criar conta */}
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Criar conta
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
    </div>
  );
}
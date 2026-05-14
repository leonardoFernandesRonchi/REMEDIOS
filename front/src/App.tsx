export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Tailwind funcionando 🚀</h1>

        <p className="text-zinc-400 mb-6">
          Se você está vendo estilos, Tailwind está configurado corretamente.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Digite algo..."
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              font-semibold
              transition
              hover:bg-blue-500
              active:scale-[0.98]
            "
          >
            Botão teste
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <span className="rounded-full bg-green-500/20 text-green-400 px-3 py-1 text-sm">
            React
          </span>

          <span className="rounded-full bg-sky-500/20 text-sky-400 px-3 py-1 text-sm">
            TypeScript
          </span>

          <span className="rounded-full bg-cyan-500/20 text-cyan-400 px-3 py-1 text-sm">
            Tailwind
          </span>
        </div>
      </div>
    </div>
  );
}

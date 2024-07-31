import { useRouter } from "next/router";

const RouteHandler = () => {
  const router = useRouter();

  const win = () => {
    // Redirige al siguiente nivel
    router.push("/2");
  };

  win()

  return null; // Este componente no renderiza nada
};

export default RouteHandler;

import { useUserStore } from '@/store/user'; // Importa useUserStore

export default function auth({ next }) {
  const userStore = useUserStore(); // Crea una instancia de userStore

  if (userStore.token) {
    return next('app');
  }
  return next();
}

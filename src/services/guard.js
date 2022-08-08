import { getCurrentSessionUser } from "./storage";

export function redirectIfNotLogin(router) {
  const currentUser = getCurrentSessionUser();
  if (!currentUser) {
    router.push('/');
  }
}
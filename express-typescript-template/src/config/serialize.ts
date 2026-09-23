// Parse the user id to deserialize function
export function serialize($user: any, done: any) {
  done(null, ($user && $user.id) || null);
}

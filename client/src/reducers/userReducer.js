export function userReducer(state = null, action) {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return action.payload;
    case "LOGOUT":
      return action.payload; // utilizador: null
    default:
      return state;
  }
}

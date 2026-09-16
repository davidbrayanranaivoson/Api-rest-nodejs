module.exports.checkPasswordStrength = (password) => {
  const minLength = 8; // Longueur minimale recommandée
  const maxLength = 16; // Longueur maximale

  // Vérifier la longueur du mot de passe
  if (password.length < minLength || password.length > maxLength) {
    return `Le mot de passe doit contenir entre ${minLength} à ${maxLength} caractères.`;
  }

  // Vérifier l'utilisation d'au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
    return "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial.";
  }

  // Vérifier la présence d'injections SQL ou autres failles de sécurité
  if (
    password.includes(";") ||
    password.includes(" OR ") ||
    password.includes("--")
  ) {
    return "Le mot de passe contient des caractères potentiellement malveillants.";
  }

  return null; // Le mot de passe est robuste
};

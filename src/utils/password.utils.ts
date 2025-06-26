/**
 * Génère un mot de passe sécurisé aléatoire
 * @param length Longueur du mot de passe (défaut: 12)
 * @returns Mot de passe généré
 */
export function generateSecurePassword(length: number = 12): string {
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Assurer qu'on a au moins un caractère de chaque type
  let password = '';
  password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];

  // Remplir le reste avec des caractères aléatoires
  const allChars = charset.lowercase + charset.uppercase + charset.numbers + charset.symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
} 
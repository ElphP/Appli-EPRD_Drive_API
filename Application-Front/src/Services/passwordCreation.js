function generatePassword(length = 10) {
    // Définir les différents types de caractères
    const specialChars = "!@#$%^&*()";
    const numbers = "0123456789";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Choisir un caractère de chaque type pour respecter la contrainte
    let password = "";
    password += specialChars.charAt(
        Math.floor(Math.random() * specialChars.length)
    );
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));

    // Fusionner tous les types de caractères pour le reste du mot de passe
    const allCharacters = specialChars + numbers + lowercase + uppercase;

    // Générer les caractères restants de manière aléatoire
    for (let i = 4; i < length; i++) {
        password += allCharacters.charAt(
            Math.floor(Math.random() * allCharacters.length)
        );
    }

    // Mélanger le mot de passe pour que l'ordre ne soit pas prévisible
    password = password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");

    return password;
}

export default generatePassword;
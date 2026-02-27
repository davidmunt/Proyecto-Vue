export const sendStatusEmail = async (email, username, nuevoEstado) => {
  try {
    await fetch("http://localhost:3000/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Actualización de tu estado de resolución",
        text: `Hola ${username}, se ha actualizado tu estado de resolución a: ${nuevoEstado.toUpperCase()}`,
      }),
    });
  } catch (error) {
    console.error("Error en fetch de mail:", error);
  }
};

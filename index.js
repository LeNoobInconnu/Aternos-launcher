<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Lancer le serveur Minecraft</title>
</head>
<body>
  <h1>Lancer le serveur Minecraft Aternos</h1>
  <button onclick="startServer()">Démarrer le serveur</button>
  <div id="status"></div>

  <script>
    async function startServer() {
      document.getElementById("status").innerText = "Démarrage en cours...";
      try {
        const response = await fetch("https://aternos-launcher-backend.up.railway.app/start-server", {
          method: "POST"
        });
        const result = await response.json();
        document.getElementById("status").innerText = result.success
          ? "✅ Serveur lancé !"
          : "❌ Échec : " + result.message;
      } catch {
        document.getElementById("status").innerText = "❌ Erreur de connexion.";
      }
    }
  </script>
</body>
</html>

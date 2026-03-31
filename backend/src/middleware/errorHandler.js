const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Données invalides',
      details: err.details.map(d => d.message),
    });
  }

  // Violation de contrainte unique PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Ce candidat a déjà postulé à ce poste',
    });
  }

  // Violation de clé étrangère PostgreSQL
  if (err.code === '23503') {
    return res.status(404).json({
      error: 'Job ou candidat introuvable',
    });
  }

  // Erreur générique
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;
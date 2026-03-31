import { db } from '../config/database.js';
import { auditLog } from '../utils/audit.js';

// Statuts valides pour le pipeline
const VALID_STATUSES = ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'];

class ApplicationsController {

  /**
   * POST /api/v1/applications
   * Un candidat postule à une offre
   */
  static async apply(req, res) {
    try {
      const { job_id, cover_letter } = req.body;
      const candidate_id = req.userId;

      // Vérification des champs obligatoires
      if (!job_id) {
        return res.status(400).json({
          success: false,
          error: 'Champ manquant',
          message: 'job_id est obligatoire',
        });
      }

      // Vérifier que l'offre existe
      const job = await db('jobs').where('id', job_id).first();
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Offre introuvable',
          message: "L'offre d'emploi n'existe pas",
        });
      }

      // Vérifier que le candidat n'a pas déjà postulé
      const existing = await db('applications')
        .where({ candidate_id, job_id })
        .first();

      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Candidature déjà existante',
          message: 'Vous avez déjà postulé à cette offre',
        });
      }

      // Créer la candidature
      const [application] = await db('applications')
        .insert({ candidate_id, job_id, cover_letter: cover_letter || null })
        .returning('*');

      // Log de l'action
      await auditLog({
        action: 'create',
        entity_type: 'application',
        entity_id: application.id,
        user_id: candidate_id,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
      });

      return res.status(201).json({
        success: true,
        data: application,
        message: 'Candidature soumise avec succès',
      });
    } catch (error) {
      console.error('Erreur apply:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la soumission',
      });
    }
  }

  /**
   * PATCH /api/v1/applications/:id/status
   * Le recruteur change le statut d'une candidature (Drag & Drop)
   */
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, rejection_reason } = req.body;

      // Vérifier que le statut est valide
      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Statut invalide',
          message: `Les statuts valides sont : ${VALID_STATUSES.join(', ')}`,
        });
      }

      // Vérifier que la candidature existe
      const application = await db('applications').where('id', id).first();
      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Candidature introuvable',
          message: "La candidature n'existe pas",
        });
      }

      // Préparer les données à mettre à jour
      const updateData = {
        status,
        updated_at: new Date(),
        recruiter_id: req.userId,
      };

      // Ajouter la raison du rejet si applicable
      if (status === 'rejected' && rejection_reason) {
        updateData.rejection_reason = rejection_reason;
      }

      // Mettre à jour le statut
      const [updated] = await db('applications')
        .where('id', id)
        .update(updateData)
        .returning('*');

      // Log de l'action
      await auditLog({
        action: 'update_status',
        entity_type: 'application',
        entity_id: id,
        user_id: req.userId,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        new_values: { status },
        old_values: { status: application.status },
      });

      return res.json({
        success: true,
        data: updated,
        message: 'Statut mis à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur updateStatus:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la mise à jour',
      });
    }
  }

  /**
   * GET /api/v1/applications/job/:id
   * Récupérer tous les candidats d'une offre (pour le board Trello)
   */
  static async getByJob(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.query;

      // Vérifier que l'offre existe
      const job = await db('jobs').where('id', id).first();
      if (!job) {
        return res.status(404).json({
          success: false,
          error: 'Offre introuvable',
          message: "L'offre d'emploi n'existe pas",
        });
      }

      // Construire la requête avec jointure sur candidates + users pour l'email
      let query = db('applications')
        .where('applications.job_id', id)
        .join('candidates', 'applications.candidate_id', 'candidates.id')
        .join('users', 'candidates.user_id', 'users.id')
        .select(
          'applications.*',
          'candidates.first_name',
          'candidates.last_name',
          'candidates.phone',
          'users.email'
        )
        .orderBy('applications.applied_at', 'desc');

      // Filtre optionnel par statut
      if (status && VALID_STATUSES.includes(status)) {
        query = query.where('applications.status', status);
      }

      const applications = await query;

      // Grouper par statut pour le board Trello
      const board = VALID_STATUSES.reduce((acc, s) => {
        acc[s] = applications.filter((a) => a.status === s);
        return acc;
      }, {});

      return res.json({
        success: true,
        data: {
          job_id: id,
          total: applications.length,
          board,
        },
      });
    } catch (error) {
      console.error('Erreur getByJob:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la récupération',
      });
    }
  }
}

export { ApplicationsController };

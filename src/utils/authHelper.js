
import api from '@/services/api';
import { invitationService } from '@/services/invitationService';

export const processPendingInvitation = async (acceptToken = null) => {

  if (invitationService.hasPendingInvitation()) {
    const token = invitationService.getToken() || acceptToken;
    try {
      await api.post('/invitations/accept', { token });
      console.log("Invitation successfully accepted!");
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    } finally {
      invitationService.clearToken();
    }
  }
};
import api from './api';
import { Appointment, PaginatedResponse } from '@/types';

export const appointmentService = {
  async getAppointments(page = 1, filters?: { status?: string }): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get<PaginatedResponse<Appointment>>('/appointments', {
      params: { page, ...filters },
    });
    return response.data;
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await api.get<{ appointment: Appointment }>(`/appointments/${id}`);
    return response.data.appointment || response.data as any;
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await api.put<{ appointment: Appointment }>(`/appointments/${id}`, data);
    return response.data.appointment || response.data as any;
  },

  async deleteAppointment(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },
};

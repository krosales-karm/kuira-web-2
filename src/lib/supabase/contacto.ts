import { supabase } from './client';
import type { Database } from './types';

type ContactoInsert = Database['public']['Tables']['contactos']['Insert'];

export interface ContactoFormData {
	nombre: string;
	email: string;
	asunto: string;
	mensaje: string;
}

export async function enviarContacto(
	formData: ContactoFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
	try {
		const contacto: ContactoInsert = {
			nombre: formData.nombre,
			email: formData.email,
			asunto: formData.asunto,
			mensaje: formData.mensaje
		};

		const { data, error } = await supabase.from('contactos').insert(contacto).select('id').single();

		if (error) {
			console.error('Error inserting contacto:', error);
			throw new Error(`Error al enviar el mensaje: ${error.message}`);
		}

		return { success: true, id: data.id };
	} catch (error) {
		console.error('Error en enviarContacto:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Error desconocido al enviar el mensaje'
		};
	}
}

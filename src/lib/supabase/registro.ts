import { supabase } from './client';
import type { Database } from './types';

type RegistroInsert = Database['public']['Tables']['registros']['Insert'];

export interface RegistroFormData {
	// Información personal
	email: string;
	nombreCompleto: string;
	nombreColectivo: string;
	telefono: string;
	sitioWeb: string;
	nacionalidad: string;
	// Ubicación
	pais: string;
	ciudad: string;
	// Profesional
	rol: string;
	biografia: string;
	// Datos de la obra
	titulo: string;
	categoria: string;
	tema: string;
	duracion: string;
	anoProduccion: string;
	idiomaPrincipal: string;
	formatoVideo: string;
	tieneSubtitulos: string;
	sinopsis: string;
}

function generateUniqueFileName(originalName: string): string {
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 8);
	const extension = originalName.split('.').pop();
	const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
	return `${baseName}_${timestamp}_${randomString}.${extension}`;
}

export async function uploadCaratula(file: File): Promise<string> {
	const fileName = generateUniqueFileName(file.name);
	const filePath = `${fileName}`;

	const { data, error } = await supabase.storage.from('caratulas').upload(filePath, file, {
		cacheControl: '3600',
		upsert: false
	});

	if (error) {
		console.error('Error uploading caratula:', error);
		throw new Error(`Error al subir la imagen de carátula: ${error.message}`);
	}

	// Obtener URL pública
	const {
		data: { publicUrl }
	} = supabase.storage.from('caratulas').getPublicUrl(data.path);

	return publicUrl;
}

export async function uploadVideo(file: File): Promise<string> {
	const fileName = generateUniqueFileName(file.name);
	const filePath = `${fileName}`;

	const { data, error } = await supabase.storage.from('videos').upload(filePath, file, {
		cacheControl: '3600',
		upsert: false
	});

	if (error) {
		console.error('Error uploading video:', error);
		throw new Error(`Error al subir el video: ${error.message}`);
	}

	return data.path;
}

export async function crearRegistro(
	formData: RegistroFormData,
	caratulaFile: File,
	videoFile: File | null
): Promise<{ success: boolean; error?: string; id?: string }> {
	try {
		// 1. Subir carátula
		const caratulaUrl = await uploadCaratula(caratulaFile);

		// 2. Subir video si existe
		let videoUrl: string | null = null;
		if (videoFile) {
			videoUrl = await uploadVideo(videoFile);
		}

		// 3. Preparar datos para inserción
		const registro: RegistroInsert = {
			email: formData.email,
			nombre_completo: formData.nombreCompleto,
			nombre_colectivo: formData.nombreColectivo || null,
			telefono: formData.telefono,
			sitio_web: formData.sitioWeb || null,
			nacionalidad: formData.nacionalidad,
			pais: formData.pais,
			ciudad: formData.ciudad,
			rol: formData.rol,
			biografia: formData.biografia,
			titulo: formData.titulo,
			categoria: formData.categoria,
			tema: formData.tema,
			duracion: parseInt(formData.duracion, 10),
			ano_produccion: parseInt(formData.anoProduccion, 10),
			idioma_principal: formData.idiomaPrincipal,
			formato_video: formData.formatoVideo,
			tiene_subtitulos: formData.tieneSubtitulos,
			sinopsis: formData.sinopsis,
			caratula_url: caratulaUrl,
			video_url: videoUrl,
			acepta_terminos: true,
			estado: 'pendiente'
		};

		// 4. Insertar en la base de datos
		const { data, error } = await supabase.from('registros').insert(registro).select('id').single();

		if (error) {
			console.error('Error inserting registro:', error);
			throw new Error(`Error al guardar el registro: ${error.message}`);
		}

		return { success: true, id: data.id };
	} catch (error) {
		console.error('Error en crearRegistro:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Error desconocido al procesar el registro'
		};
	}
}

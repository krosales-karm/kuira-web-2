export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			contactos: {
				Row: {
					id: string;
					created_at: string;
					nombre: string;
					email: string;
					asunto: string;
					mensaje: string;
					leido: boolean;
					respondido: boolean;
					notas_admin: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					nombre: string;
					email: string;
					asunto: string;
					mensaje: string;
					leido?: boolean;
					respondido?: boolean;
					notas_admin?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					nombre?: string;
					email?: string;
					asunto?: string;
					mensaje?: string;
					leido?: boolean;
					respondido?: boolean;
					notas_admin?: string | null;
				};
			};
			registros: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
					// Información Personal
					email: string;
					nombre_completo: string;
					nombre_colectivo: string | null;
					telefono: string;
					sitio_web: string | null;
					nacionalidad: string;
					// Ubicación
					pais: string;
					ciudad: string;
					// Información Profesional
					rol: string;
					biografia: string;
					// Datos de la Obra
					titulo: string;
					categoria: string;
					tema: string;
					duracion: number;
					ano_produccion: number;
					idioma_principal: string;
					formato_video: string;
					tiene_subtitulos: string;
					sinopsis: string;
					// Archivos
					caratula_url: string;
					video_url: string | null;
					// Términos y condiciones
					acepta_terminos: boolean;
					// Estado
					estado: 'pendiente' | 'revision' | 'aprobado' | 'rechazado';
					notas_admin: string | null;
				};
				Insert: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					email: string;
					nombre_completo: string;
					nombre_colectivo?: string | null;
					telefono: string;
					sitio_web?: string | null;
					nacionalidad: string;
					pais: string;
					ciudad: string;
					rol: string;
					biografia: string;
					titulo: string;
					categoria: string;
					tema: string;
					duracion: number;
					ano_produccion: number;
					idioma_principal: string;
					formato_video: string;
					tiene_subtitulos: string;
					sinopsis: string;
					caratula_url: string;
					video_url?: string | null;
					acepta_terminos: boolean;
					estado?: 'pendiente' | 'revision' | 'aprobado' | 'rechazado';
					notas_admin?: string | null;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
					email?: string;
					nombre_completo?: string;
					nombre_colectivo?: string | null;
					telefono?: string;
					sitio_web?: string | null;
					nacionalidad?: string;
					pais?: string;
					ciudad?: string;
					rol?: string;
					biografia?: string;
					titulo?: string;
					categoria?: string;
					tema?: string;
					duracion?: number;
					ano_produccion?: number;
					idioma_principal?: string;
					formato_video?: string;
					tiene_subtitulos?: string;
					sinopsis?: string;
					caratula_url?: string;
					video_url?: string | null;
					acepta_terminos?: boolean;
					estado?: 'pendiente' | 'revision' | 'aprobado' | 'rechazado';
					notas_admin?: string | null;
				};
			};
		};
	};
}

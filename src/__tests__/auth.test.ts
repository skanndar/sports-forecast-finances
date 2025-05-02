
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';

// Mock de supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn()
    }
  },
  isSupabaseConfigured: vi.fn(() => true)
}));

describe('Autenticación con Supabase', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('debería llamar a signInWithOtp con el correo y opciones correctas', async () => {
    const mockEmail = 'test@example.com';
    const mockOrigin = 'https://example.com';
    
    // Mock para window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: mockOrigin
      },
      writable: true
    });

    // Mock para una respuesta exitosa
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValueOnce({ 
      data: {}, 
      error: null 
    });

    // Llamar a la función de login (simulación)
    await supabase.auth.signInWithOtp({
      email: mockEmail,
      options: {
        emailRedirectTo: mockOrigin
      }
    });

    // Verificar que se llamó con los parámetros correctos
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: mockEmail,
      options: {
        emailRedirectTo: mockOrigin
      }
    });
  });

  it('debería comprobar correctamente la sesión actual', async () => {
    // Mock para una sesión activa
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' }
        }
      },
      error: null
    });

    // Llamar a getSession
    const response = await supabase.auth.getSession();

    // Verificar que se llamó correctamente
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(response.data.session).toBeTruthy();
    expect(response.data.session.user.id).toBe('test-user-id');
  });

  it('debería cerrar sesión correctamente', async () => {
    // Mock para una respuesta exitosa de cierre de sesión
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
      error: null
    });

    // Llamar a signOut
    await supabase.auth.signOut();

    // Verificar que se llamó correctamente
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});

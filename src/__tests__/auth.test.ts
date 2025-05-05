
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn()
    }
  }
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
      data: { 
        user: null,
        session: null
      }, 
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
    // Create a fully-typed mock User object
    const mockUser: User = {
      id: 'test-user-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      // Add other required User properties
      role: '',
      updated_at: new Date().toISOString()
    };
    
    // Mock para una sesión activa
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          user: mockUser,
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_at: 9999999999,
          expires_in: 3600,
          token_type: 'bearer'
        }
      },
      error: null
    });

    // Llamar a getSession
    const response = await supabase.auth.getSession();

    // Verificar que se llamó correctamente
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(response.data.session).toBeTruthy();
    expect(response.data.session?.user.id).toBe('test-user-id');
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


# Sports-Med Financials

## Configuración de Autenticación con Supabase

### Configuración del Entorno

Para que la autenticación funcione correctamente, asegúrate de que las variables de entorno estén configuradas en el archivo `.env`:

```
VITE_SUPABASE_URL=https://myhccubuqtpedzfkzyhf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aGNjdWJ1cXRwZWR6Zmt6eWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTQxNTYsImV4cCI6MjA2MTc5MDE1Nn0.YvbizjuA6jc1tqFOSIrP-caOHJVcnH2fpzlx3GXthjM
```

### Flujo de Autenticación

Esta aplicación utiliza el método de autenticación sin contraseña (passwordless) de Supabase mediante Magic Links:

1. El usuario introduce su dirección de correo electrónico en la página de login
2. Se le envía un enlace mágico (magic link) a su correo electrónico
3. Al hacer clic en el enlace, el usuario es redirigido a la aplicación y automáticamente autenticado
4. La sesión se mantiene en localStorage para futuras visitas

### Configuración de Supabase

Para que el sistema de autenticación funcione correctamente, es necesario configurar lo siguiente en el panel de Supabase:

1. Activar el proveedor de Email en Authentication > Providers
2. Configurar la URL del sitio en Authentication > URL Configuration:
   - Site URL: URL donde se aloja la aplicación (ej. https://myhccubuqtpedzfkzyhf.lovableproject.com)
   - Redirect URLs: Debe incluir al menos la URL completa de la aplicación (ej. https://myhccubuqtpedzfkzyhf.lovableproject.com/*)

### Solución de problemas comunes

- **No se recibe el correo con el magic link**: Verifica que las variables de entorno estén correctamente configuradas y que la dirección de correo esté en el formato correcto.
- **Error al redirigir después del login**: Asegúrate de que la URL de redirección (emailRedirectTo) incluya el protocolo y el dominio completo, y que esta URL esté incluida en las Redirect URLs en la configuración de Supabase.
- **Sesión no persiste**: Verifica que la configuración del cliente de Supabase tenga habilitadas las opciones autoRefreshToken y persistSession.

### Estructura del código de autenticación

- `src/lib/supabase.ts`: Configuración principal del cliente de Supabase y funciones auxiliares para la autenticación.
- `src/pages/LoginPage.tsx`: Componente de interfaz para el inicio de sesión.
- `src/App.tsx`: Gestión de estado de autenticación y redirecciones basadas en el estado de la sesión.


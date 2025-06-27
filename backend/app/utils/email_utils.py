import logging
import resend
from decouple import config

logger = logging.getLogger(__name__)

# Cargamos config desde .env
RESEND_API_KEY = config("RESEND_API_KEY")
SENDER_EMAIL = config("RESEND_SENDER_EMAIL")

resend.api_key = RESEND_API_KEY

async def send_password_reset_email(to: str, code: str):
    try:
        html = f"""\
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <title>Recuperación de contraseña</title>
            <style>
            body {{
                background-color: #f9fafb;
                font-family: 'Inter', system-ui, sans-serif;
                padding: 2rem;
                color: #111827;
            }}
            .container {{
                max-width: 480px;
                margin: 0 auto;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 0.75rem;
                padding: 2rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }}
            h1 {{
                font-size: 1.5rem;
                font-weight: 600;
                color: #111827;
                margin-bottom: 1rem;
            }}
            p {{
                font-size: 1rem;
                line-height: 1.5;
                color: #374151;
            }}
            .code {{
                font-size: 1.25rem;
                font-weight: bold;
                letter-spacing: 0.1em;
                background-color: #f3f4f6;
                border: 1px solid #d1d5db;
                padding: 0.75rem 1.5rem;
                margin: 1.5rem 0;
                display: inline-block;
                border-radius: 0.5rem;
                color: #111827;
            }}
            .footer {{
                font-size: 0.875rem;
                color: #9ca3af;
                margin-top: 2rem;
            }}
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Recuperación de contraseña</h1>
            <p>Hola,</p>
            <p>Has solicitado recuperar tu contraseña. Utiliza el siguiente código para continuar con el proceso:</p>
            <div class="code">{code}</div>
            <p>Este código expirará en <strong>15 minutos</strong>. Si tú no solicitaste esto, puedes ignorar este mensaje.</p>
            <div class="footer">
                © 2025 Tu Empresa. Todos los derechos reservados.
            </div>
            </div>
        </body>
        </html>
        """


        response = resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [to],
            "subject": "Recuperación de contraseña",
            "html": html,
        })

        logger.info(f"Correo enviado correctamente a {to}")
        return response

    except Exception as e:
        logger.error(f"Error al enviar correo con Resend: {str(e)}")
        raise

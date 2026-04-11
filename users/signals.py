from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail should be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Instance
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(
            instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            reset_password_token.key),
        'token': reset_password_token.key
    }

    # For development, we just print to console (console backend is active in settings)
    # The actual reset link on the frontend will be different
    frontend_url = f"http://localhost:3000/reset-password?token={reset_password_token.key}"
    
    email_html_message = f"Hello {context['username']},\n\nSomeone requested a password reset for your account.\n\nYour reset token is: {context['token']}\n\nYou can also click here to reset: {frontend_url}\n\nIf you didn't do this, ignore this email."

    # ENHANCED TERMINAL READABILITY
    print("\n" + "="*60)
    print("🔓 PASSWORD RESET REQUEST RECEIVED")
    print("="*60)
    print(f"USER  : {context['username']}")
    print(f"EMAIL : {context['email']}")
    print(f"TOKEN : {context['token']}")
    print("-" * 60)
    print(f"RESET LINK: {frontend_url}")
    print("="*60 + "\n")

    send_mail(
        # title:
        "Password Reset for TailorConnect",
        # message:
        email_html_message,
        # from:
        "noreply@tailorconnect.com",
        # to:
        [reset_password_token.user.email]
    )

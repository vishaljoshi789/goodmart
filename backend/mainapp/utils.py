from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from django.template.loader import render_to_string
from django.http import JsonResponse
from smtplib import SMTPException

from .models import Notification, User

def addNotification(title, desc, user_id, status=True):
    try:
        user = User.objects.get(id=user_id)
        
        # Create notification in DB
        Notification.objects.create(
            title=title,
            description=desc,
            status=status,
            user=user
        )

        # Prepare email
        subject = f'📢 New Notification: {title}'
        
        html_message = render_to_string('notificationEmail.html', {
            'name': user.name,
            'email': user.email,
            'phone': user.phone_no,
            'user_id': user.user_id,
            'title': title,
            'description': desc,
        })
        
        send_mail(
            subject,
            '',  # Plain text body (can be skipped if using only HTML)
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message
        )
        
        return True

    except User.DoesNotExist:
        return False
    except BadHeaderError:
        return False
    except SMTPException as e:
        return False
    except Exception as e:
        return False
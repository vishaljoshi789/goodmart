from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email (instead of username) and password.
        """
        if not email:
            raise ValueError('The Email field must be set for superusers')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    
    def create_user(self, username, password=None, **extra_fields):
        """
        Create and return a user with an email and password.
        """
        if not username:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(username)
        username = username
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
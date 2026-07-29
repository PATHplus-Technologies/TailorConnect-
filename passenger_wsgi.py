import sys
import os

# Ajouter le chemin du projet au système de fichiers de Python
sys.path.insert(0, os.path.dirname(__file__))

# Définir le module de configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tailorconnect_backend.settings')

# Charger l'application WSGI de Django
from tailorconnect_backend.wsgi import application

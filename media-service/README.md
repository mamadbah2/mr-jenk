# 🔐 Configuration de Media Service - Guide Complet

## 📋 Vue d'ensemble

Ce guide explique comment gérer les configurations sensibles du media-service sans les commiter dans Git, tout en permettant leur utilisation en local et dans Jenkins CI/CD.

## 🏗️ Structure des fichiers

```
media-service/
├── .env                              # ⛔ Ne pas commiter (dans .gitignore)
├── .env.example                      # ✅ Template à commiter
├── generate-test-config.sh           # ✅ Script de génération
├── TEST_CONFIG_SETUP.md              # ✅ Documentation détaillée
└── src/test/resources/
    ├── application.properties        # ⛔ Ne pas commiter (dans .gitignore)
    └── application.properties.template # ✅ Template à commiter
```

## 🚀 Configuration pour le développement local

### Option 1 : Utilisation du script automatique (Recommandé)

```bash
# 1. Dans le répertoire media-service
cd media-service

# 2. Sourcer le fichier .env (déjà créé avec vos credentials)
source .env

# 3. Générer le fichier de configuration
./generate-test-config.sh

# 4. Lancer les tests
mvn test
```

### Option 2 : Export manuel des variables

```bash
export MONGODB_URI="mongodb+srv://cherifmbaye02:weRcuZYf6zEFLhXz@cluster0.5q0byye.mongodb.net/z01?retryWrites=true&w=majority&appName=Cluster0"
export MONGODB_DATABASE="z01"
export SUPABASE_PROJECT_URL="https://mwkrwffquzzsvssigsup.supabase.co"
export SUPABASE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13a3J3ZmZxdXp6c3Zzc2lnc3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTkzMDIsImV4cCI6MjA2NjMzNTMwMn0.5TeZ-h0zKCc5W2KUbP1R_nU7PZNaMbrVcOK59tmjVvU"
export SUPABASE_BUCKET_NAME="media-service"

./generate-test-config.sh
mvn test
```

## 🔧 Configuration pour Jenkins CI/CD

### 1. Ajouter les credentials dans Jenkins

Allez dans **Jenkins** → **Manage Jenkins** → **Credentials** → **System** → **Global credentials** → **Add Credentials**

Ajoutez les 5 credentials suivants en tant que **Secret text** :

| ID du Credential | Valeur | Description |
|-----------------|--------|-------------|
| `MONGODB_URI` | `mongodb+srv://cherifmbaye02:...` | URI complète MongoDB |
| `MONGODB_DATABASE` | `z01` | Nom de la base de données |
| `SUPABASE_PROJECT_URL` | `https://mwkrwffquzzsvssigsup.supabase.co` | URL du projet Supabase |
| `SUPABASE_API_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Clé API Supabase |
| `SUPABASE_BUCKET_NAME` | `media-service` | Nom du bucket Supabase |

### 2. Le Jenkinsfile est déjà configuré

Le fichier `Jenkinsfile` à la racine du projet a été mis à jour pour :
- ✅ Charger automatiquement les credentials Jenkins
- ✅ Générer le fichier `application.properties` à la volée
- ✅ Lancer les tests avec les bonnes configurations

## ✨ Avantages de cette approche

1. **🔒 Sécurité** : Les secrets ne sont jamais commités dans Git
2. **🔄 Flexibilité** : Facile de changer les credentials sans modifier le code
3. **👥 Collaboration** : Chaque développeur peut avoir ses propres credentials locaux
4. **🤖 CI/CD** : Jenkins gère automatiquement les secrets via son système de credentials
5. **📖 Documentation** : Les templates montrent clairement quelles variables sont nécessaires

## 📝 Commandes utiles

```bash
# Vérifier les variables d'environnement
echo $MONGODB_URI

# Tester la génération du fichier de configuration
cd media-service
./generate-test-config.sh

# Lancer les tests
mvn test

# Vérifier que le fichier application.properties n'est pas suivi par Git
git status src/test/resources/application.properties
# Devrait afficher : "nothing to commit" ou ne pas apparaître
```

## 🔍 Vérification

Pour vous assurer que tout fonctionne :

```bash
# 1. Vérifier que les fichiers sensibles sont bien ignorés
git check-ignore -v .env
git check-ignore -v src/test/resources/application.properties

# 2. Vérifier que les templates sont bien suivis
git ls-files | grep template

# 3. Tester localement
source .env
./generate-test-config.sh
mvn test
```

## 🆘 Dépannage

### Problème : "Variable d'environnement non définie"

```bash
# Vérifier que le fichier .env existe
ls -la .env

# Sourcer à nouveau le fichier
source .env

# Vérifier les variables
env | grep MONGODB
env | grep SUPABASE
```

### Problème : "Tests échouent en local"

```bash
# Régénérer le fichier de configuration
./generate-test-config.sh

# Vérifier le contenu généré
cat src/test/resources/application.properties
```

### Problème : "Échec dans Jenkins"

1. Vérifier que tous les credentials sont bien configurés dans Jenkins
2. Les IDs doivent correspondre exactement : `MONGODB_URI`, `MONGODB_DATABASE`, etc.
3. Vérifier les logs Jenkins pour voir si les variables sont chargées

## 📚 Fichiers à commiter

✅ **À commiter** :
- `.env.example`
- `.gitignore`
- `generate-test-config.sh`
- `src/test/resources/application.properties.template`
- `TEST_CONFIG_SETUP.md`
- `README.md` (ce fichier)

⛔ **À NE PAS commiter** :
- `.env`
- `src/test/resources/application.properties`
- `src/main/resources/application.properties`

## 🎯 Prochaines étapes

1. ✅ Sourcer le fichier `.env` : `source .env`
2. ✅ Générer la config : `./generate-test-config.sh`
3. ✅ Tester localement : `mvn test`
4. ✅ Ajouter les credentials dans Jenkins
5. ✅ Commiter et pousser les changements (sans les secrets !)
6. ✅ Vérifier que le pipeline Jenkins fonctionne

---

**Note** : Ce fichier `.env` existe déjà dans votre répertoire local avec vos credentials. Ne le supprimez pas, il est nécessaire pour le développement local !


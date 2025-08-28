pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('docker-hub-credentials') // Nom d'utilisateur et token du Docker Hub
        IMAGE_VERSION = "${env.BUILD_NUMBER}"
        SERVICES = "frontend product-service user-service media-service api-gateway config-service eureka-server"
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
    }

    stages {
        
        stage('Clean Docker') {
            steps {
                echo '🧹 Nettoyage Docker...'
                sh 'docker system prune -af || true'
            }
        }
        
        stage('Build in Unit Test') {
            steps {
                echo '🚀 Lancement des services nécessaires pour les tests...'
                sh '''
                    ls -l
                    cd discovery-service && mvn clean package -DskipTests=false
                    echo 'Affichage du token : '
                    echo '$GITHUB_TOKEN'
                    export GITHUB_TOKEN=$GITHUB_TOKEN
                    echo 'printenv'
                    cd ../config-service && mvn clean package -DskipTests=false
                    cd ../api-gateway && mvn clean package -DskipTests=false
                '''
                
                echo '🧪 Tests des microservices dépendants...'
                sh '''
                    cd product-service && mvn clean package -DskipTests=false
                    cd ../user-service && mvn clean package -DskipTests=false
                    # il manque plus que media - il manque aussi test frontend Jasmine
                '''
            }
            post {
                always {
                    junit '**/target/surefire-reports/**/*.xml'
                }
            }
        }
        stage('Integration Test') {
            steps {
                script {
                    try {
                        sh 'docker-compose up --build -d'
                    } finally {
                        echo "Tearing down the test environment."
                        sh 'docker-compose down -v --remove-orphans'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building...'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying...'
                        echo 'Successful Registration'
                        def dockerhubUser = 'mamadbah2'
                        def services = ['frontend', 'product-service', 'user-service', 'media-service', 'api-gateway', 'config-service', 'eureka-server']
                        echo 'Starting Services'
                        services.each { service ->
                            echo "buy-01-${service}..."

                            withCredentials([usernamePassword(
                                credentialsId: 'dockerhub-credential',
                                usernameVariable: 'DOCKER_USER',
                                passwordVariable: 'DOCKER_PASS'
                            )]) {

                                sh 'echo "Username is: $DOCKER_USER"'
                                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                            }


                            // Nom de l'image locale
                            def localImageName = "my_buy01_pipeline-${service}"

                            // Nom de l'image pour le registre Docker Hub
                            def taggedImageName = "${dockerhubUser}/${service}:${env.BUILD_NUMBER}"

                            // Taguer l'image locale avec le nom du registre
                            sh "docker tag ${localImageName}:latest ${taggedImageName}"

                            // Pousser l'image vers Docker Hub
                            sh "docker push ${taggedImageName}"
                        }
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    echo "Déploiement sur la machine locale, version ${env.BUILD_NUMBER}..."

                    // Exécute les commandes Docker-Compose en passant la variable d'environnement
                    withEnv(["IMAGE_VERSION=${env.BUILD_NUMBER}"]) {
                        // Télécharger les nouvelles images
                        sh "docker-compose -f docker-compose-deploy.yml pull"
                        // Redémarrer les conteneurs
                        sh "docker-compose -f docker-compose-deploy.yml up -d"
                    }
                }
            }
        }
    }

    post {
         success {
                mail to: 'bahmamadoubobosewa@gmail.com',
                     subject: "SUCCESS: Pipeline ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                     body: "La pipeline a réussi. Voir les détails sur ${env.BUILD_URL}"
            }
            failure {
                mail to: 'bahmamadoubobosewa@gmail.com',
                     subject: "FAILURE: Pipeline ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                     body: "La pipeline a échoué à l'étape '${currentBuild.currentResult}'. Voir les logs sur ${env.BUILD_URL}"
            }
    }
}
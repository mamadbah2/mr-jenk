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
                 withSonarQubeEnv('safe-zone-mr-jenk') {
                     withCredentials([string(credentialsId: 'SONAR_USER_TOKEN', variable: 'SONAR_USER_TOKEN')]) {
                         sh '''
                             ls -l

                             # 🚀 Discovery Service
                             cd discovery-service
                             mvn clean package -DskipTests=false sonar:sonar \
                                 -Dsonar.projectKey=safe-zone-discovery \
                                 -Dsonar.host.url=$SONAR_HOST_URL \
                                 -Dsonar.login=$SONAR_USER_TOKEN
                             cd ..

                             # 🚀 Config Service
                             cd config-service
                             mvn clean package -DskipTests=false sonar:sonar \
                                 -Dsonar.projectKey=safe-zone-config \
                                 -Dsonar.host.url=$SONAR_HOST_URL \
                                 -Dsonar.login=$SONAR_USER_TOKEN
                             cd ..

                             # 🚀 API Gateway
                             cd api-gateway
                             mvn clean package -DskipTests=false sonar:sonar \
                                 -Dsonar.projectKey=safe-zone-api-gateway \
                                 -Dsonar.host.url=$SONAR_HOST_URL \
                                 -Dsonar.login=$SONAR_USER_TOKEN
                             cd ..

                             # 🚀 Product Service
                             cd product-service
                             mvn clean package -DskipTests=false sonar:sonar \
                                 -Dsonar.projectKey=safe-zone-product \
                                 -Dsonar.host.url=$SONAR_HOST_URL \
                                 -Dsonar.login=$SONAR_USER_TOKEN
                             cd ..

                             # 🚀 User Service
                             cd user-service
                             mvn clean package -DskipTests=false sonar:sonar \
                                 -Dsonar.projectKey=safe-zone-user \
                                 -Dsonar.host.url=$SONAR_HOST_URL \
                                 -Dsonar.login=$SONAR_USER_TOKEN
                             cd ..

                             # 🚀 Media Service
                             cd media-service
                             mvn clean package -DskipTests=false sonar:sonar \
                                 -Dsonar.projectKey=safe-zone-media \
                                 -Dsonar.host.url=$SONAR_HOST_URL \
                                 -Dsonar.login=$SONAR_USER_TOKEN
                             cd ..
                         '''
                     }
                 }

            }
            post {
                always {
                    sh 'pwd'
                    junit '**/**/target/surefire-reports/*.xml'
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
                            def localImageName = "my_buy01_pipeline2-${service}"

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
                sh "echo ${env.BUILD_NUMBER} > last_successful_build.txt"
                mail to: 'bahmamadoubobosewa@gmail.com',
                     subject: "SUCCESS: Pipeline ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                     body: "La pipeline a réussi. Voir les détails sur ${env.BUILD_URL}"
            }
            failure {
                script {
                    echo "⚠️ Déploiement échoué, rollback en cours..."

                    // Lire la dernière version déployée avec succès
                    def lastSuccessfulBuild = sh(script: "cat last_successful_build.txt", returnStdout: true).trim()

                    if (lastSuccessfulBuild) {
                        echo "Rollback vers la version ${lastSuccessfulBuild}..."
                        withEnv(["IMAGE_VERSION=${lastSuccessfulBuild}"]) {
                            sh "docker-compose -f docker-compose-deploy.yml pull"
                            sh "docker-compose -f docker-compose-deploy.yml up -d"
                        }
                    } else {
                        echo "Aucune version précédente disponible pour rollback."
                    }
                }
                mail to: 'bahmamadoubobosewa@gmail.com',
                     subject: "FAILURE: Pipeline ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                     body: "La pipeline a échoué à l'étape '${currentBuild.currentResult}'. Voir les logs sur ${env.BUILD_URL}"
            }
    }
}
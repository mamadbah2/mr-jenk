pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                git 'https://learn.zone01dakar.sn/git/mamadbah/mr-jenk.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'docker-compose up -d --build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // Add your test steps here
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Add your deploy steps here
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Add cleanup steps here
        }
    }
}
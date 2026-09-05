pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-react-app:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop my-react-app || true
                    docker rm my-react-app || true

                    docker run -d \
                        --name my-react-app \
                        -p 3000:80 \
                        my-react-app:latest
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }
}

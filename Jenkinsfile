pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Connection') {
            steps {
                sh '''
                    echo "Successfully cloned private repository!"
                    echo "Files:"
                    ls -la
                '''
            }
        }
    }
}

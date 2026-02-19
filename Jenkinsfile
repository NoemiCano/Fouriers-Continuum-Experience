pipeline {
    agent any

    tools { 
        nodejs 'NodeJS-Angular'   // La instalación que ya probaste y funciona
    }

    environment {
        SONARQUBE_ENV = 'sonarqube'   // Nombre del SonarQube que ya configuraste
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Frontend') {
            steps {
                dir('Frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh 'ng build --prod'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('Frontend') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh 'sonar-scanner'
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Backend') {
                    sh 'docker build -t its-be .'
                }
            }
        }

        // Opcional: subir artefactos a Nexus
        // stage('Upload to Nexus') {
        //     steps {
        //         // Aquí iría la configuración para subir dist/ o backend a Nexus
        //     }
        // }
    }
}

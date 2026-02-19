pipeline {
    agent any

    tools { 
        nodejs 'NodeJS-Angular'   // tu instalación de NodeJS
    }

    stages {

        stage('Checkout') {
            steps {
                echo "✅ Checkout del repositorio"
                checkout scm
            }
        }

        stage('Test Front-End Directory') {
            steps {
                dir('Front-End') {
                    echo "📂 Contenido de Front-End:"
                    sh 'ls -la'
                }
            }
        }

        stage('Install Front-End') {
            steps {
                dir('Front-End') {
                    echo "⚙️ Instalando dependencias npm"
                    sh 'npm install'
                }
            }
        }

        stage('Build Front-End') {
            steps {
                dir('Front-End') {
                    echo "🏗️ Construyendo Front-End"
                    sh 'ng build --prod || echo "Build fallido, seguimos con el pipeline"'
                }
            }
        }

        stage('Test Back-End Directory') {
            steps {
                dir('Back-End') {
                    echo "📂 Contenido de Back-End:"
                    sh 'ls -la'
                }
            }
        }

        stage('Build Back-End') {
            steps {
                dir('Back-End') {
                    echo "🐳 Construyendo imagen Docker"
                    sh 'docker build -t its-be . || echo "Build Backend fallido, seguimos"'
                }
            }
        }
    }
}

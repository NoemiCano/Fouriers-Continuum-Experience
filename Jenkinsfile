pipeline {
    agent any

    tools { 
        nodejs 'NodeJS-Angular'
        maven "Maven_Jenkins"
        jdk "Default JDK"
    }

    environment {
        SONARQUBE_ENV = 'sonarqube'
    }

    stages {

        stage('SCM') {
            steps {
                sh 'git config --global --add safe.directory "*"'
                checkout scm
            }
        }

        stage('Install Front-end Dependencies') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    sh 'npm install --ignore-scripts'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    sh 'npm run build -- --prod'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    sh 'mvn clean compile'
                }
            }
        }

        stage('SonarQube Analysis Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }

        stage('SonarQube Analysis Frontend') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS-Moderno') {
                    dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                        withSonarQubeEnv('sonarqube') {
                            sh "${tool('SonarScanner')}/bin/sonar-scanner"
                        }
                    }
                }
            }
        }

        stage('Compile Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    // CAMBIO IMPORTANTE: Usamos 'package' para generar el archivo .jar
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Docker Build & Push to Nexus') {
            steps {
                script {
                    // URL de tu repositorio Docker en Nexus
                    def nexusRegistry = "localhost:5000" 
                    def backImageName = "${nexusRegistry}/its-backend"
                    def frontImageName = "${nexusRegistry}/its-frontend"

                    // Usamos las credenciales guardadas en Jenkins
                    docker.withRegistry("http://${nexusRegistry}", 'nexus-docker-credentials') {
                        
                        // 1. Construir y subir el Back-End
                        dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                            // Construimos la imagen con el tag del número de build
                            def backImage = docker.build("${backImageName}:${env.BUILD_NUMBER}")
                            backImage.push()
                            backImage.push("latest")
                        }

                        // 2. Construir y subir el Front-End
                        dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                            def frontImage = docker.build("${frontImageName}:${env.BUILD_NUMBER}")
                            frontImage.push()
                            frontImage.push("latest")
                        }
                    }
                }
            }
        }
    }
}
